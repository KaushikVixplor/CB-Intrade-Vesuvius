import React from "react";
import moment from "moment";
import TableView from "./../layout/TableView";

export const ViolationReport = ({
  violationList,
  state,
  handleSearchWithDate,
  handleUploadDate,
  onDownload,
  violationTransaction
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
          <b>Violation Report</b>
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
              onDownload(e, "VIOLATION_REPORT");
            }}
            title="Download CP List"
          >
            <i class="material-icons" style={{ color: "black" }}>
              download
            </i>
          </button>
        </div>
      </div>
      {/* <div className="clientRequest container">
        <form action="#" style={{ height: "50vh", overflow: "auto" }}>
          <div
            className="row list-item-header"
            style={{ width: "200%", marginLeft: 20 }}
          >
            <div className="col s2 m2 l1">
              <b>Code</b>
            </div>

            <div className="col s2 m2 l1">
              <b>PAN</b>
            </div>
            <div className="col s2 m2 l1">
              <b>Name</b>
            </div>
            <div className="col s2 m2 l1">
              <b>Buy/Sell</b>
            </div>
            <div className="col s2 m2 l1">
              <b>BENPOS Date</b>
            </div>
            <div className="col s2 m2 l1">
              <b>Curr. Total Share</b>
            </div>
            <div className="col s2 m2 l1">
              <b>Prev. Total Share</b>
            </div>
            <div className="col s2 m2 l1">
              <b>Requ. Status</b>
            </div>
            <div className="col s2 m2 l1">
              <b>Appr. Date</b>
            </div>
            <div
              className="col s2 m2 l3 folio-list"
              style={{
                display: "flex",
                "background-color": "#b9e4ed",
                width: "37%",
                "margin-left": "74%",
                "margin-top": "-31px",
                "padding-top": 10,
                "justify-content": "space-between",
              }}
            >
              <div className="">
                <b>Folio1</b>
              </div>
              <div className="">
                <b>Folio2</b>
              </div>
              <div className="">
                <b>Folio3</b>
              </div>
              <div className="" style={{ height: 35 }}>
                <b>Folio4</b>
              </div>
              <div className="">
                <b>Folio5</b>
              </div>
            </div>
          </div>
          <div className="row" style={{ height: "45vh", marginLeft: 20 }}>
            {violationList &&
              violationList.map((user) =>
                user.is_valid == false ? (
                  <div className="row list-item" style={{ width: "200%" }}>
                    {user.Folio ? (
                      user.Folio.Relative ? (
                        <div className="col s2 m2 l1">
                          {user.Folio.Relative.emp_sub_code}
                        </div>
                      ) : (
                        <div className="col s2 m2 l1">
                          {user.Folio.Employee.emp_code}
                        </div>
                      )
                    ) : (
                      <div className="col s2 m2 l1">No data</div>
                    )}
                    <div className="col s2 m2 l1">{user.pan}</div>
                    {user.Folio ? (
                      user.Folio.Relative ? (
                        <div className="col s2 m2 l1">
                          {user.Folio.Relative.name}
                        </div>
                      ) : (
                        <div className="col s2 m2 l1">
                          {user.Folio.Employee.name}
                        </div>
                      )
                    ) : (
                      <div className="col s2 m2 l1">No data</div>
                    )}
                    <div
                      className="col s2 m2 l1"
                      style={
                        user.total_share - user.previous_total_share >= 0
                          ? { color: "limegreen" }
                          : { color: "red" }
                      }
                    >
                      {user.total_share - user.previous_total_share}
                    </div>

                    <div className="col s2 m2 l1">
                      {user.current_benpos_date
                        ? moment(user.current_benpos_date).format("DD-MM-YYYY")
                        : ""}
                    </div>
                    <div className="col s2 m2 l1">{user.total_share}</div>
                    <div className="col s2 m2 l1">
                      {user.previous_total_share}
                    </div>
                    {user.Requests.length > 0 ? (
                      user.Requests.map((request) => (
                        <>
                          <div className="col s2 m2 l1">
                            {request.request_status}
                          </div>
                          <div className="col s2 m2 l1">
                            {request.approval_date
                              ? moment(request.approval_date).format(
                                  "DD-MM-YYYY"
                                )
                              : ""}
                          </div>
                        </>
                      ))
                    ) : (
                      <>
                        <div className="col s2 m2 l1">
                          <span>No data</span>
                        </div>
                        <div className="col s2 m2 l1">
                          <span>No data</span>
                        </div>
                      </>
                    )}
                    {user.transaction_folio &&
                      user.transaction_folio.map((folio) => (
                        <div className="col s2 m2 l1">{folio}</div>
                      ))}
                  </div>
                ) : null
              )}
          </div>
        </form>
      </div> */}
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
            Total Data: {violationTransaction && violationTransaction.length}
          </span>
        </div>
      </div>
      {/* {violationList && violationList.length > 0 ? (
        <TableView
          data={violationList}
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
                return d.Folio
                  ? d.Folio.Relative
                    ? d.Folio.Relative.name
                    : d.Folio.Employee.name
                  : "NA";
              },
            },
            {
              name: "Buy/Sell",
              key: (d) => {
                return d.total_share - d.previous_total_share;
              },
            },
            {
              name: "BENPOSE Date",
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
              name: "Req. Status",
              key: (d) => {
                return d.Requests.length > 0
                  ? d.Requests[d.Requests.length - 1].request_status
                  : "";
              },
            },
            {
              name: "Appr. Date",
              key: (d) => {
                return d.Requests.length > 0 &&
                  d.Requests[d.Requests.length - 1].approval_date
                  ? moment(
                      d.Requests[d.Requests.length - 1].approval_date
                    ).format("DD-MM-YYYY")
                  : "";
              },
            },
            {
              name: "Folio-1",
              key: (d) => {
                return d.transaction_folio && d.transaction_folio[0]
                  ? d.transaction_folio[0]
                  : "";
              },
            },
            {
              name: "Folio-2",
              key: (d) => {
                return d.transaction_folio && d.transaction_folio[1]
                  ? d.transaction_folio[1]
                  : "";
              },
            },
            {
              name: "Folio-3",
              key: (d) => {
                return d.transaction_folio && d.transaction_folio[2]
                  ? d.transaction_folio[2]
                  : "";
              },
            },
            {
              name: "Folio-4",
              key: (d) => {
                return d.transaction_folio && d.transaction_folio[3]
                  ? d.transaction_folio[3]
                  : "";
              },
            },
            {
              name: "Folio-5",
              key: (d) => {
                return d.transaction_folio && d.transaction_folio[4]
                  ? d.transaction_folio[4]
                  : "";
              },
            },
          ]}
        ></TableView>
      ) : (
        <span style={{ fontWeight: 600, fontSize: 20 }}>No Data Found</span>
      )} */}
      {violationTransaction && violationTransaction.length > 0 ?
        <div className="tableView">
          <table className="responsive-table highlight custom-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>PAN</th>
                <th>Name</th>
                <th>Buy/ Sell</th>
                <th>Benpos Date</th>
                <th>Curr. Total Share</th>
                <th>Prev. Total Share</th>
                <th>Req Status</th>
                <th>Appr. Date</th>
                <th>Folio-1</th>
                <th>Folio-2</th>
                <th>Folio-3</th>
                <th>Folio-4</th>
                <th>Folio-5</th>
              </tr>
            </thead>
            <tbody>
              {violationTransaction.map((d, ind) =>
                <tr key={ind}>
                  <td>{d.code}</td>
                  <td>{d.pan}</td>
                  <td>{d.name}</td>
                  <td>{d.sell}</td>
                  <td>{d.benpose_date}</td>
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
