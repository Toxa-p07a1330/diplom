import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faTimes  } from '@fortawesome/fontawesome-free-solid'
import Alert from './Alert'
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {getTranslations} from "../static/transltaions";
import {sendCommandToSocket} from "../service/socketService";
import XMLViewer from "react-xml-viewer";
const commands = [
    "",
    "login",
    "logout",
    "change",
    "update",
    "lmk",
    'lwk',
    "test",
    "param",
    "clear",
    "reset"
]

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
           shouldShowMap: false,
           selectedCommand: 0,
           serverResponce: ""
       }
       this.timer = null

        this.closeAlert = this.closeAlert.bind(this)
        this.sendCommand = this.sendCommand.bind(this)
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

    sendCommand()
    {
        (async ()=>{

            let tid = this.state.tid;
            let command = commands[this.state.selectedCommand]

            let xml = await sendCommandToSocket(this.context.way_to_logging_backend, tid, command);
            this.setState({serverResponce: xml})
            this.forceUpdate();
        })()
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

    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("terminalActionsComponent", this.context.data.lang);
        this.forceUpdate();
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
                    <h3>{this.activeTranslation.Terminal}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                </div>
                <div className="row my-2">
                    <table className="table-borderless table-sm">
                        <tbody>
                        <tr><th scope="row">{this.activeTranslation.Model}</th><td>{model && model.name}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.sn}</th><td>{sn}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.Acquirer}</th><td>{acquirer && acquirer.name}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.tn}</th><td>{tid}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.Stage}</th><td>{stage}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.Description}</th><td>{description}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.id}</th><td>{merchant && merchant.mid}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.Configuration}</th><td>{conf && conf.name}</td></tr>
                        <tr><th scope="row">{this.activeTranslation.keys}</th><td/></tr>
                        {
                            this.state.tkeys && this.state.tkeys.map(tkey =>
                                <tr key={tkey.id}><th scope="row"/><td>{tkey && tkey.name + " (" + tkey.tag + ")"}</td></tr>
                            )}
                        <tr><th scope="row">{this.activeTranslation.Applications}</th><td/></tr>
                        {
                            this.state.applications && this.state.applications.map(app =>
                                <tr key={app.id}><th scope="row"/><td>{app && app.name} ({app && app.version})</td></tr>
                            )}
                        <tr><th scope="row">{this.activeTranslation.groups}</th><td/></tr>
                        {
                        this.state.groups && this.state.groups.map(group =>
                            <tr key={group.id}><th scope="row"/><td>{group && group.legend}</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="row my-2">
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <select className="form-select" aria-label="Default select example" style={{marginRight: "5px"}}
                        onChange={(e)=>{this.setState({
                            selectedCommand: +e.target.value
                        })}}>
                            <option value="0" selected>Выберите выполняемую команду</option>
                            <option value="1">Авторизация</option>
                            <option value="2">Выход из режима администратора</option>
                            <option value="3">Смена пароля</option>
                            <option value="4">Проверка и загрузка обновления</option>
                            <option value="5">Загрузка ключей-хозяев</option>
                            <option value="6">Загрузка рабочих ключей</option>
                            <option value="7">Проверка связи с сервером</option>
                            <option value="8">Сведения о терминале</option>
                            <option value="9">Очистка журнала</option>
                            <option value="10">Сброс пароля</option>
                        </select>
                        {(this.state.selectedCommand === 3 || this.state.selectedCommand === 1 || this.state.selectedCommand === 9)
                            ?<input type="text" className="form-control" placeholder={"Введите пароль"}/>:""}
                        {this.state.selectedCommand === 3?<input type="text" className="form-control" placeholder={"Введите новый пароль"}/>:""}
                        <div className="btn-group mr-2" role="group">
                                <button disabled={this.state.selectedCommand==0} type="button" className="btn btn-outline-secondary" onClick={this.sendCommand}>Отправить</button>
                        </div>
                    </div>
                </div>
                <div>
                    {this.state.serverResponce?
                        <textarea defaultValue={this.state.serverResponce} style={{
                            width: "100%",
                            height: "8em"
                        }}/>
                        :""
                    }
                </div>
                { (this.state.enablePolling || this.state.hasResult) &&
                    <div className="row my-2">
                        <table className="table table-sm table-borderless table-striped">
                            <thead className="thead-dark">
                            <tr>
                                <th>{this.activeTranslation.Command}</th>
                                <th>{this.activeTranslation.Status}</th>
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
                                <tr><th>{this.activeTranslation.sn}</th><td>{this.state.inforesult.sn}</td><td/></tr>
                                <tr><th>{this.activeTranslation.aId}</th><td>{this.state.inforesult.acqid}</td><td/></tr>
                                <tr><th>{this.activeTranslation.tId}</th><td>{this.state.inforesult.tid}</td><td/></tr>
                                <tr><th>{this.activeTranslation.dId}</th><td>{this.state.inforesult.devid}</td><td/></tr>
                                <tr><th>{this.activeTranslation.mId}</th><td>{this.state.inforesult.mid}</td><td/></tr>
                                <tr><th>{this.activeTranslation.mnl}</th><td>{this.state.inforesult.acqn}</td><td/></tr>
                                <tr><th>{this.activeTranslation.appv}</th><td>{this.state.inforesult.app}</td><td/></tr>
                                <tr><th>{this.activeTranslation.intV}</th><td>{this.state.inforesult.iv}</td><td/></tr>
                                <tr><th>{this.activeTranslation.os}</th><td>{this.state.inforesult.os}</td><td/></tr>
                                <tr><th>{this.activeTranslation.secM}</th><td>{this.state.inforesult.mcu}</td><td/></tr>
                                <tr><th>{this.activeTranslation.sdk}</th><td>{this.state.inforesult.sdk}</td><td/></tr>
                                <tr><th>{this.activeTranslation.tcn}</th><td>{this.state.inforesult.ntconf}</td><td/></tr>
                                <tr><th>{this.activeTranslation.tcs}</th><td>{this.state.inforesult.tconf}</td><td/></tr>
                                <tr><th>{this.activeTranslation.ccn}</th><td>{this.state.inforesult.ncconf}</td><td/></tr>
                                <tr><th>{this.activeTranslation.ccs}</th><td>{this.state.inforesult.cconf}</td><td/></tr>
                                <tr><th>{this.activeTranslation.ecn}</th><td>{this.state.inforesult.neconf}</td><td/></tr>
                                <tr><th>{this.activeTranslation.ecs}</th><td>{this.state.inforesult.econf}</td><td/></tr>
                                <tr><th>{this.activeTranslation.Ccn}</th><td>{this.state.inforesult.nkconf}</td><td/></tr>
                                <tr><th>{this.activeTranslation.Ccs}</th><td>{this.state.inforesult.kconf}</td><td/></tr>
                                <tr><th>{this.activeTranslation.tmsH}</th><td>{this.state.inforesult.cshost}</td><td/></tr>
                                <tr><th>{this.activeTranslation.tmsca}</th><td>{this.state.inforesult.csca}</td><td/></tr>
                                <tr><th>{this.activeTranslation.tmscert}</th><td>{this.state.inforesult.cccert}</td><td/></tr>
                                <tr><th>{this.activeTranslation.ahca}</th><td>{this.state.inforesult.ashost}</td><td/></tr>
                                <tr><th>{this.activeTranslation.aca}</th><td>{this.state.inforesult.asca}</td><td/></tr>
                                <tr><th>{this.activeTranslation.acc}</th><td>{this.state.inforesult.accert}</td><td/></tr>
                                <tr><th>{this.activeTranslation.kca}</th><td>{this.state.inforesult.ksca}</td><td/></tr>
                                <tr><th>{this.activeTranslation.kcc}</th><td>{this.state.inforesult.kccert}</td><td/></tr>
                                </>
                                }
                            </tbody>
                       </table>
                    </div>
                }
           </div>
           <Alert
               title={this.activeTranslation.RemoveG}
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