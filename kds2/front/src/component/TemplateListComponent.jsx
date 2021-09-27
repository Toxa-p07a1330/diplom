import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faEdit, faPlus} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'

class TemplateListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            templates: [],
            message: null,
            selected_templates: undefined,
            show_alert: false,
            checkedItems: [],
            hidden: false,
        }
        this.refreshTemplates = this.refreshTemplates.bind(this)
        this.updateTemplateClicked = this.updateTemplateClicked.bind(this)
        this.addTemplateClicked = this.addTemplateClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteTemplatesClicked = this.deleteTemplatesClicked.bind(this)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.templates.length).fill(v);
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

    deleteTemplatesClicked() {
        let x = [];
        this.state.templates.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will delete " + x.length + " templates";
            }
            else
            {
                msg = "Please confirm you will delete template " + x[0].name;
            }
            this.setState({ show_alert: true, selected_templates: x, message: msg });
        }
    }


    refreshTemplates() {
        UserDataService.retrieveAllConfigTemplates()
            .then(
                result => {
                    console.log(result)
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ templates: result.data });
                    this.setChecked(false)
                }
            )
            .catch(()=>{ this.setState({ hidden: true})})
    }

    componentDidMount() {
        this.refreshTemplates()
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

    updateTemplateClicked(id) {
        this.props.history.push(`/conftemplates/${id}`)
    }

    OnDelete(templates)
    {
       UserDataService.deleteConfigTemplates(templates)
           .then(
               response => {
                   this.refreshTemplates()
               }
           )
           .catch(()=>{})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addTemplateClicked() {
        this.props.history.push(`/conftemplates/-1`)
    }

    render() {
        if (this.state.hidden)
            return null
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Configuration templates</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={this.addTemplateClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Create</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteTemplatesClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Delete</button>
                </div>
                <div component="container">
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>Name</th>
                                <th>Stage</th>
                                <th>Section</th>
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
                             this.state.templates && this.state.templates.map((template, index) =>
                                <tr key={template.id}>
                                    <td>{template.name}</td>
                                    <td>{template.stage}</td>
                                    <td>{template.tag}</td>
                                    <td>{template.description}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateTemplateClicked(template.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
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
                    title="Delete template"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_templates}/>
            </div>
        )
    }
}

export default TemplateListComponent;
