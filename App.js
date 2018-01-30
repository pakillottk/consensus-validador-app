import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import LoginPage from './pages/LoginPage';
import SessionsPage from './pages/SessionsPage';

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
