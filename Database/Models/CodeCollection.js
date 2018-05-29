import DB from '../LocalMongoDB';
import Code from './Code/Code';
import CodeRoutes from './Code/Routes';

import API from '../../Communication/API/API';
import EventWebSocket from '../../Communication/EventBased/EventWebSocket'
import moment from 'moment'

export default class CodeCollection {
    constructor( session, type, onCodeAdded ) {
        this.session = session;
        this.type = type;
        this.onCodeAdded = onCodeAdded;
        this.filename = session.id + '_' + type.id + '_' + API.me.username;
        this.db = new DB( this.filename, false, true ); 

        this.socket = new EventWebSocket(
            API.connection,
            session.id + '-session'
        );
        this.socket.bind( 'code_added', async ( data ) => {
            if( parseInt(data.type_id) === parseInt(this.type.id) ) {
                await this.addCode( data );
                if( this.onCodeAdded ) {
                    this.onCodeAdded( data );
                }
            }
        });
        this.socket.bind( 'code_updated', async ( data ) => {
            if( data.type_id === this.type.id ) {
                if( await this.codeExists( data.code ) ) {
                    await this.updateCode( new Code(data) );
                } else {
                    await this.addCode( data );
                    if( this.onCodeAdded ) {
                        this.onCodeAdded( data );
                    }
                }
            }
        });

        this.lastUpdate = null;
        this.validated = 0;
    }
    
    async syncCollection() {
        const codesResponse = await API.get( CodeRoutes.get + '?session=' + this.session.id + '&type_id='+this.type.id );
        if( !codesResponse.ok ) {
            return;
        }

        let i;
        let totalValidated = 0;
        const codes = await codesResponse.json();
        const dbCodes = await this.getCodes({});
        const codeDict = {};
        for( i = 0; i < dbCodes.length; i++ ) {
            const dbCode = dbCodes[i];
            codeDict[ dbCode.code ] = dbCode;
        }

        toInsert = [];
        toUpdate = [];
        for( i = 0; i < codes.length; i++ ) {
            const code = codes[ i ];
            const codeDB = codeDict[ code.code ];
            if( codeDB ) {
                const currentUpdated = moment( code.updated_at );
                const dbUpdated = moment(codeDB.updated_at);
                if( currentUpdated.isAfter( dbUpdated ) ) {
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
                toInsert.push( code );                
            }            
        }
        if( toInsert.length > 0 ) {
            this.addCodes( toInsert );
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

    addCodes( codes ) {
        return this.db.insert( codes );
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

    getCodes( query ) {
        return new Promise( ( resolve, reject ) => {
            this.db.find( query )
            .then( codes => {
                resolve( codes )
            })
            .catch( error => {
                reject( error )
            })
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