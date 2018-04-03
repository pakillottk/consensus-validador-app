import QueueTask from '../../Tasks/QueueTask';
import EmitVeredictTask from '../Tasks/EmitVeredictTask';
import CloseVotationTask from '../Tasks/CloseVotationTask';

import Votation from '../Votation';
import Code from '../../Database/Models/Code/Code';

export default class ConsensusController {
    constructor( codeCollection, onVotationClosed ) {
        this.codeCollection = codeCollection;
        this.onVotationClosed = onVotationClosed;
        this.votingTask = new QueueTask();
    }

    codeScanned( code, scanMode ) {
        this.openVotation( new Votation( null, code, scanMode, new Date() ) );
    }

    startTask() {
        this.votingTask.start();
    }

    stopTask() {
        this.votingTask.stop();
    }

    openVotation( votation ) {
        //Implement in subclasses
        throw 'Not implemented';
    }

    votationOpened( votation ) {
        this.votingTask.addTask(  new EmitVeredictTask( this.codeCollection, votation ) );
    }

    votationClosed( votation ) {
        if( votation.consensus.id === undefined ) {
            //Nothing to do. Code doesn't exists
            this.votationCloseFinished( votation );
            return;
        }
        votation.consensus = new Code( votation.consensus );
        this.votingTask.addTask( new CloseVotationTask( this.codeCollection, votation, () => this.votationCloseFinished( votation ) ) );
    }

    votationCloseFinished( votation ) {
        console.log( 'votation closed' );
        //console.log( votation );

        if( this.onVotationClosed ) {
            this.onVotationClosed( votation, this.codeCollection.type.type );
        }
    }
} 