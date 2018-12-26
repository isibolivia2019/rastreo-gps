import React from 'react';

import {
  Sidebar, SidebarNav, SidebarNavItem,
  SidebarControls, SidebarControlBtn,
  LoremIpsum, Grid, Row, Col, FormControl,
  Label, Progress, Icon,
  SidebarDivider
} from '@sketchpixy/rubix';
import UsuariosConectados from './usuariosConectados';
import DispositivosConectados from './dispositivosConectados';
let menu
import { Link, withRouter } from 'react-router';
import store from '../store'
import {setCodigoUsuario, setNombreUsuario, setTipoUsuario} from '../actionCreators'
const {socket} = require('../sockets')
@withRouter
class ApplicationSidebar extends React.Component {
  handleChange(e) {
    this._nav.search(e.target.value);
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>
                  { /** Pages Section */ }
                  <div className='sidebar-header'>PAGINAS</div>
                  <SidebarNavItem glyph='icon-fontello-gauge' name='Mis Vehiculos' href='/misvehiculos' />
                </SidebarNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

class DummySidebar extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className='sidebar-header'>DUMMY SIDEBAR</div>
            <LoremIpsum query='1p' />
          </Col>
        </Row>
      </Grid>
    );
  }
}

@withRouter
export default class SidebarContainer extends React.Component {
  constructor(){
    super()
    this.state = {
      codigo: "",
      nombre: "",
      tipo: "",
      menuSidebarControlBtn: ``,
      menuSidebar: ``
    }

    store.subscribe(() => {
      if(store.getState().tipoUsuario == "Root"){
        this.setState({
          menuSidebarControlBtn:
            <SidebarControls>
              <SidebarControlBtn bundle='fontello' glyph='docs' sidebar={0} />
              <SidebarControlBtn bundle={'fontello'} glyph={'chat-1'} sidebar={1} />
              <SidebarControlBtn bundle={'fontello'} glyph={'chart-pie-2'} sidebar={2} />
            </SidebarControls>,
          menuSidebar: 
          <div id='sidebar-container'>
            <Sidebar sidebar={0}>
              <ApplicationSidebar />
            </Sidebar>
            <Sidebar sidebar={1}>
              <UsuariosConectados />
            </Sidebar>
            <Sidebar sidebar={2}>
              <DispositivosConectados />
            </Sidebar>
          </div>
        })
      }else{
        this.setState({
          menuSidebarControlBtn:
            <SidebarControls>
              <SidebarControlBtn bundle='fontello' glyph='docs' sidebar={0} />
            </SidebarControls>,
          menuSidebar: 
          <div id='sidebar-container'>
            <Sidebar sidebar={0}>
              <ApplicationSidebar />
            </Sidebar>
          </div>
        })
      }
    })
  }
  componentDidMount(){
    fetch('/api/verificar-autentificacion', {
      method: 'POST',
      body: '',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
        if(data.codigo != ""){
          this.setState({codigo: data.codigo, nombre: data.nombre})
          const usuario = {socket: socket.id, codigo: data.codigo}
          socket.emit('autentificacion', usuario, respuesta =>{
              socket.emit('datosUsuarios', usuario.codigo, respuesta => {
                store.dispatch(setCodigoUsuario(data.codigo))
                store.dispatch(setNombreUsuario(data.nombre))
                store.dispatch(setTipoUsuario(data.tipo))
                this.setState({
                  usuario:  respuesta
                })
              })
          })
        }else{
          if(store.getState().codigoUsuario != ""){
            this.setState({
              codigo: store.getState().codigoUsuario,
              nombre: store.getState().nombreUsuario,
              tipo: store.getState().tipoUsuario})
          }else{
            vex.dialog.alert('Inicie Sesion Nuevamente')
            this.props.router.push('/')
          }
        }

    })
    .catch(err => console.error(err))
  }
  render() {
    return (
      <div id='sidebar'>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>{this.state.nombre}</div>
                <div>
                  <Progress id='demo-progress' value={100} color='#ffffff'/>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
          {this.state.menuSidebarControlBtn}
          {this.state.menuSidebar}
      </div>
    );
  }
}
