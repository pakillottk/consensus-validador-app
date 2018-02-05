import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import LoginPage from './Pages/LoginPage';
import SessionsPage from './Pages/SessionsPage';

import CodeCollection from './Database/Models/CodeCollection';
import ConsensusLocalController from './Consensus/Controllers/ConsensusLocalController';

const dummyCollection = new CodeCollection( {name: 'test', date: new Date()}, 'dummy' );
const consensusController = new ConsensusLocalController( dummyCollection );
consensusController.startTask();

const simulateScan = ( code, mode ) => {
  console.log( 'simulating ' + code + ' ' + mode );
  consensusController.codeScanned( code, mode );
}

consensusController.codeScanned( '1', 'E' );
setTimeout( () => simulateScan( 'a', 'E' ), 100 );
setTimeout( () => simulateScan( '1', 'E' ), 100 + 100 );
setTimeout( () => simulateScan( '3', 'E' ), 100 + 100 + 100 );

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