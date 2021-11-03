import React, {useContext} from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/fontawesome-free-solid'
import { userActions } from '../rdx/rdx';
import hamburger from "../static/hamburger.png"

import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavLink,
  NavbarText
} from 'reactstrap';
import MobileOnly from "./MobileOnly";
import DesktopOnly from "./DesktopOnly";
import LogoutBtn from "./LogoutBtn";
import {MobileSideMenuContext} from "../context/MobileSideMenuContextProvider";
import ToggleSideMenuBtn from "./ToggleSideMenuBtn";

class Header extends React.Component {

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
            <DesktopOnly isOpen={1}>
              <Nav className="mr-auto" navbar>
              </Nav>
              { this.props.loggedIn &&
              <>
              <LogoutBtn/>
              </>
              }
            </DesktopOnly>
            <MobileOnly isOpen={1}>
                <ToggleSideMenuBtn/>
            </MobileOnly>

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

export default connect(mapStateToProps)(Header);