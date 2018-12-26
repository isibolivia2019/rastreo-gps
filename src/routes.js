import React from 'react';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';

import Home from './routes/home';
import Login from './routes/Login';
import MisVehiculos from './routes/MisVehiculos';
import MisVehiculosMenu from './routes/MisVehiculosMenu';
import MisVehiculosConfiguracion from './routes/MisVehiculosConfiguracion';
import RastreoOnline from './routes/RastreoOnline';
import RutasTemporales from './routes/RutasTemporales';
import RastreoRecorridoTemporal from './routes/RastreoRecorridoTemporal';
class App extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <Sidebar />
        <Header />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </MainContainer>
    );
  }
}

export default (
  <Route>
    <Route path='/' component={Login} />
    <Route component={App}>
      <Route path='home' component={Home} />
      <Route path='misvehiculos' component={MisVehiculos} />
      <Route path='misvehiculos/menu' component={MisVehiculosMenu} />
      <Route path='/misvehiculos/configuracion' component={MisVehiculosConfiguracion} />
      <Route path='/misvehiculos/rastreo' component={RastreoOnline} />
      <Route path='/misvehiculos/temporales' component={RutasTemporales} />
      <Route path='/misvehiculos/temporales/recorrido' component={RastreoRecorridoTemporal} />
    </Route>
  </Route>
  
);
