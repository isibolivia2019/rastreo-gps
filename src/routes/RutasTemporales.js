import React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';
import { PropagateLoader } from 'react-spinners'
const {socket} = require('../sockets')
import { Link } from 'react-router';
import store from '../store'
import {fechaRecorrido} from '../actionCreators'
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
  NavDropdown,
  MenuItem,
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
} from '@sketchpixy/rubix';
let data
let tabla

class SocialSwitches extends React.Component {
  componentDidMount() {
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

    elems.forEach(function(html) {
      var switchery = new Switchery(html);
    });
  }
  render() {
    return (
      <div>
      <h3>Octubre</h3>
      <Table className='panel-switches' collapsed>
        <tbody>
          <tr>
            <td>
              <Icon glyph='icon-fontello-twitter' className='fg-blue' /><span className='text-uppercase panel-switches-text'>twitter</span>
            </td>
            <td className='panel-switches-holder'><input type='checkbox' className='js-switch' defaultChecked /></td>
          </tr>
          <tr>
            <td>
              <Icon glyph='icon-fontello-facebook' className='fg-darkblue' /><span className='text-uppercase panel-switches-text'>facebook</span>
            </td>
            <td className='panel-switches-holder'><input type='checkbox' className='js-switch' /></td>
          </tr>
          <tr>
            <td>
              <Icon glyph='icon-fontello-gplus' className='fg-deepred' /><span className='text-uppercase panel-switches-text'>google+</span>
            </td>
            <td className='panel-switches-holder'><input type='checkbox' className='js-switch' /></td>
          </tr>
          <tr>
            <td>
              <Icon glyph='icon-fontello-linkedin' className='fg-deepred' /><span className='text-uppercase panel-switches-text'>linkedin</span>
            </td>
            <td className='panel-switches-holder'><input type='checkbox' className='js-switch' defaultChecked /></td>
          </tr>
          <tr>
            <td>
              <Icon glyph='icon-fontello-instagram' className='fg-deepred' /><span className='text-uppercase panel-switches-text'>instagram</span>
            </td>
            <td className='panel-switches-holder'>
              <Button bsStyle='primary'>connect</Button>
            </td>
          </tr>
        </tbody>
      </Table>
      </div>
    );
  }
}

class NotePanel extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} style={{padding: 50, paddingTop: 12.5, paddingBottom: 25}} className='text-center'>
            <h3 className='fg-black50'>NOTE</h3>
            <hr/>
            <p><LoremIpsum query='3s'/></p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class RevenuePanel extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} className='text-center'>
            <br/>
            <div>
              <h4>Gross Revenue</h4>
              <h2 className='fg-green visible-xs visible-md visible-lg'>9,362.74</h2>
              <h4 className='fg-green visible-sm'>9,362.74</h4>
            </div>
            <hr className='border-green'/>
            <div>
              <h4>Net Revenue</h4>
              <h2 className='fg-green visible-xs visible-md visible-lg'>6,734.89</h2>
              <h4 className='fg-green visible-sm'>6,734.89</h4>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class LoadPanel extends React.Component {
  render() {
    return (
      <Row className='bg-green fg-lightgreen'>
        <Col xs={6}>
          <h3>Daily Load</h3>
        </Col>
        <Col xs={6} className='text-right'>
          <h2 className='fg-lightgreen'>67%</h2>
        </Col>
      </Row>
    );
  }
}

