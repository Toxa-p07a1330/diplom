import React, {Component} from 'react';
import {Modal, ModalBody, Table} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare} from "@fortawesome/fontawesome-free-solid";
import PaginationComponent from "./PaginationComponent";

class SelectObject extends Component {

  constructor(props) {
    super(props)

    this.state = {
      search_value: '',
      optionCount: 1000,
      pageLimit: 100,
      checkedItems: []
    }

    this.onok = this.onok.bind(this)
    this.oncancel = this.oncancel.bind(this)
    this.onSearchInputChanged = this.onSearchInputChanged.bind(this)
    this.onPageChanged = this.onPageChanged.bind(this)
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.setChecked = this.setChecked.bind(this)
    this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
    this.getColumnValue = this.getColumnValue.bind(this)

  }

  onPageChanged(page)
  {
     this.props.loadPage && this.props.loadPage(page);
     this.setChecked(false)
  }

  setChecked(v)
  {
    let checkedCopy = Array(this.props.options.length).fill(v);
    this.setState( { checkedItems : checkedCopy })
  }

  handleCheckChange(e)
  {
    const idx = e.target.name;
    const isChecked = e.target.checked;

    let checkedCopy = [...this.state.checkedItems];
    checkedCopy[idx] = isChecked;
    //console.log()
    this.setState({ checkedItems: checkedCopy });
  }

  handleGroupCheckChange(e)
  {
    const isChecked = e.target.checked;
    this.setChecked(isChecked);
  }

  onok(arg)
  {
    this.props.close();
    if (this.props.multiselect)
    {
      let x = [];
      this.props.options.map((t, idx) => {
        if (this.state.checkedItems[idx]) {
          x.push(t)
        }
        return 0
      });
      this.props.ok && this.props.ok(x);
    }
    else {
      this.props.ok && this.props.ok(arg);
    }
  }

    getColumnValue(opt, name) {
      let fields = name.split('.');
      let x = null;
      if (fields.length > 0) {
        x = opt[fields[0]];
        if (x && fields.length > 1) {
          x = x[fields[1]];
          if (x && fields.length > 2)
            x = x[fields[2]];
        }
      }
      return x;
    }

    oncancel()
    {
      this.props.close();
    }

    onSearchInputChanged(e)
    {
      this.setState({ search_value: e.target.value})
    }

  render () {
    return (
    <div>
      <Modal isOpen={this.props.modal} fade={false} className="modal-lg">
        <div className="modal-header">
          <h5>{this.props.title}</h5>
          <div className="ml-auto">
            <div className="input-group input-group-sm">
              <input type="text" className="form-control" onChange={this.onSearchInputChanged}
                     value = {this.state.search_value}
                     placeholder={this.props.placeholder}/>
              {this.props.multiselect &&
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" onClick={() => this.onok(null)}>Select</button>
                </div>
              }
              <div className="input-group-append">
                <button className="btn btn-outline-secondary" onClick={this.oncancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <ModalBody>
          <PaginationComponent totalRecords={this.props.optionCount} pageLimit={this.state.pageLimit}
                               pageNeighbours={2}
                               onPageChanged={this.onPageChanged} />
          <Table className="ml-2 table-sm">
            <thead className="thead-light">
            <tr>
              { this.props.headers && this.props.headers.map( (h, index) =>
                  <th key={index}>{h}</th>
              )}
              <th>
                {this.props.multiselect &&
                <div className="btn-toolbar pb-1">
                  <div className="btn-group  ml-auto">
                    <input type="checkbox" onChange={this.handleGroupCheckChange}/>
                  </div>
                </div>
                }
              </th>
            </tr>
            </thead>
            <tbody>
            {
              this.props.options && this.props.options.map((opt, index) =>
                    <tr key={opt.id}
                        className={!this.state.search_value || opt[this.props.searchName].startsWith(this.state.search_value) ? "" : "d-none"}>
                      { this.props.columns && this.props.columns.map( (col, index) =>
                          <td key={index}>{this.getColumnValue(opt, col)}</td>
                      )}
                      <td>
                        <div className="btn-toolbar">
                          {!this.props.multiselect &&
                          <div className="btn-group  ml-auto">
                            <button className="btn btn-outline-secondary btn-sm btn-toolbar"
                                    onClick={() => this.onok(opt)}><FontAwesomeIcon icon={faCheckSquare}/>
                            </button>
                          </div>
                          }
                          {this.props.multiselect &&
                          <div className="btn-group  ml-auto mt-1">
                            <input type="checkbox" name={index} checked={this.state.checkedItems.length > index ? this.state.checkedItems[index] : false} onChange={this.handleCheckChange}/>
                          </div>
                          }
                        </div>
                      </td>
                    </tr>
              )
            }
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </div>
    )
  }
}

export default SelectObject;