import CodeColection from '../../Database/Models/CodeCollection'
import ConsensusLocalController from './ConsensusLocalController'
import ConsensusEventBasedController from './ConsensusEventBasedController'
import EventWebSocket from '../../Communication/EventBased/EventWebSocket'

import API from '../../Communication/API/API'

//Hybrid controller that alternates local and EventBased on network errors.
export default class ConsensusRobustController {
    constructor( lastScanHandler ) {
        this.lastScanHandler = lastScanHandler;

        this.collections = [];
        this.socketControllers = [];
        this.localControllers = [];

        this.codeCount = 0;
        this.validated = 0;

        this.isOnline = false;
    }

    async initialize( session, types ) { 
        let totalCodes = 0;
        let totalValidated = 0;

        for( let i = 0; i < types.length; i++ ) {
            const type = types[ i ]
            const collection = new CodeColection( session, type );
            await collection.syncCollection();
            totalCodes += await collection.getCodeCount();
            totalValidated += collection.validated;

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
                collection,
                this.votationEnded.bind( this )
            );
            socketController.startTask();
            this.socketControllers.push(
                socketController    
            );

            const localController = new ConsensusLocalController( collection, 
                ( votation ) => this.votationClosed( votation ), 
                this.votationEnded.bind( this )
            );
            localController.startTask();
            this.localControllers.push(
                localController
            );
        };

        this.codeCount = totalCodes;
        this.validated = totalValidated;
    }

    stop() {
        this.socketControllers.forEach( controller => {
            controller.stopTask();
            controller.eventHandler.disconnect();
        });

        this.localControllers.forEach( controller => {
            controller.stopTask();
        });
    }

    codeScanned( code ) {
        console.log( 'to vote: ' + code )
        if( this.isOnline ) {
            this.socketControllers.forEach( controller => {
                controller.codeScanned( code )
            })
        } else {
            this.localControllers.forEach( controller => {
                controller.codeScanned( code )
            })
        }
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
    
    votationEnded( votation, type ) {
        //TODO: check votation opened by this node
        if( votation.consensus === null ) {
            this.lastScanHandler({
                verification: votation.verification,
                code: '',
                name: '',
                type: type,
                message: 'El código no existe.'
            });
        } else {
            this.lastScanHandler({
                verification: votation.verification,
                code: votation.consensus.code,
                name: votation.consensus.name,
                type: type,
                message: votation.message
            });
        }
    }
}