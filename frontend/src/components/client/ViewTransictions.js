import React, { Component } from "react";
import { connect } from "react-redux";
import TopNav from "../layout/TopNav";
import { Redirect } from "react-router";
import RequestList from "../layout/RequestList";
import { getRequestList, sharePdf } from "../../store/action/CommonAction";
import AfterTransactionModal from "../layout/AfterTransactionModal";
import {
  resetUpdateStat,
  updateRequest,
  requestFolioList,
} from "../../store/action/ClientAction";
import M from "materialize-css";
import moment from "moment";

import swal from "sweetalert";
import { DisclosureFormModal } from "../layout/DisclosureFormModal";
import { ViewRequestModal } from "../admin/ViewRequestModal";
import { pdfDownload } from "../../store/action/CommonAction";

export class ViewTransictions extends Component {
  state = {
    selReq: null,
    name: "",
    request_type: "",
    security_type: "",
    pan: "",
    req_id: "",
    request_folio: "",
    transaction_date: "",
    stock_exchange: "",
    transaction_price: "",
    transaction_date: "",
    request_quantity: "",

    query: "",
    onRequestFlag: false,
    type: "",
    sharePdf: false,
    pdfDownloadFlag: false,
  };

  componentDidMount = () => {
    var elem = document.querySelectorAll(".tooltipped");
    var instance = M.Tooltip.init(elem, {});
    // console.log(elem, instance);
    if (this.props.user) {
      var today = this.getDateValue()
      this.setState({ today: today });
      if (this.props.userData.userDetails.is_compliance)
        this.props.GetRequestList(null, null, this.props.user.accessToken);
      else
        this.props.GetRequestList(
          null,
          this.props.userData.userDetails.pan,
          this.props.user.accessToken
        );
    }
  };

