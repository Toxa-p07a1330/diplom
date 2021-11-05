import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faClock, faEdit, faFeather, faSave, faUpload} from '@fortawesome/fontawesome-free-solid'

import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-textmate";
import {connect} from "react-redux";
import {alertActions} from "../rdx/rdx";
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/LangSelectorContextProvider";

// const customTheme = {
//   "tagColor": "#2980b9",
//   "separatorColor": "#3498db",
//   "attributeKeyColor": "#2980b9",
//   "attributeValueColor": "#27ae60",
//   "textColor": "#27ae60"
// }

class TemplateComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            name: '',
            stage: '',
            tag: '',
            description: '',
            xml: '<todo/>',
            error: null,
            message:null,
            xmlReadOnly: true,
            hidden: false,
            xml_errors: false
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.setStage = this.setStage.bind(this)

        this.handleChange = this.handleChange.bind(this)
        this.prettifyXml = this.prettifyXml.bind(this)

        this.aceValidate = this.aceValidate.bind(this)
        this.aceChange = this.aceChange.bind(this)


        this.aceRef= React.createRef();


    }

    aceChange(e)
    {
        this.setState({ xml: e })
    }

    aceValidate(e)
    {
        let ok = true;
        e.map((rec) =>{
            console.log("REC", rec)
            if (rec.type === "error")
                ok = false;
        })
        this.setState({ xml_errors: !ok })
        console.log("ok", ok)
        console.log(e)
    }


    prettifyXml()
    {
        if (!this.state.xml_errors) {
            let format = require('xml-formatter');
            let formattedXml = format(this.aceRef.current.editor.getValue(), {collapseContent: true});
            this.setState({xml: formattedXml})
        }
    }

    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    };

    setStage()
    {
        UserDataService.incrementStage(this.state.stage)
            .then( resp => this.setState( { stage : resp.data.stage }))
            .catch(()=>{})
    }

    handleFileChange = (e) => {
        if (!e.target.files) {
          return;
        }
        let data = e.target.files[0];
        UserDataService.uploadConfigTemplateFile(this.state.id, data).then(
            (resp) => {
                if (resp != null)
                {
                    this.setState({ tag: resp.data.tag, xml: resp.data.xml });
                }
            })
            .catch(()=>{});
    }

    onSubmit(values) {
        let template = {
            id: this.state.id,
            name: values.name,
            stage: values.stage,
            tag : values.tag,
            description: values.description,
            xml: values.xml,
        }
        if (parseInt(values.id) === -1) {
            UserDataService.createConfigTemplate(template)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        console.log(resp)
                        this.setState( { id: resp.data.id,
                                         tag: resp.data.tag,
                                         name: resp.data.name,
                                         stage: resp.data.stage,
                                         description: resp.data.description }); // continue to upload file
                        //this.props.history.push('/conftemplates')
                    }
                })
                .catch(()=>{})
        } else {
            UserDataService.updateConfigTemplate(this.state.id, template)
                .then(() => this.props.history.push('/conftemplates'))
                .catch(()=>{})
        }
    }

    static contextType = LangSelectorContext;
    activeTranslation = {}

    componentDidMount() {
        this.activeTranslation = getTranslations("templateComponent", this.context.data.lang);
        this.forceUpdate()
        if (parseInt(this.state.id) === -1) {
            return;
        }
        UserDataService.retrieveConfigTemplate(this.state.id)
            .then((response) => {
                this.setState({
                name: response.data.name,
                stage: response.data.stage,
                tag: response.data.tag,
                xml: response.data.xml,
                description: response.data.description,
                })
            })
            .catch(()=>{ this.setState({ hidden: true })})
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.name) {
            e = this.activeTranslation.nameAlert
        }
        else if (parseInt(values.id) !== -1 && !values.tag) {
            e = this.activeTranslation.sectionAlert
        }
        else if (parseInt(values.id) !== -1 && !values.stage) {
            e = this.activeTranslation.stageAlert
        }
        else  if (this.state.xml_errors)
        {
            e = this.activeTranslation.invXML
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        if (this.state.hidden)
            return null;
        let { id, name, stage, tag, description, xml } = this.state
        return (
            <div>
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.title}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}
                        {this.activeTranslation.Back}</button>
                </div>
                <Formik
                    initialValues={{ id, name, stage, tag, description, xml }}
                    onSubmit={this.onSubmit}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validate={this.validate}
                    enableReinitialize={true}
                    >
                    {
                        (props) => (
                            <Form>
                                <fieldset className="form-pack">
                                    <label>{this.activeTranslation.Name}</label>
                                    <Field className="form-control" type="text" name="name" onChange={this.handleChange} value={this.state.name} autoComplete="off"/>
                                </fieldset>
                                { this.state.tag && this.state.tag !== "terminal" &&
                                    <fieldset className="form-group">
                                        <label>{this.activeTranslation.Stage}</label>
                                        <div className="input-group">
                                            <Field className="form-control" type="text" name="stage"
                                                   onChange={this.handleChange} value={this.state.stage}
                                                   autoComplete="off"/>
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary" onClick={this.setStage}
                                                        type="button"><FontAwesomeIcon icon={faClock}/></button>
                                            </div>
                                        </div>
                                    </fieldset>
                                }
                               { this.state.id && parseInt(this.state.id) !== -1 &&
                               <fieldset className="form-pack">
                                    <label>{this.activeTranslation.Section}</label>
                                    <Field className="form-control" type="text" name="tag" disabled/>
                                </fieldset>
                               }
                                <fieldset className="form-pack">
                                    <label>{this.activeTranslation.Description}</label>
                                    <Field className="form-control" type="text" name="description" onChange={this.handleChange} value={this.state.description}  autoComplete="off"/>
                                </fieldset>
                                { this.state.id && parseInt(this.state.id) !== -1 &&
                                <>
                                    <div className="row mt-4 mb-2 ml-0 mr-0">
                                        <label>{this.activeTranslation.Data}</label>
                                        <button type="button" className="btn btn-outline-secondary ml-auto mb-2"
                                                onClick={() => { this.setState({ xmlReadOnly: !this.state.xmlReadOnly })}}>
                                            <FontAwesomeIcon icon={faEdit}/>{this.state.xmlReadOnly ? this.activeTranslation.edit_on
                                            : this.activeTranslation.edit_off}
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary ml-2 mb-2"
                                                onClick={ this.prettifyXml}>
                                            <FontAwesomeIcon icon={faFeather}/>{this.activeTranslation.Prettify}
                                        </button>
                                        <label className="btn btn-outline-secondary ml-2" >
                                            <FontAwesomeIcon icon={faUpload}/>{' '}{this.activeTranslation.upload}
                                            <input
                                                className="d-none"
                                                type="file"
                                                onChange={this.handleFileChange}
                                            />
                                        </label>
                                    </div>

                                  <div className="border border-primary rounded p-2">
                                        <AceEditor
                                            placeholder="Put you XML configuration here"
                                            mode="xml"
                                            theme="textmate"
                                            name="blah2"
                                            fontSize={14}
                                            onValidate={this.aceValidate}
                                            onChange={this.aceChange}
                                            showPrintMargin={true}
                                            showGutter={true}
                                            highlightActiveLine={true}
                                            ref={this.aceRef}
                                            value= { this.state.xml }
                                            width={"auto"}
                                            readOnly={this.state.xmlReadOnly}
                                            setOptions={{
                                                showLineNumbers: true,
                                                tabSize: 2,
                                            }}/>
                                  </div>
                                        </>
                                        }
                                <button className="btn btn-outline-secondary mt-2" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}{this.activeTranslation.Save}</button>
                            </Form>
                        )
                    }
                </Formik>
           </div>
           </div>
        )
    }
}

export default connect()(TemplateComponent);