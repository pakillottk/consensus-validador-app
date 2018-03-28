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
            //console.log( 'received_votation' );
            //console.log( data );
            const votation = new Votation( 
                data.openedBy, 
                data.code, 
                data.scanMode, 
                data.openedAt, new SocketVotationSolver(this.eventHandler) 
            );
            this.votationOpened( votation )
        });
        this.eventHandler.bind( 'votation_closed', ( veredict ) => {
            //console.log( veredict );
            this.votationClosed( veredict );
        });
    }

    openVotation( votation ) {
        votation =  {...votation.getAsPlainObject(), openedBy: this.eventHandler.nodeId};
        this.eventHandler.emit( 'open_votation', votation )
    }
}