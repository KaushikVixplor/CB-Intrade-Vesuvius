import React, { Component } from "react";
import { connect } from "react-redux";
import { LeftBar } from "../layout/LeftBar";
import TopNav from "../layout/TopNav";
import { RequestApproval } from "./RequestApproval";
import M from "materialize-css";
import { SuucessOrErrorModal } from "../layout/SystemResetModal";
import { Redirect } from "react-router";
import {
  clientRequest,
  fetchFolioList,
  requestTran,
  userRelative,
} from "../../store/action/ClientAction";
import swal from "sweetalert";
import { DisclosureFormModal } from "../layout/DisclosureFormModal";
import { sharePdf } from "../../store/action/CommonAction";

export class TradingRequest extends Component {
  state = {
    flag: true,
    folios: [],
    relation: false,
    name: "",
    designation: "Secratory",
    category: "Self",
    employee_relative: "",
    mode: "Market",
    security_type: "Shares",
    folio: "INP78974564",
    folio_id: null,
    request_type: "Purchase",
    date_requested_to: "",
    date_requested_from: "",

    request_quantity: 0,
    proposed_price: 0,
    market_price: 0,
    previous_price: 0,

    onRequestFlag: false,
    type: "",

    company: "Infosys",
    company_add: "54D 1st stree, Bangalore, karnataka-500012",
    add: "10c Bedu street, Bangalore, karnataka-500012",

    sharePdf: false,
  };
  handleForWhom = (e) => {
    if (e.target.id == "relative") {
      this.setState({ relation: true });
    } else {
      this.setState({ relation: false });
    }
  };

  HandleChange = (e) => {
    console.log(e.target.id, e.target.value);
    this.setState({ [e.target.id]: e.target.value, flag: true });
    if (e.target.id == "category") {
      if (this.state.category != e.target.value) {
        if (document.getElementById("employee_relative") != null) {
          document.getElementById("employee_relative").selectedIndex = 0;
        }
      }
    }
    // document.getElementById("employee_relative").selectedIndex = 0
  };

  OnSubmit = () => {
    if (this.state.request_type == 'Sell') {
      var folio = this.props.folios.Folios.find(f => f.id == this.state.folio_id)
      if (!folio) {
        for (var i = 0; i < this.props.folios.Relatives.length; i++) {
          folio = this.props.folios.Relatives[i].Folios.find(f => f.id == this.state.folio_id)
          if (folio) break
        }
      }
      if (folio && folio.current_share < this.state.request_quantity) {
        swal('Info', 'Request quantity should be less than or equal with current share of the selected folio', 'info')
        return
      }
    }
    if (
      this.state.folio_id == null ||
      this.state.date_requested_from == "" ||
      this.state.date_requested_to == "" ||
      this.state.request_quantity == 0
    ) {
      alert("Please fill all the mandetory fields");
    } else if (new Date(this.state.date_requested_from).getTime() > new Date(this.state.date_requested_to).getTime()) {
      swal('Info', 'Dealing date request from must be less than Dealing date request to')
    } else if (new Date(new Date(this.props.company.window_close_from).setHours(0, 0, 0)).getTime() <= new Date(this.state.date_requested_from).getTime() && new Date(this.state.date_requested_from).getTime() <= new Date(new Date(this.props.company.window_close_to).setHours(23, 59, 59)).getTime()) {
      swal('Info', 'Trading window will be closed from ' + this.getDate(this.props.company.window_close_from) + ' to ' + this.getDate(this.props.company.window_close_to), 'info')
    } else if (new Date(new Date(this.props.company.window_close_from).setHours(0, 0, 0)).getTime() <= new Date(this.state.date_requested_to).getTime() && new Date(this.state.date_requested_to).getTime() <= new Date(new Date(this.props.company.window_close_to).setHours(23, 59, 59)).getTime()) {
      swal('Info', 'Trading window will be closed from ' + this.getDate(this.props.company.window_close_from) + ' to ' + this.getDate(this.props.company.window_close_to), 'info')
    } else if (new Date(this.state.date_requested_from).getTime() < new Date(new Date(this.props.company.window_close_from).setHours(0, 0, 0)).getTime() && new Date(this.state.date_requested_to).getTime() > new Date(new Date(this.props.company.window_close_to).setHours(23, 59, 59)).getTime()) {
      swal('Info', 'Trading window will be closed from ' + this.getDate(this.props.company.window_close_from) + ' to ' + this.getDate(this.props.company.window_close_to), 'info')
    } else {
      this.setState({ onRequestFlag: true });
      this.props.RequestTran(this.state, this.props.user.accessToken);
    }
  };

