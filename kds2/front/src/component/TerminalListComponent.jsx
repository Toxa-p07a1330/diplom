import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faEdit, faPlus, faPlay, faCube} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import PaginationComponent from "./PaginationComponent";

class TerminalListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            terminals: [],
            message: null,
            selected_terminals: undefined,
            show_alert: false,
            currentPage: 1,
            pageLimit: 100,
            terminalCount: 0,
            checkedItems: [],
            hidden: false,
        }
        this.refreshTerminals = this.refreshTerminals.bind(this)
        this.updateTerminalClicked = this.updateTerminalClicked.bind(this)
        this.addTerminalClicked = this.addTerminalClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
        this.actionTerminalClicked = this.actionTerminalClicked.bind(this)

        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteTerminalsClicked = this.deleteTerminalsClicked.bind(this)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.terminals.length).fill(v);
        this.setState( { checkedItems : checkedCopy })
    }

    handleCheckChange(e)
    {

        const idx = e.target.name;
        const isChecked = e.target.checked;

        let checkedCopy = [...this.state.checkedItems];
        checkedCopy[idx] = isChecked;
        this.setState({ checkedItems: checkedCopy });
    }

    handleGroupCheckChange(e)
    {
        const isChecked = e.target.checked;
        this.setChecked(isChecked);
    }

    deleteTerminalsClicked() {
        let x = [];
        this.state.terminals.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will delete " + x.length + " terminals";
            }
            else
            {
                msg = "Please confirm you will delete terminal " + x[0].sn;
            }
            this.setState({ show_alert: true, selected_terminals: x, message: msg });
        }
    }

    actionTerminalClicked(id) {
        this.props.history.push(`/terminalactions/${id}`)
    }

    onPageChanged(p) {
        this.setState({ currentPage: p })
        this.refreshTerminals()
    }

    refreshTerminals() {
        UserDataService.retrieveAllTerminals(this.state.currentPage, this.state.pageLimit)
            .then(
                result => {
                    this.setState({terminalCount: result.data.totalElements, terminals: result.data.content, hidden: false})
                    this.setChecked(false)
                }
            )
            .catch(error => { this.setState({ hidden: true })})
    }

    componentDidMount() {
        this.refreshTerminals()
    }

    showMessage(text)
    {
          this.setState({message: text})
          setTimeout(() => {
                      this.setState({
                      message: null
                    })
                  }, 2000);
    }

    updateTerminalClicked(id) {
        this.props.history.push(`/terminals/${id}`)
    }

    OnDelete(terminals)
    {
       UserDataService.deleteTerminals(terminals)
           .then(
               response => {
                   this.refreshTerminals()
               }
           )
           .catch(error => {})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addTerminalClicked() {
        this.props.history.push(`/terminals/-1`)
    }

    deleteTerminalClicked(terminal) {
        this.setState({ show_alert: true,  selected_terminal: terminal, message: "Please confirm you will delele " + terminal.sn });
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Terminals</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() =>  this.props.history.push(`/import/terminals`)}><FontAwesomeIcon icon={faCube}/>{' '}Import</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.addTerminalClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Create</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteTerminalsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Delete</button>

                </div>
                <div component="container">
                    <PaginationComponent totalRecords={this.state.terminalCount} pageLimit={this.state.pageLimit} pageNeighbours={2} onPageChanged={this.onPageChanged} />
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>Model</th>
                                <th>Serial number</th>
                                <th>Acquirer</th>
                                <th>TID</th>
                                <th>Merchant</th>
                                <th>Configuration</th>
                                <th>
                                    <div className="btn-toolbar pb-1">
                                        <div className="btn-group  ml-auto">
                                            <input type="checkbox"  onChange={this.handleGroupCheckChange}/>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                             this.state.terminals && this.state.terminals.map((terminal, index) =>
                                <tr key={terminal.id}>
                                    <td>{terminal.terminalModel.name}</td>
                                    <td>{terminal.sn}</td>
                                    <td>{terminal.merchant && terminal.merchant.acquirer && terminal.merchant.acquirer.name}</td>
                                    <td>{terminal.tid}</td>
                                    <td>{terminal.merchant ? terminal.merchant.name : ""}</td>
                                    <td>{terminal.conf && terminal.conf.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateTerminalClicked(terminal.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
                                            </div>
                                            <div className="btn-group  ml-2">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.actionTerminalClicked(terminal.id)}><FontAwesomeIcon icon={faPlay} fixedWidth/></button>
                                            </div>
                                            <div className="btn-group  ml-2 mt-1">
                                                <input type="checkbox" name={index} checked={this.state.checkedItems.length > index ?  this.state.checkedItems[index] : false} onChange={this.handleCheckChange}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                             )
                            }
                        </tbody>
                    </Table>
                </div>
                <Alert
                    title="Delete terminal"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_terminals}/>
            </div>
        )
    }
}

export default TerminalListComponent;
