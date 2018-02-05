import ConsensusController from './ConsensusController';
import LocalVotationSolver from '../VotationSolvers/LocalVotationSolver';

import Code from '../../Database/Models/Code/Code';

export default class ConsensusLocalController extends ConsensusController {
    constructor( codeCollection ) {
        super( codeCollection );
    }

    openVotation( votation ) {
        votation.solver = new LocalVotationSolver( ( veredict ) => this.onVoteEmitted( votation, veredict ) );
        this.votationOpened( votation );
    }

    onVoteEmitted( votation, veredict ) {
        if( veredict.verification === 'blank' ) {
            this.votationCloseFinished( votation );
        } else {
            this.codeCollection.findCode( votation.code )
                .then( codeDB => {
                    const code = new Code( codeDB );
                    if( veredict.verification === 'valid' ) {
                        votation.consensus = code.marked();
                    } else {
                        votation.consensus = code;
                    }

                    this.votationClosed( votation );
                })
        }            
    }

    votationCloseFinished( votation ) {
        console.log( 'votation closed' );
        console.log( votation );
    }
}