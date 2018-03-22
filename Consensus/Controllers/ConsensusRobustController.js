import CodeColection from '../../Database/Models/CodeCollection'
import ConsensusLocalController from './ConsensusLocalController'
import ConsensusEventBasedController from './ConsensusEventBasedController'
import EventWebSocket from '../../Communication/EventBased/EventWebSocket'

import API from '../../Communication/API/API'

//Hybrid controller that alternates local and EventBased on network errors.
export default class ConsensusRobustController {
    constructor() {
        this.collections = [];
        this.socketControllers = [];
        this.localControllers = [];

        this.isOnline = false;
    }

    async initialize( session, types ) { 
        for( let i = 0; i < types.length; i++ ) {
            const type = types[ i ]
            const collection = new CodeColection( session, type );
            await collection.syncCollection();

            this.collections.push(
                collection    
            );

            const socketController = new ConsensusEventBasedController(
                new EventWebSocket( 
                    API.connection, 
                    session.id + '-' + session.name + '-' + type.id + '-' + type.type,
                    () => this.socketConnected(),
                    () => this.socketDisconnected()  
                ),
                collection
            );
            socketController.startTask();
            this.socketControllers.push(
                socketController    
            );

            const localController = new ConsensusLocalController( collection, ( votation ) => this.votationClosed( votation ) );
            localController.startTask();
            this.localControllers.push(
                localController
            );
        };
    }

    codeScanned( code ) {
        console.log( 'to vote: ' + code )
        this.localControllers.forEach( controller => {
            controller.codeScanned( code )
        })
        /*
        if( this.isOnline ) {
            this.socketControllers.forEach( controller => {
                controller.codeReceived( code )
            })
        } else {
            this.localControllers.forEach( controller => {
                consoller.codeReceived( code )
            })
        }*/
    }

    socketConnected() {
        console.log( 'connection okey' );
        this.isOnline = true;
    }

    socketDisconnected() {
        console.log( 'lost connection' );
        this.isOnline = false; 
    }

    votationClosed( votation ) {
        console.log( 'closed' )
    }
}