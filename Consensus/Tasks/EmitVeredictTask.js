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
                    if( codeDB !== null ) {
                        const codeObj = new Code( codeDB );
                        veredict = codeObj.verify( this.votation.scanMode );
                        marked = codeObj.marked();
                        this.votation.vote({
                            ...veredict, 
                            proposal: veredict.verification === 'valid' ? marked.getAsPlainObject() : codeObj.getAsPlainObject()
                        });
                    }
                                        
                    resolve();
                })
                .catch( error =>  { reject( error ) } );
        });
    }
}