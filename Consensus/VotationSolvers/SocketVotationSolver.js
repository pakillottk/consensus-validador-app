import VotationSolver from './VotationSolver';

export default class SocketVotationSolver extends VotationSolver {
    constructor( socket ) {
        super();
        
        this.socket = socket;
    }

    emitVote( veredict ) {
        this.socket.emit( 'vote', veredict );
    }
}