class AlertChart extends React.Component {
  componentDidMount() {
    var chart = new Rubix('#alert-chart', {
      width: '100%',
      height: 200,
      hideLegend: true,
      hideAxisAndGrid: true,
      focusLineColor: '#fff',
      theme_style: 'dark',
      axis: {
        x: {
          type: 'linear'
        },
        y: {
          type: 'linear',
          tickFormat: 'd'
        }
      },
      tooltip: {
        color: '#fff',
        format: {
          x: 'd',
          y: 'd'
        }
      },
      margin: {
        left: 25,
        top: 50,
        right: 25,
        bottom: 25
      }
    });

    var alerts = chart.column_series({
      name: 'Load',
      color: '#7CD5BA',
      nostroke: true
    });

    alerts.addData([
      {x: 0, y: 30},
      {x: 1, y: 40},
      {x: 2, y: 15},
      {x: 3, y: 30},
      {x: 4, y: 35},
      {x: 5, y: 70},
      {x: 6, y: 50},
      {x: 7, y: 60},
      {x: 8, y: 35},
      {x: 9, y: 30},
      {x: 10, y: 40},
      {x: 11, y: 30},
      {x: 12, y: 50},
      {x: 13, y: 35}
    ]);
  }
  render() {
    return (
      <Row>
        <Col xs={12}>
          <div id='alert-chart' className='rubix-chart'></div>
        </Col>
      </Row>
    );
  }
}

