import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faPlay } from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'

class KeyloaderListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            keyloaders: [],
            message: null,
            selected_keyloaders: undefined,
            show_alert: false,
            checkedItems: [],
            hidden: false,
        }
        this.refreshKeyloaders = this.refreshKeyloaders.bind(this)
        this.updateKeyloaderClicked = this.updateKeyloaderClicked.bind(this)
        this.actionKeyloaderClicked = this.actionKeyloaderClicked.bind(this)
        this.addKeyloaderClicked = this.addKeyloaderClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)

        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteKeyloadersClicked = this.deleteKeyloadersClicked.bind(this)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.keyloaders.length).fill(v);
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

    deleteKeyloadersClicked() {
        let x = [];
        this.state.keyloaders.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will delete " + x.length + " keyloaders";
            }
            else
            {
                msg = "Please confirm you will delete keyloader " + x[0].name;
            }
            this.setState({ show_alert: true, selected_keyloaders: x, message: msg });
        }
    }


    refreshKeyloaders() {
        UserDataService.retrieveAllKeyloaders()
            .then(
                result => {
                    console.log(result)
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ keyloaders: result.data });
                    this.setChecked(false)
                }
            ).catch(()=> this.setState({ hidden: true }))
    }

    componentDidMount() {
        this.refreshKeyloaders()
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

    actionKeyloaderClicked(id) {
        this.props.history.push(`/keyloaderactions/${id}`)
    }

    updateKeyloaderClicked(id) {
        this.props.history.push(`/keyloaders/${id}`)
    }

    OnDelete(keyloaders)
    {
        UserDataService.deleteKeyloaders(keyloaders)
            .then(
                response => {
                    this.refreshKeyloaders()
                }
            )
            .catch(()=>{})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addKeyloaderClicked() {
        this.props.history.push(`/keyloaders/-1`)
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Keyloaders</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={this.addKeyloaderClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Create</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteKeyloadersClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Delete</button>
                </div>
                <div component="container">
                    <Table className="table-sm">
                        <thead className="thead-light">
                        <tr>
                            <th>Tag</th>
                            <th>Name</th>
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
                            this.state.keyloaders && this.state.keyloaders.map((keyloader, index) =>
                                <tr key={keyloader.id}>
                                    <td>{keyloader.keyTag}</td>
                                    <td>{keyloader.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateKeyloaderClicked(keyloader.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
                                            </div>
                                            {false &&
                                            <div className="btn-group  ml-2">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar"
                                                        onClick={() => this.actionKeyloaderClicked(keyloader.id)}>
                                                    <FontAwesomeIcon icon={faPlay} fixedWidth/></button>
                                            </div>
                                            }
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
                    title="Delete keyloader"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_keyloaders}/>
            </div>
        )
    }
}

export default KeyloaderListComponent;
