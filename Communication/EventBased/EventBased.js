export default class EventBased {
    // @client - the client of the system (websocket, pusher...)
    constructor( client, onConnect, onDisconnect ) {
        this.client = client;
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;

        this.attachConectionStatusEmitters();
    }

    attachConectionStatusEmitters() {
        //Implement in subclasses
        throw 'Not implemented';
    }

    bind( event, callback ) {
        //Implement in subclasses
        throw 'Not implemented';
    }

    broadcast( message ) {
        //Implement in subclasses
        throw 'Not implemented';
    }

    emit( receiver, message ) {
        //Implement in subclasses
        throw 'Not implemented';
    }
}