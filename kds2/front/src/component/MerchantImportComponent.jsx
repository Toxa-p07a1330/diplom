import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faUpload} from '@fortawesome/fontawesome-free-solid'
import {LangSelectorContext} from "../context/LangSelectorContextProvider";
import {getTranslations} from "../static/transltaions";

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

    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("merchantImportComponent", this.context.data.lang);
        this.forceUpdate();
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
                    <h3>{this.activeTranslation.title}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}{this.activeTranslation.Back}</button>
                </div>
                <div className="row my-2">
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div className="btn-group mr-2" role="group">
                            <label className="btn btn-outline-secondary ml-auto" ><FontAwesomeIcon icon={faUpload}/>{' '}
                                {this.activeTranslation.uploadM}
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
                                    <th>{this.activeTranslation.Report}</th>
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
                            <tr><th>{this.activeTranslation.tmp}</th><td>{this.state.report.totalItems}</td></tr>
                            <tr><th>{this.activeTranslation.created}</th><td>{this.state.report.itemsCreated}</td></tr>
                            <tr><th>{this.activeTranslation.update}</th><td>{this.state.report.itemsUpdated}</td></tr>
                            <tr><th>{this.activeTranslation.nur}</th><td>{this.state.report.itemsSkipped}</td></tr>
                            <tr><th>{this.activeTranslation.errors}</th><td>{this.state.report.errorCount}</td></tr>
                            <tr><th>{this.activeTranslation.el}</th><td>{this.state.report.emptyLines}</td></tr>
                            <tr><th>{this.activeTranslation.comms}</th><td>{this.state.report.commentLines}</td></tr>
                            <tr><th>{this.activeTranslation.tlp}</th><td>{this.state.report.totalLines}</td></tr>
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