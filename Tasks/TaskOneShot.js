import Task from './Task';

export default class TaskOneShot extends Task {
    constructor( onFinish ) {
        super( undefined, onFinish );
    }

    async run() {
        try {
            await this.runHandler();
            this.finishAndSuccess();
        } catch( error ) {
            this.finishAndFail();    
        }
        this.finished = true;    
    }
}