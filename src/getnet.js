const Request = require('./request');

class Getnet
{
    constructor (clientId, clientSecret, env) {
        this.client_id     = clientId;
        this.client_secret = clientSecret;
        this.env           = env;

        this.authorizationToken = null;
        this.request = new Request(this);
    }

    /**
     * Set new env.
     * 
     * @param {string} env 
     * @returns {Getnet}
     */
    setEnv(env) {
        this.env = env;

        return this;
    }

    /**
     * Get env.
     * 
     * @returns {string}
     */
    getEnv() {
        return this.env;
    }

    /**
     * Set new authorization token.
     * 
     * @param {string} authorizationToken 
     * @returns {Getnet}
     */
    setAuthorizationToken(authorizationToken) {
        this.authorizationToken = authorizationToken;

        return this;
    }

    /**
     * Get authorization token.
     * 
     * @returns {string}
     */
    getAuthorizationToken() {
        return this.authorizationToken;
    }

    /**
     * Autorizar transação de credito.
     * 
     * @param {Object} transaction 
     * @returns {Object}
     */
    async authorizeCredit(transaction) {
        await this.request.auth();

        // Gerar token do cartão e associar na transacao
        var cartaoToken = await this.request.gerarTokenCartao(transaction.credit.card.number_card, transaction.customer.customer_id);
        transaction.credit.card.number_token = cartaoToken;
        delete transaction.credit.card.number_card;

        // Autorizar transacao de credito
        var response = await this.request.post('/v1/payments/credit', transaction);

        return response;
    }

    /**
     * Confirmar transacao de credito tardia.
     * 
     * @param {String} pagtoId 
     * @returns {Object}
     */
    async confirmCredit(pagtoId) {
        await this.request.auth();

        // Confirmar transacao de credito
        var response = await this.request.post('/v1/payments/credit/' + pagtoId + '/confirm');

        return response;

    }

    /**
     * Cancelar transacao de credito tardia.
     * 
     * @param {String} pagtoId 
     * @returns {Object}
     */
     async cancelCredit(pagtoId) {
        await this.request.auth();

        // Cancelar transacao de credito
        var response = await this.request.post('/v1/payments/credit/' + pagtoId + '/cancel');

        return response;

    }
}

module.exports = Getnet;