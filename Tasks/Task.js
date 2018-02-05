
const DEFAULT_TIME = 100;

export default class Task {
    /*
        @frequency - Time (in ms) between Task's executions
    */
    constructor( frequency, onFinish ) {
        this.state = 'waiting';
        this.stopRequested = false;
        this.finishRequested = false;
        this.finished = false;
        this.frequency = frequency || DEFAULT_TIME;
        this.onFinish = onFinish || ( () => {} );
    }

    isWaiting() {
        return this.state === 'waiting';
    }

    isRunning() {
        return this.state === 'running';
    }

    isFinished() {
        return this.finished;
    }

    isSuccessfull() {
        return this.state === 'success';
    }

    hasFailed() {
        return this.state === 'failed';
    }

    setStateWaiting() {
        this.state = 'waiting';
    }
    
    setStateRunning() {
        this.state = 'running';
    }

    setStateSuccess() {
        this.state = 'sucess';
    }

    setStateFailed() {
        this.state = 'failed';
    }

    finish() {
        this.stop();
        this.finishRequested = true;
    }

    finishAndFail() {
        this.finish();
        this.setStateFailed();
    }

    finishAndSuccess() {
        this.finish();
        this.setStateSuccess();
    }

    start() {
        this.finishRequested = false;
        this.stopRequested   = false;
        this.setStateRunning();
        this.run();
    }

    runHandler() {
        //Dummy handler
        this.finishAndSuccess();
    }

    run() {
        this.runHandler();

        if( !this.stopRequested ) {
           setTimeout( () => this.run(), this.frequency );
        } else {
            if( this.finishRequested ) {
                this.finished = true;
                this.onFinish();
            } else {
                this.setStateWaiting();
            }
        }
    }

    stop() {
        this.stopRequested = true;
    }
}