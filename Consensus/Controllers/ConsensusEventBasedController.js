import ConsensusController from './ConsensusController';

export default class ConsensusEventBasedController extends ConsensusController {
    constructor( eventHandler, codeCollection ) {
        super( codeCollection );

        this.eventHandler = eventHandler;
        this.bindEvents();
    }

    bindEvents() {
        this.eventHandler.bind( 'votation_opened', ( data ) => this.votationOpened( data.votation ) );
        this.eventHandler.bind( 'votation_closed', ( data ) => this.votationClosed( data.votation ) );
    }

    openVotation( votation ) {
        //this.eventHandler.emit( 'open_votation', votation )
    }
}