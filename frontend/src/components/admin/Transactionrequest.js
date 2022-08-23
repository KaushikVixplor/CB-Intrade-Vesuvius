import React, { Component } from "react";
import { connect } from "react-redux";
import ClientRequest from "./ClientRequest";
import PostTransaction from "./PostTransaction";
import { pdfDownload } from "../../store/action/CommonAction";
import AllTransaction from "./AllTransaction";
import swal from "sweetalert";

export class Transactionrequest extends Component {
  state = { filterReport: null };
  componentDidUpdate() {
    if (this.state.pdfDownloadFlag && this.props.pdfDownloadError) {
      swal("OOPS!", "Failed to download pdf", "error");
      this.setState({ pdfDownloadFlag: false });
    }
  }
  onDownload = (e) => {
    e.preventDefault();
    console.log("download");
    this.setState({ pdfDownloadFlag: true });
    this.props.PdfDownload(
      null,
      null,
      null,
      this.state.filterReport,
      this.props.user.accessToken
    );
  };
  handleFilter = (e) => {
    this.setState({ filterReport: e.target.value });
  };

  handelChange=(e)=>{
    this.setState({[e.target.id]: e.target.value})
  }

  render() {
    return (
      <div>
        <div className="row container">
          <div
            className="row item-header"
            style={{ width: "100%", marginLeft: 20 }}
          >
            <b>Transaction Request</b>
          </div>
          <div className="col s4 m4 l4" style={{ marginTop: -16 }}>
            <label className="left">Choose Request Type</label>
            <select class="browser-default" onChange={this.handleFilter}>
              <option value="" disabled selected>
                Choose your option
              </option>
              <option value="all">All</option>
              <option value="PRE_TRANSACTION">Pending</option>
              <option value="POST_TRANSACTION">Complete</option>
            </select>
          </div>
          <div
            className="col s6 m6 l6 input-field search-box"
            style={{ marginTop: "10px" }}
          >
            <input
              className="serach-input"
              id="query"
              type="text"
              onChange={this.handelChange}
              placeholder="Search your word"
            />
          </div>
          <div className="col s1 m1 l1">
            <i
              className="material-icons right"
              style={{ "margin-top": 8, "margin-right": 51 }}
            >
              search
            </i>
          </div>
          <div className="col s1 m1 l1 ">
            <div
              className="left"
              style={{ marginTop: "2%", marginLeft: "38%" }}
            >
              <button
                className="btn-floating btn-button"
                onClick={this.onDownload}
                title="Download Report"
                disabled={this.state.filterReport == null ? true : false}
              >
                <i class="material-icons" style={{ color: "black" }}>
                  download
                </i>
              </button>
            </div>
          </div>
        </div>
        <div>
          {this.state.filterReport == "PRE_TRANSACTION" ? (
            <ClientRequest state={this.state}/>
          ) : this.state.filterReport == "POST_TRANSACTION" ? (
            <PostTransaction state={this.state}/>
          ) : this.state.filterReport == "all" ? (
            <AllTransaction state={this.state}/>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log("here", state);
  return {
    user: state.auth.user,
    requests: state.common.requests,

    pdfDownloadError: state.common.pdfDownloadError,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    PdfDownload: (startDate, endDate, request_status, type, token) => {
      dispatch(pdfDownload(startDate, endDate, request_status, type, token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactionrequest);
