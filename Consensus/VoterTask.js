import Task from '../Tasks/Task';
import Code from '../Database/Models/Code/Code';

const LOOP_FREQ = 100; //ms

export default class VoterTask extends Task {
    constructor( votationsPool, freq ) {
        super( freq || LOOP_FREQ );
        
        this.votationsPool = votationsPool || null;
    }

    emitVote( votation ) {
        const verifyResult = votation.code.verify( votation.scanMode );
        votation.vote( verifyResult.verification );
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