import ConsensusController from './ConsensusController';
import LocalVotationSolver from '../VotationSolvers/LocalVotationSolver';

import Code from '../../Database/Models/Code/Code';

export default class ConsensusLocalController extends ConsensusController {
    constructor( codeCollection, onVotationClosed ) {
        super( codeCollection, onVotationClosed );
    }

    async openVotation( votation ) {
        if( await this.codeCollection.codeExists( votation.code ) ) {
            votation.solver = new LocalVotationSolver( ( veredict ) => this.onVoteEmitted( votation, veredict ) );
            this.votationOpened( votation );
        } else {
            this.votationClosed({
                consensus: { code: votation.code },
                message: 'El código no existe...',
                verification: 'not_valid'
            });
        }        
    }

    onVoteEmitted( votation, veredict ) {
        delete veredict.veredict.proposal;
        
        this.codeCollection.findCode( votation.code )
            .then( codeDB => {
                const code = new Code( codeDB );
                if( veredict.verification === 'valid' ) {
                    veredict.veredict.consensus = code.marked();
                } else {
                    veredict.veredict.consensus = code;
                }
                console.log( veredict.veredict );
                this.votationClosed( veredict.veredict );
            });
    }    
}