import Queue from '../../Queues/Queue';

export default class VotationsPool {
    constructor() {
        this.veredictPending = new Queue();
        this.closingPending  = new Queue();
    }

    hasVeredictPending() {
        return !this.veredictPending.isEmpty();
    }

    hasClosingPending() {
        return !this.closingPending.isEmpty();
    }

    addVeredictPending( votation ) {
        this.veredictPending.enqueue( votation );
    }

    addClosingPending( votation ) {
        this.closingPending.enqueue( votation );
    }

    shiftVeredictPending() {
        return this.veredictPending.unenqueue();
    }

    shiftClosingPending() {
        return this.closingPending.unenqueue();
    }
}