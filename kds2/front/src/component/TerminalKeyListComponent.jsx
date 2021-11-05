import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faEdit, faCube} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import PaginationComponent from './PaginationComponent'
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/LangSelectorContextProvider";

class TerminalKeyListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tkeys: [],
            message: null,
            selected_keys: undefined,
            show_alert: false,
            keyCount: 0,
            currentPage: 1,
            pageLimit: 200,
            checkedItems: [],
            hidden: false,
        }
        this.refreshKeys = this.refreshKeys.bind(this)
        this.updateKeyClicked = this.updateKeyClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteKeysClicked = this.deleteKeysClicked.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
    }

    onPageChanged(cp) {
        this.setState({ currentPage : cp })
        this.refreshKeys()
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.tkeys.length).fill(v);
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

    deleteKeysClicked() {
        let x = [];
        this.state.tkeys.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = this.activeTranslation.confm + x.length + this.activeTranslation.keys;
            }
            else
            {
                msg = this.activeTranslation.conf1 + x[0].name;
            }
            this.setState({ show_alert: true, selected_keys: x, message: msg });
        }
    }


    refreshKeys() {
        UserDataService.retrieveAllKeys(this.state.currentPage, this.state.pageLimit)
            .then(
                result => {
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ keyCount: result.data.totalElements, tkeys: result.data.content });
                    this.setChecked(false)
                }
            ).catch(()=> { this.setState( { hidden : true })})
    }

    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("terminalKeyListComponent", this.context.data.lang);
        this.forceUpdate();
        this.refreshKeys()
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

    updateKeyClicked(id, tid) {
        this.props.history.push(`/keys/${id}/${tid}`)
    }

    OnDelete(tkeys)
    {
        UserDataService.deleteKeys(tkeys)
            .then(
                response => {
                    this.refreshKeys()
                }
            )
            .catch(()=>{})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }


    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.Keys}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() =>  this.props.history.push(`/import/keys`)}><FontAwesomeIcon icon={faCube}/>{' '}{this.activeTranslation.Import}</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteKeysClicked}><FontAwesomeIcon icon={faTrash}/>{' '}{this.activeTranslation.Delete}</button>
                </div>
                <div component="container">
                    <PaginationComponent totalRecords={this.state.keyCount} pageLimit={this.state.pageLimit} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                    <Table className="table-sm">
                        <thead className="thead-light">
                        <tr>
                            <th>{this.activeTranslation.Model}</th>
                            <th>{this.activeTranslation.sn}</th>
                            <th>{this.activeTranslation.Tag}</th>
                            <th>{this.activeTranslation.Name}</th>
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
                            this.state.tkeys && this.state.tkeys.map((tkey, index) =>
                                <tr key={tkey.id}>
                                    <td>{tkey.terminal && tkey.terminal.terminalModel && tkey.terminal.terminalModel.name}</td>
                                    <td>{tkey.terminal && tkey.terminal.sn}</td>
                                    <td>{tkey.tag}</td>
                                    <td>{tkey.name}</td>
                                <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateKeyClicked(tkey.id, tkey.terminal.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
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
                    title="Delete key"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_keys}/>
            </div>
        )
    }
}

export default TerminalKeyListComponent;
