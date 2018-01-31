import DB from '../LocalMongoDB';
import Code from './Code/Code';

export default class CodeCollection {
    constructor( session, collection ) {
        const filename = session.name + '_' + session.date + '_' + collection;
        //TODO: Makes DB persistent. Memory only for testing.
        this.db = new DB( filename, true, false ); 
        this.lastUpdate = null;

        this.syncCollection();
    }

    syncCollection() {
        //TODO: Retrieve codes from the backend and store in DB.
        
        /*
            DUMMY CODE FOR TESTING
        */
        
        //Generates some random codes
        console.log( 'entering dummy codes' );
        for( let i = 0; i < 10; i++ ) {
            const code = {
                id: i,
                code: i,
                name: 'Code ' + i,
                email: 'Code'+i+'@mail.to',
                maxValidations: 1,
                validations: 0,
                created_at: new Date(),
                updated_at: new Date()
            };

            this.addCode( code ).then( ( code ) => console.log( code ) );
        }
        console.log( 'finished dummy codes' );

        /* ================ */

        this.lastUpdate = new Date();
    }

    addCode( code ) {
        return this.db.insert( code );
    }

    updateCode( code ) {
        return this.db.update( { code: code.code }, code.getAsPlainObject() );
    }

    findCode( code ) {
        return new Promise( ( resolve, reject ) => {
            this.db.findOne( { code: code } )
                .then( ( code ) => {
                    resolve( code === null ? code : new Code( code ) );
                })
                .catch( error => {
                    reject( eerror )
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
}