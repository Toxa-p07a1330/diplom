import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faEdit, faPlus} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/LangSelectorContextProvider";

class ApplicationListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            applications: [],
            message: null,
            selected_applications: undefined,
            show_alert: false,
            checkedItems: [],
            hidden: false,
        }
        this.refreshApplications = this.refreshApplications.bind(this)
        this.updateApplicationClicked = this.updateApplicationClicked.bind(this)
        this.addApplicationClicked = this.addApplicationClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteApplicationsClicked = this.deleteApplicationsClicked.bind(this)

    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.applications.length).fill(v);
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

    deleteApplicationsClicked() {
        let x = [];
        this.state.applications.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = this.activeTranslation.confM + x.length + this.activeTranslation.apps;
            }
            else
            {
                msg = this.activeTranslation.conf1 + x[0].name;
            }
            this.setState({ show_alert: true, selected_applications: x, message: msg });
        }
    }


    refreshApplications() {
        UserDataService.retrieveAllApplications()
            .then(
                result => {
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ applications: result.data });
                    this.setChecked(false)
                }
            )
            .catch(()=>{this.setState({ hidden: false })})
    }
    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("applicationListComponent", this.context.data.lang);
        this.forceUpdate();

        this.refreshApplications()
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

    updateApplicationClicked(id) {
        this.props.history.push(`/applications/${id}`)
    }

    OnDelete(applications)
    {
       UserDataService.deleteApplications(applications)
           .then(
               response => {
                   this.refreshApplications()
               }
           )
           .catch(() =>{})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addApplicationClicked() {
        this.props.history.push(`/applications/-1`)
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.Applications}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={this.addApplicationClicked}><FontAwesomeIcon icon={faPlus}/>{' '}{this.activeTranslation.Create}</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteApplicationsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}{this.activeTranslation.Delete}</button>
                </div>
                <div component="container">
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>{this.activeTranslation.Model}</th>
                                <th>{this.activeTranslation.Tag}</th>
                                <th>{this.activeTranslation.Name}</th>
                                <th>{this.activeTranslation.Version}</th>
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
                             this.state.applications && this.state.applications.map((application, index) =>
                                <tr key={application.id}>
                                    <td>{application.terminalModel && application.terminalModel.name}</td>
                                    <td>{application.tag}</td>
                                    <td>{application.name}</td>
                                    <td>{application.version}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-application  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateApplicationClicked(application.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
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
                    title={this.activeTranslation.deleteA}
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_applications}/>
            </div>
        )
    }
}

export default ApplicationListComponent;
