export default class Queue {
    constructor() {
        this['queue'] = [];
    }

    isEmpty() {
        return this['queue'].length === 0;
    }

    enqueue( item ) {
        return this['queue'].push( item );
    }

    unenqueue( item ) {
        return this['queue'].shift();
    }
}