import Datastore from 'react-native-local-mongodb';

export default class LocalMongoDB {
    constructor( filename, inMemory, autoload ) {
        const config = { inMemoryOnly: inMemory || false, autoload: autoload || true };
        if( filename ) {
            config[ 'filename' ] = filename;
        }

        this.db = new Datastore( config );
    }

    insert( data ) {
        return new Promise( ( resolve, reject  => {
            this.db.insert( data, ( error, newDoc ) => {
                if( error ) {
                    reject( error );
                }
                
                resolve(  newDoc );                
            });
        }));       
    }

    find( query ) {
        return new Promise( ( resolve, reject ) => {
            this.db.find( query || {}, ( error, docs ) => {
                if( error ) {
                    reject( error );
                }
                
                resolve( docs );                
            });
        });        
    }

    findOne( query ) {
        return new Promise( ( resolve, reject ) => {
            this.db.findOne( query || {}, ( error, doc ) => {
                if( error ) {
                    reject( error );
                }
                
                resolve( doc );                
            });
        });
    }

    update( query, data ) {
        return new Promise( ( resolve, reject ) => {
            this.db.update( query, data, ( error, doc ) => {
                if( error ) {
                    reject( error );
                }

                resolve( doc );
            });
        });        
    }

    remove( query ) {
        return new Promise( ( resolve, reject ) => {
            this.db.remove( query, {}, ( error, removed ) => {
                if( error ) {
                    reject( error );
                }
                
                resolve( removed );                
            });
        });        
    }
}