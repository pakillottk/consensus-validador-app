import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import LoginPage from './Pages/LoginPage';
import SessionsPage from './Pages/SessionsPage';

import CodeCollection from './Database/Models/CodeCollection';

const collection = new CodeCollection( {name: 'asd', date: new Date()}, 'test' );

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