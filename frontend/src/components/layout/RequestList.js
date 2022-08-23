import React from "react";
import moment from "moment";
import TableView from "./TableView";

export default function RequestList({
  list,
  fillNext,
  handleSearch,
  clientRequest,
  onApprove,
  onReject,
  designation,
  ViewRequest,
  onDownload,
}) {
  return (
    <div className="">
      <div className="row container">
        {clientRequest ? null : (
          <div
            className="row item-header"
            style={{ width: "100%", marginLeft: 20 }}
          >
            <b>View Transactions</b>
          </div>
        )}

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
            onChange={handleSearch}
            placeholder="Search with Id & Name"
          />
        </div>
        {/*<div
          className="right"
          //style={{ marginTop: 14, marginLeft: 10 }}
        >
          <button
            className="btn-floating btn-button"
            onClick={onDownload}
            title="Download Transactions List"
          >
            <i class="material-icons" style={{ color: "black" }}>
              download
            </i>
          </button>
        </div>*/}
      </div>
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
            Total Data: {list && list.length}
          </span>
        </div>
      </div>
      {list && list.length > 0 ? (
        <TableView
          data={handleSearch(list, this.props.state.query, ['id', 'category', 'security_type', 'mode', 'request_folio', 'request_type', 'date_requested_to', 'request_quantity', 'proposed_price', 'updatedAt', 'request_status'], 'transaction request')}
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
                return d.Folio && d.Folio.Employee ? d.Folio.Employee.name : "";
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
          view={ViewRequest}
          actions={
            clientRequest
              ? [
                  {
                    name: "Action",
                    key: [
                      { name: "approve", f: onApprove, page: false },
                      { name: "reject", f: onReject, page: false },
                    ],
                  },
                ]
              : [
                  {
                    name: "Action",
                    key: [
                      {
                        name: "fillnext",
                        f: fillNext,
                        modal: "after-transaction-modal",
                      },
                    ],
                  },
                ]
          }
        ></TableView>
      ) : (
        <span style={{ fontWeight: 600, fontSize: 20 }}>No Data Found</span>
      )}
    </div>
  );
}
