import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faSave} from '@fortawesome/fontawesome-free-solid'
import {alertActions} from "../rdx/rdx";
import {connect} from "react-redux";
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {getTranslations} from "../static/transltaions";
import {sendLogToBack} from "../service/loggingService";

class KeyloaderComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            message:null,
            name: '',
            description: '',
            sn: '',
            url: '',
            keytag: '',
            hidden: false,
       }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
    }

    onSubmit(values) {
        let act = {
            id: this.state.id,
            name: values.name,
            description: values.description,
            url: values.url,
            serialNumber: values.sn,
            keyTag: values.keytag
        }

        if (parseInt(act.id) === -1) {
            sendLogToBack(this.context.data.way_to_logging_backend, "info", "Key loader "+act.name+" was created")
            UserDataService.createKeyloader(act)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        this.props.history.push('/keyloaders')
                    }
                })
                .catch(()=>{})
        } else {
            sendLogToBack(this.context.data.way_to_logging_backend, "info", "Key loader "+act.name+" was updated")
            UserDataService.updateKeyloader(this.state.id, act)
                .then(() => this.props.history.push('/keyloaders'))
                .catch(()=>{})
        }
    }

    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("keyloaderComponent", this.context.data.lang);
        this.forceUpdate();
        if (parseInt(this.state.id) !== -1) {
            UserDataService.retrieveKeyloader(this.state.id)
                .then((response) => {
                    this.setState({
                        name: response.data.name,
                        description: response.data.description,
                        url: response.data.url,
                        sn: response.data.serialNumber,
                        keytag: response.data.keyTag,
                    })
                })
                .catch(()=> this.setState({ hidden: true }))
        }
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.name) {
            e = this.activeTranslation.enterN
        }
        else if (!values.url) {
            e = this.activeTranslation.enterU
        }
        else if (!values.sn) {
            e = this.activeTranslation.enterSn
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        if (this.state.hidden)
            return null;
        let { id, name, description, url, sn, keytag } = this.state
          console.log("render", name)
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.Keyloader}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                </div>
                <Formik
                    initialValues={ {id, name, description, url, sn, keytag }}
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
                                    <label>{this.activeTranslation.Name}</label>
                                    <Field className="form-control" type="text" name="name"  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Description}</label>
                                    <Field className="form-control" type="text" name="description"  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.ip}</label>
                                    <Field className="form-control" type="text" name="url"  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.sn}</label>
                                    <Field className="form-control" type="text" name="sn"  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.keytag}</label>
                                    <Field className="form-control" type="text" name="keytag"  autoComplete="off"/>
                                </fieldset>
                                <button className="btn btn-outline-secondary" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}{this.activeTranslation.Save}</button>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        )
    }
}

export default connect()(KeyloaderComponent);