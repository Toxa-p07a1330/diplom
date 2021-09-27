import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/fontawesome-free-solid'
import { userActions } from '../rdx/rdx';

import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavLink,
  NavbarText
} from 'reactstrap';

class NavigationBar extends React.Component {

    constructor(props) {
      super(props);
      this.logout = this.logout.bind(this)
    }

    logout()
    {
        this.props.dispatch(userActions.logout());
    }

 render() {
    return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">jTMS</NavbarBrand>
        <Collapse navbar>
          <Nav className="mr-auto" navbar>
          </Nav>
          { this.props.loggedIn &&
          <>
          <NavbarText>{this.props.user.login}</NavbarText>
          <NavLink href="#" onClick={this.logout}><FontAwesomeIcon icon={faPowerOff} fixedWidth />{' '}Logout</NavLink>
          </>
          }
        </Collapse>
      </Navbar>
    </div>
    );
  }
}

function mapStateToProps(state) {
    const { user, loggedIn } = state.authentication;
    return {
        user, loggedIn
    };
}

export default connect(mapStateToProps)(NavigationBar);