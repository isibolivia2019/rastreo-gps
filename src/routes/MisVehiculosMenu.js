import React from 'react';
import { Link } from 'react-router';
import {
  Row,
  Col,
  Icon,
  Grid,
  Panel,
  Image,
  Table,
  Button,
  PanelBody,
  PanelHeader,
  PanelContainer,
} from '@sketchpixy/rubix';
import store from '../store'

class GalleryItem extends React.Component {
  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelHeader>
            <Grid className='gallery-item'>
              <Row>
                <Col xs={12} style={{padding: 12.5}}>
                    <Link to={`/misvehiculos/${this.props.url}`} className='gallery-item-link'>
                    <Image responsive src={`/imagenes/${this.props.image}.jpg`} alt={this.props.title} width='200' height='150'/>
                    <div className='black-wrapper text-center'>
                      <Table style={{height: '100%', width: '100%'}}>
                        <tbody>
                          <tr>
                            <td>
                              <Icon glyph={`${this.props.icono} icon-3x`} />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Link>
                  <div className='text-center'>
                    <h4 className='fg-darkgrayishblue75 hidden-xs' style={{textTransform: 'uppercase'}}>{this.props.title}</h4>
                    <h6 className='fg-darkgrayishblue75 visible-xs' style={{textTransform: 'uppercase'}}>{this.props.title}</h6>
                    <h5 className='fg-darkgray50 hidden-xs' style={{textTransform: 'uppercase'}}>{this.props.subtitle}</h5>
                    <h6 className='visible-xs' style={{textTransform: 'uppercase'}}><small className='fg-darkgray50'>{this.props.subtitle}</small></h6>
                    <Link to={`/misvehiculos/${this.props.url}`}><Button outlined style={{marginBottom: 5}} bsStyle='primary'>{this.props.button}</Button></Link>
                  </div>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
        </Panel>
      </PanelContainer>
    );
  }
}

export default class MisVehiculosMenu extends React.Component {
  async componentDidMount() {
    //$('#body, html').addClass('social');
    await this.setState({
        listaVehiculos: store.getState().rastreoVehiculos
    })

    if(this.state.listaVehiculos.length < 1){
        this.props.router.push('/misvehiculos')
    }else{
      var links = document.getElementsByClassName('gallery-1');
      $('.gallery-1').unbind('click').bind('click', function(event) {
        blueimp.Gallery(links, {
          index: $(this).get(0),
          event: event
        });
      });
    }
  }

  render() {
    return (
      <Row className='gallery-view'>
        {/*<Col xs={6} sm={4} md={4} collapseRight>
          <GalleryItem image='imagen4' title='Informacion del Vehiculo' subtitle='14th Dec - 15th Dec' url='' button='Ver Informacion' icono='icon-fontello-doc-7'/>
    </Col>*/}
        <Col xs={6} sm={4} md={4} collapseRight>
          <GalleryItem image='imagen1' title='Rastreo Online' subtitle='10th Dec - 12th Dec'  url='rastreo' button='Iniciar Rastreo' icono='icon-dripicons-location'/>
        </Col>
        <Col xs={6} sm={4} md={4} collapseRight>
          <GalleryItem image='imagen5' title='Recorrido Temporal' subtitle='13th Dec - 14th Dec' url='temporales' button='Ver Informacion' icono='icon-flatline-road'/>
        </Col>
        {/*<Col xs={6} sm={4} md={4} collapseRight>
          <GalleryItem image='imagen2' title='Rutas Guardadas' subtitle='13th Dec - 14th Dec' url='configuracion' button='Ver Informacion' icono='icon-ikons-diskette'/>
        </Col>*/}
        <Col xs={6} sm={4} md={4} collapseRight>
          <GalleryItem active image='imagen3' title='Configuracion de Dispositivo GPS' subtitle='11th Dec - 12th Dec' url='configuracion' button='Configurar' icono='icon-simple-line-icons-settings'/>
        </Col>
      </Row>
    );
  }
}
