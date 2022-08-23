import React from "react";
import moment from "moment";
import TableView from "../layout/TableView";

export const ActivityLog = ({
  log,
  handelChange,
  handleSearch,
  handleUploadDate,
  handleSearchWithDate,
  state,
  onDownload,
}) => {
  var field1 = state.startDate.split("-").reverse().join("-");
  var field = state.endDate.split("-").reverse().join("-");
  return (
    <div className="">
      <div className="row container">
        <div
          className="row item-header"
          style={{ width: "100%", marginLeft: 20 }}
        >
          <b>Activity Log</b>
        </div>
        <div className="col s4 m4 l4">
          <label>Previous Date </label>
          <input
            id="start_date"
            type="date"
            defaultValue={field1}
            onChange={handleUploadDate}
          />
        </div>
        <div className="col s4 m4 l4">
          <label>Current Date</label>
          <input
            id="end_date"
            type="date"
            defaultValue={field}
            onChange={handleUploadDate}
          />
        </div>
        <div className="col s1 m1 l1" style={{ marginLeft: "4%" }}>
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
        <div
          className="col s1 m1 l1"
          style={{ marginTop: "3%", marginLeft: "12%" }}
        >
          <button
            className="btn-floating btn-button"
            onClick={(e, type) => {
              onDownload(e, "ACTIVITY");
            }}
            title="Download Activity Log"
          >
            <i class="material-icons" style={{ color: "black" }}>
              download
            </i>
          </button>
        </div>
      </div>
      <div className="row">
        <div
          className="col s9 m9 l9 input-field search-box"
          style={{ marginTop: "-6px" }}
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
      <div className="row">
        <div className="col s9 m9 l9">
          <span
            className="left"
            style={{
              marginTop: 21,
              marginBottom: -18,
              fontWeight: 600,
            }}
          >
            Total Data: {log && log.length}
          </span>
        </div>
      </div>
      {log && log.length > 0 ? (
        <TableView
          data={handleSearch(log, state.query, ['createdAt', 'activity', 'done_by', 'done_for', 'status'])}
          headers={[
            {
              name: "Sl. No.",
              key: (d) => {
                return d + 1;
              },
            },
            {
              name: "Timestamp",
              key: (list) => {
                return list.createdAt
                  ? moment(list.createdAt).format("DD-MM-YYYY, h:mm:ss a")
                  : "";
              },
            },
            {
              name: "Activity",
              key: (d) => {
                return d.activity;
              },
            },
            {
              name: "By",
              key: (d) => {
                return d.done_by;
              },
            },
            {
              name: "For",
              key: (d) => {
                return d.done_for;
              },
            },
            {
              name: "Status",
              key: (d) => {
                return d.status;
              },
            },
          ]}
        />
      ) : (
        <span style={{ fontWeight: 600, fontSize: 20 }}>No Data Found</span>
      )}
    </div>
  );
};
