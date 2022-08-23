import React from "react";
import moment from "moment";
import "../stylesheet/modals.css";
import "../stylesheet/common.css";

export const ViewRequestModal = ({ user }) => {
  return (
    <div>
      <div id="view-request-modal" class="modal">
        <div class="row modal-content">
          <div className="row modal-title ">
            <span style={{ marginLeft: 26 }}>View Request</span>
          </div>
          <form action="">
            <fieldset>
              <div className="row">
                <div className="col l4">
                  <label>Transaction id: </label> {user && user.id}
                </div>
                <div className="col l4">
                  <label>Employee Name: </label>{" "}
                  {user && user.Folio && user.Folio.Employee
                    ? user.Folio.Employee.name
                    : ""}
                </div>
                <div className="col l4">
                  <label>Category: </label> {user && user.category}
                </div>
                <div className="col l4">
                  <label>Security Type: </label> {user && user.security_type}
                </div>
                <div className="col l4">
                  <label>Mode: </label> {user && user.mode}
                </div>
                <div className="col l4">
                  <label>Folio: </label> {user && user.request_folio}
                </div>
                <div className="col l4">
                  <label>Request Type: </label> {user && user.request_type}
                </div>
                <div className="col l4">
                  <label>Valid Until: </label>{" "}
                  {user && user.date_requested_to
                    ? moment(user.date_requested_to).format("DD-MM-YYYY")
                    : ""}
                </div>
                <div className="col l4">
                  <label>Request Quantity: </label>{" "}
                  {user && user.request_quantity}
                </div>
                <div className="col l4">
                  <label>Proposed Price: </label> {user && user.proposed_price}
                </div>
                <div className="col l4">
                  <label>Timestamp: </label>{" "}
                  {user && user.updatedAt
                    ? moment(user.updatedAt).format("DD-MM-YYYY, h:mm:ss a")
                    : ""}
                </div>
                <div className="col l4">
                  <label>Market Price: </label> {user && user.market_price}
                </div>
              </div>
            </fieldset>
          </form>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves btn-flat">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
