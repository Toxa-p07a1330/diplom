import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/fontawesome-free-solid";
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {getTranslations} from "../static/transltaions";

class MyAccountComponent extends Component {

    constructor(props) {
        super(props)

       this.state = {
            id: this.props.match.params.id,
            name: '',
            login: '',
            email: '',
            admin: false,
            pwd: '',
            pwd2: '',
            error: null,
            show_pwd: false,
            account_updated: false
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.onSetPasswordClick = this.onSetPasswordClick.bind(this)

    }

    onSubmit(values) {
        let user = {
            id: this.state.id,
            name: values.name,
            login: values.login,
            email: values.email,
            pwd: values.pwd,
            admin: values.admin
        }
        UserDataService.updateAccount(this.state.id, user)
            .then(() => {
                this.setState( {account_updated : true })
            })
    }

    static contextType = LangSelectorContext;
    activeTranslation = {}
    componentDidMount() {
        this.activeTranslation = getTranslations("myAccountComponent", this.context.data.lang);
        UserDataService.retrieveUser(this.state.id)
            .then(response => this.setState({
                name: response.data.name,
                login: response.data.login,
                email: response.data.email,
                admin: response.data.admin
            }))
    }

    onSetPasswordClick()
    {
        this.setState({ show_pwd: true, pwd: '' });
    }

    validate(values) {
        let e = null;
        let errors = {}
        if (values.pwd)
        {
            if (values.pwd2.length < 8)
                e = this.activeTranslation.pwdCheck
            else if (!values.pwd2)
                e = this.activeTranslation.repeat
            else if (values.pwd !== values.pwd2)
                e = this.activeTranslation.match
        }
        if (e != null)
            errors.error = "error"
        this.setSate({ error: e })
        return errors
    }

      render() {
        let { id, name, login, email, pwd, pwd2, admin } = this.state
        return (
            <div>
                <div className="container">
                    <div className="row my-2 mr-0">
                        <h3>{this.activeTranslation.title}</h3>
                        <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                    </div>
                <Formik
                    initialValues={{ id, name, login, email, pwd, pwd2, admin }}
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
                                {this.state.account_updated && <div className="alert btn-outline-secondary">{this.activeTranslation.update}</div>}
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Name}</label>
                                    <Field className="form-control" type="text" name="name" disabled/>
                                </fieldset>
                                <fieldset className="form-group" disabled >
                                    <label>{this.activeTranslation.Login}</label>
                                    <Field className="form-control" type="text" name="login" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.EMail}</label>
                                    <Field className="form-control" type="text" name="email" disabled validate="validateEmail"/>
                                </fieldset>
                              <div className="form-group form-check">
                                  <Field type="checkbox" name="admin" className="form-check-input" disabled />
                                  <label htmlFor="admin" className="form-check-label">{this.activeTranslation.admin}</label>
                              </div>

                                {
                                this.state.show_pwd &&
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Password}</label>
                                    <Field className="form-control" type="password" name="pwd"/>
                                </fieldset>
                                }
                                {
                               this.state.show_pwd &&
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.repeatPass}</label>
                                    <Field className="form-control" type="password" name="pwd2"/>
                                </fieldset>
                                }
                                {
                                   !this.state.show_pwd &&
                                   <fieldset className="form-group">
                                        <button className="btn btn-outline-secondary" onClick={this.onSetPasswordClick}>{this.activeTranslation.change}</button>
                                   </fieldset>
                                }
                                <button className="btn btn-outline-secondary" type="submit">{this.activeTranslation.save}</button>
                            </Form>
                        )
                    }
                </Formik>

            </div>
        </div>
        )
    }
}

export default MyAccountComponent;