  componentDidUpdate = () => {
    var elem = document.querySelectorAll(".tooltipped");
    var instance = M.Tooltip.init(elem, {});
    // console.log(elem, instance);
    // if (instance.isHovered) {
    //   instance.open();
    // }
    if (this.props.updateSuccess) {
      var elem = document.getElementById("after-transaction-modal");
      if (elem) {
        var instance = M.Modal.getInstance(elem);
        if (instance.isOpen) {
          instance.close();
          this.props.GetRequestList(
            null,
            this.props.userData.userDetails.pan,
            this.props.user.accessToken
          );
          this.props.ResetUpdateStat();
        }
      }
    }
    if (this.state.onRequestFlag && !this.props.requestUpdateLoading) {
      if (this.props.requestUpdateSuccess) {
        swal("Success", "SuccessFul", "success");
        var modal = document.getElementById("download-modal");
        var instance = M.Modal.getInstance(modal);
        instance.open();
        this.setState({ type: "success", onRequestFlag: false });
      } else if (this.props.requestUpdateError) {
        swal("OOPS!", this.props.requestUpdateMsg, "error");
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
    if (this.state.pdfDownloadFlag && this.props.pdfDownloadError) {
      swal("OOPS!", "Failed to download pdf", "error");
      this.setState({ pdfDownloadFlag: false });
    }
  };

  FillNext = (id) => {
    // console.log("id", id);
    this.setState({
      selReq: id,
      name: this.props.requests[id].Folio
        ? this.props.requests[id].Folio.Employee.name
        : "",
      req_id: this.props.requests[id].id,
      request_type: this.props.requests[id].request_type,
      security_type: this.props.requests[id].security_type,
      pan: this.props.requests[id].pan,
      request_folio: "",
      transaction_date: "",
      stock_exchange: "",
      transaction_price: 0,
      request_quantity: 0,
    });
    this.props.RequestFolioList(
      this.props.requests[id].id,
      this.props.user.accessToken
    );
  };

  HandleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  OnSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state)
    if (new Date(this.props.company.window_close_from).getTime() <= new Date(this.state.transaction_date).getTime() && new Date(this.state.transaction_date).getTime() <= new Date(this.props.company.window_close_to).getTime()) {
      swal('Info', 'Trading window is currently closed until ' + this.getDate(this.props.company.window_close_to) + '!!', 'info')
    } else {
      this.setState({ onRequestFlag: true });
      this.props.UpdateRequest(
        {
          transaction_date: moment(this.state.transaction_date).format(
            "DD/MM/YYYY"
          ),
          transaction_price: this.state.transaction_price,
          transaction_quantity: this.state.transaction_quantity,
          trans_folio: this.state.request_folio,
          stock_exchange: this.state.stock_exchange,
          request_status: "Completed",
        },
        this.props.requests[this.state.selReq].id,
        this.props.user.accessToken
      );
    }
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

  ViewRequest = (e) => {
    var id = e.target.id;
    var request = this.props.requests.find((o) => o.id == id);
    this.setState({ request: request });
    var modal = document.getElementById("view-request-modal");
    var instance = M.Modal.getInstance(modal);
    instance.open();
  };
  onSharePdf = (e) => {
    this.setState({ sharePdf: true });
    var type = "Transaction_details_submit";
    this.props.SharePdf(
      type,
      this.props.requests[this.state.selReq].id,
      this.props.user.accessToken
    );
  };
  onDownload = (e) => {
    e.preventDefault();
    this.setState({ pdfDownloadFlag: true });
    this.props.PdfDownload(
      null,
      null,
      this.props.userData.userDetails.pan,
      "CLIENT_TRANSACTION",
      this.props.user.accessToken
    );
  };
  render() {
    // console.log("loc state", this.state);
    // console.log("loc props", this.props);
    if (!this.props.user) return <Redirect to="/login" />;
    const query = this.state.query;
    const filteredUser = this.props.requests
      ? query
        ? this.props.requests.filter((user) => {
            return (
              user.id == query ||
              user.request_status.toLowerCase().includes(query.toLowerCase()) ||
              user.Folio.Employee.name
                .toLowerCase()
                .includes(query.toLowerCase())
            );
          })
        : this.props.requests
      : [];
    return (
      <div>
        <TopNav />

        <DisclosureFormModal
          file={this.props.requestUpdate}
          share={this.onSharePdf}
        />
        <ViewRequestModal user={this.state.request} />
        <AfterTransactionModal
          OnSubmit={this.OnSubmit}
          HandleChange={this.HandleChange}
          state={this.state}
          requestFolios={this.props.requestFolios}
          loading={this.props.updateLoading}
          onDownload={this.onDownload}
        />
        <RequestList
          fillNext={this.FillNext}
          ViewRequest={this.ViewRequest}
          designation={this.props.user.designation}
          list={filteredUser}
          handleSearch={this.HandleChange}
          onDownload={this.onDownload}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // console.error("csdc:: ",state.common.requests)
  return {
    user: state.auth.user,
    userData: state.auth.data,
    common: state.common.leftBarItem,
    requests: state.common.requests,
    updateLoading: state.client.requestUpdateLoading,
    updateSuccess: state.client.requestUpdateSuccess,
    updateError: state.client.requestUpdateError,
    requestFolios: state.client.requestFolios,

    requestUpdate: state.client.requestUpdate,
    requestUpdateSuccess: state.client.requestUpdateSuccess,
    requestUpdateError: state.client.requestUpdateError,
    requestUpdateLoading: state.client.requestUpdateLoading,
    requestUpdateMsg: state.client.requestUpdateMsg,

    sharePdfSuccess: state.common.sharePdfSuccess,
    sharePdfLoading: state.common.sharePdfLoading,
    sharePdfError: state.common.sharePdfError,
    sharePdfMsg: state.common.sharePdfMsg,

    pdfDownloadError: state.common.pdfDownloadError,

    company: state.common.getCompanyData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GetRequestList: (status, pan, token) => {
      dispatch(getRequestList(status, pan, token));
    },
    UpdateRequest: (body, id, token) => {
      dispatch(updateRequest(body, id, token));
    },
    ResetUpdateStat: () => {
      dispatch(resetUpdateStat());
    },
    RequestFolioList: (id, token) => {
      dispatch(requestFolioList(id, token));
    },
    SharePdf: (type, id, pdf, token) => {
      dispatch(sharePdf(type, id, pdf, token));
    },
    PdfDownload: (startDate, endDate, request_status, type, token) => {
      dispatch(pdfDownload(startDate, endDate, request_status, type, token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTransictions);
