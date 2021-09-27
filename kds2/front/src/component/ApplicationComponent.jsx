import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faSave} from '@fortawesome/fontawesome-free-solid'
import {alertActions} from "../rdx/rdx";
import {connect} from "react-redux";

class ApplicationComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            name: '',
            tag: '',
            typeTag: '',
            version: '',
            signature: '',
            description: '',
            fileName: '',
            model: undefined,
            models: [],
            hidden: false,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.uploadPackFile = this.uploadPackFile.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange({ target}) {
        this.setState({ [target.name]: target.value });
    };

    uploadPackFile(e)
    {
        if (!e.target.files) {
            return;
        }
        let data = e.target.files[0];
        let fn = data.name;
        console.log(fn)
        UserDataService.uploadApplicationPackageFile(this.state.id, data).then(
            (resp) => {
                if (resp != null)
                {
                    console.log(data);
                    this.setState({ fileName: fn });
                }
            })
            .catch( (e) => {});
    }

    onSubmit(values) {
        let application = {
            id: this.state.id,
            name: this.state.name,
            tag: this.state.tag,
            description: this.state.description,
            version: this.state.version,
            fileName: this.state.fileName,
            terminalModel: this.state.model,
            typeTag: this.state.typeTag
        }
        if (parseInt(values.id) === -1) {
            UserDataService.createApplication(application)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        this.props.history.push('/applications')
                    }
                })
                .catch(()=>{})
        } else {
            UserDataService.updateApplication(this.state.id, application)
                .then(() => this.props.history.push('/applications'))
                .catch(()=>{})
        }
    }

    componentDidMount() {
        UserDataService.retrieveAllTerminalModels()
            .then((tresp) => {
                if (parseInt(this.state.id) !== -1) {
                    UserDataService.retrieveApplication(this.state.id)
                        .then(response => {
                                this.setState({
                                    name: response.data.name,
                                    description: response.data.description,
                                    tag: response.data.tag,
                                    version: response.data.version,
                                    typeTag: response.data.typeTag,
                                    model: response.data.terminalModel,
                                    fileName: response.data.fileName,
                                    models: tresp.data,
                                })
                            }
                        )
                        .catch(()=> this.setState({ hidden: true }))
                }
                else
                {
                    this.setState({ models: tresp.data, model: tresp.data && tresp.data.length > 0 && tresp.data[0]});
                }
            })
            .catch(()=> this.setState({ hidden: true }))
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!this.state.model) {
            e = 'Please enter terminal model'
        }
        else if (!this.state.name) {
            e = 'Please enter application name'
        }
        else if (!this.state.version) {
            e = 'Please enter application version'
        }
        else if (!this.state.tag) {
            e = 'Please enter application tag'
        }
        else if (!this.state.typeTag) {
            e = 'Please enter application type tag'
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
          if (this.state.hidden)
              return null;
        let { id, name, tag, description } = this.state
        return (
            <div>
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Application</h3>
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
                                    <label>Terminal model</label>
                                    <Field className="form-control" as="select" name="model"
                                           value={this.state.model && this.state.model.id}
                                           onChange={(v) => { this.setState( {model: {id: v.target.value, name: ''}})} }
                                    >
                                        {
                                            this.state.models && this.state.models.map(
                                                tm =>
                                                    <option key={tm.id} value={tm.id}>{tm.name}</option>
                                            )
                                        }
                                    </Field>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Application name</label>
                                    <Field className="form-control" type="text" name="name" onChange={this.handleChange} value={this.state.name}  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Version</label>
                                    <Field className="form-control" type="text" name="version" onChange={this.handleChange} value={this.state.version}  autoComplete="off"/>
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>Application tag</label>
                                    <Field className="form-control" type="text" name="tag" onChange={this.handleChange} value={this.state.tag}  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Application type tag</label>
                                    <Field className="form-control" type="text" name="typeTag" onChange={this.handleChange} value={this.state.typeTag}  autoComplete="off"/>
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>Description</label>
                                    <Field className="form-control" type="text" name="description" onChange={this.handleChange} value={this.state.description}  autoComplete="off"/>
                                </fieldset>
                                {parseInt(this.state.id) !== -1 &&
                                <fieldset className="form-group">
                                    <label>Package</label>
                                    <div className="input-group">
                                    <Field className="form-control mb-2" type="text" name="packFile" disabled onChange={this.handleChange}
                                           value={this.state.fileName}
                                    />
                                    <div className="input-group-append">
                                    <label className="btn btn-outline-secondary" >
                                    Upload
                                    <input
                                    className="d-none"
                                    type="file"
                                    onChange={this.uploadPackFile}
                                    />
                                    </label>
                                    </div>
                                    </div>
                                    </fieldset>
                                }
                                <button className="btn btn-outline-secondary" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}Save</button>
                            </Form>
                        )
                    }
                </Formik>
             </div>
        </div>
        )
    }
}

export default connect()(ApplicationComponent);