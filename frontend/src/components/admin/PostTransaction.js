import React, { Component } from "react";
import { connect } from "react-redux";
import { getRequestList } from "../../store/action/CommonAction";
import { postRequestAction } from "../../store/action/HodAction";
import M from "materialize-css";
import moment from "moment";
import { ViewRequestModal } from "./ViewRequestModal";
import swal from "sweetalert";
import { pdfDownload } from "../../store/action/CommonAction";
import TableView from "../layout/TableView";

export class PostTransaction extends Component {
  state = {
    request: [],
    query: "",
    pdfDownloadFlag: false,
  };
  componentDidMount() {
    M.AutoInit();
    if (this.props.user) {
      this.props.PendingRequest("Completed", null, this.props.user.accessToken);
    }
  }
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  ViewRequest = (e) => {
    var id = e.target.id;
    var request = this.props.requests.find((o) => o.id == id);
    this.setState({ request: request });
    var modal = document.getElementById("view-request-modal");
    var instance = M.Modal.getInstance(modal);
    // console.log(modal, instance);
    instance.open();
  };
  handleDownload = (id) => {
    this.props.PostRequestAction(id, this.props.user.accessToken);
  };
  componentDidUpdate = () => {
    if (this.state.pdfDownloadFlag && this.props.pdfDownloadError) {
      swal("OOPS!", "Failed to download pdf", "error");
      this.setState({ pdfDownloadFlag: false });
    }
  };
  onDownload = (e) => {
    e.preventDefault();
    this.setState({ pdfDownloadFlag: true });
    this.props.PdfDownload(
      null,
      null,
      null,
      "POST_TRANSACTION",
      this.props.user.accessToken
    );
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

  render() {
    // console.log(this.state);
    // console.log(this.props);
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
      <div className="">
        <ViewRequestModal user={this.state.request} />
        <div className="row container">
          <div className="col s1 m1 l1 right">
            <i
              className="material-icons right"
              style={{ "margin-top": 8, "margin-right": 51 }}
            >
              search
            </i>
          </div>
          <div
            className="col s11 m11 l11 input-field search-box"
            style={{ marginTop: "-6px" }}
          >
            <input
              className="serach-input"
              id="query"
              type="text"
              onChange={this.handleChange}
              placeholder="Search with Id & Name"
            />
          </div>
        </div>
        {/*<div className="row">
          <div
          className="right"
          //style={{ marginTop: 14, marginLeft: 10 }}
          >
            <button
              className="btn-floating btn-button"
              onClick={this.onDownload}
              title="Download CP List"
            >
              <i class="material-icons" style={{ color: "black" }}>
                download
              </i>
            </button>
          </div>
    </div>
        <form action="#" style={{ height: "50vh", overflow: "auto" }}>
          <div
            className="row list-item-header"
            style={{ width: "223%", marginLeft: 20 }}
          >
            <div className="col l1">
              <b>Id</b>
            </div>
            <div className="col l1">
              <b>Name</b>
            </div>
            <div className="col l1">
              <b>Category</b>
            </div>
            <div className="col l1">
              <b>Security Type</b>
            </div>
            <div className="col l1">
              <b>Mode</b>
            </div>
            <div className="col l1">
              <b>Tr. Folio</b>
            </div>
            <div className="col l1">
              <b>Request type</b>
            </div>
            <div className="col l1">
              <b>Date to</b>
            </div>
            <div className="col l1">
              <b>Proposed quantity</b>
            </div>
            <div className="col l1">
              <b>Proposed price</b>
            </div>
            <div className="col l1">
              <b>Timestamp</b>
            </div>
            <div className="col l1">
              <b>Action</b>
            </div>
          </div>
          <div className="row" style={{ marginLeft: 20, height: "60vh" }}>
            {this.props.requests &&
              filteredUser.map((user, ind) => (
                <div
                  className="row list-item"
                  style={{ width: "223%", marginLeft: 10 }}
                >
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.id}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.Folio && user.Folio.Employee
                      ? user.Folio.Employee.name
                      : ""}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.category}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.security_type}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.mode}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.request_folio}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.request_type}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.date_requested_to
                      ? moment(user.date_requested_to).format("DD-MM-YYYY")
                      : ""}
                  </div>

                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.request_quantity}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.proposed_price}
                  </div>
                  <div
                    className="col l1 btn-flat"
                    id={user.id}
                    onClick={this.ViewRequest}
                  >
                    {user.updatedAt
                      ? moment(user.updatedAt).format("DD-MM-YYYY, h:mm:ss a")
                      : ""}
                  </div>
                  <div className="col l1">
                    <a
                      class="btn-floating btn-small waves-effect waves-light"
                      onClick={() => this.handleDownload(user.id)}
                    >
                      <i class="material-icons">vertical_align_bottom</i>
                    </a>
                  </div>
                </div>
              ))}
          </div>
                    </form>*/}
        <div className="row">
          <div className="col s9 m9 l9">
            <span
              className="left"
              style={{
                marginTop: -19,
                marginBottom: -18,
                fontWeight: 600,
              }}
            >
              Total Data:{" "}
              {this.props.requests && filteredUser ? filteredUser.length : 0}
            </span>
          </div>
        </div>
        {this.props.requests && filteredUser.length > 0 ? (
          <TableView
            data={this.handleSearch(filteredUser, this.props.state.query, ['id', 'category', 'security_type', 'mode', 'request_folio', 'request_type', 'date_requested_to', 'request_quantity', 'proposed_price', 'updatedAt', 'request_status'], 'transaction request')}
            headers={[
              {
                name: "Id",
                key: (d) => {
                  return d.id;
                },
              },
              {
                name: "Name",
                key: (d) => {
                  return d.Folio && d.Folio.Employee
                    ? d.Folio.Employee.name
                    : "";
                },
              },
              {
                name: "Category",
                key: (d) => {
                  return d.category;
                },
              },
              {
                name: "Security",
                key: (d) => {
                  return d.security_type;
                },
              },
              {
                name: "Mode",
                key: (d) => {
                  return d.mode;
                },
              },
              {
                name: "Tr. Folio",
                key: (d) => {
                  return d.request_folio;
                },
              },
              {
                name: "Req. Type",
                key: (d) => {
                  return d.request_type;
                },
              },
              {
                name: "Valid Until",
                key: (d) => {
                  return d.date_requested_to
                    ? moment(d.date_requested_to).format("DD-MM-YYYY")
                    : "";
                },
              },
              {
                name: "Proposed Quantity",
                key: (d) => {
                  return d.request_quantity;
                },
              },
              {
                name: "Proposed Price",
                key: (d) => {
                  return d.proposed_price;
                },
              },
              {
                name: "Timestamp",
                key: (d) => {
                  return d.updatedAt
                    ? moment(d.updatedAt).format("DD-MM-YYYY, h:mm:ss a")
                    : "";
                },
              },
              {
                name: "Status",
                key: (d) => {
                  return d.request_status;
                },
              },
            ]}
            view={this.ViewRequest}
            actions={[
              {
                name: "Action",
                key: [
                  {
                    name: "download",
                    f: (id) => {
                      this.handleDownload(id);
                    },
                  },
                ],
              },
            ]}
          ></TableView>
        ) : (
          <span style={{ fontWeight: 600, fontSize: 20 }}>No Data Found</span>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log("here", state);
  return {
    user: state.auth.user,
    requests: state.common.requests,

    pdfDownloadError: state.common.pdfDownloadError,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    PendingRequest: (status, pan, token) => {
      dispatch(getRequestList(status, pan, token));
    },
    PostRequestAction: (id, token) => {
      dispatch(postRequestAction(id, token));
    },
    PdfDownload: (startDate, endDate, request_status, type, token) => {
      dispatch(pdfDownload(startDate, endDate, request_status, type, token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostTransaction);
