import Task from './Task';

export default class TaskOneShot extends Task {
    constructor( onFinish ) {
        super( undefined, onFinish );
    }

    run() {
       this.runHandler()
        .then( () => {
            this.finishAndSuccess();
            this.finished = true;
        })
        .catch( ( error ) => {
            this.finishAndFail();
            this.finished = true;
        });     
    }
}