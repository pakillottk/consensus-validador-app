import TaskOneShot from '../../Tasks/TaskOneShot';
import Code from '../../Database/Models/Code/Code';
import { RotationGestureHandler } from 'react-native-gesture-handler';

export default class EmitCodeSearchTask extends TaskOneShot {
    constructor( allowedCollections, votation, onFinish ) {
        super( onFinish );

        this.allowedCollections = allowedCollections;
        this.votation       = votation;
    }

    /*
        Vote if the code is in any of the collections.
    */ 
    async runHandler() {
        let codeDB = null;
        for( let i = 0; i < this.allowedCollections.length; i++ ) {
            const codeCollection = this.allowedCollections[ i ];
            codeDB = await codeCollection.findCode( this.votation.code );
            if( codeDB ) {
                const codeObj = new Code( codeDB );
                veredict = {
                    verification:"valid",
                    message:"Code found",
                    scanMode: this.votation.scanMode,
                    openedBy: this.votation.openedBy,
                    codeFound: codeObj.getAsPlainObject(),
                    inCollection: codeCollection.type.id+'-'+codeCollection.type.type
                };

                this.votation.vote( veredict );
                return;
            }
        }
    }
}