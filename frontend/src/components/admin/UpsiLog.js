import React from "react";
import moment from "moment";
import TableView from "../layout/TableView";
import { getDateString } from "../../utils/helper";

export const UpsiLog = ({
  upsiList,
  handelChange,
  handleSearch,
  handleUploadDate,
  handleSearchWithDate,
  state,
  userDetails,
}) => {
  var field1 = state.startDate.split("-").reverse().join("-");
  var field = state.endDate.split("-").reverse().join("-");
  return (
    <div>
      <div className="row container">
        <div
          className="row item-header"
          style={{ width: "100%", marginLeft: 20 }}
        >
          <b>UPSI Log</b>
        </div>
        <div className="col s5 m5 l5">
          <label>Previous Date </label>
          <input
            id="start_date"
            type="date"
            defaultValue={field1}
            onChange={handleUploadDate}
          />
        </div>
        <div className="col s5 m5 l5">
          <label>Current Date</label>
          <input
            id="end_date"
            type="date"
            defaultValue={field}
            onChange={handleUploadDate}
          />
        </div>
        <div className="col s2 m2 l2 right">
          <button
            className="btn btn-button"
            style={{ "margin-top": 30 }}
            onClick={handleSearchWithDate}
          >
            <i
              className="material-icons right"
              style={{ "margin-top": 1, "margin-right": 12 }}
            >
              search
            </i>
          </button>
        </div>
        <div className="row">
          <div
            className="col s9 m9 l9 input-field search-box"
            style={{ marginTop: "-6px", marginLeft: "13px" }}
          >
            <input
              className="serach-input"
              id="query"
              type="text"
              onChange={handelChange}
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
        </div>
        <div className="col s12 m12 l12">
          <span
            className="left"
            style={{
              marginTop: 21,
              marginBottom: -18,
              fontWeight: 600,
            }}
          >
            Total Data: {upsiList && upsiList.length}
          </span>
        </div>
      </div>
      <div className="clientRequest container">
        {upsiList && upsiList.length > 0 ? (
          <TableView
            data={handleSearch(upsiList, state.query, [
              "createdAt",
              "shared_by",
              "shared_with",
              "subject",
              "information",
            ]).sort((a, b) =>
              new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1
            )}
            headers={[
              {
                name: "Sl. No.",
                key: (d) => {
                  return d + 1;
                },
              },
              {
                name: "Timestamp",
                key: (d) => {
                  return getDateString(new Date(d.createdAt), true);
                },
              },
              {
                name: "Sender(PAN)",
                key: (d) => {
                  return d.shared_by;
                },
              },
              {
                name: "Receiver(PAN)",
                key: (d) => {
                  return userDetails?.is_compliance ||
                    d.shared_by.includes(userDetails?.pan)
                    ? d.shared_with
                    : userDetails?.name + "(" + userDetails?.pan + ")";
                },
              },
              {
                name: "Information Shared",
                key: (d) => {
                  return d.subject;
                },
              },
              // {
              //   name: "Information",
              //   key: (d) => {
              //     return d.information
              //   }
              // },
            ]}
          />
        ) : (
          <span style={{ fontWeight: 600, fontSize: 20 }}>No Data Found</span>
        )}
      </div>
    </div>
  );
};
