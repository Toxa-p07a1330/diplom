import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faPlus, faEye, faChevronLeft, faSave } from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import SelectObject from "./SelectObject";
import PaginationComponent from "./PaginationComponent";
import {connect} from "react-redux";
import {alertActions} from "../rdx/rdx";
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/GlobalContextProvider";
import {sendLogToBack} from "../service/loggingService";

class GroupComponent extends Component {

    constructor(props) {
        super(props)
       this.state = {
            id: this.props.match.params.id,
            legend: '',
            tag: '',
            description: '',
            terminals: [],
            allterminals: [],
            selected_terminals: [],
            show_alert: false,
            show_terminal_selection: false,
            termPage: 1,
            termPageLimit: 100,
            termCount: 0,
            groupTermCount: 0,
            groupTermPage: 1,
            groupTermPageLimit: 100,
            checkedItems: [],
            hidden: false
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.setSelectedTerminal = this.setSelectedTerminal.bind(this)
        this.removeTerminalClicked = this.removeTerminalClicked.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.removeTerminalConfirmed = this.removeTerminalConfirmed.bind(this)
        this.viewTerminalClicked = this.viewTerminalClicked.bind(this)

        this.closeTerminalSelection = this.closeTerminalSelection.bind(this)
        this.selectTerminalClicked = this.selectTerminalClicked.bind(this)
        this.selectTerminal = this.selectTerminal.bind(this)
        this.loadTerminalPage = this.loadTerminalPage.bind(this)
        this.refreshGroupTerminals = this.refreshGroupTerminals.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)

        this.setChecked = this.setChecked.bind(this)
        this.removeTerminalsClicked = this.removeTerminalsClicked.bind(this)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.terminals.length).fill(v);
        this.setState( { checkedItems : checkedCopy })
    }

    handleCheckChange(e)
    {

        const idx = e.target.name;
        const isChecked = e.target.checked;

        let checkedCopy = [...this.state.checkedItems];
        checkedCopy[idx] = isChecked;
        this.setState({ checkedItems: checkedCopy });
    }

    handleGroupCheckChange(e)
    {
        const isChecked = e.target.checked;
        this.setChecked(isChecked);
    }

    onPageChanged(cp) {
        this.refreshGroupTerminals(cp)
    }

    loadTerminalPage(p)
    {
        UserDataService.retrieveAllTerminals(p, this.state.termPageLimit)
            .then(resp => this.setState({ allterminals : resp.data.content } )
            .catch(error => this.props.dispatch(alertActions.error(error.message)))
        )
    }

    closeTerminalSelection()
    {
        this.setState( {show_terminal_selection : false })
    }

    selectTerminalClicked()
    {
        this.setState( {show_terminal_selection : true })
    }

    selectTerminal(terminals)
    {
        UserDataService.appendToGroupMultipleTerminals(this.state.id, terminals)
            .then(() => this.refreshGroupTerminals(this.state.groupTermPage))
            .catch(error => {});
    }

    viewTerminalClicked(terminal) {
        this.props.history.push(`/terminals/${terminal.id}`)
    }

    setSelectedTerminal(e)
    {
        this.setState({ selected_terminal : e[0] })
    }

    removeTerminalConfirmed()
    {
       UserDataService.removeFromGroupMultipleTerminals(this.state.id, this.state.selected_terminals)
           .then(() => this.refreshGroupTerminals(this.state.groupTermPage))
           .catch(error => this.props.dispatch(alertActions.error(error.message)))
    }

    closeAlert()
    {
        this.setState({ show_alert : false })
    }

    removeTerminalsClicked() {
        let x = [];
        this.state.terminals.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0;
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will remove " + x.length + " terminals";
            }
            else
            {
                msg = "Please confirm you will remove terminal " + x[0].sn;
            }

            this.setState({ show_alert: true, selected_terminals: x, message: msg });
        }
    }

    removeTerminalClicked(terminal) {
        let x = [];
        this.state.terminals.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0;
        });
    }

    onSubmit(values) {
        let group = {
            id: this.state.id,
            legend: values.legend,
            tag: values.tag,
            description: values.description,
        }

        sendLogToBack(this.context.data.way_to_logging_backend, "info", "Group "+values.legend+" was created")

        if (parseInt(values.id) === -1) {
            UserDataService.createGroup(group)
                .then((resp) => {
                        if (resp.data.error)
                            this.props.dispatch(alertActions.error(resp.data.error))
                        else {
                            this.props.history.push(`/groups/${resp.data.id}`)
                            window.location.href = "http://localhost:3000/groups/";
                        }
                })
                .catch(error => {})
        } else {
            UserDataService.updateGroup(this.state.id, group)
                .then((resp) => {
                    if (resp.data.error)
                        this.props.dispatch(alertActions.error(resp.data.error))
                    else
                        this.props.history.goBack();
                        //this.props.history.push('/groups')
                })
                .catch(error => {})
        }
    }

    refreshGroupTerminals(cp)
    {
        UserDataService.retrieveGroupTerminals(this.state.id, cp, this.state.groupTermPageLimit)
        .then( (tresp) => {
            this.setState({
                terminals: tresp.data.content,
                groupTermCount: tresp.data.totalElements,
                groupTermPage: cp
            })
            this.setChecked(false)
        })
        .catch(error => {})
    }
    static contextType = LangSelectorContext;
    activeTranslation = {}
    componentDidMount() {
        this.forceUpdate()
        this.activeTranslation = getTranslations("groupComponent", this.context.data.lang);
        UserDataService.retrieveAllTerminals(this.state.termPage, this.state.termPageLimit)
        .then ((presp) => {
            if (parseInt(this.state.id) === -1) {
                this.setState({ allterminals : presp.data.content, termCount: presp.data.totalElements, hidden: false })
                return
            }
            UserDataService.retrieveGroupTerminals(this.state.id, this.state.groupTermPage, this.state.groupTermPageLimit).then( (tresp) => {
                UserDataService.retrieveGroup(this.state.id)
                    .then((response) => {
                        this.setState({
                            legend: response.data.legend,
                            description: response.data.description,
                            terminals: tresp.data.content,
                            allterminals: presp.data.content,
                            termCount: presp.data.totalElements,
                            groupTermCount: tresp.data.totalElements,
                            tag: response.data.tag,
                            hidden: false,
                        })
                        this.setChecked(false)
                    })
                    .catch(error => this.setState({ hidden: true }))
                })
                .catch(error => this.setState({ hidden: true }))
            })
            .catch(error => this.setState({ hidden: true }))
    }

    validate(values) {
        let e = null
        let errors = {}
        if (!values.legend) {
            e = this.activeTranslation.enterName
        }
        else if (!values.tag) {
            e = this.activeTranslation.enterTag
        }
        if (e != null)
            errors.error = "error"
        this.props.dispatch(alertActions.error(e))
        return errors
    }

      render() {
        if (this.state.hidden)
            return null;
        let { id, legend, description, tag } = this.state
        return (
            <div>
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.title}</h3>
                    <button
                        className="btn btn-outline-secondary ml-auto"
                        onClick={() => this.props.history.goBack()}>
                        <FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.back}
                    </button>
                </div>
                <Formik
                    initialValues={{ id, legend, description, tag }}
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
                                    <label>{this.activeTranslation.name}</label>
                                    <Field className="form-control" type="text" name="legend" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Tag}</label>
                                    <Field className="form-control" type="text" name="tag" autoComplete="off"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>{this.activeTranslation.Description}</label>
                                    <Field className="form-control" type="text" name="description" autoComplete="off"/>
                                </fieldset>
                                <button className="btn btn-outline-secondary" type="submit"><FontAwesomeIcon icon={faSave}/>{' '}{this.activeTranslation.save}</button>
                            </Form>
                        )
                    }
                </Formik>
                        { parseInt(this.state.id) !== -1 &&
                            <>
                                <div className="row mt-4 mb-2 mr-0">
                                    <h3>{this.activeTranslation.titg}</h3>
                                    <button className="btn btn-outline-secondary ml-auto" onClick={this.selectTerminalClicked}><FontAwesomeIcon icon={faPlus}/>{' '}{this.activeTranslation.append}</button>
                                    <button className="btn btn-outline-secondary ml-2" onClick={this.removeTerminalsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}{this.activeTranslation.remove}</button>
                                </div>
                                <PaginationComponent totalRecords={this.state.groupTermCount} pageLimit={this.state.groupTermPageLimit} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                                <Table className="table-sm ml-2 table-striped">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>{this.activeTranslation.model}</th>
                                            <th>{this.activeTranslation.sn}</th>
                                            <th>{this.activeTranslation.acquirer}</th>
                                            <th>{this.activeTranslation.tid}</th>
                                            <th>
                                                <div className="btn-toolbar pb-1">
                                                    <div className="btn-group  ml-auto">
                                                        <input type="checkbox"  onChange={this.handleGroupCheckChange}/>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                         this.state.terminals && this.state.terminals.map((terminal, index) =>
                                            <tr key={terminal.id}>
                                                <td>{terminal.terminalModel.name}</td>
                                                <td>{terminal.sn}</td>
                                                <td>{terminal.merchant && terminal.merchant.acquirer && terminal.merchant.acquirer.name}</td>
                                                <td>{terminal.tid}</td>
                                                <td>
                                                    <div className="btn-toolbar">
                                                       <div className="btn-group  ml-auto">
                                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.viewTerminalClicked(terminal)}><FontAwesomeIcon icon={faEye}/></button>
                                                       </div>
                                                        <div className="btn-group  ml-2 mt-1">
                                                                <input type="checkbox" name={index} checked={this.state.checkedItems.length > index ?  this.state.checkedItems[index] : false} onChange={this.handleCheckChange}/>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                         )
                                        }
                                    </tbody>
                                </Table>
                               </>
                           }
            </div>
                       <Alert
                           title={this.activeTranslation.removeT}
                           message={this.state.message}
                           ok={this.removeTerminalConfirmed}
                           close={this.closeAlert}
                           modal={this.state.show_alert}
                           arg={this.state.selected_terminal}/>
                <SelectObject
                    title={this.activeTranslation.st}
                    headers = {['Model', 'Serial Number', 'Acquirer', 'Terminal ID']}
                    columns={ ['terminalModel.name', 'sn', 'merchant.acquirer.name', 'tid']}
                    ok={this.selectTerminal}
                    close={this.closeTerminalSelection}
                    loadPage={this.loadTerminalPage}
                    placeholder="Terminal serial ..."
                    modal={this.state.show_terminal_selection}
                    searchName='sn'
                    multiselect={true}
                    optionCount={this.state.termCount}
                    options={this.state.allterminals}/>
        </div>
        )
    }
}

export default connect()(GroupComponent);