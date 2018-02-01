import Task from '../Tasks/Task';

const LOOP_FREQ = 100; //ms

export default class VoterTask extends Task {
    constructor( votationsPool, freq ) {
        super( freq || LOOP_FREQ );
        
        this.votationsPool      = votationsPool || null;
        this.controllerAttached = null;
    }

    attachController( controller ) {
        this.controllerAttached = controller;
    }

    emitVote( votation ) {
        //code not in localDB, vote blank
        if( votation.code === null ) {
            votation.vote( 'blank' );
        } else {
            const verifyResult = votation.code.verify( votation.scanMode );
            votation.vote( verifyResult.verification );
            if( this.controllerAttached !== null ) {
                this.controllerAttached.voteSent( votation.code, verifyResult.verification );
            }
        }
    }

    /*
        Main Loop
    */
    runHandler() {
        if( votationsPool === null ) {
            throw "Running a VoterTask without votations pool";
        }

        //Votations pending?
        if( !this.votationsPool.isEmpty() ) {
            const votation = this.votationsPool.nextVotation();
            //Vote
            this.emitVote( votation );
        }
    }
}