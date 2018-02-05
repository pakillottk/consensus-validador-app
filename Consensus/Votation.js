export default class Votation {
    constructor( nodeId, code, scanMode, openedAt, solver ) {
        this.openedBy   = nodeId;
        this.code       = code;
        this.scanMode   = scanMode;
        this.openedAt   = openedAt;
        this.consensus  = null; //The resulting code state

        this.solver     = solver;
    }

    vote( veredict ) {
        console.log( 'voting' );
        console.log( this.code );
        console.log( 'veredict' );
        console.log( veredict );

        if( !this.solver ) {
            throw 'The votation is missing the solver';
        }
        
        this.solver.emitVote( veredict );
    }
}