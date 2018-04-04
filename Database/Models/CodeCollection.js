import DB from '../LocalMongoDB';
import Code from './Code/Code';
import CodeRoutes from './Code/Routes';

import API from '../../Communication/API/API';

//TODO: use websockets to allow realtime code insertion
export default class CodeCollection {
    constructor( session, type ) {
        this.session = session;
        this.type = type;
        this.filename = session.id + '_' + type.id + '_' + API.me.username;
        this.db = new DB( this.filename, false, true ); 
        //TODO: get the lastUpdate from the DB.
        this.lastUpdate = null;
        this.validated = 0;
    }

    async syncCollection() {
        const codesResponse = await API.get( CodeRoutes.get + '?session=' + this.session.id + '&type_id='+this.type.id );
        if( !codesResponse.ok ) {
            return;
        }

        let totalValidated = 0;
        const codes = await codesResponse.json();
        for( let i = 0; i < codes.length; i++ ) {
            const code = codes[ i ];

            const codeDB = await this.findCode( code.code );
            if( codeDB !== null ) {
                if( code.updated_at > codeDB.updated_at ) {
                    if( code.validations ) {
                        totalValidated++;
                    }

                    await this.updateCode( new Code(code) );
                } else {
                    if( codeDB.validations ) {
                        totalValidated++;
                    }
                }
            } else {
                if( code.validations ) {
                    totalValidated++;
                }

                await this.addCode( code );                
            }
        }
        this.validated = totalValidated;
        this.lastUpdate = new Date();
    }

    async getCodeCount() {
        return await this.countCodes();
    }

    async getTypes() {
        return await this.typesDB.find();
    }

    addCode( code ) {
        //console.log( 'adding code to local db' );
        //console.log( code );
        return this.db.insert( code );
    }

    updateCode( code ) {
        //console.log( 'updating code in local db' );
        //console.log( code.getAsPlainObject() );
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