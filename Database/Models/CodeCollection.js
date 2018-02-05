import DB from '../LocalMongoDB';
import Code from './Code/Code';
import CodeRoutes from './Code/Routes';

import API from '../../Communication/API/API';

//TODO: use websockets to allow realtime code insertion
export default class CodeCollection {
    constructor( session, collection ) {
        const filename = session.name + '_' + session.date + '_' + collection;
        //TODO: Makes DB persistent. Memory only for testing.
        this.db = new DB( filename, true, false ); 
        //TODO: get the lastUpdate from the DB.
        this.lastUpdate = null;
        this.syncCollection();
    }

    async syncCollection() {
        //TODO: Query only the codes after lastUpdate
        const codes = await API.get( CodeRoutes.get );
        codes.forEach( code => {
            this.addCode( code );
        });

        this.lastUpdate = new Date();
    }

    addCode( code ) {
        console.log( 'adding code to local db' );
        console.log( code );
        return this.db.insert( code );
    }

    updateCode( code ) {
        return new Promise( (resolve, reject) => {
            this.db.update( { code: code.code }, code.getAsPlainObject() )
                .then( code => {
                    resolve( code );
                })
                .catch( error => reject( error ) );
        }); 
    }

    findCode( code ) {
        return new Promise( ( resolve, reject ) => {
            this.db.findOne( { code: code } )
                .then( ( code ) => {
                    resolve( code === null ? code : new Code( code ) );
                })
                .catch( error => {
                    reject( error )
                });
        });
    }

    codeExists( code ) {
        return new Promise( ( resolve, reject ) => {
            this.findCode( code )
                .then( 
                    code => {
                        resolve( code !== null );
                    }
                )
                .catch( 
                    error => reject( error ) 
                );
        });        
    }

    markCode( code ) {
        const marked = code.marked();
        return this.updateCode( marked );
    }
}