  componentDidMount = () => {
    if (this.props.user) {
      var today = this.getDateValue()
      this.setState({ name: this.props.user.name, today: today });
      this.props.FetchFolios(this.props.user.accessToken);
      this.props.UserRelative(this.props.user.id, this.props.user.accessToken);
    }
  };

  componentDidUpdate() {
    if (
      !this.props.folioRequestLoading &&
      this.props.folioRequestSuccess &&
      this.props.folios != null
    ) {
      var arr1 = [];
      var arr2 = [];
      var relatives = this.props.folios.Relatives;
      var folio = this.props.folios.Folios;
      console.log(this.props.folios);
      if (this.state.flag && this.props.userRelativeSuccess) {
        for (var i = 0; i < folio.length; i++) {
          var info1 = {
            id: folio[i].id,
            folio: folio[i].folio,
          };
          // arr1.push(info1);
          for (var j = 0; j < relatives.length; j++) {
            if (relatives[j].type == "Immediate Relative") {
              for (let k = 0; k < relatives[j].Folios.length; k++) {
                if (
                  relatives[j].Folios[k].emp_relative_pan ==
                  this.state.employee_relative
                ) {
                  var info2 = {
                    id: relatives[j].Folios[k].id,
                    folio: relatives[j].Folios[k].folio,
                  };
                }
                arr2.push(info2);
              }
            } else if (relatives[j].type == "Material Financial Relationship") {
              for (let k = 0; k < relatives[j].Folios.length; k++) {
                if (
                  relatives[j].Folios[k].emp_relative_pan ==
                  this.state.employee_relative
                ) {
                  var info3 = {
                    id: relatives[j].Folios[k].id,
                    folio: relatives[j].Folios[k].folio,
                  };
                }
                arr2.push(info3);
              }
            }
          }
        }
        var filtered = [
          ...new Map(arr2.map((obj) => [JSON.stringify(obj), obj])).values(),
        ];
        var array = arr1.concat(filtered);
        console.log("array", arr2, array);
        this.setState({ folios: array, flag: false });
      }
    }
    if (this.state.onRequestFlag && !this.props.requestTransLoading) {
      if (this.props.requestTransSuccess) {
        swal("Success", "SuccessFul", "success");
        var modal = document.getElementById("download-modal");
        var instance = M.Modal.getInstance(modal);
        instance.open();
        this.setState({ type: "success", onRequestFlag: false });
      } else if (this.props.requestTransError) {
        swal("OOPS!", this.props.requestTransMsg, "error");
        this.setState({ type: "error", onRequestFlag: false });
      }
    }
    if (this.state.sharePdf && !this.props.sharePdfLoading) {
      if (this.props.sharePdfSuccess) {
        swal("Success", "Success", "success");
        this.setState({ sharePdf: false });
      } else if (this.props.sharePdfError) {
        swal("OOPS!", this.props.sharePdfMsg, "error");
        this.setState({ sharePdf: false });
      }
    }
  }

  onDownload = () => {
    var data = this.props.requestTrans;
    var link = document.createElement("a");
    link.href = data;
    link.download = "request.pdf";
    console.log(link.href);
    link.click();
  };

  onSharePdf = async (e) => {
    this.setState({ sharePdf: true });
    this.props.SharePdf(
      "New_transaction_request",
      this.props.header,
      this.props.user.accessToken
    );
  };

