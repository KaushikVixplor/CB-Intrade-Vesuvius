import React, { Component } from "react";
import { connect } from "react-redux";
import { RelativeTab } from "../layout/RelativeTab";

export class NewKmpForm extends Component {
  state = {
    relatives: [{ name: "" }],
    relativeAdder: false,
    change: [],
  };

  // addRelative = (element) => {
  //   console.log("hjgd")
  //   var r = this.state.relatives;
  //   r.push({
  //     name: "",
  //   });
  //   this.setState({ relatives: r });
  // };
  clickRelative = (element) => {
    let components = this.state.change;
    element = (
      <RelativeTab
        addRelative={this.addRelative}
        index={components.length}
        state={this.state}
        deleteTab={this.deleteTab}
      />
    );

    components.push(element);

    this.setState({
      change: components,
    });
  };
  deleteTab = (element) => {
    // console.log(element.currentTarget.id)
    // let components =  this.state.change.splice(element.currentTarget.id, 1);
    // console.log(components)
    this.setState({
      change: this.state.change.splice(element.currentTarget.id, 1),
      // change: components
    });
  };
  render() {
    console.log(this.state.change);
    return (
      <div>
        <div
          className="container"
          style={{ marginTop: 15, height: "80vh", overflow: "auto" }}
        >
          <form style={{ width: "98%" }}>
            <div className="row">
              <div class="input-field col s6 m6 l6">
                <input id="name" type="text" class="validate" required />
                <label className="active" for="name">
                  Name
                </label>
              </div>
              <div class="input-field col s6 m6 l6">
                <input id="pan" type="text" class="validate" required />
                <label className="active" for="pan">
                  PAN_NO
                </label>
              </div>
            </div>
            <div className="row">
              <div class="input-field col s6 m6 l6">
                <input id="desg" type="text" class="validate" />
                <label className="active" for="desg">
                  Designation
                </label>
              </div>

              <div class="input-field col s6 m6 l6">
                <input id="empcode" type="text" class="validate" required />
                <label className="active" for="empcode">
                  EMP_CODE
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col s12 m12 l12">
                <textarea
                  rows="2"
                  cols="80"
                  name="address"
                  form="usrform"
                  style={{ padding: 10 }}
                >
                  Address
                </textarea>
              </div>
            </div>
            <div class="input-field col s12 m12 l12">
              <select>
                <option value="" disabled selected>
                  Choose your option
                </option>
                <option value="1">Shares</option>
                <option value="2">Warrants</option>
                <option value="3">Convertible Debentures</option>
                <option value="3">Rights</option>
                <option value="3">Entitlements</option>
              </select>
              <label>Security Types</label>
            </div>
            <div className="row">
              <div class="input-field col s6 m6 l6">
                <input id="dpcl1" type="text" class="validate" required />
                <label className="active" for="dpcl1">
                  FOLIO_NO_1
                </label>
              </div>
              <div class="input-field col s4 m4 l4">
                <input id="current_shr1" type="number" class="validate" />
                <label className="active" for="current_shr1">
                  SHR_POS 1
                </label>
              </div>
            </div>
            <div className="row">
              <div class="input-field col s6 m6 l6">
                <input id="dpcl2" type="text" class="validate" />
                <label className="active" for="dpcl2">
                  FOLIO_NO_2
                </label>
              </div>
              <div class="input-field col s4 m4 l4">
                <input id="current_shr2" type="number" class="validate" />
                <label className="active" for="current_shr2">
                  SHR_POS 2
                </label>
              </div>
            </div>
            <div className="row">
              <div class="input-field col s6 m6 l6">
                <input id="dpcl3" type="text" class="validate" />
                <label className="active" for="dpcl3">
                  FOLIO_NO_3
                </label>
              </div>
              <div class="input-field col s4 m4 l4">
                <input id="current_shr3" type="number" class="validate" />
                <label className="active" for="current_shr3">
                  SHR_POS 3
                </label>
              </div>
            </div>
            <div className="row">
              <div class="input-field col s6 m6 l6">
                <input id="dpcl4" type="text" class="validate" />
                <label className="active" for="dpcl4">
                  FOLIO_NO_4
                </label>
              </div>
              <div class="input-field col s4 m4 l4">
                <input id="current_shr4" type="number" class="validate" />
                <label className="active" for="current_shr4">
                  SHR_POS 4
                </label>
              </div>
            </div>
            <div className="row">
              <div class="input-field col s6 m6 l6">
                <input id="dpcl5" type="text" class="validate" />
                <label className="active" for="dpcl5">
                  FOLIO_NO_5
                </label>
              </div>
              <div class="input-field col s4 m4 l4">
                <input id="current_shr5" type="number" class="validate" />
                <label className="active" for="current_shr5">
                  SHR_POS 5
                </label>
              </div>
            </div>
            <div className="row">
              <div class="input-field col s4 m4 l4">
                <input id="current_benpos" type="date" class="validate" />
                <label className="active" for="current_benpos">
                  Current_BENPOS
                </label>
              </div>
              <div class="input-field col s4 m4 l4">
                <input id="email" type="email" class="validate" required />
                <label className="active" for="email">
                  EMAIL_ID
                </label>
              </div>
              <div class="input-field col s4 m4 l4">
                <input id="mobile" type="number" class="validate" />
                <label className="active" for="mobile">
                  Mobile NO
                </label>
              </div>
            </div>
            <div className="row">
              <div class="input-field col s6 m6 l6">
                <input
                  id="last_institute"
                  type="text"
                  class="validate"
                  required
                />
                <label className="active" for="last_institute">
                  Last Institute
                </label>
              </div>
              <div class="input-field col s6 m6 l6">
                <input id="last_employer" type="text" class="validate" />
                <label className="active" for="last_employer">
                  Last Employer
                </label>
              </div>
            </div>

            {/*....................relative part.....................*/}

            {this.state.change.map((comp, index) => comp)}
          </form>
          <div className="row">
            <button
              type="button"
              className="btn btn-button col s12 m12 l12"
              onClick={this.clickRelative}
            >
              Add relative
            </button>
          </div>
          <div>
            <a className="btn right">Save</a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NewKmpForm);
