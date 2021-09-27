import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faTimes  } from '@fortawesome/fontawesome-free-solid'
import Alert from './Alert'

class TerminalActionsComponent extends Component {


    constructor(props) {
        super(props);

       this.state = {
            id: this.props.match.params.id,
            tid: '',
            sn: '',
            description: '',
            model: '',
            models: [],
            groups: [],
            applications: [],
            error: null,
            message:null,
            success:null,
            info: null,
            show_alert: false,
            merchant: undefined,
            conf:undefined,
            stage: '',
            actionName: undefined,
            actionStatus: undefined,
            actionMessage: undefined,
            enablePolling: false,
            inforesult: undefined,
            hasResult: false,
           tkeys: [],
           acquirer: undefined,
           cmd: -1,
       }
       this.timer = null

        this.closeAlert = this.closeAlert.bind(this)
        this.actionGetInfo = this.actionGetInfo.bind(this)
        this.cancelAction = this.cancelAction.bind(this)
        this.pollActionStatus = this.pollActionStatus.bind(this)
        this.parsePayload = this.parsePayload.bind(this)
        this.actionUpdate = this.actionUpdate.bind(this)
        this.actionGetLog = this.actionGetLog.bind(this)
        this.actionLoadKeys = this.actionLoadKeys.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.startTimer = this.startTimer.bind(this)
        this.startAction = this.startAction.bind(this)
        this.actionUpdateApplications = this.actionUpdateApplications.bind(this)

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

    parsePayload(p)
    {
        var parseString = require('react-native-xml2js').parseString;
        parseString(p,  (err, result) => {
            let st = result.tm.state[0];
            this.setState({actionStatus: st})

            if ("ok" === st)
            {
                if (this.state.actionName === "info") {
                    let v = result.tm.rsp[0].payload[0].parameters[0];
                    this.setState({inforesult: v})
                }
                else if ("getlog" === this.state.actionName)
                {
                    var fs = require('file-saver');
                    var blob = new Blob([result.tm.rsp[0].payload], {type: "text/plain;charset=utf-8"});
                    fs.saveAs(blob, "terminal-log.txt");
                }
            }
        });
    }

    pollActionStatus()
    {
        UserDataService.retrieveTerminal(this.state.id).then(
            resp => {
                let cmds = resp.data.terminalCommands;
                if (cmds.length === 0)
                {
                    this.stopTimer();
                    this.setState({enablePolling: false,  hasResult: false })
                }
                else {
                    const status = cmds[0].status;
                    if ("completed" === status) {
                        this.stopTimer();
                        this.parsePayload(cmds[0].result)
                        this.setState({enablePolling: false, hasResult: true})
                    } else if (status === "pending") {
                        this.setState({actionStatus: status})
                    } else if (status === "sent") {
                        this.setState({actionStatus: status})
                    }
                }
            }
        )
    }

    cancelAction()
    {
        this.stopTimer();
        UserDataService.deleteTerminalCommands(this.state.id).then( () =>
            {
                this.setState({ hasResult: false, enablePolling: false, error: null, success: null, info: null})
            }
        )
    }

    startAction(action)
    {
        let cmd = { cmd: "<cmd>" + action + "</cmd>"};
        console.log(cmd);
        UserDataService.createTerminalCommand(this.state.id, cmd).then((resp) => {
            console.log(resp.data)
            const status = resp.data.terminalCommands[0].status;
            if ("pending" === status)
            {
                this.setState({ enablePolling: true, actionName: action, actionStatus: status, inforesult : false })
                this.startTimer();
            }
            else
            {
                this.setState({ actionName: action, actionStatus: status, inforesult : false })
            }
        });
    }

    actionGetInfo()
    {
        this.startAction("info");
    }

    actionGetLog() {
        this.startAction("getlog");
    }

    actionUpdate() {
        this.startAction("update");
    }

    actionLoadKeys()
    {
        this.startAction("loadkeys");
    }

    actionUpdateApplications()
    {
        this.startAction("updatesoftware");
    }

    closeAlert()
    {
        this.setState({ show_alert: false })
    }

    componentDidMount() {
        UserDataService.retrieveTerminal(this.state.id)
            .then((response) => {
                this.setState({
                    tid: response.data.tid,
                    sn: response.data.sn,
                    model: response.data.terminalModel,
                    groups: response.data.groups,
                    description: response.data.description,
                    conf: response.data.conf,
                    stage: response.data.stage,
                    merchant: response.data.merchant,
                    tkeys: response.data.terminalKeys,
                    acquirer: response.data.merchant && response.data.merchant.acquirer,
                    applications: response.data.applications,
            })
        })
    }

    componentWillUnmount() {
        this.stopTimer();
    }

      render() {
        let { tid, sn, description, model, stage, conf, merchant, acquirer } = this.state;
        return (
            <div>
            <div className="container">
                {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                {this.state.info && <div className="alert alert-info">{this.state.info}</div>}
                {this.state.success && <div className="alert alert-success">{this.state.success}</div>}
                <div className="row my-2">
                    <h3>Terminal</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}Back</button>
                </div>
                <div className="row my-2">
                    <table className="table-borderless table-sm">
                        <tbody>
                        <tr><th scope="row">Model:</th><td>{model && model.name}</td></tr>
                        <tr><th scope="row">Serial number:</th><td>{sn}</td></tr>
                        <tr><th scope="row">Acquirer:</th><td>{acquirer && acquirer.name}</td></tr>
                        <tr><th scope="row">Terminal number:</th><td>{tid}</td></tr>
                        <tr><th scope="row">Stage:</th><td>{stage}</td></tr>
                        <tr><th scope="row">Description:</th><td>{description}</td></tr>
                        <tr><th scope="row">Merchant ID:</th><td>{merchant && merchant.mid}</td></tr>
                        <tr><th scope="row">Configuration:</th><td>{conf && conf.name}</td></tr>
                        <tr><th scope="row">Keys:</th><td/></tr>
                        {
                            this.state.tkeys && this.state.tkeys.map(tkey =>
                                <tr key={tkey.id}><th scope="row"/><td>{tkey && tkey.name + " (" + tkey.tag + ")"}</td></tr>
                            )}
                        <tr><th scope="row">Applications:</th><td/></tr>
                        {
                            this.state.applications && this.state.applications.map(app =>
                                <tr key={app.id}><th scope="row"/><td>{app && app.name} ({app && app.version})</td></tr>
                            )}
                        <tr><th scope="row">Groups:</th><td/></tr>
                        {
                        this.state.groups && this.state.groups.map(group =>
                            <tr key={group.id}><th scope="row"/><td>{group && group.legend}</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="row my-2">
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div className="btn-group mr-2" role="group">
                                <button type="button" className="btn btn-outline-secondary" onClick={this.actionGetInfo}>Get Info</button>
                        </div>
                        <div className="btn-group mr-2" role="group">
                            <button type="button" className="btn btn-outline-secondary" onClick={this.actionUpdate}>Update config</button>
                        </div>
                        <div className="btn-group mr-2" role="group">
                            <button type="button" className="btn btn-outline-secondary" onClick={this.actionGetLog}>Get Log</button>
                        </div>
                        <div className="btn-group mr-2" role="group">
                            <button type="button" className="btn btn-outline-secondary" onClick={this.actionLoadKeys}>Load keys</button>
                        </div>
                        <div className="btn-group mr-2" role="group">
                            <button type="button" className="btn btn-outline-secondary" onClick={this.actionUpdateApplications}>Update software</button>
                        </div>
                    </div>
                </div>
                { (this.state.enablePolling || this.state.hasResult) &&
                    <div className="row my-2">
                        <table className="table table-sm table-borderless table-striped">
                            <thead className="thead-dark">
                            <tr>
                                <th>Command</th>
                                <th>Status</th>
                                <th>
                                    <div className="btn-toolbar">
                                        <div className="btn-group mr-2 ml-auto">
                                            <button type="button" className="btn btn-outline-secondary btn-sm"
                                                    onClick={this.cancelAction}>
                                                <FontAwesomeIcon icon={faTimes}/>
                                            </button>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{this.state.actionName}</td>
                                <td>{this.state.actionStatus}</td>
                                <td>
                                </td>
                            </tr>
                            { this.state.inforesult &&
                                <>
                                <tr><th>Serial number:</th><td>{this.state.inforesult.sn}</td><td/></tr>
                                <tr><th>Acquirer ID:</th><td>{this.state.inforesult.acqid}</td><td/></tr>
                                <tr><th>Terminal ID:</th><td>{this.state.inforesult.tid}</td><td/></tr>
                                <tr><th>Device ID:</th><td>{this.state.inforesult.devid}</td><td/></tr>
                                <tr><th>Merchant ID:</th><td>{this.state.inforesult.mid}</td><td/></tr>
                                <tr><th>Merchant name and location:</th><td>{this.state.inforesult.acqn}</td><td/></tr>
                                <tr><th>Application version:</th><td>{this.state.inforesult.app}</td><td/></tr>
                                <tr><th>Internal version:</th><td>{this.state.inforesult.iv}</td><td/></tr>
                                <tr><th>OS:</th><td>{this.state.inforesult.os}</td><td/></tr>
                                <tr><th>Security module:</th><td>{this.state.inforesult.mcu}</td><td/></tr>
                                <tr><th>SDK:</th><td>{this.state.inforesult.sdk}</td><td/></tr>
                                <tr><th>Terminal config name:</th><td>{this.state.inforesult.ntconf}</td><td/></tr>
                                <tr><th>Terminal config stage:</th><td>{this.state.inforesult.tconf}</td><td/></tr>
                                <tr><th>Common config name:</th><td>{this.state.inforesult.ncconf}</td><td/></tr>
                                <tr><th>Common config stage:</th><td>{this.state.inforesult.cconf}</td><td/></tr>
                                <tr><th>EMV config name:</th><td>{this.state.inforesult.neconf}</td><td/></tr>
                                <tr><th>EMV config stage:</th><td>{this.state.inforesult.econf}</td><td/></tr>
                                <tr><th>CAPK config name:</th><td>{this.state.inforesult.nkconf}</td><td/></tr>
                                <tr><th>CAPK config stage:</th><td>{this.state.inforesult.kconf}</td><td/></tr>
                                <tr><th>TMS host:</th><td>{this.state.inforesult.cshost}</td><td/></tr>
                                <tr><th>TMS host CA:</th><td>{this.state.inforesult.csca}</td><td/></tr>
                                <tr><th>TMS client cert:</th><td>{this.state.inforesult.cccert}</td><td/></tr>
                                <tr><th>Acquirer host CA:</th><td>{this.state.inforesult.ashost}</td><td/></tr>
                                <tr><th>Acquirer CA:</th><td>{this.state.inforesult.asca}</td><td/></tr>
                                <tr><th>Acquirer client cert:</th><td>{this.state.inforesult.accert}</td><td/></tr>
                                <tr><th>Keyloader CA:</th><td>{this.state.inforesult.ksca}</td><td/></tr>
                                <tr><th>Keyloader client cert:</th><td>{this.state.inforesult.kccert}</td><td/></tr>
                                </>
                                }
                            </tbody>
                       </table>
                    </div>
                }
           </div>
           <Alert
               title="Remove terminal from group"
               message={this.state.message}
               ok={this.removeGroupConfirmed}
               close={this.closeAlert}
               modal={this.state.show_alert}
               arg={this.state.selected_group}/>
            </div>
        )
    }
}

export default TerminalActionsComponent;