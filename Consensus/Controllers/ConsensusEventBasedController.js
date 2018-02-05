import ConsensusController from './ConsensusController';

export default class ConsensusEventBasedController extends ConsensusController {
    constructor( eventHandler, codeCollection ) {
        this.eventHandler = eventHandler;
        this.codeCollection = codeCollection;

        this.bindEvents();
    }

    bindEvents() {
        //TODO: attach the events to websocket
        /*
        this.eventHandler.bind( 'votation_opened', ( data ) => this.votationOpened( data.votation ) );
        this.eventHandler.bind( 'votation_closed', ( data ) => this.votationClosed( data.votation ) );
        */
    }

    connectionLost() {
        //TODO
    }

    connetionRecovered() {
        //TODO
    }

    openVotation() {
        //TODO: broadcast the votation
    }
}