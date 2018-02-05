import Connection from '../Connection';

export default class ApiConnection {
    constructor( protocol, hostname, port, basePath ) {
        this.connection = new Connection( protocol, hostname, port, basePath );
    }

    async get( path ) {
        const url = this.connection.getFullURL( path );
        const request = new Request( url, { method: 'GET' });
    
        const response = await this.connection.sendRequest( request );
        return response.json();
    }

    async post( path, data ) {
        if( data instanceof Object ) {
          data = JSON.stringify( data );  
        }
        const url = this.connection.getFullURL( path );
        const request = new Request( url, { method: 'POST', body: data });

        return this.connection.sendRequest( request );
    }

    async put( path, data ) {
        if( data instanceof Object ) {
            data = JSON.stringify( data );  
        }
        const url = this.connection.getFullURL( path );
        const request = new Request( url, { method: 'PUT', body: data });

        return this.connection.sendRequest( request );
    }

    async delete( path ) {
        const url = this.connection.getFullURL( path );
        const request = new Request( url, { method: 'DELETE' });

        return this.connection.sendRequest( request );
    }
} 