import React, { Component } from 'react';
import { Formik, Form, Field,  } from 'formik';
import UserDataService from '../service/UserDataService';
import {alertActions} from "../rdx/rdx";
import { connect } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/fontawesome-free-solid";
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {sendLogToBack} from "../service/loggingService";

class UserComponent extends Component {

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
            show_pwd: parseInt(this.props.match.params.id) === -1,
            hidden: false,
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
        if (parseInt(values.id) === -1) {
            sendLogToBack(this.context.data.way_to_logging_backend, "info", "User "+user.name+" was created")
            UserDataService.createUser(user)
                .then((resp) => {
                    if (resp.data.error !== undefined)
                    {
                        this.setState({ error: resp.data.error })
                    }
                    else
                    {
                        this.props.history.push('/users')
                    }
                })
                .catch(()=>{})
        } else {
            sendLogToBack(this.context.data.way_to_logging_backend, "info", "User "+user.name+" was updated")
            UserDataService.updateUser(this.state.id, user)
                .then(() => this.props.history.push('/users'))
                .catch(()=>{})
        }
    }

    static contextType = LangSelectorContext;
    activeTranslation = {}
    componentDidMount() {
        this.activeTranslation = getTranslations("userComponent", this.context.data.lang);
        if (parseInt(this.state.id) === -1) {
            return
        }
        UserDataService.retrieveUser(this.state.id)
            .then(response => this.setState({
                name: response.data.name,
                login: response.data.login,
                email: response.data.email,
                pwd: response.data.pwd,
                admin: response.data.admin
            })).catch(() => this.setState({ hidden: true }))
    }

    onSetPasswordClick()
    {
        this.setState({ show_pwd: true, pwd: '' });
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.name) {
            e = this.activeTranslation.name
        } else if (!values.login) {
            e = this.activeTranslation.enter_login
        }
        else if (!values.email)
        {
            e = this.activeTranslation.enter_email
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                e = 'Invalid email address';
        }
        else if (parseInt(values.id) === -1)
        {
            if (!values.pwd)
                e = this.activeTranslation.ep
            else if (!values.pwd2)
                e = this.activeTranslation.rp
            else if (values.pwd2.length < 8)
                e = this.activeTranslation.pl
            else if (values.pwd !== values.pwd2)
                e = this.activeTranslation.nm
        }
        if (this.state.error != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        let { id, name, login, email, pwd, pwd2, admin } = this.state
        return (
            <div>
            <h3>User</h3>
            <div className="container">
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

                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.nm}</label>
                                    <Field className="form-control" type="text" name="name"  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group"{ ...( (parseInt(id) !== -1) && { disabled: true } ) } >
                                    <label>{this.activeTranslation.login}</label>
                                    <Field className="form-control" type="text" name="login"  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.email}</label>
                                    <Field className="form-control" type="text" name="email" validate="validateEmail"  autoComplete="off"/>
                                </fieldset>
                              <div className="form-group form-check">
                                  <Field type="checkbox" name="admin" className="form-check-input" />
                                  <label htmlFor="admin" className="form-check-label">{this.activeTranslation.admin}</label>
                              </div>

                                {
                                this.state.show_pwd &&
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.pass}</label>
                                    <Field className="form-control" type="password" name="pwd"  autoComplete="off"/>
                                </fieldset>
                                }
                                {
                               this.state.show_pwd &&
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.repeat}</label>
                                    <Field className="form-control" type="password" name="pwd2"  autoComplete="off"/>
                                </fieldset>
                                }
                                {
                                   !this.state.show_pwd &&
                                   <fieldset className="form-group">
                                        <button className="btn btn-outline-secondary" onClick={this.onSetPasswordClick}>{this.activeTranslation.change}</button>
                                   </fieldset>
                                }
                                <button className="btn btn-outline-secondary" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}{this.activeTranslation.save}</button>
                            </Form>
                        )
                    }
                </Formik>

            </div>
        </div>
        )
    }
}

export default connect()(UserComponent);