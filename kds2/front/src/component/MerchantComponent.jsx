import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEye, faChevronLeft, faEdit, faSave} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import SelectObject from "./SelectObject";
import PaginationComponent from "./PaginationComponent";
import {alertActions} from "../rdx/rdx";
import {connect} from "react-redux";
import {LangSelectorContext} from "../context/LangSelectorContextProvider";
import {getTranslations} from "../static/transltaions";

class MerchantComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            name: '',
            tag: '',
            mid: '',
            nameAndLocation: '',
            categoryCode: '',
            description: '',
            terminals: [],
            acquirer: undefined,
            show_acquirer_selection: false,
            allacquirers: [],
            merchantTermCount: 0,
            merchantTermPage: 1,
            merchantTermPageLimit: 100,
           hidden:false,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.setSelectedTerminal = this.setSelectedTerminal.bind(this)
        this.viewTerminalClicked = this.viewTerminalClicked.bind(this)

        this.closeAcquirerSelection = this.closeAcquirerSelection.bind(this)
        this.selectAcquirerClicked = this.selectAcquirerClicked.bind(this)
        this.selectAcquirer = this.selectAcquirer.bind(this)
        this.setSelectedAcquirer = this.setSelectedAcquirer.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
        this.refreshMerchantTerminals = this.refreshMerchantTerminals.bind(this)

    }

    onPageChanged(cp) {
        this.refreshMerchantTerminals(cp)
    }

    closeAcquirerSelection()
    {
        this.setState( {show_acquirer_selection : false })
    }

    selectAcquirerClicked(acq)
    {
        this.setState( {show_acquirer_selection : true })
    }

    selectAcquirer(m)
    {
        this.setState( { acquirer : m})
    }

    setSelectedAcquirer(e)
    {
        this.setState({ acquirer : e[0] })
    }

    viewTerminalClicked(terminal) {
        this.props.history.push(`/terminals/${terminal.id}`)
    }

    setSelectedTerminal(e)
    {
        this.setState({ selected_terminal : e[0] })
    }

    onSubmit(values) {
        let merchant = {
            id: this.state.id,
            name: values.name,
            tag: values.tag,
            mid: values.mid,
            nameAndLocation: values.nameAndLocation,
            categoryCode: values.categoryCode,
            description: values.description,
            acquirer: this.state.acquirer,
            merchantTermCount: 0,
            merchantTermPage: 1,
            merchantTermPageLimit: 100,
        }
        if (parseInt(values.id) === -1) {
            UserDataService.createMerchant(merchant)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        this.props.history.push('/merchants')
                    }
                })
                .catch(() => this.setState({ error: "error"}))
        } else {
            UserDataService.updateMerchant(this.state.id, merchant)
                .then(() => this.props.history.push('/merchants'))
        }
    }

    refreshMerchantTerminals(cp)
    {
        UserDataService.retrieveMerchantTerminals(this.state.id, cp, this.state.merchantTermPageLimit)
            .then( (tresp) => {
                this.setState({
                    terminals: tresp.data.content,
                    merchantTermCount: tresp.data.totalElements,
                    merchantTermPage: cp
                })
            })
    }

    static contextType = LangSelectorContext;
    activeTranslation = {}
    componentDidMount() {
        this.activeTranslation = getTranslations("merchantComponent", this.context.data.lang);
        UserDataService.retrieveAllAcquirers()
            .then((aresp) => {
                if (parseInt(this.state.id) !== -1) {
                    UserDataService.retrieveMerchantTerminals(this.state.id, this.state.merchantTermPage, this.state.merchantTermPageLimit)
                        .then( (mresp) =>
                    {
                        UserDataService.retrieveMerchant(this.state.id)
                            .then(response => {
                                    this.setState({
                                        name: response.data.name,
                                        tag: response.data.tag,
                                        description: response.data.description,
                                        mid: response.data.mid,
                                        nameAndLocation: response.data.nameAndLocation,
                                        categoryCode: response.data.categoryCode,
                                        allacquirers: aresp.data,
                                        acquirer: response.data.acquirer,
                                        terminals: mresp.data.content,
                                        merchantTermCount: mresp.data.totalElements,
                                    })
                                }
                            )
                            .catch(() => { this.setState({ hidden: true})})
                    })
                     .catch(() => { this.setState({ hidden: true})})
                }
                else
                {
                    this.setState({ allacquirers: aresp.data })
                }
            })
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.name) {
            e = this.activeTranslation.eName
        }
        else if (!values.tag) {
            e = this.activeTranslation.eTag
        }
        else if (values.mid && values.mid.toString().length !== 15) {
            e = this.activeTranslation.idLen
        }
        else if (values.categoryCode && values.categoryCode.toString().length !== 2) {
            e = this.activeTranslation.codeLen
        }
        else if (!this.state.acquirer) {
            e = this.activeTranslation.selectA
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        if (this.state.hidden)
            return null;
        let { id, name, mid, nameAndLocation, categoryCode, description, tag } = this.state
        return (
            <div>
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.title}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                </div>
                <Formik
                    initialValues={{ id, name, description, nameAndLocation, mid, categoryCode, tag }}
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
                                    <label>{this.activeTranslation.Tag}</label>
                                    <Field className="form-control" type="text" name="tag" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.id}</label>
                                    <Field className="form-control" type="text" name="mid" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.code}</label>
                                    <Field className="form-control" type="text" name="categoryCode" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.nl}</label>
                                    <Field className="form-control" type="text" name="nameAndLocation" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Description}</label>
                                    <Field className="form-control" type="text" name="description" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Acquirer}</label>
                                    <div className="input-group">
                                        <Field className="form-control" type="text" name="merchant" value={this.state.acquirer ? this.state.acquirer.name : ''} disabled/>
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" onClick={() => this.selectAcquirerClicked(this.state.merchant)} type="button"><FontAwesomeIcon icon={faEdit}/></button>
                                            <button className="btn btn-outline-secondary" onClick={() => this.viewAcquirerClicked(this.state.merchant)} type="button"><FontAwesomeIcon icon={faEye}/></button>
                                        </div>
                                    </div>
                                </fieldset>

                                <button className="btn btn-outline-secondary" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}Save</button>
                            </Form>
                        )
                    }
                </Formik>
                        { this.state.id !== -1 &&
                            <>
                            <div className="row mt-4">
                                <h3>{this.activeTranslation.terminals} ({this.state.merchantTermCount}):</h3>
                                <PaginationComponent totalRecords={this.state.merchantTermCount} pageLimit={this.state.mechantTermPageLimit} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                                <Table className="table-sm table-striped ml-2">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>{this.activeTranslation.Model}</th>
                                            <th>{this.activeTranslation.sn}</th>
                                            <th>{this.activeTranslation.Acquirer}</th>
                                            <th>{this.activeTranslation.TID}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                         this.state.terminals && this.state.terminals.map(terminal =>
                                            <tr key={terminal.id}>
                                                <td>{terminal.terminalModel.name}</td>
                                                <td>{terminal.sn}</td>
                                                <td>{terminal.merchant && terminal.merchant.acquirer && terminal.merchant.acquirer.name}</td>
                                                <td>{terminal.tid}</td>
                                                <td>
                                                    <div className="btn-toolbar">
                                                       <div className="btn-group ml-auto">
                                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.viewTerminalClicked(terminal)}><FontAwesomeIcon icon={faEye}/></button>
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
                <SelectObject
                    title="Select acquirer"
                    headers = {['Name', 'Description']}
                    columns={ ['name', 'description']}
                    ok={this.selectAcquirer}
                    close={this.closeAcquirerSelection}
                    modal={this.state.show_acquirer_selection}
                    placeholder="Acquirer name ..."
                    searchName='name'
                    options={this.state.allacquirers}/>
        </div>
        )
    }
}

export default connect()(MerchantComponent);