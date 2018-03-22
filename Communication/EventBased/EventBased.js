export default class EventBased {
    // @client - the client of the system (websocket, pusher...)
    constructor( client, onConnect, onDisconnect, channel ) {
        this.client = client;
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;
        this.channel = channel;        

        this.attachConectionStatusEmitters();
    }

    disconnect() {
       //Implement in subclasses
       throw 'Not implemented'; 
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