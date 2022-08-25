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
  compareTransaction,
  prev_benpos_date,
  current_benpos_date
}) => {
  console.log("list", compareList, state);
  var field1 = state.startDate.split("-").reverse().join("-");
  var field = state.endDate.split("-").reverse().join("-");
  const getDate = (date) => {
    var d = new Date(date);
    var day = d.getDate();
    if (day.toString().length == 1) day = '0' + day
    var month = d.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month
    var Year = d.getFullYear();
    return day + "-" + month + "-" + Year;
  }
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
            {prev_benpos_date ? getDate(prev_benpos_date) : null}
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
            {current_benpos_date ? getDate(current_benpos_date) : null}
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
            Total Data: {compareTransaction && compareTransaction.length}
          </span>
        </div>
      </div>
      {/* {compareList && compareList.length > 0 ? (
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
      )} */}
      {compareTransaction && compareTransaction.length > 0 ?
        <div className="tableView">
          <table className="responsive-table highlight custom-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>PAN</th>
                <th>Name</th>
                <th>Buy/Sell</th>
                <th>Valid</th>
                <th>Curr. Total Share</th>
                <th>Prev. Total Share</th>
                <th>Req. Status</th>
                <th>Appr. Date</th>
                <th>Folio-1</th>
                <th>Folio-2</th>
                <th>Folio-3</th>
                <th>Folio-4</th>
                <th>Folio-5</th>
              </tr>
            </thead>
            <tbody>
              {compareTransaction.map((d, ind) =>
                <tr key={ind}>
                  <td>
                    {d.code}
                  </td>
                  <td>{d.pan}</td>
                  <td>{d.name}</td>
                  <td>{d.sell}</td>
                  <td>{d.valid}</td>
                  <td>{d.curr}</td>
                  <td>{d.prev}</td>
                  <td>{d.reqStatus}</td>
                  <td>{d.apprDate}</td>
                  <td>{d.folio && d.folio[0] ? d.folio[0] : 'NA'}</td>
                  <td>{d.folio && d.folio[1] ? d.folio[1] : 'NA'}</td>
                  <td>{d.folio && d.folio[2] ? d.folio[2] : 'NA'}</td>
                  <td>{d.folio && d.folio[3] ? d.folio[3] : 'NA'}</td>
                  <td>{d.folio && d.folio[4] ? d.folio[4] : 'NA'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div> 
      :
      <span style={{ fontWeight: 600, fontSize: 20 }}>No Data Found</span>
      }
    </div>
  );
};
