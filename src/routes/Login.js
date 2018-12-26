import React from 'react';
import { css } from 'emotion';
import { PropagateLoader } from 'react-spinners'
import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Image,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  InputGroup,
  FormControl,
  PanelContainer,
} from '@sketchpixy/rubix';
const {socket} = require('../sockets')
import store from '../store'
import {setCodigoUsuario, setNombreUsuario, setTipoUsuario} from '../actionCreators'
let data

export default class Login extends React.Component {
  constructor(){
    super()
    this.state = {
      usuario: "",
      password: "",
      mensaje: "Ingrese su Usuario y Contraseña",
      autentificacion: false,
      loading: true
    }

    this.handleAutentificacion = this.handleAutentificacion.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e){
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleAutentificacion(e){
    e.preventDefault()
    if(this.state.usuario){
      if(this.state.password){
        this.setState({autentificacion: true})
        this.setState({mensaje: 'Autentificando Usuario . . .'})
        const data = {ci: this.state.usuario, pass:this.state.password}
        fetch(`/api/autentificacion/`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(data => {
          if(data[0]){
            store.dispatch(setCodigoUsuario(data[0].ci))
            store.dispatch(setNombreUsuario(data[0].nombre + ' ' + data[0].appat + ' ' + data[0].apmat))
            store.dispatch(setTipoUsuario(data[0].tipo))
            if (this.refs.myRef){
              this.setState({mensaje: 'Usuario Identificado'})
              this.setState({usuario: '', password:''})
            }
            this.props.router.push('/misvehiculos')
          }else{
            vex.dialog.alert('Usuario y/o contraseña incorrectos.');
            if (this.refs.myRef){
              this.setState({mensaje: 'Usuario y/o contraseña incorrectos.'})
              this.setState({password:''})
            }
          }
          if (this.refs.myRef){
            this.setState({autentificacion: false})
          }
        })
      }else{
        vex.dialog.alert('Ingrese su Contraseña para Iniciar Sesion.');
      }
    }else{
      vex.dialog.alert('Ingrese su Usuario para Iniciar Sesion.');
    }
  }

  render() {
    if(this.state.autentificacion)
      data = <PropagateLoader className={css`display: block; padding-top: 10px; padding-bottom: 20px; margin-left: auto; margin-right: auto; width: 0%;`} sizeUnit={"px"} size={15} color={'#123abc'} loading={this.state.loading}/>
    else
      data = <Button outlined lg type='submit' bsStyle='blue' onClick={this.handleAutentificacion}>Ingresar</Button>

    return (
      <div id='auth-container' className='login' ref="myRef">
        <div id='auth-row'>
          <div id='auth-cell'>
            <Grid>
              <Row>
                <Col sm={4} smOffset={4} xs={10} xsOffset={1} collapseLeft collapseRight>
                  <PanelContainer controls={false}>
                    <Panel>
                      <PanelBody style={{padding: 0}}>
                        <div className='text-center bg-darkblue fg-white'>
                          <h3 style={{margin: 0, padding: 25}}>RASTREO VEHICULAR</h3>
                        </div>
                        <div className='bg-hoverblue fg-black50 text-center' style={{padding: 12.5}}>
                          <div style={{margin: 12.5}}>
                            <Image responsive src='/imagenes/logoIsiBolivia.png'/>
                          </div>
                        </div>
                        <div>
                          <div className='text-center' style={{paddingTop: 12.5}}>
                            <h4>{this.state.mensaje}</h4>
                          </div>
                          <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
                            <Form>
                              <FormGroup controlId='emailaddress'>
                                <InputGroup bsSize='large'>
                                  <InputGroup.Addon>
                                    <Icon glyph='icon-fontello-user-8' />
                                  </InputGroup.Addon>
                                  <FormControl autoFocus type='number' className='border-focus-blue' placeholder='Usuario' name="usuario" value={this.state.usuario} onChange={this.handleChange}/>
                                </InputGroup>
                              </FormGroup>
                              <FormGroup controlId='password'>
                                <InputGroup bsSize='large'>
                                  <InputGroup.Addon>
                                    <Icon glyph='icon-fontello-key' />
                                  </InputGroup.Addon>
                                  <FormControl type='password' className='border-focus-blue' placeholder='Contraseña' name="password" value={this.state.password} onChange={this.handleChange}/>
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <Grid>
                                  <Row>
                                    <Col xs={12} collapseLeft collapseRight className='text-center'>
                                      {data}
                                    </Col>
                                  </Row>
                                </Grid>
                              </FormGroup>
                            </Form>
                          </div>
                        </div>
                      </PanelBody>
                    </Panel>
                  </PanelContainer>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}