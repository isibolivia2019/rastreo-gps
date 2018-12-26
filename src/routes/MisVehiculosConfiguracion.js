import React from 'react';

import {
  Row,
  Tab,
  Col,
  Nav,
  Icon,
  Grid,
  Form,
  Table,
  Label,
  Panel,
  Button,
  NavItem,
  Checkbox,
  Progress,
  PanelBody,
  FormGroup,
  PanelLeft,
  isBrowser,
  InputGroup,
  LoremIpsum,
  PanelRight,
  PanelHeader,
  FormControl,
  PanelContainer,
  PanelTabContainer,
  ControlLabel
} from '@sketchpixy/rubix';
import Switch from "react-switch";
import store from '../store'
const {socket} = require('../sockets')

export default class MisVehiculosConfiguracion extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            listaVehiculos: [],
            numero_uno: 0,
            numero_dos: 0,
            numero_tres: 0,
            alerta_bocina: 0,
            bloqueo_motor: 0,
            boton_seguridad: 0,                
            sensor_puerta: 0,
            codussd: "",
            opcionSaldo: ""
        }
        this.handleEnviarUssd = this.handleEnviarUssd.bind(this)
        this.handleVerificarSaldo = this.handleVerificarSaldo.bind(this)
        this.handleActualizarVelocidad = this.handleActualizarVelocidad.bind(this)
        this.handleActualizarDatos = this.handleActualizarDatos.bind(this)
        this.handleChangeFormularioChecked = this.handleChangeFormularioChecked.bind(this)
        this.handleChange = this.handleChange.bind(this)
      }

    async componentDidMount() {
        await this.setState({
            listaVehiculos: store.getState().rastreoVehiculos
        })
    
        if(this.state.listaVehiculos.length < 1){
            this.props.router.push('/misvehiculos')
        }else{
            if(store.getState().tipoUsuario == "Root"){
                this.setState({
                  opcionSaldo:
                  <PanelContainer noOverflow>
                  <Panel>
                    <PanelHeader className='bg-darkgreen45 fg-white'>
                      <Grid>
                        <Row>
                          <Col xs={12}>
                            <h3 style={{margin: 15}}>Otros</h3>
                          </Col>
                        </Row>
                      </Grid>
                    </PanelHeader>
                    <PanelBody>
                      <Grid>
                        <Row>
                          <Col xs={12} className='text-left'>
                              <Button bsStyle='primary' onClick={this.handleVerificarSaldo}>Verificar Saldo</Button>
                              <FormGroup controlId='modelo_vehiculo'>
                                  <ControlLabel>Codigo USSD :</ControlLabel>
                                  <InputGroup>
                                      <InputGroup.Addon>
                                          <Icon glyph='icon-fontello-vcard-1' />
                                      </InputGroup.Addon>
                                      <FormControl type='text' name="codussd" onChange={this.handleChange}/>
                                  </InputGroup>
                              </FormGroup>
                              <Button bsStyle='primary' onClick={this.handleEnviarUssd}>Enviar USSD</Button>
                              <hr className='border-green'/>
                            </Col>
                          </Row>
                        </Grid>
                      </PanelBody>
                    </Panel>
                  </PanelContainer>
                })
              }else{
                this.setState({
                  opcionSaldo: ""
                })
              }
    
            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
            elems.forEach(function(html) {
                var switchery = new Switchery(html);
            });
    
            socket.emit('listaConfiguracion', this.state.listaVehiculos[0].dispositivo, datos => {
                if(datos){
                    this.setState({
                        numero_uno: datos[0].numero_uno,
                        numero_dos: datos[0].numero_dos,
                        numero_tres: datos[0].numero_tres,
                        alerta_bocina: datos[0].alerta_bocina,
                        bloqueo_motor: datos[0].bloqueo_motor,
                        boton_seguridad: datos[0].boton_seguridad,            
                        sensor_puerta: datos[0].sensor_puerta
                    })
                }
            })
    
            socket.on('mensajeUSSD', (datos)=>{
                if(store.getState().tipoUsuario == "Root"){
                    vex.dialog.alert(`Fecha: ${datos.fecha} Hora: ${datos.hora}<br> "${datos.ussd}"`);
                }
              }) 
        }


    }

    handleVerificarSaldo(){
        const datos = {dispositivo: this.state.listaVehiculos[0].dispositivo, ussd: "*105#"}
        socket.emit('enviarUSSDDispositivo', datos)
        vex.dialog.alert('Se envio la peticion al Dispositivo haga click en OK y aguarde unos instantes');
    }

    handleEnviarUssd(){
        const datos = {dispositivo: this.state.listaVehiculos[0].dispositivo, ussd: this.state.codussd}
        socket.emit('enviarUSSDDispositivo', datos)
        vex.dialog.alert('Se envio la peticion al Dispositivo haga click en OK y aguarde unos instantes');
    }

    handleActualizarVelocidad(){
        const datos = {dispositivo: this.state.listaVehiculos[0].dispositivo, velocidad: this.state.velocidad}
        socket.emit('actualizarVelocidadDispositivo', datos, resp => {
            if(resp){
                vex.dialog.alert('Cambio realizado. Aguarde alredor 10 segundos para ver reflejado en su vehiculo');
            }else{
                vex.dialog.alert('ERROR. No se pudo realizar el cambio, intente nuevamente unos minutos');
            }
        })
    }

    handleActualizarDatos(){
        const datos = {dispositivo: this.state.listaVehiculos[0].dispositivo, numero_uno: this.state.numero_uno, numero_dos: this.state.numero_dos, numero_tres: this.state.numero_tres}
        socket.emit('actualizarDatosDispositivo', datos, resp => {
            if(resp){
                vex.dialog.alert('Cambio realizado. Aguarde alredor 10 segundos para ver reflejado en su vehiculo');
            }else{
                vex.dialog.alert('ERROR. No se pudo realizar el cambio, intente nuevamente unos minutos');
            }
        })
    }

    handleChange(e){
        const { name, value } = e.target
        this.setState({
          [name]: value
        })
      }

      handleChangeFormularioChecked(checked, event, id){
        this.setState({
            [id]: checked===true?1:0
        })
        const datos = {dispositivo: this.state.listaVehiculos[0].dispositivo, sensor: id, estado: checked===true?1:0}
        socket.emit('actualizarSensorDispositivo', datos, resp => {
            if(resp){
                vex.dialog.alert('Cambio realizado. Aguarde al menos 10 segundos para ver reflejado en su vehiculo');
            }else{
                vex.dialog.alert('ERROR. No se pudo realizar el cambio, intente nuevamente unos minutos');
            }
        })
      }
    
    render() {
        return (
            <Row>
        <Col sm={6} collapseRight>
          <PanelContainer noOverflow ref="myRef">
        <Panel>
          <PanelHeader className='bg-darkgreen45 fg-white'>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h3 style={{margin: 15}}>Sensores</h3>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <Row>
              <Col xs={12} className='text-left'>
                <Table className='panel-switches' collapsed>
                    <tbody>
                        <tr>
                            <td>
                                <span className='text-uppercase panel-switches-text'>Sensor de Puerta</span>
                            </td>
                            <td className='panel-switches-holder'><Switch onChange={this.handleChangeFormularioChecked} checked={this.state.sensor_puerta>0?true:false} id="sensor_puerta" /></td>
                        </tr>
                        <tr>
                            <td>
                                <span className='text-uppercase panel-switches-text'>Boton de Auxilio</span>
                            </td>
                            <td className='panel-switches'><Switch onChange={this.handleChangeFormularioChecked} checked={this.state.boton_seguridad>0?true:false} id="boton_seguridad" /></td>
                        </tr>
                        <tr>
                            <td>
                                <span className='text-uppercase panel-switches-text'>Sonido de Sirena</span>
                            </td>
                            <td className='panel-switches-holder'><Switch onChange={this.handleChangeFormularioChecked} checked={this.state.alerta_bocina>0?true:false} id="alerta_bocina" /></td>
                        </tr>   
                    </tbody>
                </Table>
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
            {this.state.opcionSaldo}
        </Col>
        <Col sm={6}>
        <PanelContainer noOverflow ref="myRef">
        <Panel>
          <PanelHeader className='bg-darkgreen45 fg-white'>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h3 style={{margin: 15}}>Numeros Moviles</h3>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <Row>
              <Col xs={12} className='text-left'>
              <FormGroup controlId='modelo_vehiculo'>
                                                <ControlLabel>Número Principal</ControlLabel>
                                                <InputGroup>
                                                    <InputGroup.Addon>
                                                        <Icon glyph='icon-fontello-vcard-1' />
                                                    </InputGroup.Addon>
                                                    <FormControl type='number' name="numero_uno" onChange={this.handleChange} value={this.state.numero_uno}/>
                                                </InputGroup>
                                            </FormGroup>
                                            <hr className='border-green'/>
                                            <FormGroup controlId='modelo_vehiculo'>
                                                <ControlLabel>Segundo Numero</ControlLabel>
                                                <InputGroup>
                                                    <InputGroup.Addon>
                                                        <Icon glyph='icon-fontello-vcard-1' />
                                                    </InputGroup.Addon>
                                                    <FormControl type='number' name="numero_dos" onChange={this.handleChange} value={this.state.numero_dos}/>
                                                </InputGroup>
                                            </FormGroup>
                                            <hr className='border-green'/>
                                            <FormGroup controlId='modelo_vehiculo'>
                                                <ControlLabel>Numero de Emergencia</ControlLabel>
                                                <InputGroup>
                                                    <InputGroup.Addon>
                                                        <Icon glyph='icon-fontello-vcard-1' />
                                                    </InputGroup.Addon>
                                                    <FormControl type='number' name="numero_tres" onChange={this.handleChange} value={this.state.numero_tres}/>
                                                </InputGroup>
                                            </FormGroup>
                                        <Button bsStyle='primary' onClick={this.handleActualizarDatos}>Guardar Cambios</Button>
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
        </Col>
        <Col sm={4}>
        </Col>
      </Row>
    )
  }
}
