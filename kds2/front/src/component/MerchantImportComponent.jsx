import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faUpload} from '@fortawesome/fontawesome-free-solid'

class MerchantImportComponent extends Component {


    constructor(props) {
        super(props);

       this.state = {
            report: undefined,
       }
        this.uploadMerchantsClicked = this.uploadMerchantsClicked.bind(this)
    }

    uploadMerchantsClicked(e) {
        if (!e.target.files) {
            return;
        }
        let data = e.target.files[0];
        UserDataService.uploadMerchantFile(data).then(
            (resp) => {
                if (resp != null)
                {
                    this.setState({ report: resp.data });
                }
            })
            .catch( (e) => { });
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

      render() {
        return (
            <div>
            <div className="container">
                {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                {this.state.info && <div className="alert alert-info">{this.state.info}</div>}
                {this.state.success && <div className="alert alert-success">{this.state.success}</div>}
                <div className="row my-2">
                    <h3>Merchant import</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}Back</button>
                </div>
                <div className="row my-2">
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div className="btn-group mr-2" role="group">
                            <label className="btn btn-outline-secondary ml-auto" ><FontAwesomeIcon icon={faUpload}/>{' '}
                                Upload merchants
                                <input
                                    className="d-none"
                                    type="file"
                                    onChange={this.uploadMerchantsClicked}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                {(this.state.report &&
                    <>
                    <div className="row my-2">
                        <table className="table table-sm table-borderless table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.report.lines.map(line =>
                                <tr key={line}>
                                    <td>{line}</td>
                                </tr>
                                )}
                            </tbody>
                       </table>
                    </div>
                    <div className="row my-2">
                        <table className="table table-sm table-borderless">
                        <tbody>
                            <tr><th>Total merchants processed:</th><td>{this.state.report.totalItems}</td></tr>
                            <tr><th>Created:</th><td>{this.state.report.itemsCreated}</td></tr>
                            <tr><th>Updated:</th><td>{this.state.report.itemsUpdated}</td></tr>
                            <tr><th>No update required:</th><td>{this.state.report.itemsSkipped}</td></tr>
                            <tr><th>Errors:</th><td>{this.state.report.errorCount}</td></tr>
                            <tr><th>Empty lines:</th><td>{this.state.report.emptyLines}</td></tr>
                            <tr><th>Comments:</th><td>{this.state.report.commentLines}</td></tr>
                            <tr><th>Total lines processed:</th><td>{this.state.report.totalLines}</td></tr>
                        </tbody>
                        </table>
                    </div>
                    </>
                )}
           </div>
            </div>
        )
    }
}

export default MerchantImportComponent;