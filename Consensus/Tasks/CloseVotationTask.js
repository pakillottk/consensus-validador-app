import TaskOneShot from '../../Tasks/TaskOneShot';

export default class CloseVotationTask extends TaskOneShot {
    constructor( codeCollection, votation, onFinish ) {
        super( onFinish );

        this.codeCollection = codeCollection;
        this.votation       = votation;
    }

    runHandler() {
        return new Promise( ( resolve, reject ) => {
            //console.log( 'closing' );
            //console.log( this.votation );

            this.codeCollection.updateCode( this.votation.consensus )
            .then( () => { this.onFinish( this.votation ); resolve(); } )
            .catch( error => { reject( error ) });
        });
    }
}