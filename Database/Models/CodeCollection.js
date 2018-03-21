import DB from '../LocalMongoDB';
import Code from './Code/Code';
import CodeRoutes from './Code/Routes';

import API from '../../Communication/API/API';

//TODO: use websockets to allow realtime code insertion
export default class CodeCollection {
    constructor( session ) {
        this.session = session;
        this.filename = session.name + '_' + session.date + '_' + API.me.username;
        //TODO: Makes DB persistent. Memory only for testing.
        this.db = new DB( this.filename, false, false ); 
        //TODO: get the lastUpdate from the DB.
        this.lastUpdate = null;
        this.validated = 0;
        this.syncCollection();
    }

    async syncCollection() {
        //TODO: Query only the codes after lastUpdate
        const codesResponse = await API.get( CodeRoutes.get + '?session=' + this.session.id );
        if( !codesResponse.ok ) {
            return;
        }

        const codes = await codesResponse.json();
        codes.forEach( async ( code ) => {
            if( code.validations ) {
                this.validated++;
            }
            const exists = await this.codeExists( code.code );
            if( exists ) {
                this.updateCode( new Code(code) );
            } else {
                this.addCode( code );
            }
        });

        this.lastUpdate = new Date();
    }

    async getCodeCount() {
        return await this.countCodes();
    }

    addCode( code ) {
        console.log( 'adding code to local db' );
        console.log( code );
        return this.db.insert( code );
    }

    updateCode( code ) {
        console.log( 'updating code in local db' );
        console.log( code.getAsPlainObject() );
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

    countCodes() {
        return new Promise( ( resolve, reject ) => {
            this.db.count({})
                .then(
                    count => resolve( count )
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