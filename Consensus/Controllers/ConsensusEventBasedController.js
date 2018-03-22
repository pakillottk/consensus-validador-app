import ConsensusController from './ConsensusController';

export default class ConsensusEventBasedController extends ConsensusController {
    constructor( eventHandler, codeCollection ) {
        this.eventHandler = eventHandler;
        this.codeCollection = codeCollection;

        this.bindEvents();
    }

    bindEvents() {
        this.eventHandler.onConnect = this.connetionRecovered;
        this.eventHandler.onDisconnect = this.connectionLost;
        this.eventHandler.bind( 'votation_opened', ( data ) => this.votationOpened( data.votation ) );
        this.eventHandler.bind( 'votation_closed', ( data ) => this.votationClosed( data.votation ) );
    }

    connectionLost() {
        //TODO
    }

    connetionRecovered() {
        //TODO
    }

    openVotation( votation ) {
        //this.eventHandler.emit( 'open_votation', votation )
    }
}