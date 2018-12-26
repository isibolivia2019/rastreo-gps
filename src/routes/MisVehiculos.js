import React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';
import { PropagateLoader } from 'react-spinners'
const {socket} = require('../sockets')
import store from '../store'
import {rastreoVehiculos} from '../actionCreators'
import {
  Row,
  Col,
  Grid,
  Panel,
  Table,
  Checkbox,
  FormGroup,
  PanelBody,
  PanelHeader,
  PanelContainer,
  Button
} from '@sketchpixy/rubix';
let sw = false;
let data
let tabla

export default class MisVehiculos extends React.Component {
  constructor(props){
    super(props)
    sw = false;
    this.state = {
      listaVehiculos: [],
      loading: true
    }
    this.handleMenu = this.handleMenu.bind(this)

    this.handleRutasTemporales = this.handleRutasTemporales.bind(this)
    this.handleConfiguracion = this.handleConfiguracion.bind(this)
    this.handleRecorrido = this.handleRecorrido.bind(this)
    this.handleIniciarRastreo = this.handleIniciarRastreo.bind(this)

    store.subscribe(() => {
      if(sw == false){
          sw = true;
          socket.emit('listaMisVehiculos', store.getState().codigoUsuario, (vehiculos) =>{
            if (this.refs.myRef){
                this.setState({
                listaVehiculos:  this.state.listaVehiculos.concat(vehiculos),
                loading: false
                })
                tabla = $(ReactDOM.findDOMNode(this.example)).DataTable( {
                  destroy: true,
                  responsive: true,
                  columnDefs: [{ targets: [-1, -2], className: 'dt-body-right' }]
                });
            }
        })
      }
    })
  }

  componentDidMount() {
    if(store.getState().codigoUsuario != ""){
      if(sw == false){
        sw = true;
        socket.emit('listaMisVehiculos', store.getState().codigoUsuario, (vehiculos) =>{
          if (this.refs.myRef){
              this.setState({
              listaVehiculos:  this.state.listaVehiculos.concat(vehiculos),
              loading: false
              })
          }
          if(vehiculos.length > 0){
            tabla = $(ReactDOM.findDOMNode(this.example)).DataTable( {
              destroy: true,
              responsive: true,
              columnDefs: [{ targets: [-1, -2], className: 'dt-body-right' }]
            });
          }
        }) 
      }
    }
  }

  handleMenu(i){
    const array = []
    array.push(this.state.listaVehiculos[i])
    store.dispatch(rastreoVehiculos(array))
    this.props.router.push('/misvehiculos/menu')
  }

  handleRutasTemporales(i){
    const array = []
    array.push(this.state.listaVehiculos[i])
    store.dispatch(rastreoVehiculos(array))
    this.props.router.push('misvehiculos/temporales')
  }

  handleConfiguracion(i){
    const array = []
    array.push(this.state.listaVehiculos[i])
    store.dispatch(rastreoVehiculos(array))
    this.props.router.push('misvehiculos/configuracion')
  }

  handleIniciarRastreo(i){
    const array = []
    array.push(this.state.listaVehiculos[i])
    store.dispatch(rastreoVehiculos(array))
    this.props.router.push('rastreo/online')
  }

  handleRecorrido(i){
    const array = []
    array.push(this.state.listaVehiculos[i])
    store.dispatch(rastreoVehiculos(array))
    this.props.router.push('rastreo/recorrido')
  }

  render() {
    if(!this.state.loading)
      if(this.state.listaVehiculos.length > 0)
        data = this.state.listaVehiculos.map((vehiculo, index)=>
        <tr key={vehiculo.placa}  className='text-center'>
          <td style={{paddingLeft: '20px'}}><FormGroup><Checkbox name={vehiculo.placa} defaultValue='option1' onChange={this.handleSeleccionarVehiculo}></Checkbox></FormGroup></td>
          <td>
            <Button outlined lg type='submit' bsStyle='success' onClick={()=>this.handleMenu(index)}>{vehiculo.placa}</Button>
          </td>
          <td><h4>{vehiculo.marca}</h4></td>
          <td><h4>{vehiculo.serie}</h4></td>
          <td><h4>{vehiculo.modelo}</h4></td>
        </tr>
      )
      else{
        data = <tr><td><h3>Fin de la busqueda. No se encontraron Vehiculos</h3></td></tr>
      }
    else
    data =<tr>
            <td><PropagateLoader className={css`display: block; padding-top: 10px; padding-bottom: 20px; margin-left: auto; margin-right: auto; width: 0%;`} sizeUnit={"px"} size={15} color={'#123abc'} loading={this.state.loading}/></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

    return (
      <PanelContainer ref="myRef">
      <Panel>
        <PanelHeader className='bg-darkgreen45 fg-white'>
          <Grid>
            <Row>
              <Col xs={12}>
                <h3 style={{margin: 15}}>Mis Vehiculos</h3>
              </Col>
            </Row>
          </Grid>
        </PanelHeader>
        <PanelBody>
          <Grid>
            <Row>
            <Col xs={12} className='text-left'>
                  <Table ref={(c) => this.example = c} className='display' cellSpacing='0' width='100%'>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nro. de Placa</th>
                        <th>Vehiculo</th>
                        <th>Serie</th>
                        <th>Modelo</th>
                      </tr>
                    </thead>
                    <tfoot>
                      <tr>
                        <th></th>
                        <th>Nro. de Placa</th>
                        <th>Vehiculo</th>
                        <th>Serie</th>
                        <th>Modelo</th>
                      </tr>
                    </tfoot>
                    <tbody>
                      {data}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}