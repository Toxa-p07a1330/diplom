import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faEdit, faPlus, faCube} from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import PaginationComponent from './PaginationComponent'


class MerchantListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            merchants: [],
            message: null,
            selected_merchants: undefined,
            show_alert: false,
            merchantCount: 0,
            currentPage: 1,
            pageLimit: 200,
            checkedItems: [],
            hidden: false,
        }
        this.refreshMerchants = this.refreshMerchants.bind(this)
        this.updateMerchantClicked = this.updateMerchantClicked.bind(this)
        this.addMerchantClicked = this.addMerchantClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteMerchantsClicked = this.deleteMerchantsClicked.bind(this)
    }

    onPageChanged(cp) {
        this.setState({ currentPage : cp })
        this.refreshMerchants()
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.merchants.length).fill(v);
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

    deleteMerchantsClicked() {
        let x = [];
        this.state.merchants.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Please confirm you will remove " + x.length + " merchants";
            }
            else
            {
                msg = "Please confirm you will remove merchant " + x[0].name;
            }
            this.setState({ show_alert: true, selected_merchants: x, message: msg });
        }
    }

    refreshMerchants() {
        UserDataService.retrieveAllMerchants(this.state.currentPage, this.state.pageLimit)
            .then(
                result => {
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ merchantCount: result.data.totalElements, merchants: result.data.content, hidden: false });
                    this.setChecked(false)
                }
            ).catch(()=>{ this.setState( {hidden: true })});
    }

    componentDidMount() {
        this.refreshMerchants()
    }

    showMessage(text)
    {
          this.setState({message: text})
          setTimeout(() => {
                      this.setState({
                      message: null
                    })
                  }, 2000);
    }

    updateMerchantClicked(id) {
        this.props.history.push(`/merchants/${id}`)
    }

    OnDelete(merchants)
    {
       UserDataService.deleteMerchants(merchants)
           .then(
               response => {
                   this.refreshMerchants()
               }
           )
           .catch(() => {})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addMerchantClicked() {
        this.props.history.push(`/merchants/-1`)
    }

    render() {
        if (this.state.hidden)
            return  null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>Merchants</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={() =>  this.props.history.push(`/import/merchants`)}><FontAwesomeIcon icon={faCube}/>{' '}Import</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.addMerchantClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Create</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deleteMerchantsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Delete</button>
                </div>
                <div component="container">
                    <PaginationComponent totalRecords={this.state.merchantCount} pageLimit={this.state.pageLimit} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>Tag</th>
                                <th>Name</th>
                                <th>Acquirer</th>
                                <th>Merchant ID</th>
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
                             this.state.merchants && this.state.merchants.map((merchant, index) =>
                                <tr key={merchant.id}>
                                    <td>{merchant.tag}</td>
                                    <td>{merchant.name}</td>
                                    <td>{merchant.acquirer && merchant.acquirer.name}</td>
                                    <td>{merchant.mid}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-merchant  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateMerchantClicked(merchant.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
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
                </div>
                <Alert
                    title="Delete merchant"
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_merchants}/>
            </div>
        )
    }
}

export default MerchantListComponent;
