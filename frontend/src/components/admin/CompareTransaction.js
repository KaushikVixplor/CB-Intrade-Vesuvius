import moment from "moment";
import React from "react";
import TableView from "./../layout/TableView";

export const CompareTransaction = ({
  compareList,
  handleSearchWithDate,
  handleUploadDate,
  state,
  compareData,
  previousData,
  onDownload,
}) => {
  console.log("list", compareList, state);
  var field1 = state.startDate.split("-").reverse().join("-");
  var field = state.endDate.split("-").reverse().join("-");
  return (
    <div>
      <div className="row  container">
        <div
          className="row item-header"
          style={{ width: "100%", marginLeft: 20 }}
        >
          <b>Compare Transaction</b>
        </div>
        <div className="col s4 m4 l4">
          <label>Start Date </label>
          <input
            id="start_date"
            type="date"
            defaultValue={field1}
            onChange={handleUploadDate}
          />
          <a className="left">
            <b>Previous Benpos Date:</b>{" "}
            {compareData &&
            compareData.length == 0 &&
            previousData &&
            previousData.length == 0
              ? null
              : state.compStartDate}
          </a>
        </div>
        <div className="col s4 m4 l4">
          <label>End Date</label>
          <input
            id="end_date"
            type="date"
            defaultValue={field}
            onChange={handleUploadDate}
          />
          <a className="left">
            <b>Current Benpos Date:</b>{" "}
            {compareData &&
            compareData.length == 0 &&
            previousData &&
            previousData.length == 0
              ? null
              : state.compEndDate}
          </a>
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
              onDownload(e, "COMPARE");
            }}
            title="Download CP List"
          >
            <i class="material-icons" style={{ color: "black" }}>
              download
            </i>
          </button>
        </div>
      </div>
      <div className="row" style={{ marginTop: "-20px" }}>
        <div className="col s9 m9 l9" style={{ marginTop: "-20px" }}>
          <span
            className="left"
            style={{
              marginTop: 21,
              marginBottom: -18,
              fontWeight: 600,
            }}
          >
            Total Data: {compareList && compareList.length}
          </span>
        </div>
      </div>
      {compareList && compareList.length > 0 ? (
        <TableView
          data={compareList}
          headers={[
            {
              name: "Code",
              key: (d) => {
                return d.Folio
                  ? d.Folio.Relative
                    ? d.Folio.Relative.emp_sub_code
                    : d.Folio.Employee.emp_code
                  : "NA";
              },
            },
            {
              name: "PAN",
              key: (d) => {
                return d.pan;
              },
            },
            {
              name: "Name",
              key: (d) => {
                return d.name;
              },
            },
            {
              name: "Buy/Sell",
              key: (d) => {
                return d.sell;
              },
            },
            {
              name: "Valid",
              key: (d) => {
                return d.valid;
              },
            },
            {
              name: "Curr. Total Share",
              key: (d) => {
                return d.curr;
              },
            },
            {
              name: "Prev. Total Share",
              key: (d) => {
                return d.prev;
              },
            },
            {
              name: "Req. Status",
              key: (d) => {
                return d.reqStatus;
              },
            },
            {
              name: "Appr. Date",
              key: (d) => {
                return d.apprDate;
              },
            },
            {
              name: "Folio-1",
              key: (d) => {
                return d.folio && d.folio[0] ? d.folio[0] : "";
              },
            },
            {
              name: "Folio-2",
              key: (d) => {
                return d.folio && d.folio[1] ? d.folio[1] : "";
              },
            },
            {
              name: "Folio-3",
              key: (d) => {
                return d.folio && d.folio[2] ? d.folio[2] : "";
              },
            },
            {
              name: "Folio-4",
              key: (d) => {
                return d.folio && d.folio[3] ? d.folio[3] : "";
              },
            },
            {
              name: "Folio-5",
              key: (d) => {
                return d.folio && d.folio[4] ? d.folio[4] : "";
              },
            },
          ]}
        ></TableView>
      ) : (
        <span style={{ fontWeight: 600, fontSize: 20 }}>No Data Found</span>
      )}
    </div>
  );
};
