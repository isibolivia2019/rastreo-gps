import React from 'react';
import classNames from 'classnames';
import { SidebarBtn, Navbar, Nav, NavItem, Icon, Grid, Row, Col } from '@sketchpixy/rubix';
import { Link, withRouter } from 'react-router';
const {socket} = require('../sockets')
class Brand extends React.Component {
  render() {
    return (
      <Navbar.Header {...this.props}>
        <Navbar.Brand tabIndex='-1'>
          <a href='#'>
            <img src='/imagenes/logoBlanco.png' alt='rubix' width='111' height='28' />
          </a>
        </Navbar.Brand>
      </Navbar.Header>
    );
  }
}


class HeaderNavigation extends React.Component {
  render() {
    var props = {
      ...this.props,
      className: classNames('pull-right', this.props.className)
    };

    return (
      <Nav {...props}>
        <NavItem className='logout' href='#'>
          <Icon bundle='fontello' glyph='off-1' />
        </NavItem>
      </Nav>
    );
  }
}

@withRouter
export default class Header extends React.Component {
  constructor(props){
    super(props)
    this.handleCerrarSesion = this.handleCerrarSesion.bind(this)
  }

  handleCerrarSesion(){
    socket.emit('cerrarSession', socket.id)
    fetch(`/api/cerrarsession`)
    this.props.router.push('/')
  }

  render() {
    return (
      <Grid id='navbar'>
        <Row>
          <Col xs={12}>
            <Navbar fixedTop fluid id='rubix-nav-header'>
              <Row>
                <Col xs={3} visible='xs'>
                  <SidebarBtn />
                </Col>
                <Col xs={6} sm={4}>
                  <Brand />
                </Col>
                <Col xs={3} sm={8} collapseRight className='text-right' onClick={this.handleCerrarSesion}>
                  <HeaderNavigation/>
                </Col>
              </Row>
            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}
