import Votation from '../Votation';
import Code from '../../Database/Models/Code/Code';

export default class ConsensusController {
    constructor( codeCollection, voterTask ) {
        this.codeCollection = codeCollection;
        this.voterTask      = voterTask;
        this.votationPool   = voterTask.votationPool;
    }

    codeScanned( code, scanMode ) {
        this.openVotation( code, scanMode );
    }

    voteSent( votation, veredict ) {
        if( veredict === 'valid' ) {
            this.codeCollection.updateCode( votation.code.marked() );
        }
    }

    //Must be implemented in subclasses
    emitVotation( votation ) {
        //Dummy function body
        console.log( 'emit votation not implemented in controller' );
    }

    openVotation( code, scanMode ) {
        //TODO: Get the id of the node
        const votation = new Votation( 'myId', new Date(), code, scanMode  );
        this.emitVotation( votation );
    }

    async votationReceived( votation ) {
        const codeDB    = await this.codeCollection.findCode( votation.code );
        //Code in localDB, vote. Else absent from votation
        votation.code = codeDB;
        this.votationPool.votationOpened( votation );
    }

    votationClosed( votation, veredict ) {
        this.votationPool.closedVotation( votation );
    }
}