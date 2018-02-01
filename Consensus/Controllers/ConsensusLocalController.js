import ConsensusController from './ConsensusController';

export default class ConsensusLocalController extends ConsensusController {
    constructor( codeCollection, voterTask ) {
        super( codeCollection, voterTask );
    }

    voteSent( votation, veredict ) {
        super.sentVotation( votation, veredict );
        this.votationClosed( votation );
    }

    emitVotation( votation ) {
        this.votationReceived( votation );
    }
}