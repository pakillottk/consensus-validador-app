import ConsesusEventBasedController from './ConsensusEventBasedController';
import EmitCodeSearchTask from '../Tasks/EmitCodeSearchTask';

/*
    Handles the special case of a code which isn't in any allowed
    collection. Makes a special votation where all nodes look for the code and
    respond with the collection where they found it.
    
    If the collection is allowed for the opener it should start a regular
    votation. Else, it would display an error.
*/
export default class ConsensusCodeSearchController extends ConsesusEventBasedController {
    constructor( eventHandler, allowedCollections, onVotationClosed ) {
        super( eventHandler, null, onVotationClosed );

        this.allowedCollections = allowedCollections;
    }

    //@override
    votationOpened( votation ) {
        this.votingTask.addTask( new EmitCodeSearchTask( this.allowedCollections, votation ) );
    }

    //@override
    votationClosed( votation ) {
        this.votationCloseFinished( votation );
    }
}