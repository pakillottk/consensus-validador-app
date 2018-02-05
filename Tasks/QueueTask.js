import Queue from '../Queues/Queue';
import Task from './Task';

export default class QueueTask extends Task {
    constructor( frequency ) {
        super( frequency );

        this[ 'tasks' ] = new Queue();
        this[ 'currentTask' ] = null;
    }

    addTask( task ) {
        this[ 'tasks' ].enqueue( task );
    }

    runHandler() {
        let currentTask = this[ 'currentTask' ];
        
        if( currentTask === null ) {
            if( !this['tasks'].isEmpty() ) {
                currentTask = this[ 'tasks' ].unenqueue();
                this[ 'currentTask' ] = currentTask;

                currentTask.start();
            }            
        } else {
            if( currentTask.isFinished() ) {
                this[ 'currentTask' ] = null;
            }
        }
    }
}