export default class RutasTemporales extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      meses: [],
      listaFechas: [],
      loading: true
    }

    this.handleRecorrido = this.handleRecorrido.bind(this)
  }

  async componentDidMount() {
    await this.setState({
      listaVehiculos: store.getState().rastreoVehiculos
    })

  if(this.state.listaVehiculos.length < 1){
      this.props.router.push('/misvehiculos')
  }else{
    socket.emit('listaRutaTemporal', this.state.listaVehiculos[0].dispositivo, (listaFechas) =>{
      console.log("lista de Fechas:", listaFechas)
        for(let i = 0 ; i < listaFechas.length ; i++){
          
          const dia = listaFechas[i].fecha.substring(8, 10)
          const mes = listaFechas[i].fecha.substring(5, 7)
          const año = listaFechas[i].fecha.substring(0, 4)
          var nomMes
          if(mes == "01") nomMes = "Enero"
          if(mes == "02") nomMes = "Febrero"
          if(mes == "03") nomMes = "Marzo"
          if(mes == "04") nomMes = "Abril"
          if(mes == "05") nomMes = "Mayo"
          if(mes == "06") nomMes = "Junio"
          if(mes == "07") nomMes = "Julio"
          if(mes == "08") nomMes = "Agosto"
          if(mes == "09") nomMes = "Septiembre"
          if(mes == "10") nomMes = "Octubre"
          if(mes == "11") nomMes = "Noviembre"
          if(mes == "12") nomMes = "Diciembre"
          const index = this.state.meses.findIndex(i => i.mes === mes && i.año === año)
          if(index == -1){
            this.setState({
              meses: this.state.meses.concat({mes: mes, nombre: nomMes, año: año, dias: [dia]})
            })
          }
          else{
            const copiaMeses = this.state.meses.slice()
            copiaMeses[index].dias = this.state.meses[index].dias.concat(dia)
            this.setState({meses: copiaMeses}) 
          }
        }
        /*if (this.refs.myRef){
            this.setState({
              listaFechas:  this.state.listaFechas.concat(listaFechas),
            loading: false
            })
        }
        tabla = $(ReactDOM.findDOMNode(this.example)).DataTable( {
          destroy: true,
          responsive: true,
          columnDefs: [{ targets: [-1, -2], className: 'dt-body-right' }]
        });*/
    })
  }
        


    /*socket.on('actualizaListaVehiculo', (vehiculo)=>{
      if (this.refs.myRef){
        this.setState({
          listaVehiculos: this.state.listaVehiculos.concat(vehiculo),
        })
      }
    })*/
  }

  handleRecorrido(fecha){
    store.dispatch(fechaRecorrido(fecha))
    this.props.router.push('/misvehiculos/temporales/recorrido')
  }

  render() {
    return (
      <div className='dashboard'>
        <Row>
          <Col sm={12}>
            <PanelTabContainer id='dashboard-main' defaultActiveKey="demographics">
              <Panel horizontal className='force-collapse'>
                <PanelLeft className='bg-red fg-white panel-sm-2'>
                  <Nav bsStyle="tabs" className='plain'>
                  {this.state.meses.map(mes=>
                    <NavItem eventKey={`${mes.mes}${mes.año}`} key={`${mes.mes}${mes.año}`}>
                      {mes.nombre } de {mes.año}
                    </NavItem>
                  )}
                    <NavItem eventKey="notes">
                      <Icon glyph='icon-fontello-note-1'/><span className='text-uppercase panel-switches-text'>{"Ayuda"}</span>
                    </NavItem>
                  </Nav>
                </PanelLeft>
                <PanelBody className='panel-sm-3' style={{padding: 0}}>
                  <Grid>
                    <Row>
                      <Col xs={12} collapseLeft collapseRight>
                        <Tab.Content>
                          <Tab.Pane eventKey="demographics">
                            
                          </Tab.Pane>
                          {this.state.meses.map((mes, index)=>
                          <Tab.Pane eventKey={`${mes.mes}${mes.año}`} key={`${mes.mes}${mes.año}`}>
                            <h3>{mes.nombre} de {mes.año}</h3>
                            <Table className='panel-switches' collapsed>
                              <tbody>
                                {mes.dias.map((dia, index)=>
                                <tr key={`${dia}${mes.mes}${mes.año}`}>
                                  <td>
                                    <Icon glyph='icon-fontello-instagram' className='fg-deepred' /><span className='text-uppercase panel-switches-text'>{dia}</span>
                                  </td>
                                  <td className='panel-switches-holder'>
                                    <Button bsStyle='primary' onClick={()=>this.handleRecorrido(`${mes.año}-${mes.mes}-${dia}`)}>Ver Recorrido</Button>
                                  </td>
                                </tr>
                                )}
                              </tbody>
                            </Table>
                          </Tab.Pane>
                          )}
                          <Tab.Pane eventKey="notes">
                            <NotePanel />
                          </Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
                <PanelRight className='bg-lightgreen fg-white panel-sm-2'>
                  <RevenuePanel />
                </PanelRight>
                <PanelRight className='bg-green fg-green panel-sm-4'>
                  <Grid>
                    <LoadPanel />
                    <AlertChart />
                  </Grid>
                </PanelRight>
              </Panel>
                                </PanelTabContainer>
            {/*<PanelTabContainer id='pills-stacked' defaultActiveKey="home" noOverflow>
              <PanelHeader className='bg-blue fg-white'>
                <Grid>
                  <Row>
                    <Col sm={12}>
                      <h3>Pills: Stacked</h3>
                    </Col>
                  </Row>
                </Grid>
              </PanelHeader>
              <PanelBody>
                <Grid>
                  <Row>
                    <Col sm={4}>
                      <Nav bsStyle="pills" stacked onSelect={this.handleActiveState} className='tab-blue'>
                        <NavItem eventKey="home">Home</NavItem>
                        <NavItem eventKey="user">Profile</NavItem>
                        <NavDropdown title='Dropdown' bsStyle='blue'>
                          <MenuItem >@fat</MenuItem>
                          <MenuItem >@mdo</MenuItem>
                        </NavDropdown>
                      </Nav>
                    </Col>
                    <Col sm={8}>
                      <Tab.Content>
                        <Tab.Pane eventKey="home">
                          <p><LoremIpsum query='2s'/></p>
                          <p><LoremIpsum query='1s'/></p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="user">
                          <p><LoremIpsum query='2s'/></p>
                          <p><LoremIpsum query='1s'/></p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="fat">
                          <p><LoremIpsum query='2s'/></p>
                          <p><LoremIpsum query='1s'/></p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="mdo">
                          <p><LoremIpsum query='2s'/></p>
                          <p><LoremIpsum query='1s'/></p>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                  <br />
                </Grid>
              </PanelBody>
                              </PanelTabContainer>*/}
          </Col>
        </Row>
      </div>
    );
  }
}
