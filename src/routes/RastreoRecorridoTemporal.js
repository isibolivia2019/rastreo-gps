import React from 'react';
import { css } from 'emotion';
import { PropagateLoader } from 'react-spinners'
const {socket} = require('../sockets')
import {
  Row,
  Col,
  Grid,
  Panel,
  Table,
  PanelBody,
  PanelContainer,
  MenuItem,
  DropdownButton
} from '@sketchpixy/rubix';
import store from '../store'
var marker3
let i = 0, j = 0
export default class Rutas extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        listaVehiculos: [],
        listaRecorrido: [],
        velocidadTiempo: 500,
    }
  }

  

  timer() {
    /*let km = 0;
    let difeKm = 0;
    let partesKm = 0;
    let dadoKm = 0;
    difeKm = this.state.listaRecorrido[i + 1].velocidad - this.state.listaRecorrido[i].velocidad
    partesKm = difeKm / 100
    dadoKm = partesKm * j
    km = dadoKm + this.state.listaRecorrido[i].velocidad

    if(j < 99){
        j++
    }else{
        i++
        j = 0;
    }*/
    marker3.getPopup().setContent(` 
        ${this.state.listaVehiculos[0].marca} ${this.state.listaVehiculos[0].serie} - <b>${this.state.listaVehiculos[0].placa}</b><br>
        <b>Hora: ${this.state.listaRecorrido[i].hora}</b><br>
        ${parseInt( this.state.listaRecorrido[i].velocidad)>1?"<b>Velocidad:</b> " + parseInt( this.state.listaRecorrido[i].velocidad) + " km/h":"<b>Vehiculo sin movimiento</b>"}`
    )
    i++
    if(i > (this.state.listaRecorrido.length - 1)) {
        alert("finalizo recorrido")
        i=0
        j=0
        clearInterval(this.intervalId);
    }
  }

  async componentDidMount() {
    //$('#body, html').addClass('social');
    await this.setState({
        listaVehiculos: store.getState().rastreoVehiculos
    })

    if(this.state.listaVehiculos.length < 1){
        this.props.router.push('/misvehiculos')
    }else{
        L.interpolatePosition = function(p1, p2, duration, t) {
            var k = t/duration;
            k = (k > 0) ? k : 0;
            k = (k > 1) ? 1 : k;
            return L.latLng(p1.lat + k * (p2.lat - p1.lat),
                p1.lng + k * (p2.lng - p1.lng));
        };
    
        L.Marker.MovingMarker = L.Marker.extend({
            //state constants
            statics: {
                notStartedState: 0,
                endedState: 1,
                pausedState: 2,
                runState: 3
            },
            options: {
                autostart: false,
                loop: false,
            },
        
            initialize: function (latlngs, durations, options) {
                L.Marker.prototype.initialize.call(this, latlngs[0], options);
                this._latlngs = latlngs.map(function(e, index) {
                    return L.latLng(e);
                });
        
                if (durations instanceof Array) {
                    this._durations = durations;
                } else {
                    this._durations = this._createDurations(this._latlngs, durations);
                }
        
                this._currentDuration = 0;
                this._currentIndex = 0;
                this._state = L.Marker.MovingMarker.notStartedState;
                this._startTime = 0;
                this._startTimeStamp = 0;  // timestamp given by requestAnimFrame
                this._pauseStartTime = 0;
                this._animId = 0;
                this._animRequested = false;
                this._currentLine = [];
                this._stations = {};
            },
        
            isRunning: function() {
                return this._state === L.Marker.MovingMarker.runState;
            },
            isEnded: function() {
                return this._state === L.Marker.MovingMarker.endedState;
            },
            isStarted: function() {
                return this._state !== L.Marker.MovingMarker.notStartedState;
            },
            isPaused: function() {
                return this._state === L.Marker.MovingMarker.pausedState;
            },
            start: function() {
                if (this.isRunning()) {return;}
                if (this.isPaused()) {this.resume();} else {
                    this._loadLine(0);
                    this._startAnimation();
                    this.fire('start');
                }
            },
            resume: function() {
                if (! this.isPaused()) {return;}
                // update the current line
                this._currentLine[0] = this.getLatLng();
                this._currentDuration -= (this._pauseStartTime - this._startTime);
                this._startAnimation();
            },
        
            pause: function() {
                if (! this.isRunning()) {return;}
        
                this._pauseStartTime = Date.now();
                this._state = L.Marker.MovingMarker.pausedState;
                this._stopAnimation();
                this._updatePosition();
            },
        
            stop: function(elapsedTime) {
                if (this.isEnded()) {return;}
        
                this._stopAnimation();
        
                if (typeof(elapsedTime) === 'undefined') {
                    // user call
                    elapsedTime = 0;
                    this._updatePosition();
                }
        
                this._state = L.Marker.MovingMarker.endedState;
                this.fire('end', {elapsedTime: elapsedTime});
            },
        
            addLatLng: function(latlng, duration) {
                this._latlngs.push(L.latLng(latlng));
                this._durations.push(duration);
            },
        
            moveTo: function(latlng, duration) {
                this._stopAnimation();
                this._latlngs = [this.getLatLng(), L.latLng(latlng)];
                this._durations = [duration];
                this._state = L.Marker.MovingMarker.notStartedState;
                this.start();
                this.options.loop = false;
            },
        
            addStation: function(pointIndex, duration) {
                if (pointIndex > this._latlngs.length - 2 || pointIndex < 1) {return;}
                this._stations[pointIndex] = duration;
            },
        
            onAdd: function (map) {
                L.Marker.prototype.onAdd.call(this, map);
        
                if (this.options.autostart && (! this.isStarted())) {
                    this.start();
                    return;
                }
        
                if (this.isRunning()) {this._resumeAnimation();}
            },
        
            onRemove: function(map) {
                L.Marker.prototype.onRemove.call(this, map);
                this._stopAnimation();
            },
        
            _createDurations: function (latlngs, duration) {
                var lastIndex = latlngs.length - 1;
                var distances = [];
                var totalDistance = 0;
                var distance = 0;
        
                // compute array of distances between points
                for (var i = 0; i < lastIndex; i++) {
                    distance = latlngs[i + 1].distanceTo(latlngs[i]);
                    distances.push(distance);
                    totalDistance += distance;
                }
        
                var ratioDuration = duration / totalDistance;
        
                var durations = [];
                for (i = 0; i < distances.length; i++) {durations.push(distances[i] * ratioDuration);}
        
                return durations;
            },
        
            _startAnimation: function() {
                this._state = L.Marker.MovingMarker.runState;
                this._animId = L.Util.requestAnimFrame(function(timestamp) {
                    this._startTime = Date.now();
                    this._startTimeStamp = timestamp;
                    this._animate(timestamp);
                }, this, true);
                this._animRequested = true;
            },
        
            _resumeAnimation: function() {
                if (! this._animRequested) {
                    this._animRequested = true;
                    this._animId = L.Util.requestAnimFrame(function(timestamp) {
                        this._animate(timestamp);
                    }, this, true);
                }
            },
        
            _stopAnimation: function() {
                if (this._animRequested) {
                    L.Util.cancelAnimFrame(this._animId);
                    this._animRequested = false;
                }
            },
        
            _updatePosition: function() {
                var elapsedTime = Date.now() - this._startTime;
                this._animate(this._startTimeStamp + elapsedTime, true);
            },
        
            _loadLine: function(index) {
                this._currentIndex = index;
                this._currentDuration = this._durations[index];
                this._currentLine = this._latlngs.slice(index, index + 2);
            },
        
            /**
             * Load the line where the marker is
             * @param  {Number} timestamp
             * @return {Number} elapsed time on the current line or null if
             * we reached the end or marker is at a station
             */
            _updateLine: function(timestamp) {
                // time elapsed since the last latlng
                var elapsedTime = timestamp - this._startTimeStamp;
        
                // not enough time to update the line
                if (elapsedTime <= this._currentDuration) {return elapsedTime;}
        
                var lineIndex = this._currentIndex;
                var lineDuration = this._currentDuration;
                var stationDuration;
        
                while (elapsedTime > lineDuration) {
                    // substract time of the current line
                    elapsedTime -= lineDuration;
                    stationDuration = this._stations[lineIndex + 1];
        
                    // test if there is a station at the end of the line
                    if (stationDuration !== undefined) {
                        if (elapsedTime < stationDuration) {
                            this.setLatLng(this._latlngs[lineIndex + 1]);
                            return null;
                        }
                        elapsedTime -= stationDuration;
                    }
        
                    lineIndex++;
        
                    // test if we have reached the end of the polyline
                    if (lineIndex >= this._latlngs.length - 1) {
        
                        if (this.options.loop) {
                            lineIndex = 0;
                            this.fire('loop', {elapsedTime: elapsedTime});
                        } else {
                            // place the marker at the end, else it would be at
                            // the last position
                            this.setLatLng(this._latlngs[this._latlngs.length - 1]);
                            this.stop(elapsedTime);
                            return null;
                        }
                    }
                    lineDuration = this._durations[lineIndex];
                }
        
                this._loadLine(lineIndex);
                this._startTimeStamp = timestamp - elapsedTime;
                this._startTime = Date.now() - elapsedTime;
                return elapsedTime;
            },
        
            _animate: function(timestamp, noRequestAnim) {
                this._animRequested = false;
        
                // find the next line and compute the new elapsedTime
                var elapsedTime = this._updateLine(timestamp);
        
                if (this.isEnded()) {
                    // no need to animate
                    return;
                }
        
                if (elapsedTime != null) {
                     // compute the position
                    var p = L.interpolatePosition(this._currentLine[0],
                        this._currentLine[1],
                        this._currentDuration,
                        elapsedTime);
                    this.setLatLng(p);
                }
        
                if (! noRequestAnim) {
                    this._animId = L.Util.requestAnimFrame(this._animate, this, false);
                    this._animRequested = true;
                }
            }
        });
    
        /*************************************************** */
        /*************************************************** */
    
        // INICIA MI CODIGO
        var map = new L.Map('map', {
            zoom: 6,
            minZoom: 3,
        });
      
        // create a new tile layer
        var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        layer = new L.TileLayer(tileUrl, {
          attribution: 'Maps © <a href=\"www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
          maxZoom: 18
        });
        map.addLayer(layer);
        map.setView([-16.499475, -68.122553], 13)
        const datos = {dispositivo: this.state.listaVehiculos[0].dispositivo, fecha: store.getState().fecha, horaInicio: store.getState().hora.horaInicio, horaFinal: store.getState().hora.horaFinal}
        socket.emit('recorrido', datos, ruta => {
            var recorrido = []
            let tiempo = []
            this.setState({listaRecorrido: ruta})
            for(let i = 0 ; i < ruta.length ; i++){
                recorrido = recorrido.concat([[ruta[i].latitud, ruta[i].longitud]])
                tiempo = tiempo.concat([this.state.velocidadTiempo])
            }
            marker3 = new L.Marker.MovingMarker(recorrido,
                tiempo, {autostart: true, loop: false}).addTo(map);
            this.intervalId = setInterval(this.timer.bind(this), (this.state.velocidadTiempo));
            marker3.loops = 0;
            marker3.bindPopup('', {closeOnClick: false});
            marker3.openPopup();
        })
    }
}

render() {
    return (
        <div ref="myRef">
            <Row style={{marginTop: -25, marginLeft: -50, marginRight: -50, marginBottom:-25}}>
                <Col xs={12}>
                    <PanelContainer>
                        <Panel>
                            <PanelBody>
                                <Grid>
                                    <Row>
                                        <Col xs={12}>
                                            <div style={{marginTop: -25, marginLeft: -25, marginRight: -25, marginBottom:-25}} >
                                                <div>
                                                    <div id='map' className='map leaflet-container leaflet-fade-anim' style={{height: 600}}></div>
                                                </div>
                                            </div>  
                                        </Col>
                                        
                                    </Row>
                                </Grid>
                            </PanelBody>
                        </Panel>
                    </PanelContainer>
                </Col>
            </Row>
        </div>
    );
  }
}