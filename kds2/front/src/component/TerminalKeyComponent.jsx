import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faEdit, faEye, faSave} from '@fortawesome/fontawesome-free-solid'
import SelectObject from "./SelectObject";
import {connect} from "react-redux";
import {alertActions} from "../rdx/rdx";
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/GlobalContextProvider";

class TerminalKeyComponent extends Component {

    constructor(props) {
        super(props)
       this.state = {
            id: this.props.match.params.id,
            tid: this.props.match.params.tid,
            message: null,
            name: '',
            description: '',
            sn: '',
            url: '',
            ketyag: '',
            tag: '',
            material: '',
            model: '',
            show_keyloader_selection: false,
            allkeyloaders: [],
            keyloader: undefined,
            hidden: false
       }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.selectKeyloader = this.selectKeyloader.bind(this)
        this.closeKeyloaderSelection = this.closeKeyloaderSelection.bind(this)
        this.selectKeyloaderClicked = this.selectKeyloaderClicked.bind(this)
        this.viewKeyloaderClicked = this.viewKeyloaderClicked.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange({ target}) {
        this.setState({ [target.name]: target.value });
    };

    closeKeyloaderSelection()
    {
        this.setState( {show_keyloader_selection : false })
    }

    selectKeyloader(p)
    {
        this.setState( { keyloader : p})
    }

    selectKeyloaderClicked(kld)
    {
        this.setState( {show_keyloader_selection : true })
    }

    viewKeyloaderClicked(kld)
    {
        if (kld)
        {
            this.props.history.push(`/keyloaders/${kld.id}`)
        }
    }

    onSubmit(values) {
        let key = {
            id: this.state.id,
            name: values.name,
            material: values.material,
            keyLoader: { id: this.state.keyloader && this.state.keyloader.id },
            terminal: { id: this.state.terminal.id },
            tag: values.tag,
        }
        if (parseInt(key.id) === -1) {
            UserDataService.createKey(key)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        this.props.history.goBack();
                        //this.props.history.push('/keys')
                    }
                })
                .catch(() => {})
        } else {
            UserDataService.updateKey(this.state.id, key)
                .then(() => this.props.history.goBack())
                .catch(()=>{})
        }
    }

    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("terminalKeyComponent", this.context.data.lang);
        this.forceUpdate();
        UserDataService.retrieveAllKeyloaders()
            .then((kresp) => {
                if (parseInt(this.state.id) !== -1) {
                    UserDataService.retrieveKey(this.state.id)
                        .then((response) => {
                            this.setState({
                                name: response.data.name,
                                material: response.data.material,
                                terminal: response.data.terminal,
                                sn: response.data.terminal && response.data.terminal.sn,
                                model: response.data.terminal && response.data.terminal.terminalModel && response.data.terminal.terminalModel.name,
                                keyloader: response.data.keyLoader,
                                tag: response.data.tag,
                                allkeyloaders: kresp.data,
                            })
                        })
                        .catch(()=> this.setState({ hidden: true}))
                }
                else
                {
                    UserDataService.retrieveTerminal(this.state.tid)
                        .then(( resp) => this.setState({ terminal : resp.data, allkeyloaders: kresp.data }))
                        .catch(()=> this.setState({ hidden: true}))

                }
            })
            .catch(()=> this.setState({ hidden: true}))

    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.name) {
            e = this.activeTranslation.enterN
        }
        else if (!values.tag) {
            e = this.activeTranslation.enterT
        }
        else if (!values.material) {
            e = this.activeTranslation.enterM
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        if (this.state.hidden)
            return null;
        let { id, name, material, keyloader, terminal, tag, sn, model } = this.state;
        //let model = terminal && terminal.terminalModel.name;
        //let sn = terminal && terminal.sn;

        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.Key}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                </div>
                <Formik
                    initialValues={ {id, name, material, keyloader, terminal, tag, model, sn }}
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
                                    <label>{this.activeTranslation.tn}</label>
                                    <Field className="form-control" type="text" name="model" disabled/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.tsm}</label>
                                    <Field className="form-control" type="text" name="sn" disabled/>
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.kn}</label>
                                    <Field className="form-control" type="text" name="name" onChange={this.handleChange} value={this.state.name}  autoComplete="off"/>
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Tag}</label>
                                    <Field className="form-control" type="text" name="tag" onChange={this.handleChange} value={this.state.tag}  autoComplete="off"/>
                                </fieldset>
                                <fieldset>
                                    <label>{this.activeTranslation.Material}</label>
                                    <Field className="form-control" type="text" name="material" onChange={this.handleChange} value={this.state.material}  autoComplete="off"/>
                                </fieldset>

                                <fieldset className="my-3">
                                <label>{this.activeTranslation.kl}</label>
                                    <div className="input-group">
                                        <Field className="form-control" type="text" name="keyloader" value={this.state.keyloader ? this.state.keyloader.name : ''} disabled/>
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" onClick={() => this.selectKeyloaderClicked(this.state.keyloader)} type="button"><FontAwesomeIcon icon={faEdit}/></button>
                                            <button className="btn btn-outline-secondary" onClick={() => this.viewKeyloaderClicked(this.state.keyloader)} type="button"><FontAwesomeIcon icon={faEye}/></button>
                                        </div>
                                    </div>
                                </fieldset>
                                <button className="btn btn-outline-secondary" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}{this.activeTranslation.Save}</button>
                            </Form>
                        )
                    }
                </Formik>
                <SelectObject
                    title="Select Key Loader"
                    headers = {['Name', 'Tag', 'Description']}
                    columns={ ['name', 'keyTag', 'description']}
                    ok={this.selectKeyloader}
                    close={this.closeKeyloaderSelection}
                    modal={this.state.show_keyloader_selection}
                    placeholder="Key Loader name ..."
                    options={this.state.allkeyloaders}/>
            </div>
        )
    }
}

export default connect()(TerminalKeyComponent);