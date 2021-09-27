import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faTimes} from '@fortawesome/fontawesome-free-solid'

class ActivatorActionsComponent extends Component {

    constructor(props) {
        super(props)

        this.timer = null;

       this.state = {
            id: this.props.match.params.id,
            error: null,
            message:null,
            name: '',
            description: '',
            terminalIp: '',
            confUrl: '',
            tmsCa: '',
            tmsCaSign: '',
            acquirerCa: '',
            kldCa: '',
            confCa: '',
           enablePolling: false,
           hasHesult: false,
           actionName: '',
           actionStatus: '',
           activeFlag: null,
           activationReport: undefined,
           prevStatus: '',
       }

        this.actionReset = this.actionReset.bind(this)
        this.pollActionStatus = this.pollActionStatus.bind(this)
        this.stopActivation = this.stopActivation.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.startTimer = this.startTimer.bind(this)

    }

    stopTimer()
    {
        if (this.timer != null) {
            clearInterval(this.timer)
            this.timer = null;
        }
    }

    startTimer()
    {
        this.stopTimer();
        this.timer = setInterval(()=> this.pollActionStatus(), 1000);
    }

    pollActionStatus()
    {
        UserDataService.getActivatorStatus(this.state.id).then(
            resp => {
                let r = resp.data;
                this.setState({ activationReport: r })
                let v = r.length;
                console.log(r[v-1].command)
                if (v !== 0 && ("result" === r[v-1].command)) {
                    this.stopTimer();
                }
            }
        )
    }

    stopActivation(id)
    {
        this.stopTimer();
        UserDataService.stopActivation(this.state.id).then( (resp) =>
        {
            this.setState({enablePolling: false, activationReport: undefined})
        })
    }

    actionReset()
    {
        UserDataService.runResetActivator(this.state.id).then( resp => {
            this.setState({ enablePolling: true, activationReport: resp.data })
            this.startTimer();
        }).catch()
    }

    componentDidMount() {
        if (parseInt(this.state.id) !== -1) {
            UserDataService.retrieveActivator(this.state.id)
                .then((response) => {
                    this.setState({
                        name: response.data.name,
                        description: response.data.description,
                        confUrl: response.data.confUrl,
                        terminalIp: response.data.terminalIp,
                        confCa: response.data.confCa,
                        acquirerCa: response.data.acquirerCa,
                        kldCa: response.data.kldCa,
                        tmsCa: response.data.tmsCa,
                        tmsCaSign: response.data.tmsCaSign,
                    })
                })
        }
    }

    componentWillUnmount() {
        this.stopTimer();
    }


      render() {
        let {name, description, terminalIp, confUrl} = this.state
          console.log("render", name)
        return (
            <div className="container">
                <div className="row my-2">
                    <h3>Terminal activation</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}Back</button>
                </div>
                <div className="row my-2">
                    <table className="table-borderless table-sm">
                        <tbody>
                            <tr><th scope="row">Name:</th><td>{name}</td></tr>
                            <tr><th scope="row">Description:</th><td>{description}</td></tr>
                            <tr><th scope="row">Terminal IP address:</th><td>{terminalIp}</td></tr>
                            <tr><th scope="row">Configuration URL:</th><td>{confUrl}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="row my-2">
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div className="btn-group mr-2" role="group">
                            <button type="button" className="btn btn-outline-secondary" onClick={this.actionReset}>Run reset</button>
                        </div>
                    </div>
                </div>
                {(this.state.enablePolling || this.state.hasResult) &&
                <div className="row my-2">
                    <table className="table table-sm table-borderless table-striped">
                        <thead className="thead-dark">
                        <tr>
                            <th>State</th>
                            <th>Result</th>
                            <th>
                                <div
                                    className={this.state.enablePolling ? "btn-toolbar visible" : "btn-toolbar invisible"}>
                                    <div className="btn-group mr-2 ml-auto">
                                        <button type="button" className="btn btn-outline-secondary btn-sm"
                                                onClick={this.stopActivation}>
                                            <FontAwesomeIcon icon={faTimes}/>
                                        </button>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.activationReport && this.state.activationReport.map(item =>
                            <tr key={item.command}>
                                <td>{item.command}</td>
                                <td>{item.status}</td>
                                <td/>
                            </tr> )
                        }
                        </tbody>
                    </table>
                </div>
                }
                </div>

        )
    }
}

export default ActivatorActionsComponent;