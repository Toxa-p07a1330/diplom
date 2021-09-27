import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faEye, faChevronLeft, faSave, faTrash} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import SelectObject from "./SelectObject";
import {connect} from "react-redux";
import {alertActions} from "../rdx/rdx";

class ConfigPackComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            name: '',
            tag: '',
            description: '',
            templates: [],
            message:null,
            alltemplates: [],
            show_alert: false,
            selected_templates: [],
            show_template_selection: false,
           checkedItems: [],
           hidden: false,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.setSelectedTemplate = this.setSelectedTemplate.bind(this)
        this.removeTemplatesClicked = this.removeTemplatesClicked.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.removeTemplateConfirmed = this.removeTemplateConfirmed.bind(this)
        this.viewTemplateClicked = this.viewTemplateClicked.bind(this)
        this.selectTemplateClicked = this.selectTemplateClicked.bind(this)
        this.selectTemplate = this.selectTemplate.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.closeTemplateSelection = this.closeTemplateSelection.bind(this)
        this.selectTemplate = this.selectTemplate.bind(this)
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


    selectTemplateClicked()
    {
        this.setState( {show_template_selection : true })
    }

    selectTemplate(templates)
    {
        UserDataService.appendToPackMultipleTemplates(this.state.id, templates).then((resp) => {
            this.setState( { templates: resp.data.confTemplates } )
        })
            .catch(()=>{})
    }

    closeTemplateSelection()
    {
        this.setState( {show_template_selection : false })
    }

    setSelectedTemplate(e)
    {
        this.setState({ selected_template : e[0] })
    }

    removeTemplateConfirmed()
    {
       UserDataService.removeFromPackMultipleTemplates(this.state.id, this.state.selected_templates)
           .then(
               resp => {
                   this.setState({ templates : resp.data.confTemplates});
               }
           )
           .catch(()=>{})
    }

    closeAlert()
    {
        this.setState({ show_alert : false })
    }

    removeTemplatesClicked(template) {
        let x = [];
        this.state.templates.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0;
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will remove " + x.length + " templates";
            }
            else
            {
                msg = "Please confirm you will remove template " + x[0].name;
            }
            this.setState({ show_alert: true, selected_templates: x, message: msg });
        }

    }

    viewTemplateClicked(template) {
        this.props.history.push(`/conftemplates/${template.id}`)
    }

    onSubmit(values) {
        let pack = {
            id: this.state.id,
            name: values.name,
            tag: values.tag,
            description: values.description,
        }
        if (parseInt(values.id) === -1) {
            UserDataService.createConfigPack(pack)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        this.props.history.push(`/confpacks/${resp.data.id}`)
                        window.location.reload()
                    }
                })
                .catch(()=>{})
        } else {
            UserDataService.updateConfigPack(this.state.id, pack)
                .then(() => this.props.history.push('/confpacks'))
                .catch(()=>{})
        }
    }

    componentDidMount() {
        UserDataService.retrieveAllConfigTemplates()
            .then ((tresp) => {
            if (parseInt(this.state.id) === -1) {
                this.setState({ alltemplates : tresp.data})
                return;
            }
            UserDataService.retrieveConfigPack(this.state.id)
                .then((response) => {
                    this.setState({
                    tag: response.data.tag,
                        name: response.data.name,
                        description: response.data.description,
                    templates: response.data.confTemplates,
                    alltemplates: tresp.data,
                })})
                .catch(()=>{this.setState({ hidden: true})})
             })
            .catch(()=>{this.setState({ hidden: true})})
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.name) {
            e = 'Please enter pack name'
        }
        else if (!values.tag) {
            e = 'Please enter tag'
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        if (this.state.hidden)
            return null;
        let { id, name, description, tag } = this.state
        return (
            <div>
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Configuration package</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}Back</button>
                </div>
                <Formik
                    initialValues={{ id, name, description, tag }}
                    onSubmit={this.onSubmit}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validate={this.validate}
                    enableReinitialize={true}
                    >
                    {
                        (props) => (
                            <Form>
                                <fieldset className="form-group">
                                    <label>Name</label>
                                    <Field className="form-control" type="text" name="name" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Tag</label>
                                    <Field className="form-control" type="text" name="tag" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Description</label>
                                    <Field className="form-control" type="text" name="description" autoComplete="off"/>
                                </fieldset>
                                <button className="btn btn-outline-secondary" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}Save</button>
                            </Form>
                        )
                    }
                </Formik>
{ parseInt(this.state.id) !== -1 &&
            <>
            <div className="row mt-4 mb-2 mr-0">
                <h3>Include configuration templates:</h3>
                <button className="btn btn-outline-secondary ml-auto" onClick={() => this.selectTemplateClicked()}><FontAwesomeIcon icon={faPlus}/>{' '}Add</button>
                <button className="btn btn-outline-secondary ml-2" onClick={this.removeTemplatesClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Remove</button>
            </div>
            <div className="row mt-4 mx-0">
                <Table className="table-sm ml-2 table-striped">
                    <thead className="thead-light">
                        <tr>
                            <th>Section</th>
                            <th>Name</th>
                            <th>Stage</th>
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
                                <td>{template.tag}</td>
                                <td>{template.name}</td>
                                <td>{template.stage}</td>
                                <td>
                                    <div className="btn-toolbar">
                                        <div className="btn-group  ml-auto">
                                            <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.viewTemplateClicked(template)}><FontAwesomeIcon icon={faEye}/></button>
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
               </>
           }
           </div>
           <Alert
               title="Remove template from pack"
               message={this.state.message}
               ok={this.removeTemplateConfirmed}
               close={this.closeAlert}
               modal={this.state.show_alert}
               arg={this.state.selected_template}/>
                <SelectObject
                    title="Select template"
                    headers = {['Tag', 'Name', 'Stage']}
                    columns={ ['tag', 'name', 'stage']}
                    ok={this.selectTemplate}
                    close={this.closeTemplateSelection}
                    placeholder="Template name ..."
                    modal={this.state.show_template_selection}
                    multiselect={true}
                    searchName='name'
                    options={this.state.alltemplates}/>
            </div>

        )
    }
}

export default connect()(ConfigPackComponent);