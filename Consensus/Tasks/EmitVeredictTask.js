import TaskOneShot from '../../Tasks/TaskOneShot';
import Code from '../../Database/Models/Code/Code';

export default class EmitVeredictTask extends TaskOneShot {
    constructor( codeCollection, votation, onFinish ) {
        super( onFinish );

        this.codeCollection = codeCollection;
        this.votation       = votation;
    }

    runHandler() {
        return new Promise( ( resolve, reject ) => {
            this.codeCollection.findCode( this.votation.code )
                .then( codeDB => {
                    let veredict = null;
                    if( codeDB === null ) {
                        veredict = { verification: 'blank', message: 'Code not found' };
                    } else {
                        const codeObj = new Code( codeDB );
                        veredict = codeObj.verify( this.votation.scanMode );
                    }

                    this.votation.vote( veredict );
                    
                    resolve();
                })
                .catch( error =>  { reject( error ) } );
        });
    }
}