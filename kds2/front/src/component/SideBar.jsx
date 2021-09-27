import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faKey,
    faUser,
    faUsers,
    faMobileAlt,
    faListAlt,
    faDatabase,
    faFileCode,
    faStore,
    faMagic,
    faHdd,
    faCreditCard,
    faBug
} from '@fortawesome/fontawesome-free-solid'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { userActions } from '../rdx/rdx';
import { Nav, NavItem, NavLink } from 'reactstrap';
import {faFileArchive} from "@fortawesome/fontawesome-free-regular";

class SideBar extends React.Component {

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
          <Nav vertical className="fixed-left" id="sidebar">
            <NavItem>
              <NavLink tag={Link} to="/groups/"><FontAwesomeIcon icon={faListAlt} fixedWidth/>{' '}Groups</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} to="/terminals/"><FontAwesomeIcon icon={faMobileAlt} fixedWidth/>{' '}Terminals</NavLink>
            </NavItem>
          <NavItem>
              <NavLink tag={Link} to="/merchants/"><FontAwesomeIcon icon={faStore} fixedWidth/>{' '}Merchants</NavLink>
          </NavItem>
              <NavItem>
                  <NavLink tag={Link} to="/acquirers/"><FontAwesomeIcon icon={faCreditCard} fixedWidth/>{' '}Acquirers</NavLink>
              </NavItem>
            <NavItem>
                <NavLink tag={Link} to="/conftemplates/"><FontAwesomeIcon icon={faFileCode} fixedWidth/>{' '}Config templates</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} to="/confpacks/"><FontAwesomeIcon icon={faDatabase} fixedWidth/>{' '}Config packages</NavLink>
            </NavItem>
              <NavItem>
                  <NavLink tag={Link} to="/applications/"><FontAwesomeIcon icon={faBug} fixedWidth/>{' '}Applications</NavLink>
              </NavItem>
          <NavItem>
              <NavLink tag={Link} to="/activators/"><FontAwesomeIcon icon={faMagic} fixedWidth/>{' '}Activation</NavLink>
          </NavItem>
              <NavItem>
                  <NavLink tag={Link} to="/keys/"><FontAwesomeIcon icon={faKey} fixedWidth/>{' '}Keys</NavLink>
              </NavItem>
              <NavItem>
                  <NavLink tag={Link} to="/keyloaders/"><FontAwesomeIcon icon={faHdd} fixedWidth/>{' '}Key Loaders</NavLink>
          </NavItem>
              { this.props.loggedIn && this.props.user.admin &&
                  <>
              <NavItem>
                  <NavLink tag={Link} to="/users/"><FontAwesomeIcon icon={faUsers} fixedWidth/>{' '}Users</NavLink>
              </NavItem>
              <NavItem>
                  <NavLink tag={Link} to="/logs/"><FontAwesomeIcon icon={faFileArchive} fixedWidth/>{' '}Logs</NavLink>
                  </NavItem>
              </>
              }
            <NavItem>
                <NavLink tag={Link} to={"/accounts/" + this.props.user.id}><FontAwesomeIcon icon={faUser} fixedWidth/>{' '}My account</NavLink>
            </NavItem>
          </Nav>
      );
  }
}

function mapStateToProps(state) {
    const { user, loggedIn } = state.authentication;
    return {
        user, loggedIn
    };
}

const connectedSideBar = connect(mapStateToProps)(SideBar);
export { connectedSideBar as SideBar };