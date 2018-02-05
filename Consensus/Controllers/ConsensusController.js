import QueueTask from '../../Tasks/QueueTask';
import EmitVeredictTask from '../Tasks/EmitVeredictTask';
import CloseVotationTask from '../Tasks/CloseVotationTask';

import Votation from '../Votation';
import Code from '../../Database/Models/Code/Code';

export default class ConsensusController {
    constructor( codeCollection ) {
        this.codeCollection = codeCollection;

        this.votingTask = new QueueTask();
    }

    codeScanned( code, scanMode ) {
        this.openVotation( new Votation( 'myId', code, 'E', new Date() ) );
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
        if( votation.consensus === null ) {
            //Nothing to do. Code doesn't exists
            return;
        }
        votation.consensus = new Code( votation.consensus );
        this.votingTask.addTask( new CloseVotationTask( this.codeCollection, votation, () => this.votationCloseFinished( votation ) ) );
    }

    votationCloseFinished( votation ) {
        //Impement in subclasses, if necessary
    }
} 