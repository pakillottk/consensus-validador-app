import EventBased from './EventBased';
import io from 'socket.io-client';

export default class EventWebSocket extends EventBased {
    constructor( connection, channel, onConnect, onDisconnect, isAVoter ) {
        const client = io( connection.getHostURL() );
        super( client, onConnect, onDisconnect, channel, isAVoter );
    }

    disconnect() {
        this.client.disconnect();
    }

    attachConectionStatusEmitters() {
        this.client.on( 'connect', () => {
            this.emit( 'join', { room: this.channel, voter: this.isAVoter ? true : false } )
            
            if( this.onConnect ) {
                this.onConnect()
            }
        });

        this.client.on( 'welcome', data => {
            this.nodeId = data.id;
        })

        this.client.on( 'disconnect', ()  => {
            if( this.onDisconnect ) {
                this.onDisconnect()
            }
        });
    }

    bind( event, callback ) {
        this.client.on( event, callback )
    }

    broadcast( data ) {
        this.client.broadcast( data );
    }
    
    emit( event, data ) {
        console.log( 'emitting ' + event )
        this.client.emit( event, data )
    }
}