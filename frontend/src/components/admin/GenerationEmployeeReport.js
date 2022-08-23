import React, { Component } from "react";
import { connect } from "react-redux";
import M from "materialize-css";
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'CBMSL0123BA390 | Mr. Bikas' },
  { value: 'strawberry', label: 'CBMSL0123AC480 | Mr. Anil' },
  { value: 'vanilla', label: 'CBMSL0123YK130 | Ms. Yukriti' }
]
export class GenerationEmployeeReport extends Component {
  componentDidMount = () => {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems, {
      preventScrolling: false,
    });
  };
  render() {
    return (
      <div className="container">
        <form action="#">
          <div
            className="row item-header"
            style={{ width: "100%", marginLeft: 20 }}
          >
              <b>Employee Report</b>
          </div>
          <div className="row" style={{ width: "100%", marginLeft: 20 }}>
            <div>
              <div class="input-field col s12">
              <Select isMulti className="basic-multi-select"
              classNamePrefix="select Employee" options={options} />
                {/* <label>Select Employee</label> */}
              </div>
            </div>
          </div>
          <div>
            <button className="btn btn-button right" onClick={(e)=>{e.preventDefault();alert("Report Created...")}}>create</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GenerationEmployeeReport);
