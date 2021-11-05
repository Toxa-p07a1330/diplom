import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faSave} from '@fortawesome/fontawesome-free-solid'
import {alertActions} from "../rdx/rdx";
import { connect } from "react-redux";
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/LangSelectorContextProvider";

class ActivatorComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            error: null,
            message:null,
            name: '',
            description: '',
            terminalIp: '',
            confUrl: '',
            tmsCa: '',
            tmsCaSign: '',
            acquirerCa: '',
            kldCa: '',
            confCa: '',
            models: [],
            hidden: false,
       }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.uploadKldCa = this.uploadKldCa.bind(this)
        this.uploadConfCa = this.uploadConfCa.bind(this)
        this.uploadAcquirerCa = this.uploadAcquirerCa.bind(this)
        this.uploadTmsCa = this.uploadTmsCa.bind(this)
        this.uploadTmsCaSign = this.uploadTmsCaSign.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }

    handleChange({ target}) {
        this.setState({ [target.name]: target.value });
    };

    uploadTmsCa(e)
    {
        if (!e.target.files) {
            return;
        }
        let f = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (r) => {
            let abv = new Uint8Array( r.target.result )
            let binary = '';
            const bytes = new Uint8Array(abv);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            this.setState({ tmsCa : window.btoa(binary) })
        };
        reader.readAsArrayBuffer(f)
    }

    uploadTmsCaSign(e)
    {
        if (!e.target.files) {
            return;
        }
        let f = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (r) => {
            let abv = new Uint8Array( r.target.result )
            let binary = '';
            const bytes = new Uint8Array(abv);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            this.setState({ tmsCaSign : window.btoa(binary) })
        };
        reader.readAsArrayBuffer(f)
    }

    uploadKldCa(e)
    {
        if (!e.target.files) {
            return;
        }
        let f = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (r) => {
            let abv = new Uint8Array( r.target.result )
            let binary = '';
            const bytes = new Uint8Array(abv);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            this.setState({ kldCa : window.btoa(binary) })
        };
        reader.readAsArrayBuffer(f)
    }

    uploadAcquirerCa(e)
    {
        if (!e.target.files) {
            return;
        }
        let f = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (r) => {
            let abv = new Uint8Array( r.target.result )
            let binary = '';
            const bytes = new Uint8Array(abv);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            this.setState({ acquirerCa : window.btoa(binary) })
        };
        reader.readAsArrayBuffer(f)
    }

    uploadConfCa(e)
    {
        if (!e.target.files) {
            return;
        }
        let f = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (r) => {
            let abv = new Uint8Array( r.target.result )
            let binary = '';
            const bytes = new Uint8Array(abv);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            this.setState({ confCa : window.btoa(binary) })
        };
        reader.readAsArrayBuffer(f)
    }

    removeTemplateClicked(template) {
        this.setState({ show_alert: true,  selected_template: template,
            message: this.activeTranslation.conf + template.name + this.activeTranslation.fact });
    }

    viewTemplateClicked(template) {
        this.props.history.push(`/conftemplates/${template.id}`)
    }

    onSubmit(values) {
        let act = {
            id: this.state.id,
            name: values.name,
            description: values.description,
            confCa: values.confCa,
            terminalIp: values.terminalIp,
            confUrl: values.confUrl,
            kldCa: values.kldCa,
            acquirerCa: values.acquirerCa,
            tmsCa: values.tmsCa,
            tmsCaSign: values.tmsCaSign,
            terminalModel : values.model,
        }

        if (parseInt(act.id) === -1) {
            UserDataService.createActivator(act)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        this.props.history.push('/activators')
                    }
                })
                .catch(() => {})
        } else {
            UserDataService.updateActivator(this.state.id, act)
                .then(() => this.props.history.push('/activators'))
                .catch(() => {})
        }
    }
    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("activatorComponent", this.context.data.lang);
        this.forceUpdate();
        UserDataService.retrieveAllTerminalModels()
            .then((tresp) => {
                if (parseInt(this.state.id) !== -1) {
                    UserDataService.retrieveActivator(this.state.id)
                        .then((response) => {
                            this.setState({
                                name: response.data.name,
                                description: response.data.description,
                                confUrl: response.data.confUrl,
                                terminalIp: response.data.terminalIp,
                                confCa: response.data.confCa,
                                acquirerCa: response.data.acquirerCa,
                                kldCa: response.data.kldCa,
                                tmsCa: response.data.tmsCa,
                                tmsCaSign: response.data.tmsCaSign,
                                model: response.data.terminalModel,
                                models: tresp.data,
                            })
                        })
                        .catch(() => this.setState({ hidden: true }))
                }
                else
                {
                    this.setState({models: tresp.data })
                }
            })
            .catch(() => this.setState({ hidden: true }))
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.name) {
            e = this.activeTranslation.enterN
        }
        else if (!values.terminalIp) {
            e = this.activeTranslation.enterIp
        }
        else if (!values.confUrl) {
            e = this.activeTranslation.enterURL
        }
        else if (!values.confCa) {
            e = this.activeTranslation.upCCA
        }
        else if (!values.acquirerCa) {
            e = this.activeTranslation.upACA
        }
        else if (!values.kldCa) {
            e =this.activeTranslation.upKCA
        }
        else if (!values.tmsCa) {
            e = this.activeTranslation.upTCA
        }
        else if (!values.tmsCaSign) {
            e = this.activeTranslation.upTCAS
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        if (this.state.hidden)
            return null;
        let { id, name, description, terminalIp, confUrl, confCa, acquirerCa, kldCa, tmsCa, tmsCaSign, model } = this.state
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.Activator}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                </div>
                <Formik
                    initialValues={ {id, name, description, terminalIp, confUrl, confCa, acquirerCa, kldCa, tmsCa, tmsCaSign, model  }}
                    onSubmit={this.onSubmit}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validate={this.validate}
                    enableReinitialize={true}
                    >
                    {
                        (props) => (
                            <Form>
                                {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}

                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Name}</label>
                                    <Field className="form-control" type="text" name="name" onChange={this.handleChange} value={this.state.name}  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Description}</label>
                                    <Field className="form-control" type="text" name="description" onChange={this.handleChange} value={this.state.description}  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.ip}</label>
                                    <Field className="form-control" type="text" name="terminalIp" onChange={this.handleChange} value={this.state.terminalIp}  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.url}</label>
                                    <Field className="form-control" type="text" name="confUrl" onChange={this.handleChange} value={this.state.confUrl}  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.tm}</label>
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
                                    <label>{this.activeTranslation.CSCA}</label>
                                    <div className="input-group">
                                        <Field className="form-control mb-2" type="text" name="tmsCa" disabled/>
                                        <div className="input-group-append">
                                            <label className="btn btn-outline-secondary" >
                                                Upload
                                                <input
                                                    className="d-none"
                                                    type="file"
                                                    onChange={this.uploadTmsCa}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.CSCAS}</label>
                                    <div className="input-group">
                                        <Field className="form-control mb-2" type="text" name="tmsCaSign" disabled/>
                                        <div className="input-group-append">
                                            <label className="btn btn-outline-secondary" >
                                                {this.activeTranslation.Upload}
                                                <input
                                                    className="d-none"
                                                    type="file"
                                                    onChange={this.uploadTmsCaSign}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.CCA}</label>
                                    <div className="input-group">
                                        <Field className="form-control mb-2" type="text" name="confCa" disabled/>
                                        <div className="input-group-append">
                                            <label className="btn btn-outline-secondary" >
                                                {this.activeTranslation.Upload}
                                                <input
                                                    className="d-none"
                                                    type="file"
                                                    onChange={this.uploadConfCa}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.ACA}</label>
                                    <div className="input-group">
                                        <Field className="form-control mb-2" type="text" name="acquirerCa" disabled/>
                                        <div className="input-group-append">
                                            <label className="btn btn-outline-secondary" >
                                                {this.activeTranslation.Upload}
                                                <input
                                                    className="d-none"
                                                    type="file"
                                                    onChange={this.uploadAcquirerCa}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.KCA}</label>
                                    <div className="input-group">
                                        <Field className="form-control mb-2" type="text" name="kldCa" disabled/>
                                        <div className="input-group-append">
                                            <label className="btn btn-outline-secondary" >
                                                {this.activeTranslation.Upload}
                                                <input
                                                    className="d-none"
                                                    type="file"
                                                    onChange={this.uploadKldCa}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                                <button className="btn btn-outline-secondary mb-4" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}{this.activeTranslation.Save}</button>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        )
    }
}

export default connect()(ActivatorComponent);