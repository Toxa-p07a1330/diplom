import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faEdit, faPlus} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import {LangSelectorContext} from "../context/LangSelectorContextProvider";
import {getTranslations} from "../static/transltaions";

class UserListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            users: [],
            message: null,
            selected_users: undefined,
            show_alert: false,
            checkedItems: [],
            hidden: false
        }
        this.refreshUsers = this.refreshUsers.bind(this)
        this.updateUserClicked = this.updateUserClicked.bind(this)
        this.addUserClicked = this.addUserClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteUsersClicked = this.deleteUsersClicked.bind(this)
    }


    setChecked(v)
    {
        let checkedCopy = Array(this.state.users.length).fill(v);
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

    deleteUsersClicked() {
        let x = [];
        this.state.users.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg =this.activeTranslation.conf_mult + x.length + " users";
            }
            else
            {
                msg = this.activeTranslation.conf_single + x[0].name;
            }
            this.setState({ show_alert: true, selected_users: x, message: msg });
        }
    }


    refreshUsers() {
        UserDataService.retrieveAllUsers("")
            .then(
                result => {
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ users: result.data });
                    this.setChecked(false)
                }
            )
            .catch(()=> this.setState({ hidden: true }))
    }


    static contextType = LangSelectorContext;
    activeTranslation = {}
    componentDidMount() {
        this.refreshUsers()
        this.activeTranslation = getTranslations("userListComponent", this.context.data.lang);

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

    updateUserClicked(id) {
        this.props.history.push(`/users/${id}`)
    }

    OnDelete(users)
    {
       UserDataService.deleteUsers(users)
           .then(
               response => {
                   this.refreshUsers()
               }
           )
           .catch(()=>{})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addUserClicked() {
        this.props.history.push(`/users/-1`)
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.users_title}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={this.addUserClicked}><FontAwesomeIcon icon={faPlus}/>{' '}{this.activeTranslation.create}</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteUsersClicked}><FontAwesomeIcon icon={faTrash}/>{' '}{this.activeTranslation.delete}</button>
                </div>
                <div component="container">
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>{this.activeTranslation.name}</th>
                                <th>{this.activeTranslation.login}</th>
                                <th>{this.activeTranslation.email}</th>
                                <th>{this.activeTranslation.admin}</th>
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
                             this.state.users && this.state.users.map((user, index) =>
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.login}</td>
                                    <td>{user.email}</td>
                                    <td>{user.admin ? "yes" : "no"}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateUserClicked(user.id)}><FontAwesomeIcon icon={faEdit}/></button>
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
                    title="Delete user"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_users}/>
            </div>
        )
    }
}

export default UserListComponent;
