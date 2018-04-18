import DB from '../LocalMongoDB';

export default class ConnectionConfigConnection {
    constructor() {
        this.db = new DB( 'consensus-connections-store', false, true );
    }

    async getAll() {
        return await this.db.find();
    }

    async find( name ) {
        return await this.db.findOne({name: name});
    }

    async insert( connectionData ) {
        if( await this.find( connectionData.name ) !== null ) {
            return await this.update( connectionData  );
        }
        return await this.db.insert( connectionData );
    }

    async update( connectionData ) {
        return await this.db.update( {name: connectionData.name}, connectionData );
    }

    async remove( name ) {
        return await this.db.remove( {name: name} );
    }
} 