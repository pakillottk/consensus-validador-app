export default class VotationsPool {
    constructor() {
        this.pendingVotations = [];
        this.myVotations = {};
    }

    isEmpty() {
        return this.pendingVotations.length === 0;
    }

    votationOpened( votation ) {
        this.pendingVotations.push( votation );
        
        //TODO: If votation openened by this node, add to myVotations
        /*
        if() {
            this.myVotations[ votation.code.code ] = votation;
        }
        */
    }
    
    nextVotation() {
        if( this.isEmpty() ) {
            throw 'Attempting to get next pending votation on empty VotationsPool';
        }
        return this.pendingVotations.shift();
    }

    closedVotation( votation ) {
        const code = votation.code.code;
        if( this.myVotations[ code ] ) {
            delete this.myVotations[ code ];
        }
    }
}