import React, { Component } from 'react';
import UserListComponent from './UserListComponent';
import UserComponent from './UserComponent';
import GroupListComponent from './GroupListComponent';
import GroupComponent from './GroupComponent';
import GroupActionsComponent from './GroupActionsComponent';
import TerminalListComponent from './TerminalListComponent';
import TerminalComponent from './TerminalComponent';
import { Router, Switch, Route } from "react-router-dom";
import { SideBar } from './SideBar'
import Header from './Header'
import Home from './Home'
import { history } from '../helpers/history'
import {PrivateRoute} from './PrivateRoute'
import {LoginPage} from './LoginPage'
import { connect } from 'react-redux';
import TemplateListComponent from './TemplateListComponent';
import TemplateComponent from './TemplateComponent';
import ConfigPackListComponent from './ConfigPackListComponent';
import ConfigPackComponent from './ConfigPackComponent';
import MerchantListComponent from './MerchantListComponent';
import MerchantComponent from './MerchantComponent';
import MyAccountComponent from './MyAccountComponent';
import TerminalActionsComponent from "./TerminalActionsComponent";
import ActivatorListComponent from './ActivatorListComponent';
import ActivatorComponent from './ActivatorComponent';
import ActivatorActionsComponent from "./ActivatorActionsComponent";
import KeyloaderListComponent from "./KeyloaderListComponent";
import KeyloaderComponent from "./KeyloaderComponent";
import TerminalKeyListComponent from "./TerminalKeyListComponent";
import TerminalKeyComponent from "./TerminalKeyComponent";
import AcquirerListComponent from "./AcquirerListComponent";
import AcquirerComponent from "./AcquirerComponent";
import KeyImportComponent from "./KeyImportComponent";
import TerminalImportComponent from "./TerminalImportComponent";
import MerchantImportComponent from "./MerchantImportComponent";
import LogListComponent from "./LogListComponent";
import ApplicationListComponent from "./ApplicationListComponent";
import ApplicationComponent from "./ApplicationComponent";
import DesktopOnly from "./DesktopOnly";
import MobileOnly from "./MobileOnly";
import SideMenu from "./SideMenu";


class KdsApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
        };
    }

    render() {
        return (
        <div>
            <Router history = { history }>
                <Header/>
                <div className="wrapper">
                    <SideMenu loggedIn={this.props.loggedIn}/>
                    <div id="content" className="container-fluid" style={{
                        width: "100%",
                        boxSizing: "border-box",
                    }}>
                        {this.props.message &&
                            <div className="alert alert-danger mt-1 mr-0 ml-0">{this.props.message}</div>}
                        <Switch>
                                <PrivateRoute path="/users/" exact component={UserListComponent} />
                                <PrivateRoute path="/users/:id" exact component={UserComponent} />
                                <PrivateRoute path="/groups/" exact component={GroupListComponent} />
                                <PrivateRoute path="/groups/:id" exact component={GroupComponent} />
                                <PrivateRoute path="/terminals" exact component={TerminalListComponent} />
                                <PrivateRoute path="/terminals/:id" exact component={TerminalComponent} />
                                <PrivateRoute path="/conftemplates/" exact component={TemplateListComponent} />
                                <PrivateRoute path="/conftemplates/:id" component={TemplateComponent} />


                                <PrivateRoute path="/confpacks/" exact component={ConfigPackListComponent} />
                                <PrivateRoute path="/confpacks/:id" exact component={ConfigPackComponent} />
                                <PrivateRoute path="/merchants/" exact component={MerchantListComponent} />
                                <PrivateRoute path="/merchants/:id" exact component={MerchantComponent} />
                                <PrivateRoute path="/accounts/:id" exact component={MyAccountComponent} />
                                <PrivateRoute path="/groupactions/:id" exact component={GroupActionsComponent} />
                                <PrivateRoute path="/terminalactions/:id" exact component={TerminalActionsComponent} />
                                <PrivateRoute path="/activators/" exact component={ActivatorListComponent} />
                                <PrivateRoute path="/activators/:id" exact component={ActivatorComponent} />
                                <PrivateRoute path="/activatoractions/:id" exact component={ActivatorActionsComponent} />
                                <PrivateRoute path="/keys/" exact component={TerminalKeyListComponent} />
                                <PrivateRoute path="/keys/:id/:tid" exact component={TerminalKeyComponent} />
                                <PrivateRoute path="/keyloaders/" exact component={KeyloaderListComponent} />
                                <PrivateRoute path="/keyloaders/:id" exact component={KeyloaderComponent} />
                                <PrivateRoute path="/acquirers/" exact component={AcquirerListComponent} />
                                <PrivateRoute path="/acquirers/:id" exact component={AcquirerComponent} />
                                <PrivateRoute path="/import/keys" exact component={KeyImportComponent} />
                                <PrivateRoute path="/import/terminals" exact component={TerminalImportComponent} />
                                <PrivateRoute path="/import/merchants" exact component={MerchantImportComponent} />
                                <PrivateRoute path="/applications/" exact component={ApplicationListComponent} />
                                <PrivateRoute path="/applications/:id" exact component={ApplicationComponent} />
                                <PrivateRoute path="/logs" exact component={LogListComponent} />
                                <Route path="/login" component={LoginPage} />
                                <PrivateRoute component={Home} />
                            </Switch>
                    </div>
                </div>
            </Router>
        </div>
        )
    }
}

function mapStateToProps(state) {
    const { loggedIn } = state.authentication;
    const { message } = state.errorReport;
    return {
        loggedIn, message
    };
}
const connectedKdsApp = connect(mapStateToProps)(KdsApp);
export { connectedKdsApp as KdsApp };
