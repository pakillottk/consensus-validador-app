import EventBased from './EventBased';

export default class EventWebSocket extends EventBased {
    constructor( channel, onConnect, onDisconnect ) {
        //TODO: create a websocket client
        const client = null;
        this.channel = channel;        

        super( client, onConnect, onDisconnect );
    }

    //TODO: implement the binding of onConnect, onDisconnect
    attachConectionStatusEmitters() {
        return true;
    }

    bind( event, callback ) {
        //TODO
    }
    
}