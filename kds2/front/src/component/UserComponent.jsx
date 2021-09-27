import React, { Component } from 'react';
import { Formik, Form, Field,  } from 'formik';
import UserDataService from '../service/UserDataService';
import {alertActions} from "../rdx/rdx";
import { connect } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/fontawesome-free-solid";

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
            UserDataService.updateUser(this.state.id, user)
                .then(() => this.props.history.push('/users'))
                .catch(()=>{})
        }
    }

    componentDidMount() {
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
            e = 'Please enter user name'
        } else if (!values.login) {
            e = 'Please enter login'
        }
        else if (!values.email)
        {
            e = 'Please enter e-mail'
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                e = 'Invalid email address';
        }
        else if (parseInt(values.id) === -1)
        {
            if (!values.pwd)
                e = 'Please enter password'
            else if (!values.pwd2)
                e = 'Please repeat password'
            else if (values.pwd2.length < 8)
                e = 'Password length should be 8 or greater'
            else if (values.pwd !== values.pwd2)
                e = 'Passwords do not match'
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
                                    <label>Name</label>
                                    <Field className="form-control" type="text" name="name"  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group"{ ...( (parseInt(id) !== -1) && { disabled: true } ) } >
                                    <label>Login</label>
                                    <Field className="form-control" type="text" name="login"  autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>EMail</label>
                                    <Field className="form-control" type="text" name="email" validate="validateEmail"  autoComplete="off"/>
                                </fieldset>
                              <div className="form-group form-check">
                                  <Field type="checkbox" name="admin" className="form-check-input" />
                                  <label htmlFor="admin" className="form-check-label">User is administrator</label>
                              </div>

                                {
                                this.state.show_pwd &&
                                <fieldset className="form-group">
                                    <label>Password</label>
                                    <Field className="form-control" type="password" name="pwd"  autoComplete="off"/>
                                </fieldset>
                                }
                                {
                               this.state.show_pwd &&
                                <fieldset className="form-group">
                                    <label>Repeat password</label>
                                    <Field className="form-control" type="password" name="pwd2"  autoComplete="off"/>
                                </fieldset>
                                }
                                {
                                   !this.state.show_pwd &&
                                   <fieldset className="form-group">
                                        <button className="btn btn-outline-secondary" onClick={this.onSetPasswordClick}>Change password</button>
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

export default connect()(UserComponent);