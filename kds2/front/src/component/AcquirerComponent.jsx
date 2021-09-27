import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEye, faChevronLeft, faSave} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import PaginationComponent from "./PaginationComponent";
import {connect} from "react-redux";
import {alertActions} from "../rdx/rdx";

class AcquirerComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            name: '',
            merchants: [],
            tag: '',
            description: '',
            error: null,
           merchantCount: 0,
           merchantPage: 1,
           merchantPageLimit: 100,
           hidden: false,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.viewMerchantClicked = this.viewMerchantClicked.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
        this.refreshAcquirerMerchants = this.refreshAcquirerMerchants.bind(this)
    }

    onPageChanged(cp) {
        this.refreshAcquirerMerchants(cp)
    }

    refreshAcquirerMerchants(cp)
    {
        UserDataService.retrieveAcquirerMerchants(this.state.id, cp, this.state.merchantPageLimit)
            .then( (tresp) => {
                this.setState({
                    merchants: tresp.data.content,
                    merchantCount: tresp.data.totalElements,
                    merchantPage: cp
                })
            })
            .catch(() => {})
    }

    viewMerchantClicked(merchant) {
        this.props.history.push(`/merchants/${merchant.id}`)
    }

    onSubmit(values) {
        let acquirer = {
            id: this.state.id,
            name: values.name,
            tag: values.tag,
            description: values.description,
        }
        if (parseInt(values.id) === -1) {
            UserDataService.createAcquirer(acquirer)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        this.props.history.push('/acquirers')
                    }
                })
                .catch(() => {})
        } else {
            UserDataService.updateAcquirer(this.state.id, acquirer)
                .then(() => this.props.history.push('/acquirers'))
                .catch(() => {})
        }
    }

    componentDidMount() {
        if (parseInt(this.state.id) !== -1) {
            UserDataService.retrieveAcquirer(this.state.id)
                .then(response => {
                        this.setState({
                            name: response.data.name,
                            description: response.data.description,
                            tag: response.data.tag,
                        })
                        this.refreshAcquirerMerchants(1)
                    }
                )
                .catch(()=>{ this.setState({ hidden: false })})
        }
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.name) {
            e = 'Please enter acquirer name'
        }
        else if (!values.tag) {
            e = 'Please enter acquirer tag'
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
                    <h3>Acquirer</h3>
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
                        { this.state.id !== -1 &&
                            <>
                            <div className="row mt-4">
                                <h3>Merchants ({this.state.merchantCount}):</h3>
                                <PaginationComponent totalRecords={this.state.merchantCount} pageLimit={this.state.mechantPageLimit} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                                <Table className="table-sm">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>MID</th>
                                            <th>Name</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                         this.state.merchants && this.state.merchants.map(merchant =>
                                            <tr key={merchant.id}>
                                                <td>{merchant.mid}</td>
                                                <td>{merchant.name}</td>
                                                <td>
                                                    <div className="btn-toolbar">
                                                       <div className="btn-acquirer  ml-auto">
                                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.viewMerchantClicked(merchant)}><FontAwesomeIcon icon={faEye}/></button>
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
        </div>
        )
    }
}

export default connect()(AcquirerComponent);