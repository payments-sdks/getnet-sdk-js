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

    async authorizeCredit(transaction) {
        await this.request.auth();

        var response = await this.request.post('/v1/payments/credit', transaction);

        //..
    }
}

module.exports = Getnet;