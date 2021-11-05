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
import MobileOnly from "./MobileOnly";
import DesktopOnly from "./DesktopOnly";
import LogoutBtn from "./LogoutBtn";
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/LangSelectorContextProvider";

class SideBar extends React.Component {

   constructor(props) {
        super(props);
        this.logout = this.logout.bind(this)
   }

  logout()
  {
    this.props.dispatch(userActions.logout());
  }
    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("sideBar", this.context.data.lang);
        this.forceUpdate();
    }
        render() {
      return (
          <>
              <Nav vertical className="fixed-left" id="sidebar">
                <NavItem>
                  <NavLink tag={Link} to="/groups/"><FontAwesomeIcon icon={faListAlt} fixedWidth/>{' '}{this.activeTranslation.Groups}</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/terminals/"><FontAwesomeIcon icon={faMobileAlt} fixedWidth/>{' '}{this.activeTranslation.Terminals}</NavLink>
                </NavItem>
              <NavItem>
                  <NavLink tag={Link} to="/merchants/"><FontAwesomeIcon icon={faStore} fixedWidth/>{' '}{this.activeTranslation.Merchants}</NavLink>
              </NavItem>
                  <NavItem>
                      <NavLink tag={Link} to="/acquirers/"><FontAwesomeIcon icon={faCreditCard} fixedWidth/>{' '}{this.activeTranslation.Acquirers}</NavLink>
                  </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/conftemplates/"><FontAwesomeIcon icon={faFileCode} fixedWidth/>{' '}{this.activeTranslation.ct}</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/confpacks/"><FontAwesomeIcon icon={faDatabase} fixedWidth/>{' '}{this.activeTranslation.cp}</NavLink>
                </NavItem>
                  <NavItem>
                      <NavLink tag={Link} to="/applications/"><FontAwesomeIcon icon={faBug} fixedWidth/>{' '}{this.activeTranslation.Applications}</NavLink>
                  </NavItem>
              <NavItem>
                  <NavLink tag={Link} to="/activators/"><FontAwesomeIcon icon={faMagic} fixedWidth/>{' '}{this.activeTranslation.Activation}</NavLink>
              </NavItem>
                  <NavItem>
                      <NavLink tag={Link} to="/keys/"><FontAwesomeIcon icon={faKey} fixedWidth/>{' '}{this.activeTranslation.Keys}</NavLink>
                  </NavItem>
                  <NavItem>
                      <NavLink tag={Link} to="/keyloaders/"><FontAwesomeIcon icon={faHdd} fixedWidth/>{' '}{this.activeTranslation.kl}</NavLink>
              </NavItem>
                  { this.props.loggedIn && this.props.user.admin &&
                      <>
                  <NavItem>
                      <NavLink tag={Link} to="/users/"><FontAwesomeIcon icon={faUsers} fixedWidth/>{' '}{this.activeTranslation.Users}</NavLink>
                  </NavItem>
                  <NavItem>
                      <NavLink tag={Link} to="/logs/"><FontAwesomeIcon icon={faFileArchive} fixedWidth/>{' '}{this.activeTranslation.Logs}</NavLink>
                      </NavItem>
                  </>
                  }
                  <NavItem>
                      <NavLink tag={Link} to={"/accounts/" + this.props.user.id}><FontAwesomeIcon icon={faUser} fixedWidth/>{' '}{this.activeTranslation.acc}</NavLink>
                  </NavItem>
                  <NavItem>
                    <MobileOnly isOpen={1}>
                        <LogoutBtn/>
                    </MobileOnly>
                  </NavItem>
              </Nav>

          </>
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