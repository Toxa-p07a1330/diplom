import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faPlay } from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'

class ActivatorListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            acts: [],
            message: null,
            selected_acts: undefined,
            show_alert: false,
            checkedItems: [],
            hidden: false,
        }
        this.refreshActivators = this.refreshActivators.bind(this)
        this.updateActivatorClicked = this.updateActivatorClicked.bind(this)
        this.actionActivatorClicked = this.actionActivatorClicked.bind(this)
        this.addActivatorClicked = this.addActivatorClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteActivatorsClicked = this.deleteActivatorsClicked.bind(this)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.acts.length).fill(v);
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

    deleteActivatorsClicked() {
        let x = [];
        this.state.acts.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will delete " + x.length + " activators";
            }
            else
            {
                msg = "Please confirm you will delete activator " + x[0].name;
            }
            this.setState({ show_alert: true, selected_acts: x, message: msg });
        }
    }


    refreshActivators() {
        UserDataService.retrieveAllActivators()
            .then(
                result => {
                    console.log(result)
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ acts: result.data });
                    this.setChecked(false)
                }
            ).catch(()=> { this.setState({ hidden: true })})
    }

    componentDidMount() {
        this.refreshActivators()
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

    actionActivatorClicked(id) {
        this.props.history.push(`/activatoractions/${id}`)
    }

    updateActivatorClicked(id) {
        this.props.history.push(`/activators/${id}`)
    }

    OnDelete(acts)
    {
       UserDataService.deleteActivators(acts)
           .then(
               response => {
                   this.refreshActivators()
               }
           )
           .catch(()=>{})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addActivatorClicked() {
        this.props.history.push(`/activators/-1`)
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Activators</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={this.addActivatorClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Create</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteActivatorsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Delete</button>
                </div>
                <div component="container">
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>Name</th>
                                <th>Terminal model</th>
                                <th>Description</th>
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
                             this.state.acts && this.state.acts.map((act, index) =>
                                <tr key={act.id}>
                                    <td>{act.name}</td>
                                    <td>{act.terminalModel && act.terminalModel.name}</td>
                                    <td>{act.description}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateActivatorClicked(act.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
                                            </div>
                                            <div className="btn-group  ml-2">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.actionActivatorClicked(act.id)}><FontAwesomeIcon icon={faPlay} fixedWidth/></button>
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
                    title="Delete activator"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_acts}/>
            </div>
        )
    }
}

export default ActivatorListComponent;
