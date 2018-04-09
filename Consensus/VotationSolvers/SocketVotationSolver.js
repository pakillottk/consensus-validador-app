import VotationSolver from './VotationSolver';

export default class SocketVotationSolver extends VotationSolver {
    constructor( socket ) {
        super();
        
        this.socket = socket;
    }

    emitVote( veredict ) {
        console.log( 'emitting ' + this.socket.channel );
        this.socket.emit( 'vote', {room: this.socket.channel, veredict} );
    }
}