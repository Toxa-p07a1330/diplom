import React, { Component } from 'react';
import UserDataService from '../service/UserDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus } from '@fortawesome/fontawesome-free-solid'
import { Table } from 'reactstrap';
import Alert from './Alert'
import {LangSelectorContext} from "../context/LangSelectorContextProvider";
import {getTranslations} from "../static/transltaions";

class ConfigPackListComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            packs: [],
            message: null,
            selected_packs: undefined,
            show_alert: false,
            checkedItems: [],
            hidden: false,
        }
        this.refreshConfigPacks = this.refreshConfigPacks.bind(this)
        this.updateConfigPackClicked = this.updateConfigPackClicked.bind(this)
        this.addConfigPackClicked = this.addConfigPackClicked.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.OnDelete = this.OnDelete.bind(this)
        this.CloseAlert = this.CloseAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deletePacksClicked = this.deletePacksClicked.bind(this)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.packs.length).fill(v);
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

    deletePacksClicked() {
        let x = [];
        this.state.packs.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = this.activeTranslation.conf_m + x.length + this.activeTranslation.confs;
            }
            else
            {
                msg = this.activeTranslation.conf1 + x[0].name;
            }
            this.setState({ show_alert: true, selected_packs: x, message: msg });
        }
    }

    refreshConfigPacks() {
        UserDataService.retrieveAllConfigPacks("")
            .then(
                result => {
                    if (result.message !== undefined)
                        this.setState({ message: result.error });
                    else
                        this.setState({ packs: result.data });
                    this.setChecked(false)
                }
            ).catch(()=>{ this.setState({ hidden: true })})
    }

    static contextType = LangSelectorContext;
    activeTranslation = {}

    componentDidMount() {
        this.refreshConfigPacks()
        this.activeTranslation = getTranslations("configPackListComponent", this.context.data.lang);
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

    updateConfigPackClicked(id) {
        this.props.history.push(`/confpacks/${id}`)
    }

    OnDelete(packs)
    {
       UserDataService.deleteConfigPacks(packs)
           .then(
               response => {
                   this.refreshConfigPacks()
               }
           )
           .catch(()=>{})
    }

    CloseAlert()
    {
        this.setState({ show_alert : false })
    }

    addConfigPackClicked() {
        this.props.history.push(`/confpacks/-1`)
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="container">
                <div className="row my-2 mr-0">
                    <h3>{this.activeTranslation.title}</h3>
                    <button className="btn btn-outline-secondary ml-auto" onClick={this.addConfigPackClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Create</button>
                    <button className="btn btn-outline-secondary ml-2" onClick={this.deletePacksClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Delete</button>
                </div>
                <div component="container">
                    <Table className="table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>{this.activeTranslation.Tag}</th>
                                <th>{this.activeTranslation.Name}</th>
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
                             this.state.packs && this.state.packs.map((pack, index) =>
                                <tr key={pack.id}>
                                    <td>{pack.tag}</td>
                                    <td>{pack.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group  ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar" onClick={() => this.updateConfigPackClicked(pack.id)}><FontAwesomeIcon icon={faEdit} fixedWidth/></button>
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
                    title={this.activeTranslation.deleteP}
                    message={this.state.message}
                    ok={this.OnDelete}
                    close={this.CloseAlert}
                    modal={this.state.show_alert}
                    arg={this.state.selected_packs}/>
            </div>
        )
    }
}

export default ConfigPackListComponent;
