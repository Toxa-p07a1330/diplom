import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { Table } from 'reactstrap';
import PaginationComponent from "./PaginationComponent";
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/GlobalContextProvider";

class LogListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            logs: [],
            currentPage: 1,
            pageLimit: 100,
            logCount: 0,
            hidden: false,
        }
        this.refreshLogs = this.refreshLogs.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
    }

    onPageChanged(p) {
        this.setState({ currentPage: p })
        this.refreshLogs()
    }

    refreshLogs() {
        UserDataService.retrieveAllLogs(this.state.currentPage, this.state.pageLimit)
            .then(
                result => {
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                    {
                        this.setState({logCount: result.data.totalElements, logs: result.data.content,});

                    }
                }
            ).catch(()=> this.setState({ hidden: true }))
    }
    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("logListComponent", this.context.data.lang);
        this.forceUpdate();
        this.refreshLogs()
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.title}</h3>
                </div>
                <div component="container">
                    <PaginationComponent totalRecords={this.state.logCount} pageLimit={this.state.pageLimit} pageNeighbours={2} onPageChanged={this.onPageChanged} />
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>{this.activeTranslation.Time}</th>
                                <th>{this.activeTranslation.Level}</th>
                                <th>{this.activeTranslation.User}</th>
                                <th>{this.activeTranslation.Message}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                             this.state.logs && this.state.logs.map(log =>
                                <tr key={log.id}>
                                    <td>{new Date(log.date).toLocaleTimeString()}
                                        <br/>
                                        {new Date(log.date).toLocaleDateString()}
                                    </td>
                                    <td>{log.level}</td>
                                    <td>{log.user}</td>
                                    <td>{log.message}</td>
                                </tr>
                             )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default LogListComponent;
