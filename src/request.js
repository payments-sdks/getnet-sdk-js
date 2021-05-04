const axios = require('axios');
const Getnet = require('./getnet');
const { endpoints} = require('./configs');

class Request
{
    constructor (getnet) {
        this.getnet = getnet;

        if (typeof endpoints[getnet.env] == undefined) {
            throw "Env not implemented: " + getnet.env;
        }

        this.baseurl = endpoints[getnet.env];
    }

    /**
     * Auth to get access_token.
     * 
     * @returns {Getnet}
     */
    async auth() {
        if (this.getnet.getAuthorizationToken()) {
            return this.getnet;
        }

        try {
            var response = await this.send('/auth/oauth/v2/token', 'AUTH', 'scope=oob&grant_type=client_credentials');
        } catch (err) {
            throw err;
        }

        this.getnet.setAuthorizationToken(response.access_token);

        return this.getnet;

    }

    /**
     * Gerar token do cartao.
     * 
     * @param {string} cartaoNum 
     * @param {string} clientID 
     * @returns {String}
     */
    async gerarTokenCartao(cartaoNum, clientID) {
        // Verificar se esta logado
        await this.auth();

        var data = {
            card_number: cartaoNum,
            customer_id: clientID,
        };

        var res = await this.post('/v1/tokens/card', data);

        return res.number_token;
    }

    /**
     * Enviar requisicao.
     * 
     * @param {string} urlPart 
     * @param {string} method 
     * @param {Object} data 
     * @returns {Object}
     */
    async send(urlPart, method, data) {

        var url = this.getFullUrl(urlPart);

        var headers = {
            'Content-Type'  : 'application/json; charset=utf-8',
        };

        var req = { url, method, headers, data };  
        
        // Verificar se form method AUTH
        if (method == 'AUTH') {
            req.method = 'post';
            req.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            req.auth = {
                username : this.getnet.client_id,
                password : this.getnet.client_secret,
            };
        }

        if (this.getnet.getAuthorizationToken()) {
            req.headers['Authorization'] = 'Bearer ' + this.getnet.getAuthorizationToken();
        }

        try {
            var res = await axios(req);
        } catch (err) {
            if (err.response && err.response.data) {
                var info = err.response.data;
                var error = {
                    message: info.message,
                    code: info.status_code,
                    detalhe: info.details,
                }

                throw error;
            }
            
            throw err;
        }

        if ((res.status != 200) && (res.status != 201) && (res.status != 202)) {
            throw res.data;
        }

        return res.data;
    }

    /**
     * Retorna a URL completa.
     * 
     * @param {string} url_part 
     * @returns {string}
     */
    getFullUrl(url_part) {
        return this.baseurl + url_part;
    }

    /**
     * Retorna a URL base do ambiente.
     * 
     * @returns {string}
     */
    getBaseUrl() {
        return this.baseurl;
    }

    async get(url_part) {
        return await this.send(url_part, 'get');
    }

    async post(url_part, data = {}) {
        return await this.send(url_part, 'post', data);
    }

    async put(url_part, data = {}) {
        return await this.send(url_part, 'put', data);
    }
}

module.exports = Request;