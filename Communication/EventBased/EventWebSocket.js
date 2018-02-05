import EventBased from './EventBased';
import io from 'socket.io-client';
import env from '../../env';

export default class EventWebSocket extends EventBased {
    constructor( channel, onConnect, onDisconnect ) {
        const client = io( env.events.url );
        super( client, onConnect, onDisconnect );

        this.channel = channel;        
    }

    //TODO: implement the binding of onConnect, onDisconnect
    attachConectionStatusEmitters() {
        return true;
    }

    bind( event, callback ) {
        //TODO
    }
    
}