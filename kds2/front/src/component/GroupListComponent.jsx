import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faEdit, faPlus, faPlay} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import PaginationComponent from './PaginationComponent'
import {alertActions} from "../rdx/rdx";
import {connect} from "react-redux";
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {sendLogToBack} from "../service/loggingService";

class GroupListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            groups: [],
            message: null,
            selected_groups: undefined,
            show_alert: false,
            groupCount: 0,
            currentPage: 1,
            pageLimit: 200,
            checkedItems: [],
            hidden: false,
        }
        this.refreshGroups = this.refreshGroups.bind(this)
        this.updateGroupClicked = this.updateGroupClicked.bind(this)
        this.addGroupClicked = this.addGroupClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.actionGroupClicked = this.actionGroupClicked.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)

        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.removeGroupsClicked = this.removeGroupsClicked.bind(this)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.groups.length).fill(v);
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

    removeGroupsClicked() {
        let x = [];
        this.state.groups.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = this.activeTranslation.conf_mult + x.length + this.activeTranslation.groups;
                sendLogToBack(this.context.data.way_to_logging_backend, "info", "Group "+ x.length +" was deleted")

            }
            else
            {
                msg = this.activeTranslation.conf1 + x[0].legend;
                sendLogToBack(this.context.data.way_to_logging_backend, "info", "Group "+ x[0].legend +" was deleted")
            }
            this.setState({ show_alert: true, selected_groups: x, message: msg });
        }
    }

    onPageChanged(cp) {
        this.setState({ currentPage : cp })
        this.refreshGroups()
    }

    refreshGroups() {
        UserDataService.retrieveAllGroups(this.state.currentPage, this.state.pageLimit)
            .then(
                result => {
                    console.log("RESULT", result)
                    this.setState({groupCount: result.data.totalElements, groups: result.data.content, hidden: false });
                    this.setChecked(false)
                }
            ).catch(error=>{this.setState ({ hidden: true}) })
    }
    static contextType = LangSelectorContext;
    activeTranslation = {}
    componentDidMount() {
        this.activeTranslation = getTranslations("groupListComponent", this.context.data.lang);
        this.refreshGroups()
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

    updateGroupClicked(id) {
        this.props.history.push(`/groups/${id}`)
    }

    actionGroupClicked(id) {
        this.props.history.push(`/groupactions/${id}`)
    }

    OnDelete(groups)
    {
       UserDataService.deleteGroups(groups)
           .then( response => this.refreshGroups())
           .catch(error => this.props.dispatch(alertActions.error(error.message)))
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addGroupClicked() {
        this.props.history.push(`/groups/-1`)
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.Groups}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={this.addGroupClicked}><FontAwesomeIcon icon={faPlus}/>{' '}{this.activeTranslation.create}</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.removeGroupsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}{this.activeTranslation.delete}</button>
                </div>
                <div component="container">
                    <PaginationComponent totalRecords={this.state.groupCount} pageLimit={this.state.pageLimit} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>{this.activeTranslation.tag}</th>
                                <th>{this.activeTranslation.name}</th>
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
                             this.state.groups && this.state.groups.map((group, index) =>
                                <tr key={group.id}>
                                    <td>{group.tag}</td>
                                    <td>{group.legend}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm  btn-toolbar" onClick={() => this.updateGroupClicked(group.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
                                            </div>
                                            <div className="btn-group  ml-2">
                                                <button className="btn btn-outline-secondary btn-sm  btn-toolbar" onClick={() => this.actionGroupClicked(group.id)}><FontAwesomeIcon icon={faPlay} fixedWidth/></button>
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
                    title="Delete group"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_groups}/>
            </div>
        )
    }
}

export default connect()(GroupListComponent);
