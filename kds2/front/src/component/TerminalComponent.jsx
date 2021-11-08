import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faEye,
    faEdit,
    faSave,
    faChevronLeft,
    faClock,
    faBolt, faTrash, faFeather
} from '@fortawesome/fontawesome-free-solid'
import { Tabs, Tab } from "react-bootstrap";
import { Table } from 'reactstrap';
import Alert from './Alert'
import SelectObject from "./SelectObject";
import {connect} from "react-redux";
import {alertActions} from "../rdx/rdx";
import AceEditor from "react-ace";
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {getTranslations} from "../static/transltaions";
import {sendLogToBack} from "../service/loggingService";

class TerminalComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            tid: '',
            sn: '',
            description: '',
            xml: '<terminal/>',
            model: undefined,
            models: [],
            groups: [],
            error: null,
            message:null,
            show_alert: false,
            selected_groups: undefined,
            show_tkey_alert: false,
            selected_tkeys: undefined,
            merchant: undefined,
            conf:undefined,
            allgroups: [],
            allpacks: [],
            allmerchants: [],
            packinput: undefined,
            show_merchant_selection: false,
            show_pack_selection: false,
            show_group_selection: false,
            show_application_selection: false,
            stage: '',
            tkeys: [],
            keyloadercert: '',
            checkedGroupItems: [],
            checkedKeyItems: [],
            checkedApplicationItems: [],
            applications: [],
            allapplications: [],
           selected_applications: [],
           hidden: false,
           xml_errors: false,
           xmlReadOnly: true,
           ip: '',
       }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.setSelectedGroup = this.setSelectedGroup.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.removeGroupConfirmed = this.removeGroupConfirmed.bind(this)
        this.viewConfPackClicked = this.viewConfPackClicked.bind(this)
        this.setSelectedConfPack = this.setSelectedConfPack.bind(this)
        this.viewMerchantClicked = this.viewMerchantClicked.bind(this)
        this.setSelectedMerchant = this.setSelectedMerchant.bind(this)
        this.selectMerchantClicked = this.selectMerchantClicked.bind(this)
        this.closeMerchantSelection = this.closeMerchantSelection.bind(this)
        this.selectMerchant = this.selectMerchant.bind(this)
        this.selectPackClicked = this.selectPackClicked.bind(this)
        this.closePackSelection = this.closePackSelection.bind(this)
        this.selectPack = this.selectPack.bind(this)
        this.selectGroupClicked = this.selectGroupClicked.bind(this)
        this.closeGroupSelection = this.closeGroupSelection.bind(this)
        this.selectGroup = this.selectGroup.bind(this)
        this.setStage = this.setStage.bind(this)
        this.uploadKeyloaderCert = this.uploadKeyloaderCert.bind(this)

        this.createKeyClicked = this.createKeyClicked.bind(this)
        this.editKeyClicked = this.editKeyClicked.bind(this)
        this.viewKeyClicked = this.viewKeyClicked.bind(this)
        this.deleteKeyConfirmed = this.deleteKeyConfirmed.bind(this)
        this.closeKeyAlert = this.closeKeyAlert.bind(this)

        this.handleChange = this.handleChange.bind(this)

        this.handleKeyCheckChange = this.handleKeyCheckChange.bind(this)
        this.handleKeyGroupCheckChange = this.handleKeyGroupCheckChange.bind(this)
        this.setKeyChecked = this.setKeyChecked.bind(this)
        this.deleteKeysClicked = this.deleteKeysClicked.bind(this)

        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.handleGroupGroupCheckChange = this.handleGroupGroupCheckChange.bind(this)
        this.setGroupChecked = this.setGroupChecked.bind(this)
        this.removeGroupsClicked = this.removeGroupsClicked.bind(this)

        this.handleApplicationCheckChange = this.handleApplicationCheckChange.bind(this)
        this.handleApplicationGroupCheckChange = this.handleApplicationGroupCheckChange.bind(this)
        this.setApplicationChecked = this.setApplicationChecked.bind(this)
        this.removeApplicationsClicked = this.removeApplicationsClicked.bind(this)
        this.closeApplicationSelection = this.closeApplicationSelection.bind(this)
        this.addApplicationsClicked = this.addApplicationsClicked.bind(this)
        this.removeApplicationsConfirmed = this.removeApplicationsConfirmed.bind(this)
        this.closeApplicationAlert = this.closeApplicationAlert.bind(this)
        this.selectApplications = this.selectApplications.bind(this)
        this.viewApplicationClicked = this.viewApplicationClicked.bind(this)

        this.prettifyXml = this.prettifyXml.bind(this)
        this.aceValidate = this.aceValidate.bind(this)
        this.aceChange = this.aceChange.bind(this)
        this.aceRef= React.createRef();

    }

    aceChange(e) {
        this.setState({ xml: e })
    }

    aceValidate(e) {
        let ok = true;
        e.map((rec) =>{
            if (rec.type === "error")
                ok = false;
        })
        this.setState({ xml_errors: !ok })
    }

    prettifyXml() {
        if (!this.state.xml_errors) {
            let format = require('xml-formatter');
            let formattedXml = format(this.aceRef.current.editor.getValue(), {collapseContent: true});
            this.setState({xml: formattedXml})
        }
    }


    setApplicationChecked(v)
    {
        let checkedCopy = Array(this.state.applications.length).fill(v);
        this.setState( { checkedApplicationItems : checkedCopy })
    }

    handleApplicationCheckChange(e)
    {
        const idx = e.target.name;
        const isChecked = e.target.checked;

        let checkedCopy = [...this.state.checkedApplicationItems];
        checkedCopy[idx] = isChecked;
        this.setState({ checkedApplicationItems: checkedCopy });
    }

    handleApplicationGroupCheckChange(e)
    {
        const isChecked = e.target.checked;
        this.setApplicationChecked(isChecked);
    }

    removeApplicationsClicked() {
        let x = [];
        this.state.applications.map ((t, idx) => {
            if (this.state.checkedApplicationItems[idx]) {
                x.push(t)
            }
            return 0;
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                sendLogToBack(this.context.data.way_to_logging_backend, "info", "Application "+x.length+" was deleted")
                msg = "Please confirm you will remove " + x.length + " applications";
            }
            else
            {
                sendLogToBack(this.context.data.way_to_logging_backend, "info", "Application "+x[0].name+" was deleted")
                msg = "Please confirm you will remove application " + x[0].name;
            }

            this.setState({ show_application_alert: true, selected_applications: x, message: msg });
        }
    }

    removeApplicationsConfirmed()
    {
        UserDataService.removeTerminalApplications(this.state.id, this.state.selected_applications)
            .then(
                (resp) => {
                        this.setState({ applications : resp.data.applications});
                        this.setApplicationChecked(false);
                }
            )
            .catch(error => {})
    }

    closeApplicationAlert()
    {
        this.setState({ show_application_alert : false })
    }

    addApplicationsClicked()
    {
        this.setState( {show_application_selection : true })
    }

    closeApplicationSelection()
    {
        this.setState( {show_application_selection : false })
    }

    selectApplications(apps)
    {
        if (apps && (apps.length > 0))
            UserDataService.addTerminalApplications(this.state.id, apps)
                .then((resp) => this.setState({ applications : resp.data.applications}))
                .catch(error => {})
    }

    viewApplicationClicked(app)
    {
        this.props.history.push(`/applications/${app.id}`)
    }

    setKeyChecked(v)
    {
        let checkedCopy = Array(this.state.tkeys.length).fill(v);
        this.setState( { checkedKeyItems : checkedCopy })
    }

    handleKeyCheckChange(e)
    {
        const idx = e.target.name;
        const isChecked = e.target.checked;

        let checkedCopy = [...this.state.checkedKeyItems];
        checkedCopy[idx] = isChecked;
        this.setState({ checkedKeyItems: checkedCopy });
    }

    handleKeyGroupCheckChange(e)
    {
        const isChecked = e.target.checked;
        this.setKeyChecked(isChecked);
    }

    deleteKeysClicked() {
        let x = [];
        this.state.tkeys.map ((t, idx) => {
            if (this.state.checkedKeyItems[idx]) {
                x.push(t)
            }
            return 0;
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will delete " + x.length + " keys";
                sendLogToBack(this.context.data.way_to_logging_backend, "info", "Keys "+x.length+" was deleted")

            }
            else
            {
                msg = "Please confirm you will delete key " + x[0].name;
                sendLogToBack(this.context.data.way_to_logging_backend, "info", "Key "+x[0].name+" was deleted")

            }

            this.setState({ show_tkey_alert: true, selected_tkeys: x, message: msg });
        }
    }

    setGroupChecked(v)
    {
        let checkedCopy = Array(this.state.groups.length).fill(v);
        this.setState( { checkedGroupItems : checkedCopy })
    }

    handleGroupCheckChange(e)
    {
        const idx = e.target.name;
        const isChecked = e.target.checked;

        let checkedCopy = [...this.state.checkedGroupItems];
        checkedCopy[idx] = isChecked;
        this.setState({ checkedGroupItems: checkedCopy });
    }

    handleGroupGroupCheckChange(e)
    {
        const isChecked = e.target.checked;
        this.setGroupChecked(isChecked);
    }

    removeGroupsClicked() {
        let x = [];
        this.state.groups.map ((t, idx) => {
            if (this.state.checkedGroupItems[idx]) {
                x.push(t)
            }
            return 0;
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will remove terminal from  " + x.length + " groups";
                sendLogToBack(this.context.data.way_to_logging_backend, "info", "Terminal "+x.length+" was deleted")

            }
            else
            {
                msg = "Please confirm you will remove terminal from group " + x[0].legend;
                sendLogToBack(this.context.data.way_to_logging_backend, "info", "Application "+x[0].legend+" was deleted")

            }

            this.setState({ show_alert: true, selected_groups: x, message: msg });
        }
    }

    handleChange({ target}) {
        this.setState({ [target.name]: target.value });
    };

    deleteKeyConfirmed()
    {
        UserDataService.deleteKeys(this.state.selected_tkeys)
            .then(
                () => {
                    UserDataService.retrieveTerminal(this.state.id).then((resp) =>{
                        this.setState({ tkeys : resp.data.terminalKeys});
                        this.setKeyChecked(false);
                    })
                        .catch(error => this.props.dispatch(alertActions.error(error.message)))
                })
            .catch(error => {})
    }

    closeKeyAlert()
    {
        this.setState({ show_tkey_alert : false })
    }

    createKeyClicked()
    {
        this.props.history.push(`/keys/${-1}/${this.state.id}`)
    }

    editKeyClicked(tkey)
    {
        this.props.history.push(`/keys/${tkey.id}/${this.state.id}`)
    }

    viewKeyClicked(tkey)
    {

    }

    uploadKeyloaderCert(e)
    {
        if (!e.target.files) {
            return;
        }
        let f = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (r) => {
            this.setState({ keyloadercert : r.target.result })
        };
        reader.readAsText(f)
    }

    setStage()
    {
        UserDataService.incrementStage(this.state.stage).then( resp => {
            this.setState( { stage : resp.data.stage })
        }).catch(error=>{});
    }

    closeGroupSelection()
    {
        this.setState( {show_group_selection : false })
    }

    selectGroupClicked()
    {
        this.setState( {show_group_selection : true })
    }

    selectGroup(groups)
    {
        if (groups && (groups.length > 0))
        UserDataService.appendTerminalToGroups(this.state.id, groups).then((resp) => {
            this.setState({ groups : resp.data.groups});
        })
            .catch(error=>{});
    }

    closePackSelection()
    {
        this.setState( {show_pack_selection : false })
    }

    selectPackClicked(pack)
    {
        this.setState( {show_pack_selection : true })
    }

    selectPack(p)
    {
        this.setState( { conf : p})
    }

    closeMerchantSelection()
    {
        this.setState( {show_merchant_selection : false })
    }

    selectMerchantClicked(merchant)
    {
        this.setState( {show_merchant_selection : true })
    }

    selectMerchant(m)
    {
        this.setState( { merchant : m})
    }

    setSelectedGroup(e)
    {
        this.setState({ selected_group : e[0] })
    }

    setSelectedConfPack(e)
    {
        this.setState({ conf : e[0] })
    }

    viewConfPackClicked(conf)
    {
        if (conf)
        {
            this.props.history.push(`/confpacks/${conf.id}`)
        }
    }

    setSelectedMerchant(e)
    {
        this.setState({ merchant : e[0] })
    }

    viewMerchantClicked(merchant)
    {
        if (merchant)
        {
            this.props.history.push(`/merchants/${merchant.id}`)
        }
    }

    removeGroupConfirmed()
    {
       UserDataService.removeTerminalFromGroups(this.state.id, this.state.selected_groups)
           .then(
               resp => {
                   this.setState({ groups : resp.data.groups});
                   this.setGroupChecked(false)
               }
           )
           .catch(error => {})
    }

    closeAlert()
    {
        this.setState({ show_alert : false })
    }

    onSubmit(values) {
        let terminal = {
            id: this.state.id,
            tid: this.state.tid,
            sn: this.state.sn,
            terminalModel : this.state.model,
            description: this.state.description,
            conf: this.state.conf,
            stage: this.state.stage,
            merchant: this.state.merchant,
            keyLoaderCert:  this.state.keyloadercert,
            terminalKeys: this.state.tkeys,
            xml: this.state.xml,
            ip: this.state.ip,

        }
        if (parseInt(this.state.id) === -1) {
            sendLogToBack(this.context.data.way_to_logging_backend, "info", "Terminal "+terminal.tid+" was created")
            UserDataService.createTerminal(terminal)
                .then((resp) => {
                    if (resp.data.error) {
                        this.setState({ error: resp.data.error })
                    }
                    else {
                        this.props.history.push(`/terminals/${resp.data.id}`)
                        window.location.reload();
                    }
                })
                .catch(() => {})
        } else {
            sendLogToBack(this.context.data.way_to_logging_backend, "info", "Terminal "+terminal.tid+" was updated")
            UserDataService.updateTerminal(this.state.id, terminal)
                .then((resp) => {
                    if (resp.data.error) {
                        this.setState({ error: resp.data.error })
                    }
                    else {
                        this.props.history.push('/terminals')
                    }
                })
                .catch(() => {})
        }
    }
    static contextType = LangSelectorContext;
    activeTranslation = {}
    componentDidMount() {
        this.activeTranslation = getTranslations("terminalComponent", this.context.data.lang);
        UserDataService.retrieveAllConfigPacks()
        .then((presp) => {
            UserDataService.retrieveAllGroups(1, 100)
                .then((gresp) => {
                    UserDataService.retrieveAllTerminalModels()
                        .then((tresp) => {
                            UserDataService.retrieveAllMerchants(1, 100)
                                .then((mresp) => {
                                    if (parseInt(this.state.id) !== -1) {
                                        UserDataService.retrieveTerminal(this.state.id)
                                            .then((response) => {
                                                UserDataService.retrieveAllModelApplications(response.data.terminalModel.id)
                                                    .then((aresp) => {
                                                        console.log("terminal data =")
                                                        console.log(response);
                                                        this.setState({
                                                            tid: response.data.tid,
                                                            sn: response.data.sn,
                                                            model: response.data.terminalModel,
                                                            groups: response.data.groups,
                                                            description: response.data.description,
                                                            conf: response.data.conf,
                                                            stage: response.data.stage,
                                                            merchant: response.data.merchant,
                                                            models: tresp.data,
                                                            allgroups: gresp.data.content,
                                                            allpacks: presp.data,
                                                            allmerchants: mresp.data.content,
                                                            keyloadercert: response.data.keyLoaderCert,
                                                            tkeys: response.data.terminalKeys,
                                                            applications: response.data.applications,
                                                            allapplications: aresp.data,
                                                            ip: response.data.ip,
                                                            hidden: false,
                                                            xml: response.data.xml,
                                                        })
                                                        this.setGroupChecked(false);
                                                        this.setKeyChecked(false);
                                                    })
                                                    .catch(() => { this.setState({ hidden: true})})
                                            })
                                            .catch(() => { this.setState({ hidden: true})})
                                    } else {
                                        this.setState({
                                            models: tresp.data,
                                            allgroups: gresp.data.content,
                                            allpacks: presp.data,
                                            allmerchants: mresp.data.content,
                                            model: tresp.data && tresp.data.length > 0 && tresp.data[0],
                                            hidden: false,
                                        });
                                        this.setGroupChecked(false);
                                        this.setKeyChecked(false);
                                    }
                                })
                                .catch(() => { this.setState({ hidden: true})})
                        })
                        .catch(() => { this.setState({ hidden: true})})
                })
                .catch(() => { this.setState({ hidden: true})})
        })
            .catch(() => { this.setState({ hidden: true})})
    }

    validate(values) {
        let e = null;
        let errors = {}
        if (!this.state.sn) {
            e = this.activeTranslation.enterSn
        }
        else if (!this.state.stage) {
            e = this.activeTranslation.stageDef
        }
        else if (this.state.tid && this.state.tid.toString().length !== 8) {
            e = this.activeTranslation.tidLen
        }
        else if (!this.state.model) {
            e = this.activeTranslation.select_model
        }
        else if (!this.state.merchant) {
            e = this.activeTranslation.select_merch
        }
        else if (this.state.ip && !  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.state.ip))
        {
            e = this.activeTranslation.ipCheck
        }
        else  if (this.state.xml_errors)
        {
            e = this.activeTranslation.xmlCheck
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        if (this.state.hidden)
            return null;
        return (
            <div>
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Terminal</h3>
                    { parseInt(this.state.id) !== -1 &&
                        <>
                    <button className="btn btn-outline-secondary ml-auto"
                            onClick={() => this.props.history.push(`/terminalactions/${this.state.id}`)}>
                        <FontAwesomeIcon icon={faBolt}/>{' '}{this.activeTranslation.Actions}</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={() => this.props.history.goBack()}>
                        <FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                    </>
                    }
                    { parseInt(this.state.id) === -1 &&
                    <>
                        <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}>
                            <FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                    </>
                    }
                </div>
                <Formik
                    onSubmit={this.onSubmit}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validate={this.validate}
                    enableReinitialize={true}
                    initialValues={ {} }
                >
                    {
                        (props) => (
                            <Form>
                                {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                                <fieldset className="form-group">
                                    <label>Model</label>
                                    <Field className="form-control" as="select" name="model"
                                           disabled = {parseInt(this.state.id) !== -1}
                                           value={this.state.model && this.state.model.id}
                                           onChange={(v) => {
                                               this.setState( {model: {id: v.target.value, name: ''}})} }>
                                        {
                                            this.state.models && this.state.models.map(
                                                tm =>
                                                    <option key={tm.id} value={tm.id}>{tm.name}</option>
                                            )
                                        }
                                    </Field>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.sn}</label>
                                    <Field className="form-control" type="text" name="sn" onChange={this.handleChange} value={this.state.sn} autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.tn}</label>
                                    <Field className="form-control" type="text" name="tid" onChange={this.handleChange} value={this.state.tid} autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Stage}</label>
                                    <div className="input-group">
                                        <Field className="form-control" type="text" name="stage" onChange={this.handleChange} value={this.state.stage} autoComplete="off"/>
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" onClick={this.setStage} type="button"><FontAwesomeIcon icon={faClock}/></button>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Description}</label>
                                    <Field className="form-control" type="text" name="description" onChange={this.handleChange} value={this.state.description} autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.ip}</label>
                                    <Field className="form-control" type="text" name="ip" onChange={this.handleChange} value={this.state.ip} autoComplete="off"/>
                                </fieldset>
                            <fieldset className="form-group">
                            <label>{this.activeTranslation.conf}</label>
                                <div className="input-group">
                                    <Field className="form-control" type="text" name="confpack" value={this.state.conf ? this.state.conf.name : ''} autoComplete="off" disabled/>
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" onClick={() => this.selectPackClicked(this.state.conf)} type="button"><FontAwesomeIcon icon={faEdit}/></button>
                                            <button className="btn btn-outline-secondary" onClick={() => this.viewConfPackClicked(this.state.conf)} type="button"><FontAwesomeIcon icon={faEye}/></button>
                                        </div>
                                </div>
                           </fieldset>
                            <fieldset className="form-group">
                                <label>{this.activeTranslation.Merchant}</label>
                                <div className="input-group">
                                    <Field className="form-control" type="text" name="merchant" value={this.state.merchant ? this.state.merchant.name : ''} autoComplete="off" disabled />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" onClick={() => this.selectMerchantClicked(this.state.merchant)} type="button"><FontAwesomeIcon icon={faEdit}/></button>
                                        <button className="btn btn-outline-secondary" onClick={() => this.viewMerchantClicked(this.state.merchant)} type="button"><FontAwesomeIcon icon={faEye}/></button>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="form-group">
                                <label>{this.activeTranslation.Certificate}</label>
                                <div className="input-group">
                                    <Field className="form-control mb-2" type="text" name="keyloadercert" disabled
                                           onChange={this.handleChange} value={this.state.keyloadercert}/>
                                    <div className="input-group-append">
                                        <label className="btn btn-outline-secondary" >
                                            {this.activeTranslation.Upload}
                                            <input
                                                className="d-none"
                                                type="file"
                                                onChange={this.uploadKeyloaderCert}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                                <>
                                    <div className="row mt-4 mb-2 ml-0 mr-0">
                                        <label>{this.activeTranslation.private}</label>
                                        <button type="button" className="btn btn-outline-secondary ml-auto mb-2"
                                                onClick={() => { this.setState({ xmlReadOnly: !this.state.xmlReadOnly })}}>
                                            <FontAwesomeIcon icon={faEdit}/>{this.state.xmlReadOnly ? this.activeTranslation.edit_on :this.activeTranslation.edit_off}
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary ml-2 mb-2"
                                                onClick={ this.prettifyXml}>
                                            <FontAwesomeIcon icon={faFeather}/>{this.activeTranslation.Prettify}
                                        </button>
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


                                <button className="btn btn-outline-secondary mt-3" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}{this.activeTranslation.Save}</button>
                            </Form>
                        )
                    }
                </Formik>
        { parseInt(this.state.id) !== -1 &&
            <>
                <Tabs defaultActiveKey="keys" className="mt-4">
                    <Tab eventKey="keys" title="Keys">
                        <div className="row mt-4 mb-2 mr-0">
                            <h3>Keys</h3>
                            <button className="btn btn-outline-secondary ml-auto" onClick={() => this.createKeyClicked()}><FontAwesomeIcon icon={faPlus}/>{' '}{this.activeTranslation.Create}</button>
                            <button className="btn btn-outline-secondary ml-2" onClick={this.deleteKeysClicked}><FontAwesomeIcon icon={faTrash}/>{' '}{this.activeTranslation.delete}</button>
                        </div>
                        <Table className="table-sm mt-2">
                            <thead className="thead-light">
                            <tr>
                                <th>{this.activeTranslation.Tag}</th>
                                <th>{this.activeTranslation.Name}</th>
                                <th>
                                    <div className="btn-toolbar pb-1">
                                        <div className="btn-group  ml-auto">
                                            <input type="checkbox"  onChange={this.handleKeyGroupCheckChange}/>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            { this.state.tkeys && this.state.tkeys.map((tkey, index) =>
                                <tr key={tkey.id}>
                                    <td>{tkey.tag}</td>
                                    <td>{tkey.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.editKeyClicked(tkey)}><FontAwesomeIcon icon={faEdit}/></button>
                                            </div>
                                            <div className="btn-group  ml-2">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.viewKeyClicked(tkey)}><FontAwesomeIcon icon={faEye}/></button>
                                            </div>
                                            <div className="btn-group  ml-2 mt-1">
                                                <input type="checkbox" name={index} checked={this.state.checkedKeyItems.length > index ?  this.state.checkedKeyItems[index] : false} onChange={this.handleKeyCheckChange}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>)
                            }
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="apps" title="Applications">
                        <div className="row mt-4 mb-2 mr-0">
                            <h3>Applications</h3>
                            <button className="btn btn-outline-secondary ml-auto" onClick={() => this.addApplicationsClicked()}><FontAwesomeIcon icon={faPlus}/>{' '}{this.activeTranslation.Add}</button>
                            <button className="btn btn-outline-secondary ml-2" onClick={this.removeApplicationsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}{this.activeTranslation.Remove}</button>
                        </div>
                        <Table className="table-sm mt-2">
                            <thead className="thead-light">
                            <tr>
                                <th>{this.activeTranslation.Tag}</th>
                                <th>{this.activeTranslation.Name}</th>
                                <th>
                                    <div className="btn-toolbar pb-1">
                                        <div className="btn-group  ml-auto">
                                            <input type="checkbox"  onChange={this.handleApplicationGroupCheckChange}/>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            { this.state.tkeys && this.state.applications.map((app, index) =>
                                <tr key={app.id}>
                                    <td>{app.tag}</td>
                                    <td>{app.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.viewApplicationClicked(app)}><FontAwesomeIcon icon={faEye}/></button>
                                            </div>
                                            <div className="btn-group  ml-2 mt-1">
                                                <input type="checkbox" name={index} checked={this.state.checkedApplicationItems.length > index ?  this.state.checkedApplicationItems[index] : false} onChange={this.handleApplicationCheckChange}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>)
                            }
                            </tbody>
                        </Table>

                    </Tab>
                    <Tab eventKey="groups" title="Groups">
                        <div className="row mt-4 mb-2 mr-0">
                            <h3>{this.activeTranslation.participants}</h3>
                            <button className="btn btn-outline-secondary ml-auto" onClick={() => this.selectGroupClicked()}><FontAwesomeIcon icon={faPlus}/>{' '}{this.activeTranslation.addG}</button>
                            <button className="btn btn-outline-secondary ml-2" onClick={this.removeGroupsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}{this.activeTranslation.removeG}</button>

                        </div>
                        <Table className="table-sm mt-2">
                            <thead className="thead-light">
                            <tr>
                                <th>{this.activeTranslation.Tag}</th>
                                <th>{this.activeTranslation.Name}</th>
                                <th>
                                    <div className="btn-toolbar pb-1">
                                        <div className="btn-group  ml-auto">
                                            <input type="checkbox"  onChange={this.handleGroupGroupCheckChange}/>
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
                                                <div className="btn-group  ml-auto mt-1">
                                                    <input type="checkbox" name={index} checked={this.state.checkedGroupItems.length > index ?  this.state.checkedGroupItems[index] : false} onChange={this.handleGroupCheckChange}/>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>

                    </Tab>
                </Tabs>


               </>
           }
           </div>
           <Alert
               title={this.activeTranslation.removeT}
               message={this.state.message}
               ok={this.removeGroupConfirmed}
               close={this.closeAlert}
               modal={this.state.show_alert}
               arg={this.state.selected_groups}/>
            <Alert
                    title={this.activeTranslation.deleteK}
                    message={this.state.message}
                    ok={this.deleteKeyConfirmed}
                    close={this.closeKeyAlert}
                    modal={this.state.show_tkey_alert}
                    arg={this.state.selected_tkeys}/>
                <Alert
                    title={this.activeTranslation.deleteA}
                    message={this.state.message}
                    ok={this.removeApplicationsConfirmed}
                    close={this.closeApplicationAlert}
                    modal={this.state.show_application_alert}
                    arg={this.state.selected_applications}/>
                <SelectObject
                    title={this.activeTranslation.selectM}
                    headers = {['Name', 'Description', 'Merchant Id']}
                    columns={ ['name', 'description', 'mid']}
                    ok={this.selectMerchant}
                    close={this.closeMerchantSelection}
                    placeholder="Merchant name ..."
                    searchName='name'
                    modal={this.state.show_merchant_selection}
                    options={this.state.allmerchants}/>
                <SelectObject
                    title="Select configuration package"
                    headers = {['Name', 'Description']}
                    columns={ ['name', 'description']}
                    ok={this.selectPack}
                    close={this.closePackSelection}
                    modal={this.state.show_pack_selection}
                    searchName='name'
                    placeholder="Config name ..."
                    options={this.state.allpacks}/>
                <SelectObject
                    title={this.activeTranslation.selectG}
                    headers = {['Name', 'Description']}
                    columns={ ['legend', 'description']}
                    ok={this.selectGroup}
                    close={this.closeGroupSelection}
                    modal={this.state.show_group_selection}
                    multiselect={true}
                    searchName='legend'
                    placeholder="Group name ..."
                    options={this.state.allgroups}/>
                <SelectObject
                    title={this.activeTranslation.selectA}
                    headers = {['Name', 'Tag', 'Version']}
                    columns={ ['name', 'tag', 'version']}
                    ok={this.selectApplications}
                    close={this.closeApplicationSelection}
                    modal={this.state.show_application_selection}
                    multiselect={true}
                    searchName='name'
                    placeholder="Application name ..."
                    options={this.state.allapplications}/>
            </div>
        )
    }
}

export default connect()(TerminalComponent);