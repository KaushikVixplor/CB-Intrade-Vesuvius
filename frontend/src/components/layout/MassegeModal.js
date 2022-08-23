import React from "react";
import moment from "moment";
import { TableView } from "./TableView";

export const MassegeModal = (props) => {
  return (
    <div
      id="massege-modal"
      className="modal modal-fixed-footer"
      //style={{ height: "7%" }}
    >
      <div class="row modal-content">
        <div className="row modal-title center" style={{ paddingTop: 15 }}>
          <span>Go to comparison page?</span>
        </div>
        <div className="clientRequest container">
          {props.datalist && props.datalist.length > 0 ? (
            <TableView
              data={props.datalist}
              headers={[
                {
                  name: "Name",
                  key: (d) => {
                    return d.name;
                  },
                },
                {
                  name: "PAN",
                  key: (d) => {
                    return d.pan;
                  },
                },
                {
                  name: "Email",
                  key: (d) => {
                    return d.email;
                  },
                },
                {
                  name: "Curr. Benpos Date",
                  key: (d) => {
                    return d.current_benpos_date
                      ? moment(d.current_benpos_date).format("DD-MM-YYYY")
                      : "";
                  },
                },
                {
                  name: "Curr. Total Share",
                  key: (d) => {
                    return d.total_share;
                  },
                },
                {
                  name: "Prev. Total Share",
                  key: (d) => {
                    return d.previous_total_share;
                  },
                },
                {
                  name: "Valid",
                  key: (d) => {
                    return d.is_valid ? "Valid" : "Invalid";
                  },
                },
                {
                  name: "Share Change",
                  key: (d) => {
                    return d.is_share_changed == false ? "false" : "true";
                  },
                },
                {
                  name: "Transaction Folio",
                  key: (d) => {
                    return d.transaction_folio;
                  },
                },
              ]}
            ></TableView>
          ) : (
            <span style={{ fontWeight: 600, fontSize: 20 }}>No Data Found</span>
          )}
        </div>
      </div>
      <div className="modal-footer" style={{ textAlign: "center" }}>
        <button
          className="waves-effect waves btn-flat"
          onClick={props.handleGo}
        >
          Yes
        </button>
        <button className="modal-close waves-effect waves btn-flat">No</button>
      </div>
    </div>
  );
};
