import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faTimes, faPlay, faEdit} from '@fortawesome/fontawesome-free-solid'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Table} from 'reactstrap';
import PaginationComponent from "./PaginationComponent";
import SelectObject from "./SelectObject";
import Alert from "./Alert";
import {Tab, Tabs} from "react-bootstrap";
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {getTranslations} from "../static/transltaions";

class GroupActionsComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            legend: '',
            description: '',
            error: null,
            terminals: [],
            allterminals: [],
            selected_terminal: null,
            checkedItems: new Map(),
            groupTermCount: 0,
            groupTermPage: 1,
            groupTermPageLimit: 200,
            selected: false,
            cmd:undefined,
            show_application_selection: false,
            allapplications: [],
            show_alert: false,
            alert_title: undefined,
            alert_message: undefined,
            alert_arg: undefined,
            show_report: false,
            show_remove_report: false,
            rep: undefined,
            removeAppFlag: false,
        }

        this.timer = null


        this.viewTerminalClicked = this.viewTerminalClicked.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.selectAll = this.selectAll.bind(this)
        this.deselectAll = this.deselectAll.bind(this)
        this.refreshGroupTerminals = this.refreshGroupTerminals.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
        this.handleSelectedChange = this.handleSelectedChange.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.startTimer = this.startTimer.bind(this)
        this.startAction = this.startAction.bind(this)
        this.pollActionStatus = this.pollActionStatus.bind(this)
        this.cancelAction = this.cancelAction.bind(this)
        this.actionUpdate = this.actionUpdate.bind(this)
        this.actionLoadKeys = this.actionLoadKeys.bind(this)
        this.showStatus = this.showStatus.bind(this)
        this.actionTerminalClicked = this.actionTerminalClicked.bind(this)
        this.actionAddApps = this.actionAddApps.bind(this)
        this.actionRemoveApps = this.actionRemoveApps.bind(this)
        this.selectApplications = this.selectApplications.bind(this)
        this.closeApplicationSelection = this.closeApplicationSelection.bind(this)
        this.actionUpdateApps = this.actionUpdateApps.bind(this)


        this.alertConfirmed = this.alertConfirmed.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)

    }

    showAlert(title, msg, arg)
    {
        this.setState({ show_alert: true, alert_title: title, alert_message: msg, alert_arg: arg })
    }

    alertConfirmed()
    {
        if (this.state.alert_arg)
            this.startAction(this.state.alert_arg)
    }

    closeAlert()
    {
        this.setState({ show_alert : false })
    }

    selectApplications(apps)
    {
        if (apps && (apps.length > 0)) {
            this.setState({ show_spinner: true })
            if (this.state.removeAppFlag) {
                UserDataService.removeGroupApplications(this.state.id, apps)
                    .then((resp) => {
                        this.setState({rep: resp.data, show_remove_report: true, show_spinner: false, actionName: "removeapplications"})
                    })
                    .catch(error => {
                    })
            }
            else
            {
                UserDataService.addGroupApplications(this.state.id, apps)
                    .then((resp) => {
                        this.setState({rep: resp.data, show_report: true, show_spinner: false, actionName: "addapplications"})
                    })
                    .catch(error => {
                    })
            }
        }
    }

    closeApplicationSelection()
    {
        this.setState( {show_application_selection : false })
    }

    actionAddApps()
    {
        UserDataService.retrieveAllApplications().then(resp => {
            this.setState({ allapplications: resp.data, show_application_selection : true, removeAppFlag: false})
        }).catch(()=>{});

    }

    actionRemoveApps()
    {
        UserDataService.retrieveAllApplications().then(resp => {
            this.setState({ allapplications: resp.data, show_application_selection : true, removeAppFlag: true  })
        }).catch(()=>{});
    }

    actionTerminalClicked(tid)
    {
        if (this.state.cmd) {
            if ("addapplications" === this.state.cmd) {
                // TODO:
            }
            else if ("removeapplications" === this.state.cmd) {
                // TODO:
            }
            else {
                UserDataService.createTerminalCommand(tid, this.state.cmd).then(() => {
                    this.setState({enablePolling: true})
                    this.startTimer();
                })
            }
        }
    }

    showStatus(term)
    {
        let x = term.terminalCommands && term.terminalCommands.length > 0 && term.terminalCommands[0];
        if (!x || !x.status)
            return null;
        if ("completed" !== x.status)
            return x.status;
        else {
            var parseString = require('react-native-xml2js').parseString;
            var xx;
            parseString(x.result,  (err, xml) => {
                xx = xml;
            })
            return xx.tm.rsp[0].status
        }
    }

    startTimer()
    {
        if (this.timer === null) {
            this.timer = setInterval(() => this.pollActionStatus(), 1000);
        }
    }

    stopTimer()
    {
        if (this.timer != null) {
            clearInterval(this.timer)
            this.timer = null;
        }
    }

    actionUpdate() {
        this.showAlert(this.activeTranslation.updateT,
            this.activeTranslation.updateM,
            "update")
        //this.startAction("update");
    }

    actionLoadKeys()
    {
        this.showAlert(this.activeTranslation.loadMk,
            this.activeTranslation.loadMkM,
            "loadkeys")
        //this.startAction("loadkeys");
    }

    actionUpdateApps() {
        this.showAlert(this.activeTranslation.updateAT,
            this.activeTranslation.updateAM,
            "updatesoftware")
        //this.startAction("update");
    }

    startAction(action)
    {
        let xcmd = { cmd: "<cmd>" + action + "</cmd>"};
        UserDataService.createCommandsForGroup(this.state.id, xcmd, this.state.groupTermPage, this.state.groupTermPageLimit).then((resp) => {
            this.setState({ enablePolling: true,
                actionName: action,
                terminals : resp.data.content, cmd: xcmd })
            this.startTimer();
        });
    }

    pollActionStatus()
    {
        this.refreshGroupTerminals(this.state.groupTermPage);
    }


    cancelAction()
    {
        this.stopTimer();
        UserDataService.deleteGroupCommands(this.state.id).then(() =>{
            this.setState({ enablePolling: false })
            this.refreshGroupTerminals(this.state.groupTermPage)
        })
    }

    handleSelectedChange(e)
    {
        this.setState({ selected: e.target.checked });
    }

    onPageChanged(cp) {
        this.refreshGroupTerminals(cp)
    }

    refreshGroupTerminals(cp)
    {
        UserDataService.retrieveGroupTerminals(this.state.id, cp, this.state.groupTermPageLimit)
            .then( (tresp) => {
                console.log(tresp)
                this.setState({
                    terminals: tresp.data.content,
                    groupTermCount: tresp.data.totalElements,
                    groupTermPage: cp
                })
            })
    }

    selectAll()
    {
        this.state.terminals.forEach((t) => {
                this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(t.id, true) }));
            })
    }

    deselectAll()
    {
        this.state.terminals.forEach((t) => {
            this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(t.id, false) }));
        })
    }

    handleCheckChange(e)
    {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
    }


    viewTerminalClicked(terminal) {
        this.props.history.push(`/terminals/${terminal.id}`)
    }

    activeTranslation = {};
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("groupActionsComponent", this.context.data.lang);
        UserDataService.retrieveGroupTerminals(this.state.id, this.state.groupTermPage, this.state.groupTermPageLimit)
            .then((tresp) => {
                console.log(tresp)
                UserDataService.retrieveGroup(this.state.id)
                    .then(response => this.setState({
                        legend: response.data.legend,
                        description: response.data.description,
                        terminals: tresp.data.content,
                        groupTermCount: tresp.data.totalElements,

            }))
        })
    }

    componentWillUnmount() {
        this.stopTimer();
    }

      render() {
        let { legend, description, actionName } = this.state
        return (
            <div>
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.title}</h3>
                    <button
                        className="btn btn-outline-secondary ml-auto"
                        onClick={() => this.props.history.push(`../groups/${this.state.id}`)}>
                        <FontAwesomeIcon icon={faEdit}/>{' '}{this.activeTranslation.Edit}
                    </button>
                    <button
                        className="btn btn-outline-secondary ml-2"
                        onClick={() => this.props.history.goBack()}>
                        <FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}
                    </button>
                </div>
                <table className="table-borderless table-sm">
                    <tbody>
                        <tr><th scope="row">{this.activeTranslation.Name}</th><td>{legend}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.Description}</th><td>{description}</td></tr>
                        <tr><th scope="row"><span/>{ actionName &&
                            <span>{this.activeTranslation.Current}</span>}</th><td>{actionName}</td></tr>
                    </tbody>
                </table>
                <div>
                    <Tabs defaultActiveKey="config" className="mt-4">
                        <Tab eventKey="config" title="Configuration">
                            <div className="btn-tsoolbar mt-4" role="toolbar" aria-label="Toolbar with button groups">
                                <div className="btn-group mr-2" role="group">
                                    <button
                                        disabled={!this.state.terminals.length}
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={this.actionUpdate}>{this.activeTranslation.Update}
                                    </button>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="keys" title="Keys">
                                <div className="btn-tsoolbar mt-4" role="toolbar" aria-label="Toolbar with button groups">
                                    <div className="btn-group mr-2" role="group">
                                        <button
                                            disabled={!this.state.terminals.length}
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={this.actionLoadKeys}>{this.activeTranslation.umk}
                                        </button>
                                    </div>
                            </div>
                        </Tab>
                        <Tab eventKey="apps" title="Applications">
                            <div className="btn-tsoolbar mt-4" role="toolbar" aria-label="Toolbar with button groups">
                                <div className="btn-group mr-2" role="group">
                                    <button
                                        disabled={!this.state.terminals.length}
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={this.actionAddApps}>{this.activeTranslation.Add}
                                    </button>
                                </div>
                                <div className="btn-group mr-2" role="group">
                                    <button
                                        disabled={!this.state.terminals.length}
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={this.actionRemoveApps}>{this.activeTranslation.Remove}
                                    </button>
                                </div>
                                <div className="btn-group mr-2" role="group">
                                    <button
                                        disabled={!this.state.terminals.length}
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={this.actionUpdateApps}>{this.activeTranslation.Update}
                                    </button>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                        { this.state.id !== -1 &&
                            <>
                                <div className="row mt-4 mb-2 mr-0">
                                    <h3>Terminals ({this.state.groupTermCount})</h3>
                                    { this.state.show_spinner &&
                                        <div className="spinner-border ml-auto" role="status"/>
                                    }
                                    {this.state.selected &&
                                     <>
                                    <button className="btn btn-outline-secondary ml-auto"
                                            onClick={this.deselectAll}>{this.activeTranslation.dselAll}</button>
                                    < button className="btn btn-outline-secondary ml-2" onClick={this.selectAll}>{this.activeTranslation.selAll}</button>
                                    </>
                                    }
                                </div>
                                <PaginationComponent totalRecords={this.state.groupTermCount} pageLimit={this.state.groupTermPageLimit} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                                <Table className="table-sm ml-2 table-light table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>{this.activeTranslation.Model}</th>
                                            <th>{this.activeTranslation.sn}</th>
                                            <th>{this.activeTranslation.Acquirer}</th>
                                            <th>{this.activeTranslation.TID}</th>
                                            <th>{this.activeTranslation.Status}</th>
                                            <th>
                                                <div className="btn-toolbar">
                                                    <div className="btn-group mr-2 ml-auto">
                                                        <button type="button" className="btn btn-outline-secondary btn-sm btn-toolbar"
                                                                onClick={this.cancelAction}>
                                                            <FontAwesomeIcon icon={faTimes}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                         this.state.terminals && this.state.terminals.map(terminal =>
                                            <tr key={terminal.id}>
                                                <td>{terminal.terminalModel && terminal.terminalModel.name}</td>
                                                <td>{terminal.sn}</td>
                                                <td>{terminal.merchant && terminal.merchant.acquirer && terminal.merchant.acquirer.name}</td>
                                                <td>{terminal.tid}</td>
                                                <td>
                                                    {this.showStatus(terminal)}
                                                </td>
                                                <td>
                                                    <button className="btn btn-outline-secondary btn-sm  btn-toolbar mr-2 ml-auto"
                                                            disabled={!actionName}
                                                            onClick={() => this.actionTerminalClicked(terminal.id)}><FontAwesomeIcon icon={faPlay} fixedWidth/></button>
                                                </td>
                                            </tr>
                                         )
                                        }
                                    </tbody>
                                </Table>
                               </>
                           }
            </div>
                <SelectObject
                    title={this.activeTranslation.selectApp}
                    headers = {['Model', 'Name', 'Tag', 'Version']}
                    columns={ ['terminalModel.name', 'name', 'tag', 'version']}
                    ok={this.selectApplications}
                    close={this.closeApplicationSelection}
                    modal={this.state.show_application_selection}
                    multiselect={true}
                    searchName='name'
                    placeholder="Application name ..."
                    options={this.state.allapplications}/>
                <Alert
                    title={this.state.alert_title}
                    message={this.state.alert_message}
                    ok={this.alertConfirmed}
                    close={this.closeAlert}
                    modal={this.state.show_alert}
                    arg={this.state.alert_arg}/>
                <Modal isOpen={this.state.show_report} fade={false}>
                    <ModalHeader>{this.activeTranslation.Report}</ModalHeader>
                    <ModalBody>
                        <table className="table-sm ml-2 table-light">
                            <tbody>
                                <tr><th>{this.activeTranslation.ttp}</th><td>{this.state.rep && this.state.rep.total}</td></tr>
                                <tr><th>{this.activeTranslation.aaat}</th><td>{this.state.rep && this.state.rep.installed}</td></tr>
                                <tr><th>{this.activeTranslation.nurf}</th><td>{this.state.rep && this.state.rep.uptodate}</td></tr>
                                <tr><th>{this.activeTranslation.tmmi}</th><td>{this.state.rep && this.state.rep.modelmismatch}</td></tr>
                                <tr><th>{this.activeTranslation.errs}</th><td>{this.state.rep && this.state.rep.errors}</td></tr>
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={()=> this.setState({ show_report: false })}>Close</Button>{' '}
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.show_remove_report} fade={false}>
                    <ModalHeader>{this.activeTranslation.Report}</ModalHeader>
                    <ModalBody>
                        <table className="table-sm ml-2 table-light">
                            <tbody>
                            <tr><th>{this.activeTranslation.ttp}</th><td>{this.state.rep && this.state.rep.total}</td></tr>
                            <tr><th>{this.activeTranslation.rao}</th><td>{this.state.rep && this.state.rep.removed}</td></tr>
                            <tr><th>{this.activeTranslation.anfo}</th><td>{this.state.rep && this.state.rep.notfound}</td></tr>
                            <tr><th>{this.activeTranslation.errors}</th><td>{this.state.rep && this.state.rep.errors}</td></tr>
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={()=> this.setState({ show_remove_report: false })}>{this.activeTranslation.Close}</Button>{' '}
                    </ModalFooter>
                </Modal>
        </div>
        )
    }
}

export default GroupActionsComponent;