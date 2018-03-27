import ConsensusController from './ConsensusController';
import LocalVotationSolver from '../VotationSolvers/LocalVotationSolver';

import Code from '../../Database/Models/Code/Code';

export default class ConsensusLocalController extends ConsensusController {
    constructor( codeCollection, onVotationClosed ) {
        super( codeCollection, onVotationClosed );
    }

    openVotation( votation ) {
        votation.solver = new LocalVotationSolver( ( veredict ) => this.onVoteEmitted( votation, veredict ) );
        this.votationOpened( votation );
    }

    onVoteEmitted( votation, veredict ) {   
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