  getDate = (date) => {
    var d = new Date(date);
    var day = d.getDate();
    if (day.toString().length == 1) day = '0' + day
    var month = d.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month
    var Year = d.getFullYear();
    return day + "-" + month + "-" + Year;
  }

  getDateValue = () => {
    var d = new Date();
    var day = d.getDate();
    if (day.toString().length == 1) day = '0' + day
    var month = d.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month
    var Year = d.getFullYear();
    return Year + "-" + month + "-" + day;
  }
  
  render() {
    console.log("loc state", this.state);
    console.log("loc state", this.props);
    if (!this.props.user) return <Redirect to="/login" />;
    return (
      <div className="row">
        <TopNav />
        <DisclosureFormModal
          download={this.onDownload}
          file={this.props.requestTrans}
          share={this.onSharePdf}
        />

        <div
          className="row item-header"
          style={{ width: "79%", marginLeft: 126 }}
        >
          <b>Pre Transaction Approval</b>
        </div>
        <div
          className="container"
          style={{ marginTop: 15, height: "77vh", overflow: "auto" }}
        >
          <div style={{ marginTop: 10 }}>
            <form action="#">
              <div>
                <span
                  style={{
                    fontSize: "smaller",
                    marginLeft: "-79%",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: "red" }}>*</span> indicates the
                  mandatory fields
                </span>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <input
                    id="name"
                    type="text"
                    class="validate"
                    value={this.state.name}
                    disabled
                    onChange={this.HandleChange}
                  />
                  <label className="active" for="name">
                    Name
                  </label>
                </div>
              </div>
              <p>
                <label>Category</label>
              </p>
              <div className="row">
                <div className="col s4 m4 l4">
                  <p>
                    <label>
                      <input
                        name="category"
                        id="category"
                        class="with-gap"
                        type="radio"
                        value="Self"
                        onChange={this.HandleChange}
                        checked={this.state.category == "Self"}
                        // onChange={handleForWhom}
                      />
                      <span>Self</span>
                    </label>
                  </p>
                </div>
                <div className="col s4 m4 l4">
                  <p>
                    <label>
                      <input
                        name="category"
                        id="category"
                        value="Immediate Relative"
                        class="with-gap"
                        type="radio"
                        onChange={this.HandleChange}
                        checked={this.state.category == "Immediate Relative"}
                        // onChange={handleForWhom}
                      />
                      <span>Immediate Relative</span>
                    </label>
                  </p>
                </div>
                <div className="col s4 m4 l4">
                  <p>
                    <label>
                      <input
                        name="category"
                        id="category"
                        value="Material Financial Relationship"
                        class="with-gap"
                        type="radio"
                        onChange={this.HandleChange}
                        checked={
                          this.state.category ==
                          "Material Financial Relationship"
                        }
                        // onChange={handleForWhom}
                      />
                      <span>Material Financial Relationship</span>
                    </label>
                  </p>
                </div>
              </div>
              <div className=" input-field col s12 m12 l12">
                {this.state.category == "Immediate Relative" ? (
                  <select
                    class="browser-default"
                    id="employee_relative"
                    onChange={this.HandleChange}
                    required
                  >
                    <option value="" disabled selected>
                      Choose your Relative
                    </option>
                    {this.props.userRelative &&
                      this.props.userRelative.Relatives.map((user) =>
                        user.type == "Immediate Relative" ? (
                          <option value={user.pan}>{user.name}</option>
                        ) : null
                      )}
                  </select>
                ) : this.state.category == "Material Financial Relationship" ? (
                  <select
                    class="browser-default"
                    id="employee_relative"
                    onChange={this.HandleChange}
                    required
                  >
                    <option value="" disabled selected>
                      Choose your option
                    </option>
                    {this.props.userRelative &&
                      this.props.userRelative.Relatives.map((user) =>
                        user.type == "Material Financial Relationship" ? (
                          <option value={user.pan}>{user.name}</option>
                        ) : null
                      )}
                  </select>
                ) : null}
              </div>
              <p>
                <label>
                  Folios (or DpId+ClientId)
                  <span style={{ color: "red" }}>*</span>
                </label>
              </p>
              <div className="input-field col s12">
                <select
                  //style={{ backgroundColor: "white" }}
                  className="browser-default"
                  id="folio_id"
                  value={this.state.transaction_folio}
                  onChange={this.HandleChange}
                  required
                >
                  <option value="" disabled selected>
                    Choose your Folio
                  </option>
                  {this.state.category == "Self"
                    ? this.props.folios &&
                      this.props.folios.Folios &&
                      this.props.folios.Folios.map((folio) =>
                        folio.emp_relative_pan == null ? (
                          <option value={folio.id}>{folio.folio}</option>
                        ) : null
                      )
                    : this.state.category == "Immediate Relative"
                    ? this.props.folios &&
                      this.props.folios.Relatives &&
                      this.state.employee_relative
                      ? this.state.folios.length > 0
                        ? this.state.folios.map((folio) =>
                            folio != undefined ? (
                              <option value={folio.id}>{folio.folio}</option>
                            ) : null
                          )
                        : null
                      : null
                    : this.state.category == "Material Financial Relationship"
                    ? this.props.folios &&
                      this.props.folios.Relatives &&
                      this.state.employee_relative
                      ? this.state.folios.length > 0
                        ? this.state.folios.map((folio) =>
                            folio != undefined ? (
                              <option value={folio.id}>{folio.folio}</option>
                            ) : null
                          )
                        : null
                      : null
                    : null}
                </select>
                {/* <label>Transaction Folio</label> */}
              </div>
              <p>
                <label>Security Type</label>
              </p>
              <div className="input-field col s12">
                <select
                  id="security_type"
                  className="browser-default"
                  value={this.state.security_type}
                  onChange={this.HandleChange}
                >
                  {/* <option disabled selected value="">
                    None
                  </option> */}
                  <option selected value="Shares">
                    Shares
                  </option>
                  <option value="Warrants">Warrants</option>
                  <option value="Convertible Debentures">
                    Convertible Debentures
                  </option>
                  <option value="Rights">Rights</option>
                  <option value="Entitlements">Entitlements</option>
                </select>
                {/* <label>Security Type</label> */}
              </div>
              <p>
                <label>Mode</label>
              </p>
              <div className="input-field col s12">
                <select
                  id="mode"
                  className="browser-default"
                  value={this.state.mode}
                  onChange={this.HandleChange}
                  required
                >
                  <option value="Market">Market</option>
                  <option value="Public">Public</option>
                  <option value="Rights">Rights</option>
                  <option value="Preferential Offer">Preferential Offer</option>
                  <option value="Off Market">Off Market</option>
                  <option value="ESOP Request">ESOP Request</option>
                  <option value="Inter-se Transfer">Inter SE Transfer</option>
                </select>
                {/* <label>Mode</label> */}
              </div>
              {/* </form>
            <form action="#"> */}
              <p>
                <label>Request Type</label>
              </p>
              <div className="row">
                <div className="col s6 m6 l6">
                  <p>
                    <label>
                      <input
                        name="group1"
                        id="request_type"
                        class="with-gap"
                        type="radio"
                        value="Sell"
                        onChange={this.HandleChange}
                        checked={this.state.request_type == "Sell"}
                        // onChange={handleForWhom}
                      />
                      <span>Sell</span>
                    </label>
                  </p>
                </div>
                <div className="col s6 m6 l6">
                  <p>
                    <label>
                      <input
                        name="group1"
                        id="request_type"
                        value="Purchase"
                        class="with-gap"
                        type="radio"
                        onChange={this.HandleChange}
                        checked={this.state.request_type == "Purchase"}
                        // onChange={handleForWhom}
                      />
                      <span>Purchase</span>
                    </label>
                  </p>
                </div>
              </div>
            </form>
            {/* <div className="input-field col s12">
              <input
                type="text"
                id="amount"
                className="validate"
                // placeholder="Enter Share"
                // onChange={this.HandleChange}
                // value={state.firstName}
                    onChange={this.HandleChange}
                    required
              />
              <label className="active" for="amount">Enter Amount</label>
            </div> */}
            <div className="input-field col s6 m6 l6">
              <input
                type="date"
                id="date_requested_from"
                value={this.state.date_requested_from}
                className="validate"
                onChange={this.HandleChange}
                min={this.state.today}
                required
              />
              <label>
                Dealing Date from <span style={{ color: "red" }}>*</span>
              </label>
            </div>
            <div className="input-field col s6 m6 l6">
              <input
                type="date"
                id="date_requested_to"
                value={this.state.date_requested_to}
                className="validate"
                onChange={this.HandleChange}
                min={this.state.today}
                required
              />
              <label>
                Dealing Date to <span style={{ color: "red" }}>*</span>
              </label>
            </div>
            <div className="input-field col s6 m6 l6">
              <input
                id="request_quantity"
                type="number"
                value={this.state.request_quantity}
                onChange={this.HandleChange}
                class="validate"
                placeholder="Enter Proposed Quantity"
                required
              />
              <label className="active" for="request_quantity">
                Proposed Quantity <span style={{ color: "red" }}>*</span>
              </label>
            </div>
            <div className="input-field col s6 m6 l6">
              <input
                id="proposed_price"
                type="number"
                onChange={this.HandleChange}
                class="validate"
                value={this.state.proposed_price}
                placeholder="Enter Proposed Price"
                required
              />
              <label className="active" for="proposed_price">
                Proposed Price
              </label>
            </div>
            <div className="input-field col s6 m6 l6">
              <input
                id="market_price"
                type="number"
                onChange={this.HandleChange}
                class="validate"
                value={this.state.market_price}
                placeholder="Enter Market Price"
                required
              />
              <label className="active" for="market_price">
                Market Price
              </label>
            </div>
            {/* <div className="input-field col s6 m6 l6">
              <input
                id="previous_price"
                type="number"
                onChange={this.HandleChange}
                class="validate"
                value={this.state.previous_price}
                // value="SFHG345THE4"
              />
              <label className="active" for="previous_price">
                Previous Price
              </label>
            </div> */}
            <div className="row">
              {this.props.folios != null ? (
                <div className="col s6 m6 l12 right">
                  <button
                    className="btn right btn-button"
                    //data-target="modal1"
                    onClick={this.OnSubmit}
                  >
                    Request
                  </button>
                </div>
              ) : (
                <span
                  className="right"
                  style={{
                    paddingLeft: 142,
                    color: "firebrick",
                    "text-decoration-line": "underline",
                    "font-weight": "bold",
                  }}
                >
                  Please add atleast one folio for making a request
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    user: state.auth.user,
    common: state.common.leftBarItem,
    folios: state.client.folios,
    folioRequestLoading: state.client.folioRequestLoading,
    folioRequestSuccess: state.client.folioRequestSuccess,
    userRelative: state.client.userRelative,
    userRelativeSuccess: state.client.userRelativeSuccess,

    requestTransSuccess: state.client.requestTransSuccess,
    requestTransError: state.client.requestTransError,
    requestTransLoading: state.client.requestTransLoading,
    requestTrans: state.client.requestTrans,
    header: state.client.header,
    requestTransMsg: state.client.requestTransMsg,

    sharePdfSuccess: state.common.sharePdfSuccess,
    sharePdfLoading: state.common.sharePdfLoading,
    sharePdfError: state.common.sharePdfError,
    sharePdfMsg: state.common.sharePdfMsg,

    company: state.common.getCompanyData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    RequestTran: (data, token) => {
      dispatch(requestTran(data, token));
    },
    MakeRequest: (data, token) => {
      dispatch(clientRequest(data, token));
    },
    FetchFolios: (token) => {
      dispatch(fetchFolioList(token));
    },
    UserRelative: (id, token) => {
      dispatch(userRelative(id, token));
    },
    SharePdf: (type, id, pdf, token) => {
      dispatch(sharePdf(type, id, pdf, token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TradingRequest);
