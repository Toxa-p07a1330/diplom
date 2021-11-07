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
import MobileOnly from "./MobileOnly";
import DesktopOnly from "./DesktopOnly";
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {getTranslations} from "../static/transltaions";

class LogoutBtn extends React.Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this)
    }
    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("logoutBtn", this.context.data.lang);
        this.forceUpdate();
    }
        logout()
    {
        this.props.dispatch(userActions.logout());
    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarText><span id={"current_user_login"}>{this.props.user.login}</span></NavbarText>
                            <NavLink href="#" onClick={this.logout}><FontAwesomeIcon icon={faPowerOff} fixedWidth />{' '}{this.activeTranslation.Logout}</NavLink>
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

export default connect(mapStateToProps)(LogoutBtn);