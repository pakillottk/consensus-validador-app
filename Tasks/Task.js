
const DEFAULT_TIME = 100;

export default class Task {
    /*
        @frequency - Time (in ms) between Task's exectuions
    */
    constructor( frequency ) {
        this.state = 'waiting';
        this.stopRequested = false;
        this.finished = false;
        this.frequency = frequency || DEFAULT_TIME;
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
        this.finished = true;
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
        this.stopRequested = false;
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
            setTimeout( this.run(), this.frequency );
        } else {
            this.setStateWaiting();
        }
    }

    stop() {
        this.stopRequested = true;
    }
}