import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import LoginPage from './Pages/LoginPage';
import SessionsPage from './Pages/SessionsPage';

//import EventWebSocket from './Communication/EventBased/EventWebSocket';
//import CodeCollection from './Database/Models/CodeCollection';

//const ws = new EventWebSocket(''); 
//const collection = new CodeCollection( {name: 'asd', date: new Date()}, 'test' );

import API from './Communication/API/API';
import config from './env'

( async ()  => {
  await API.attemptLogin({
    username: 'root',
    password: 'root',
    client_id: config.auth.client_id,
    client_secret: config.auth.client_secret,
    grant_type: config.auth.grant_type
  });
})();

export default class App extends React.Component {
  render() {    
    return (
      <Router>
        <Scene key="root">
          <Scene key="login" component={LoginPage} title="Login" initial={true} />
          <Scene key="sessions" component={SessionsPage} title="Sesiones" />
        </Scene>
      </Router>
    );
  }
}