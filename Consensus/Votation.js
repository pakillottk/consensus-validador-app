export default class Votation {
    constructor( openedBy, openedAt, code, scanMode ) {
        this.openedBy = openedBy;
        this.openedAt = openedAt;
        this.code     = code;
        this.scanMode = scanMode;
    }

    vote( choice ) {
        console.log( 'Emiting the vote for: ' + this.code.code );
        console.log( choice );
        //TODO: send the vote
    }
}