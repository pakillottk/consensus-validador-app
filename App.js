import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import ConnectionPage from './Pages/ConnectionPage';
import LoginPage from './Pages/LoginPage';
import SessionsPage from './Pages/SessionsPage';
import ScanPage from './Pages/ScanPage';
import CodeListPage from './Pages/CodeListPage';
import HistoryPage from './Pages/HistoryPage';

export default class App extends React.Component {
  render() {    
    return (
      <Router>
        <Scene key="root" navigationBarStyle={{backgroundColor:'#666'}} titleStyle={{color:'#ddd'}}>
          <Scene key="connection" component={ConnectionPage} title="CONECTAR" initial={true} />
          <Scene key="login" component={LoginPage} title="LOGIN" />
          <Scene key="sessions" component={SessionsPage} title="SESIONES" />
          <Scene key="scan" component={ScanPage} title="ESCÁNER" />
          <Scene key="codelist" component={CodeListPage} title="LISTADO" />
          <Scene key="history" component={HistoryPage} title="HISTORIA" />
        </Scene>
      </Router>
    );
  }
}