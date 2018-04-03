import CodeColection from '../../Database/Models/CodeCollection'
import ConsensusLocalController from './ConsensusLocalController'
import ConsensusEventBasedController from './ConsensusEventBasedController'
import EventWebSocket from '../../Communication/EventBased/EventWebSocket'

import API from '../../Communication/API/API'
import Code from '../../Database/Models/Code/Code';

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
        this.votationEnded = this.votationEnded.bind( this );
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
        //console.log( 'to vote: ' + code )
        let notFoundIn = 0;
        if( this.isOnline ) {
            for(let i = 0; i < this.socketControllers.length; i++) {
                const controller = this.socketControllers[ i ];
                if( controller.codeCollection.codeExists( code ) ){
                    controller.codeScanned( code );
                    break;
                } else {
                    notFoundIn++;
                }
            }

            if( notFoundIn === this.socketControllers.length ) {
                this.socketControllers[ 0 ].codeScanned( code );
            }
        } else {
            for(let i = 0; i < this.localControllers.length; i++) {
                const controller = this.localControllers[ i ];
                if( controller.codeCollection.codeExists( code ) ){
                    controller.codeScanned( code );
                    break;
                } else {
                    notFoundIn++;
                }
            }

            if( notFoundIn === this.localControllers.length ) {
                this.localControllers[ 0 ].codeScanned( code );
            }
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
    
    votationEnded( votation, type ) {
        const transportTime = new Date().getTime() - new Date( votation.closed_at ).getTime();
        console.log( 'votation end' );
        console.log( 'elapsed: ' + votation.elapsed );
        console.log( 'time to receive: ' + transportTime );

        //TODO: check votation opened by this node
        if( votation.consensus.id === undefined ) {
            this.lastScanHandler({
                verification: votation.verification,
                code: votation.consensus.code,
                name: '',
                type: '',
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