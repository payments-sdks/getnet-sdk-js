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
            req.headers['Authorization'] = 'Bearer ' + this.getAuthorizationToken();
        }

        var res = await axios(req);

        if (res.status != 200) {
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
        return await this.send(url_part, 'GET');
    }

    async post(url_part, data) {
        return await this.send(url_part, 'POST', data);
    }

    async put(url_part, data) {
        return await this.send(url_part, 'PUT', data);
    }
}

module.exports = Request;