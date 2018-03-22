export default class Connection {
    constructor( protocol, hostname, port, basePath ) {
        this.protocol = protocol || 'http';
        this.hostname = hostname || 'localhost';
        this.port     = port     || 80;
        this.basePath = basePath || '';
    }

    getHostURL() {
       return this.protocol + '://' + this.hostname + ':' + this.port; 
    }

    getBaseURL() {
        return this.getHostURL() + '/' + this.basePath; 
    }

    getFullURL( path ) {
        if( path[ 0 ] !== '/' && this.basePath !== '') {
            path = '/' + path;
        }

        return this.getBaseURL() + path;
    }

    async sendRequest( request ) {
        return fetch( request );
    }
}