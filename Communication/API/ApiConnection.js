import Connection from '../Connection';
import config from '../../env';

export default class ApiConnection {
    constructor( protocol, hostname, port, basePath, loginPath, logoutPath  ) {
        this.connection = new Connection( protocol, hostname, port );
        this.loginPath = loginPath || null;
        this.logoutPath = logoutPath || null;
        this.authTokens = {};
        this.me = null;
    }

    getAuthHeader() {
        if( Object.keys(this.authTokens).length === 0 && this.authTokens.constructor === Object ) {
            return '';
        }

        return this.authTokens.type + ' ' + this.authTokens.access;
    }

    formatURLEncoded( obj ) {
        const formBody = [];
        for (const property in obj) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(obj[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        return formBody.join('&');
    }

    async attemptLogin( data ) {        
        const response = await this.post( this.loginPath, data, true );
        if( !response.ok ) {
            throw new Error( 'LOGIN FAILED' );  
        }
        const tokens = await response.json();
        this.authTokens = {
            type: tokens.token_type,
            access: tokens.access_token,
            refresh: tokens.refresh_token
        };        

        const meResponse = await this.get( config.auth.mePath );
        if( meResponse.ok ) {
            this.me = await meResponse.json();
        }
    }

    async get( path ) {
        const url = this.connection.getFullURL( path );
        const request = new Request( url, { method: 'GET', headers: { Authorization: this.getAuthHeader() } });
    
        return this.connection.sendRequest( request );
    }

    async post( path, data, urlEncoded = false ) {
        if( urlEncoded ) {
            data = this.formatURLEncoded( data );
        } else {
            if( data instanceof Object ) {
                data = JSON.stringify( data );  
            }
        }

        const url = this.connection.getFullURL( path );
        const request = new Request( url, { 
            method: 'POST', 
            headers: { 
                'Authorization': this.getAuthHeader(),
                'Content-Type': urlEncoded ? 'application/x-www-form-urlencoded;charset=UTF-8' : 'charset=UTF-8'
            }, 
            body: data, 
        });

        return this.connection.sendRequest( request );
    }

    async put( path, data ) {
        if( data instanceof Object ) {
            data = JSON.stringify( data );  
        }
        const url = this.connection.getFullURL( path );
        const request = new Request( url, { method: 'PUT', headers: { Authorization: this.getAuthHeader() }, body: data });

        return this.connection.sendRequest( request );
    }

    async delete( path ) {
        const url = this.connection.getFullURL( path );
        const request = new Request( url, { method: 'DELETE', headers: { Authorization: this.getAuthHeader() } });

        return this.connection.sendRequest( request );
    }
} 