import React, { Component } from "react";
import { connect } from "react-redux";
import M from "materialize-css";
import TopNav from "../layout/TopNav";
import RequestList from "../layout/RequestList";
import { dispatch } from "d3-dispatch";
import { requestAction } from "../../store/action/HodAction";
import { getRequestList, sharePdf } from "../../store/action/CommonAction";

import { DisclosureFormModal } from "../layout/DisclosureFormModal";
import swal from "sweetalert";
import { ViewRequestModal } from "./ViewRequestModal";
import { pdfDownload } from "../../store/action/CommonAction";
import { RequestRejectReasonModal } from "../layout/RequestRejectReasonModal";

export class ClientRequest extends Component {
  state = {
    requestFlag: true,
    onRequestFlag: false,
    type: "",
    query: "",
    id: "",
    status: "",
    sharePdf: false,
    request: [],
    pdfDownloadFlag: false,
  };
  componentDidMount = () => {
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems, {
      preventScrolling: false,
    });
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems, {});
    var elem = document.querySelectorAll(".tooltipped");
    var instance = M.Tooltip.init(elem, {});
    if (this.props.user) {
      this.setState({ requestFlag: true });
      this.props.PendingRequest("Pending", null, this.props.user.accessToken);
    }
  };
  componentDidUpdate() {
    var elem = document.querySelectorAll(".tooltipped");
    var instance = M.Tooltip.init(elem, {});
    if (
      !this.props.requestActionLoading &&
      this.state.requestFlag &&
      this.props.requestActionSuccess
    ) {
      this.props.PendingRequest("Pending", null, this.props.user.accessToken);
      this.setState({ requestFlag: false });
    }
    if (this.state.onRequestFlag && !this.props.requestActionLoading) {
      if (this.props.requestActionSuccess) {
        swal("Success", "SuccessFul", "success");
        var modal = document.getElementById("download-modal");
        var instance = M.Modal.getInstance(modal);
        instance.open();
        this.setState({ type: "success", onRequestFlag: false });
      } else if (this.props.requestActionError) {
        swal("OOPS!", 'Error to update request', "error");
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
  }
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSearch = (data, query, keys, type = null) => {
    // console.error(data)
    if (query) {
      var op = []
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < keys.length; j++) {
          if (data[i][keys[j]] && data[i][keys[j]].toString().toLowerCase().includes(query.toLowerCase()) && !op.find(f => f.id == data[i].id)) {
            op.push(data[i])
          }
          if (type == 'transaction request') {
            if (data[i][keys[j]] && data[i].Folio.Employee.name.toString().toLowerCase().includes(query.toLowerCase()) && !op.find(f => f.id == data[i].id)) {
              op.push(data[i])
            }
          }
        }
      }
      return op
    } else {
      return data
    }
  }

  OnAppprove = (e) => {
    // console.log("line number 67 id", e.target.id);
    this.setState({
      id: e.target.id,
      status: "Approved",
      onRequestFlag: true,
      requestFlag: true,
    });
    this.props.RequestAction(
      "Approved",
      e.target.id,
      this.props.user.accessToken
    );
  };

  OnReject = (e) => {
    this.setState({
      // id: e.target.id,
      status: "Rejected",
      onRequestFlag: true,
      requestFlag: true,
    });
    this.props.RequestAction(
      "Rejected",
      this.state.id,
      this.props.user.accessToken,
      {reason: this.state.reason},
    );
    // this.props.PendingRequest("Pending", null, this.props.user.accessToken);
  };

  onclickReject=(e, d)=>{
    this.setState({id: d.id})
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
    if (this.state.status == "Approved") {
      var type = "Transaction_request_appoved";
    } else if (this.state.status == "Rejected") {
      var type = "Transaction_request_rejected";
    }
    this.props.SharePdf(type, this.state.id, this.props.user.accessToken);
  };

  onDownload = (e) => {
    e.preventDefault();
    this.setState({ pdfDownloadFlag: true });
    this.props.PdfDownload(
      null,
      null,
      null,
      "PRE_TRANSACTION",
      this.props.user.accessToken
    );
  };
  render() {
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
        <ViewRequestModal user={this.state.request} />
        <RequestRejectReasonModal
          handleChange={this.handleChange}
          OnReject={this.OnReject}
        />
        <DisclosureFormModal
          file={this.props.request}
          share={this.onSharePdf}
        />
        <RequestList
          onApprove={this.OnAppprove}
          onReject={this.onclickReject}
          ViewRequest={this.ViewRequest}
          // list={this.state.requestList}
          list={filteredUser}
          handleChange={this.handleChange}
          clientRequest={true}
          onDownload={this.onDownload}
          handleSearch={this.handleSearch}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log("here", state);
  return {
    user: state.auth.user,
    requests: state.common.requests,
    requestFetchLoading: state.common.requestFetchLoading,
    requestFetchSuccess: state.common.requestFetchSuccess,

    request: state.Hod.request,
    requestActionSuccess: state.Hod.requestActionSuccess,
    requestActionError: state.Hod.requestActionError,
    requestActionLoading: state.Hod.requestActionLoading,
    requestMessage: state.Hod.requestMessage,

    sharePdfSuccess: state.common.sharePdfSuccess,
    sharePdfLoading: state.common.sharePdfLoading,
    sharePdfError: state.common.sharePdfError,
    sharePdfMsg: state.common.sharePdfMsg,

    pdfDownloadError: state.common.pdfDownloadError,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    RequestAction: (status, id, token, body) => {
      dispatch(requestAction(status, id, token, body));
    },
    PendingRequest: (status, pan, token) => {
      dispatch(getRequestList(status, pan, token));
    },
    SharePdf: (type, id, pdf, token) => {
      dispatch(sharePdf(type, id, pdf, token));
    },
    PdfDownload: (startDate, endDate, request_status, type, token) => {
      dispatch(pdfDownload(startDate, endDate, request_status, type, token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientRequest);
