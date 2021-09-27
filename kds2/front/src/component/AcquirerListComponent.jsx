import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faEdit, faPlus} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'

class AcquirerListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            acquirers: [],
            message: null,
            selected_acquirers: undefined,
            show_alert: false,
            checkedItems: [],
            hidden: false,
        }
        this.refreshAcquirers = this.refreshAcquirers.bind(this)
        this.updateAcquirerClicked = this.updateAcquirerClicked.bind(this)
        this.addAcquirerClicked = this.addAcquirerClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteAcquirersClicked = this.deleteAcquirersClicked.bind(this)

    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.acquirers.length).fill(v);
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

    deleteAcquirersClicked() {
        let x = [];
        this.state.acquirers.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will delete " + x.length + " acquirers";
            }
            else
            {
                msg = "Please confirm you will delete acquirer " + x[0].name;
            }
            this.setState({ show_alert: true, selected_acquirers: x, message: msg });
        }
    }


    refreshAcquirers() {
        UserDataService.retrieveAllAcquirers()
            .then(
                result => {
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ acquirers: result.data });
                    this.setChecked(false)
                }
            )
            .catch(()=>{ this.setState({ hidden: true })})
    }

    componentDidMount() {
        this.refreshAcquirers()
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

    updateAcquirerClicked(id) {
        this.props.history.push(`/acquirers/${id}`)
    }

    OnDelete(acquirers)
    {
       UserDataService.deleteAcquirers(acquirers)
           .then(
               response => {
                   this.refreshAcquirers()
               }
           )
           .catch(()=>{})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addAcquirerClicked() {
        this.props.history.push(`/acquirers/-1`)
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Acquirers</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={this.addAcquirerClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Create</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteAcquirersClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Delete</button>
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
                             this.state.acquirers && this.state.acquirers.map((acquirer, index) =>
                                <tr key={acquirer.id}>
                                    <td>{acquirer.tag}</td>
                                    <td>{acquirer.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-acquirer  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateAcquirerClicked(acquirer.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
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
                    title="Delete acquirer"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_acquirers}/>
            </div>
        )
    }
}

export default AcquirerListComponent;
