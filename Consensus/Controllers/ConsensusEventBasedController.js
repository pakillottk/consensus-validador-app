import ConsensusController from './ConsensusController';
import Votation from '../Votation';
import SocketVotationSolver from '../VotationSolvers/SocketVotationSolver';

export default class ConsensusEventBasedController extends ConsensusController {
    constructor( eventHandler, codeCollection, onVotationClosed ) {
        super( codeCollection, onVotationClosed );

        this.eventHandler = eventHandler;
        this.bindEvents();
    }

    bindEvents() {
        this.eventHandler.bind( 'votation_opened', ( data ) => {
            console.log( 'received_votation' );
            //console.log( data );
            if( data.room !== this.eventHandler.channel ) {
                console.log( 'out' );
                return;
            }
            const votation = new Votation( 
                data.votation.openedBy, 
                data.votation.openerId,
                data.votation.code, 
                data.votation.scanMode, 
                data.votation.openedAt,
                data.votation.offline, 
                new SocketVotationSolver(this.eventHandler) 
            );
            this.votationOpened( votation )
        });
        this.eventHandler.bind( 'votation_closed', ( data ) => {
            //console.log( veredict );
            console.log( 'votation closed ' + this.eventHandler.channel );
            if( data.room === this.eventHandler.channel ) {
                this.votationClosed( data.votation );
            }
        });
    }

    openVotation( votation ) {
        votation =  {...votation.getAsPlainObject(), openedBy: this.eventHandler.nodeId };
        this.eventHandler.emit( 'open_votation', { room: this.eventHandler.channel, votation } )
    }
}