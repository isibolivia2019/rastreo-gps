import React from 'react';

import {
  Grid, Row, Col
} from '@sketchpixy/rubix';
const {socket} = require('../sockets')
class ChatNav extends React.Component {
  render() {
    return (
      <ul className='sidebar-nav' {...this.props}>
        {this.props.children}
      </ul>
    );
  }
}

class ChatItem extends React.Component {
  render() {
    var isOffline = true;
    var status = 'border-darkgray';
    if(this.props.idle) status = 'border-yellow';
    if(this.props.busy) status = 'border-red';
    if(this.props.online) status = 'border-green';
    if(status !== 'border-darkgray') isOffline = false;

    let props = {
      ...this.props,
    };

    delete props.idle;
    delete props.busy;
    delete props.online;
    delete props.name;
    delete props.avatar;

    return (
      <li tabIndex='-1' {...props}>
        <a href='#' tabIndex='-1'>
          <img src={`/imgs/app/avatars/${this.props.avatar}.png`} width='30' height='30' className={status} style={{borderWidth: 2, borderStyle: 'solid', borderRadius: 100, padding: 2, position: 'relative', top: -7, opacity: isOffline ? 0.4 : 1}} />
          <span className='name' style={{position: 'relative', top: -2, opacity: isOffline ? 0.4 : 1}}>{this.props.name}</span>
        </a>
      </li>
    );
  }
}

export default class usuariosConectados extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      listaUsuarios: []
    }
  }
  componentDidMount(){
    socket.emit('listaUsuariosConectados', "", (lista) =>{
      if (this.refs.myRef){
          this.setState({
            listaUsuarios: lista,
          })
      }
    })
    socket.on('actualizaListaUsuariosConectados', (lista)=>{
      if (this.refs.myRef){
         this.setState({
          listaUsuarios: lista,
        })
      }
    })
  }
  render() {
    return (
      <div ref="myRef">
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-header'>USUARIOS ({this.state.listaUsuarios.length})</div>
              <div className='sidebar-nav-container'>
                <ChatNav style={{marginBottom: 0}}>
                  {this.state.listaUsuarios.map(usuarios=>
                    <ChatItem key={usuarios.codigo} name={usuarios.codigo} avatar='avatar5' online />
                  )}
                </ChatNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
