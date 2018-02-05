import VotationSolver from './VotationSolver';

export default class LocalVotationSolver extends VotationSolver {
    constructor( onVote ) {
        super();
        
        this.onVote = onVote;
    }

    emitVote( veredict ) {
        this.onVote( veredict );
    }
}