import React, { Component } from "react";
import { connect } from "react-redux";
import M from "materialize-css";
import { withRouter } from "react-router";
import TopNav from "../layout/TopNav";
import { Redirect } from "react-router";
import moment from "moment";
import {
  gotoCompare,
  leftBarItemChange,
  sharePdf,
} from "../../store/action/CommonAction";
import {
  uploadExcel,
  uploadBulkEmployee,
  compareTransaction,
  violationTransaction,
  windowConfigure,
  getFolios,
  getUpsi,
  shareUpsi,
  activityLog,
  emailPanRequest,
} from "../../store/action/HodAction";
import { UploadDocument } from "../admin/UploadDocument";
import swal from "sweetalert";
import ConfigureModal from "../admin/ConfigureModal";
import ConfirmationModal from "../admin/ConfirmationModal";
import { MassegeModal } from "../layout/MassegeModal";

export class Dashboard extends Component {
  state = {
    chooseFlag: null,
    weeklyData: "",
    compareTransData: [],
    violationTransData: [],
    date: "",
    from: "",
    to: "",
    purpose: "",
    uploadFlag: false,
    bulkKmp: "",
    comparetransFlag: true,
    violationTransFlag: true,
    activityLogFlag: true,
    compStartDate: "",
    compEndDate: "",
    startDate: "",
    endDate: "",
    filterData: [],
    NewData: [],
    filterFlag: false,
    share_by: "",
    share_to: "",
    subject: "",
    body: "",
    onRequestFlag: false,
    type: "",
    email: "",
    company: {},
    configFlag: false,
    configSubmitFlag: false,
    annualConfirmFlag: false,
    configShareFlag: false,
  };
  componentDidMount() {
    M.AutoInit();
    var today = this.getDateValue()
    if (this.props.user) {
      if (this.props.user.is_compliance) {
        this.setState({ company: this.props.userData.userDetails.Company , today: today});
      }
      this.get15Date()
    }
  }
  componentDidUpdate() {
    if (
      !this.props.weeklyDataLoading &&
      this.props.weeklyDataSuccess &&
      this.state.uploadFlag
    ) {
      console.log("modal open...");
      var modal = document.getElementById("massege-modal");
      var instance = M.Modal.getInstance(modal);
      instance.open();
      this.setState({ uploadFlag: false });
    } else if (
      !this.props.weeklyDataLoading &&
      this.props.weeklyDataError &&
      this.state.uploadFlag
    ) {
      swal("OOPS!", 'Error to upload benpos data', "error");
      this.setState({ uploadFlag: false, weeklyData: "", date: "" });
    }
    if (this.state.configFlag && !this.props.windowConfigLoding) {
      if (this.props.windowConfigSuccess) {
        swal("Success", "SuccessFul", "success");
        this.setState({ configFlag: false });
      }
      if (this.props.windowConfigError) {
        swal("OOPS!", this.props.windowConfigMsg, "error");
        this.setState({ configFlag: false });
      }
    }
    if (
      this.state.configSubmitFlag &&
      !this.props.windowConfigSubmitSendLoding &&
      this.props.windowConfigSubmitSendSuccess
    ) {
      this.props.SharePdf("Window_closure", null, this.props.user.accessToken);
      this.setState({ configSubmitFlag: false });
    }
    if (this.state.configShareFlag && !this.props.sharePdfLoading) {
      if (this.props.sharePdfSuccess) {
        swal("Success", "SuccessFul", "success");
        this.setState({ configShareFlag: false });
      }
      if (this.props.sharePdfError) {
        swal("OOPS!", this.props.sharePdfMsg, "error");
        this.setState({ configShareFlag: false });
      }
      if (this.props.windowConfigSubmitSendError) {
        swal("OOPS!", this.props.windowConfigMsg, "error");
        this.setState({ configShareFlag: false });
      }
    }
    if (this.state.annualConfirmFlag && !this.props.sharePdfLoading) {
      if (this.props.sharePdfSuccess) {
        swal("Success", "SuccessFul", "success");
        this.setState({ annualConfirmFlag: false });
      }
      if (this.props.sharePdfError) {
        swal("OOPS!", this.props.sharePdfMsg, "error");
        this.setState({ annualConfirmFlag: false });
      }
    }
  }


  getDateValue = () => {
    var d = new Date();
    var day = d.getDate();
    if (day.toString().length == 1) day = '0' + day
    var month = d.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month
    var Year = d.getFullYear();
    return Year + "-" + month + "-" + day;
  }

  dateFormatter = (inputDate) => {
    var splitDate = inputDate.split("-");
    if (splitDate.count == 0) {
      return null;
    }
    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2];
    return day + "/" + month + "/" + year;
  };
  compareTransactionDateFormat = (inputDate) => {
    var date = new Date(inputDate),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
  };
  onclick = (e) => {
    this.props.LeftBarItemChange(e.target.id);
    this.props.history.push({
      pathname: "/admin",
    });
  };

  handleUpload = (e) => {
    this.setState({ weeklyData: e.target.files[0] });
  };
  handleUploadDate = (e) => {
    this.setState({ date: e.target.value });
  };
  handleSubmit = (e) => {
    var date = this.state.date;
    var formattedDate = this.dateFormatter(date);
    var excel = this.state.weeklyData;
    console.log(formattedDate, excel);
    var modal = document.getElementById("upload-modal");
    var instance = M.Modal.getInstance(modal);
    instance.close();
    this.setState({ uploadFlag: true, weeklyData: "", date: "" });
    this.props.UploadExcel(formattedDate, excel, this.props.user.accessToken);
  };

  resetValue = (id) => {
    if (id == "doc") {
      this.setState({ weeklyData: "" });
    }
    if (id == "user") {
      this.setState({ bulkKmp: "" });
    }
  };

  
  sendMail = (e) => {
    console.error("sendMail = ",this.state);
    if (
      !this.state.annualConfirmFlag
    ) {
      var modal = document.getElementById("confirmation-modal");
      var instance = M.Modal.getInstance(modal);
      instance.close();
      console.error("sendMail = ",this.state);
      this.props.SharePdf("Cp_annual_declaration", null, this.props.user.accessToken);
      this.setState({ annualConfirmFlag: true });
      console.error("sendMail = ",this.state);
    }
  };

  
  sendMailCO = (e) => {
    console.error("sendMailCO = ",this.state);
    if (
      !this.state.annualConfirmFlag
    ) {
      var modal = document.getElementById("confirmation-modal");
      var instance = M.Modal.getInstance(modal);
      instance.close();
      console.error("sendMailCO = ",this.state);
      this.props.SharePdf("Co_annual_declaration", null, this.props.user.accessToken);
      this.setState({ annualConfirmFlag: true });
      console.error("sendMailCO = ",this.state);
    }
  };



  windowCloserSubmit = (e) => {
    console.log(this.state);
    var from = this.state.from;
    var to = this.state.to;
    var purpose = this.state.purpose;
    var type = "submit";
    if (this.state.from == "") {
      from = moment(this.state.company.window_close_from).format("YYYY-MM-DD");
    }
    if (this.state.to == "") {
      to = moment(this.state.company.window_close_to).format("YYYY-MM-DD");
    }
    if (this.state.purpose == "") {
      purpose = this.state.company.purpose;
    }
    this.setState({ from: "", to: "", purpose: "", configFlag: true });
    var data = {
      purpose: purpose,
    };
    var modal = document.getElementById("configure-modal");
    var instance = M.Modal.getInstance(modal);
    instance.close();
    console.log(from, to, purpose);
    this.props.WindowConfiguration(
      type,
      from,
      to,
      data,
      this.props.user.accessToken
    );
  };

  windowCloserSubmitShare = (e) => {
    var from = this.state.from;
    var to = this.state.to;
    var purpose = this.state.purpose;
    var type = "submit & send";
    if (this.state.from == "") {
      from = moment(this.state.company.window_close_from).format("YYYY-MM-DD");
    }
    if (this.state.to == "") {
      to = moment(this.state.company.window_close_to).format("YYYY-MM-DD");
    }
    if (this.state.purpose == "") {
      purpose = this.state.company.purpose;
    }
    this.setState({ from: "", to: "", purpose: "" });
    var data = {
      purpose: purpose,
    };
    this.setState({ from: "", to: "", purpose: "" });
    var data = {
      purpose: purpose,
    };
    var modal = document.getElementById("configure-modal");
    var instance = M.Modal.getInstance(modal);
    instance.close();
    console.log(from, to, purpose);
    this.setState({ configSubmitFlag: true, configShareFlag: true });
    this.props.WindowConfiguration(
      type,
      from,
      to,
      data,
      this.props.user.accessToken
    );
    //this.props.SharePdf("Window_closure", null, this.props.user.accessToken);
  };

  handleGo = (e) => {
    this.props.LeftBarItemChange("report");
    this.props.history.push({
      pathname: "/admin",
    });
    this.props.GoToCompare("compare");
    var startdate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 8
    );
    var enddate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1
    );
    var start_date = this.compareTransactionDateFormat(startdate);
    var end_date = this.compareTransactionDateFormat(enddate);
    this.setState({ startDate: start_date, endDate: end_date });
    var modal = document.getElementById("massege-modal");
    var instance = M.Modal.getInstance(modal);
    instance.close();
    this.props.CompareTransaction(
      start_date,
      end_date,
      this.props.user.accessToken
    );
  };
  handleWindowCloser = (e) => {
    console.log(e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  };
  onTab = (e) => {
    if (e.target.id == "info") {
      this.props.history.push({
        pathname: "/info",
      });
    } else if (e.target.id == "request") {
      if (this.props.company && new Date(new Date(this.props.company.window_close_from).setHours(0, 0, 0)).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(new Date(this.props.company.window_close_to).setHours(23, 59, 59)).getTime()) {
        swal('Info', 'Trading window will be closed from ' + this.getDate(this.props.company.window_close_from) + ' to ' + this.getDate(this.props.company.window_close_to), 'info')
      } else {
        this.props.history.push({
          pathname: "/request",
          state: "compare",
        });
      }
    } else {
      this.props.history.push({
        pathname: "/view",
      });
    }
  };

  getDate = (date) => {
    var d = new Date(date);
    var day = d.getDate();
    if (day.toString().length == 1) day = '0' + day
    var month = d.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month
    var Year = d.getFullYear();
    return day + "-" + month + "-" + Year;
  }

  get15Date = () => {
    var d = new Date(new Date().getTime() - (15 * 24 * 60 * 60 * 1000));
    var day = d.getDate();
    if (day.toString().length == 1) day = '0' + day
    var month = d.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month
    var Year = d.getFullYear();
    this.setState({day15: Year + "-" + month + "-" + day})
  }

  render() {
    if (!this.props.user) return <Redirect to="/login" />;
    console.log(this.state);
    console.log(this.props);
    return (
      <div style={{height:"100vh",width:"100vw","overflow-x":"auto","overflow-y":"auto"}}>
        <TopNav />
        <MassegeModal
          handleGo={this.handleGo}
          datalist={this.props.weeklyData}
        />
        <UploadDocument
          state={this.state}
          handleUpload={this.handleUpload}
          handleUploadDate={this.handleUploadDate}
          handleSubmit={this.handleSubmit}
          resetValue={this.resetValue}
        />
        <ConfigureModal
          state={this.state}
          windowCloserSubmit={this.windowCloserSubmit}
          handleWindowCloser={this.handleWindowCloser}
          windowCloserSubmitShare={this.windowCloserSubmitShare}
          company={this.props.company}
          getDate={this.getDate}
        />
        <ConfirmationModal
          state={this.state}
          sendMail={this.sendMail}
          sendMailCO={this.sendMailCO}
        />
        {this.props.user && this.props.user.is_compliance ? (
          <div className="dashboard" style={{marginTop:"60px"}}>
          <div class="row dashboard-row-client" style={{ marginTop: 40 }}>
            {/* <div class="row dashboard-row" style={{ marginTop: 35 }}> */}
              <div className="col s4 m4 l4">
                <div
                  class="card dashboard-card"
                  id="report"
                  onClick={this.onclick}
                  style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}
                >
                  <div class="card-image dashboard-card-image" id="report">
                    <img
                      id="report"
                      onClick={this.onclick}
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSI0NS42ODc1IiB5MT0iMTI0LjI5Njg4IiB4Mj0iNDUuNjg3NSIgeTI9IjE0Ny44MjMyNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xXzQzOTk1X2dyMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijg2IiB5MT0iMTQuMzMyNDQiIHgyPSI4NiIgeTI9IjE1Ni43OTY4MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0yXzQzOTk1X2dyMiI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc1LjI1IiB5MT0iMTQuMzMyNDQiIHgyPSI3NS4yNSIgeTI9IjE1Ni43OTY4MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0zXzQzOTk1X2dyMyI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc1LjI1IiB5MT0iMTQuMzMyNDQiIHgyPSI3NS4yNSIgeTI9IjE1Ni43OTY4MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci00XzQzOTk1X2dyNCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijg2IiB5MT0iMTQuMzMyNDQiIHgyPSI4NiIgeTI9IjE1Ni43OTY4MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci01XzQzOTk1X2dyNSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijg2IiB5MT0iMTQuMzMyNDQiIHgyPSI4NiIgeTI9IjE1Ni43OTY4MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci02XzQzOTk1X2dyNiI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48Zz48cGF0aCBkPSJNMzQuOTM3NSwxMjMuNjI1djE2LjEyNWMwLDIuOTY5NjkgMi40MDUzMSw1LjM3NSA1LjM3NSw1LjM3NWgxNi4xMjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTFfNDM5OTVfZ3IxKSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMzkuNzUsOTkuNDM3NXYtNjcuMTg3NWMwLC0zLjQ5OTEyIC0yLjI1NDgxLC02LjQ1NTM4IC01LjM3NSwtNy41Njh2LTAuNDk0NWMwLC00LjQ0NTEzIC0zLjYxNzM4LC04LjA2MjUgLTguMDYyNSwtOC4wNjI1aC04MC42MjVjLTQuNDQ1MTIsMCAtOC4wNjI1LDMuNjE3MzcgLTguMDYyNSw4LjA2MjV2MC40OTQ1Yy0zLjEyMDE5LDEuMTEyNjIgLTUuMzc1LDQuMDY4ODcgLTUuMzc1LDcuNTY4djMyLjI1Yy00LjQ0NTEzLDAgLTguMDYyNSwzLjYxNzM3IC04LjA2MjUsOC4wNjI1djY5Ljg3NWMwLDcuNDA5NDQgNi4wMjgwNiwxMy40Mzc1IDEzLjQzNzUsMTMuNDM3NWg5OS40Mzc1djBjMC4xOTA4MSwwIDAuMzgxNjMsLTAuMDA1MzggMC41NzUxMiwtMC4wMTM0NGM1LjcwNTU2LC0wLjI5ODMxIDEwLjE3NDg4LC01LjIxNjQ0IDEwLjE3NDg4LC0xMS4xOTM0NHYtMzcuMTY4MTNjMCwtNC40NDUxMyAtMy42MTczNywtOC4wNjI1IC04LjA2MjUsLTguMDYyNXpNMTE4LjI1LDI5LjU2MjVoMTMuNDM3NWMxLjQ4MzUsMCAyLjY4NzUsMS4yMDQgMi42ODc1LDIuNjg3NXYxNi4xMjVoLTEzLjQzNzVjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA0IC0yLjY4NzUsLTIuNjg3NXpNNDUuNjg3NSwyMS41aDgwLjYyNWMxLjQ4MzUsMCAyLjY4NzUsMS4yMDQgMi42ODc1LDIuNjg3NWgtODZjMCwtMS40ODM1IDEuMjA0LC0yLjY4NzUgMi42ODc1LC0yLjY4NzV6TTI5LjU2MjUsMTQyLjQzNzV2LTY5Ljg3NWMwLC0xLjQ4MzUgMS4yMDQsLTIuNjg3NSAyLjY4NzUsLTIuNjg3NWgyMS4zMTE4OGMwLjkwMDMxLDAgMS43MzYxMywwLjQ0NjEyIDIuMjM2LDEuMTk1OTRsNy41NTcyNSwxMS4zMzA1YzEuNDk2OTQsMi4yNTQ4MSA0LjAwNzA2LDMuNTk4NTYgNi43MTYwNiwzLjU5ODU2aDUzLjU1MzgxYzEuNDgzNSwwIDIuNjg3NSwxLjIwNCAyLjY4NzUsMi42ODc1djU2LjQzNzVjMCwxLjkwNTQ0IDAuNTYxNjksMy43NDYzOCAxLjUwNSw1LjM3NWgtOTAuMTkyNWMtNC40NDUxMiwwIC04LjA2MjUsLTMuNjE3MzcgLTguMDYyNSwtOC4wNjI1ek0xNDIuNDM3NSwxNDQuNjY4MTNjMCwzLjA2NjQ0IC0yLjI4MTY5LDUuNjc2IC01LjA4MjA2LDUuODIzODFjLTEuNDgzNSwwLjA2NzE5IC0yLjkxMzI1LC0wLjQ0MzQ0IC0zLjk5MzYyLC0xLjQ3MDA2Yy0xLjA3NzY5LC0xLjAyNjYyIC0xLjY3NDMxLC0yLjQwOCAtMS42NzQzMSwtMy44OTY4N3YtNTYuNDM3NWMwLC00LjQ0NTEzIC0zLjYxNzM4LC04LjA2MjUgLTguMDYyNSwtOC4wNjI1aC01My41NTM4MWMtMC45MDU2OSwwIC0xLjc0NDE5LC0wLjQ0ODgxIC0yLjI0Njc1LC0xLjIwMTMxbC03LjU1NzI1LC0xMS4zMzMxOWMtMS40OTY5NCwtMi4yNDk0NCAtNC4wMDQzOCwtMy41OTA1IC02LjcwNTMxLC0zLjU5MDVoLTE1LjkzNjg3di0zMi4yNWMwLC0xLjQ4MzUgMS4yMDQsLTIuNjg3NSAyLjY4NzUsLTIuNjg3NWg3Mi41NjI1djE2LjEyNWMwLDQuNDQ1MTIgMy42MTczOCw4LjA2MjUgOC4wNjI1LDguMDYyNWgxMy40Mzc1djkxLjM3NWMwLDEuNDg2MTkgMS4yMDEzMSwyLjY4NzUgMi42ODc1LDIuNjg3NWMxLjQ4NjE5LDAgMi42ODc1LC0xLjIwMTMxIDIuNjg3NSwtMi42ODc1di00MC4zMTI1YzEuNDgzNSwwIDIuNjg3NSwxLjIwNCAyLjY4NzUsMi42ODc1eiIgZmlsbD0idXJsKCNjb2xvci0yXzQzOTk1X2dyMikiPjwvcGF0aD48cGF0aCBkPSJNNDguMzc1LDM3LjYyNWg1My43NXY1LjM3NWgtNTMuNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTNfNDM5OTVfZ3IzKSI+PC9wYXRoPjxwYXRoIGQ9Ik00OC4zNzUsNDguMzc1aDUzLjc1djUuMzc1aC01My43NXoiIGZpbGw9InVybCgjY29sb3ItNF80Mzk5NV9ncjQpIj48L3BhdGg+PHBhdGggZD0iTTY5Ljg3NSw1OS4xMjVoMzIuMjV2NS4zNzVoLTMyLjI1eiIgZmlsbD0idXJsKCNjb2xvci01XzQzOTk1X2dyNSkiPjwvcGF0aD48cGF0aCBkPSJNNjkuODc1LDY5Ljg3NWgzMi4yNXY1LjM3NWgtMzIuMjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTZfNDM5OTVfZ3I2KSI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
                      style={{marginLeft: "60px"}}
                    />
                  </div>
                  <div
                    id="report"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onclick}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="report"
                        className="dashboard-card-name"
                        style={{ color: "#022d36", fontWeight: 500 }}
                      >
                        Reports
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col s4 m4 l4">
                <div
                  class="card dashboard-card modal-trigger"
                  id="upload"
                  data-target="upload-modal"
                  style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}
                >
                  <div
                    class="card-image dashboard-card-image modal-trigger"
                    id="upload"
                    data-target="upload-modal"
                  >
                    <img
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjcwLjc2OTk0IiB4Mj0iODYiIHkyPSIxMTYuNDYwMTMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMV81MjEzOV9ncjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI2MS44MTI1IiB5MT0iMzQuNDg4NjkiIHgyPSI2MS44MTI1IiB5Mj0iMTQ0Ljk3MTgxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTJfNTIxMzlfZ3IyIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMTMwLjM0Mzc1IiB5MT0iMzQuNDg4NjkiIHgyPSIxMzAuMzQzNzUiIHkyPSIxNDQuOTcxODEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItM181MjEzOV9ncjMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjMyLjI1IiB4Mj0iODYiIHkyPSIxNDguNzEwMTMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItNF81MjEzOV9ncjQiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGc+PHBhdGggZD0iTTEwMi40NTgyNSw5OS40MzIxM2gtNS43MDgyNWMtMS40ODM1LDAgLTIuNjg3NSwxLjE2NjM3IC0yLjY4NzUsMi42NTI1NnY4LjEwMDEzYzAsMS40ODA4MSAtMS4xOTg2MiwyLjY4NDgxIC0yLjY3OTQ0LDIuNjg0ODFoLTEwLjc2NjEyYy0xLjQ4MDgxLDAgLTIuNjc5NDQsLTEuMjA0IC0yLjY3OTQ0LC0yLjY4NDgxdi04LjEwMDEzYzAsLTEuNDg2MTkgLTEuMjA0LC0yLjY1MjU2IC0yLjY4NzUsLTIuNjUyNTZoLTUuNzA4MjVjLTEuOTM3NjksMCAtMy4wNDIyNSwtMi4zOTE4OCAtMS44ODEyNSwtNC4wNTI3NWwxNC41NzcsLTIwLjg1NWMxLjgyNzUsLTIuNjE0OTQgNS42OTQ4MSwtMi42MTc2MyA3LjUyMjMxLC0wLjAwNTM4bDE0LjU3NywyMC44NjMwNmMxLjE2MzY5LDEuNjYwODggMC4wNTY0NCw0LjA1MDA2IC0xLjg3ODU2LDQuMDUwMDZ6IiBmaWxsPSJ1cmwoI2NvbG9yLTFfNTIxMzlfZ3IxKSI+PC9wYXRoPjxwYXRoIGQ9Ik01MS4wNjI1LDY3LjE4NzVoNS4zNzVjMCwtOC4wNjI1IDcuMjMyMDYsLTE2LjEyMjMxIDE2LjEyNSwtMTYuMTIyMzF2LTUuMzc1Yy0xMS44NTQ1NiwwIC0yMS41LDEwLjc0NzMxIC0yMS41LDIxLjQ5NzMxeiIgZmlsbD0idXJsKCNjb2xvci0yXzUyMTM5X2dyMikiPjwvcGF0aD48cGF0aCBkPSJNMTM5Ljc1LDgwLjYyNWMwLC0xMC43NSAtOC40NDE0NCwtMTguODA5ODEgLTE4LjgxMjUsLTE4LjgwOTgxdjUuMzc1YzcuNDA5NDQsMCAxMy40Mzc1LDUuMzcyMzEgMTMuNDM3NSwxMy40MzQ4MXoiIGZpbGw9InVybCgjY29sb3ItM181MjEzOV9ncjMpIj48L3BhdGg+PHBhdGggZD0iTTE0OC4wOTczOCw5Mi4yNzI2M2MxLjU5MzY5LC0zLjY4MTg4IDIuNDAyNjMsLTcuNTkyMTkgMi40MDI2MywtMTEuNjQ0OTRjMCwtMTYuMjk5NjkgLTEzLjI2MjgxLC0yOS41NjI1IC0yOS41NjI1LC0yOS41NjI1Yy02LjUxNDUsMCAtMTIuNjg3NjksMi4wODgxOSAtMTcuNzg1ODgsNS45NjA4OGMtNC4zMDI2OSwtMTMuMDM0MzggLTE2LjUyMDA2LC0yMi4wODU4NyAtMzAuNTg5MTIsLTIyLjA4NTg3Yy0xNy43ODMxOSwwIC0zMi4yNSwxNC40NjY4MSAtMzIuMjUsMzIuMjVjMCw0LjE0NjgxIDAuMTY2NjIsOC4wNTk4MSAxLjQyNDM3LDEwLjc0NzMxaC0xLjQyNDM3Yy0xMy4zMzgwNiwwIC0yNC4xODc1LDEwLjg0OTQ0IC0yNC4xODc1LDI0LjE4NzVjMCwxMS41NjQzMSA4LjE2MTk0LDIxLjI0NzM3IDE5LjAyNzUsMjMuNjIwNDRjMS4wMjM5NCw2LjM5ODk0IDYuNTM4NjksMTEuMzE3MDYgMTMuMjIyNSwxMS4zMTcwNmg1Ni40Mzc1aDE2LjEyNWg1LjM3NWM2LjU0OTQ0LDAgMTIuMDAyMzgsLTQuNzEzODggMTMuMTg0ODgsLTEwLjkyNDY5YzkuMjIzNSwtMS4yMDEzMSAxNi4zNzc2MiwtOS4wODkxMyAxNi4zNzc2MiwtMTguNjM1MTNjMCwtNi4wOTI1NiAtMi45MjQsLTExLjcyMDE5IC03Ljc3NzYyLC0xNS4yMzAwNnpNMTI2LjMxMjUsMTMxLjY4NzVoLTUuMzc1aC0xNi4xMjVoLTU2LjQzNzVjLTMuNDk5MTIsMCAtNi40NTUzOCwtMi42ODc1IC03LjU2OCwtNS4zNzVoOTMuMDczNWMtMS4xMTI2MywyLjY4NzUgLTQuMDY4ODgsNS4zNzUgLTcuNTY4LDUuMzc1ek0xMzcuMDYyNSwxMjAuOTM3NWgtOTYuNzVjLTEwLjM3MTA2LDAgLTE4LjgxMjUsLTguNDQxNDQgLTE4LjgxMjUsLTE4LjgxMjVjMCwtMTAuMzcxMDYgOC40NDE0NCwtMTguODEyNSAxOC44MTI1LC0xOC44MTI1aDkuNTEzNzVsLTEuNjg1MDYsLTMuNzgxMzFjLTIuMjMwNjMsLTUuMDE0ODggLTIuNDUzNjksLTcuNDg3MzcgLTIuNDUzNjksLTEyLjM0MWMwLC0xNC44MTg4OCAxMi4wNTYxMywtMjYuODc1IDI2Ljg3NSwtMjYuODc1YzEzLjAxODI1LDAgMjQuMTMxMDYsOS4yOTg3NSAyNi40MjYxOSwyMi4xMTI3NWwwLjkyNzE5LDUuMTcwNzVsMy42NDk2MiwtMy43NzMyNWM0LjYwNjM4LC00Ljc2MjI1IDEwLjc3Njg3LC03LjM4NTI1IDE3LjM3MiwtNy4zODUyNWMxMy4zMzgwNiwwIDI0LjE4NzUsMTAuODQ5NDQgMjQuMTg3NSwyNC4xODc1YzAsMy42NzY1IC0wLjgxNDMxLDcuMjEwNTYgLTIuMzc1NzUsMTAuNDE5NDRsLTEuNzYzLDMuMzI3MTNsMi4zNzAzNywxLjI2MDQ0YzQuNDA0ODEsMi4zNDA4MSA3LjE0MzM4LDYuODg4MDYgNy4xNDMzOCwxMS44NjhjMCw3LjQwOTQ0IC02LjAyODA2LDEzLjQzNDgxIC0xMy40Mzc1LDEzLjQzNDgxeiIgZmlsbD0idXJsKCNjb2xvci00XzUyMTM5X2dyNCkiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=="
                      style={{marginLeft: "60px"}}
                    />
                  </div>
                  <div
                    id="upload"
                    class="btn-flat dashboard-card-action modal-trigger"
                    data-target="upload-modal"
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="upload"
                        className="dashboard-card-name"
                        style={{
                          color: "#022d36",
                          fontWeight: 500,
                        }}
                      >
                        Upload Benpos Data
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col s4 m4 l4">
                <div
                  class="card dashboard-card"
                  id="request"
                  onClick={this.onclick}
                  style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}
                >
                  <div class="card-image dashboard-card-image" id="request">
                    <img
                      id="request"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iNzcuOTM3NSIgeTE9Ijg0LjY1NjI1IiB4Mj0iNzcuOTM3NSIgeTI9IjEwMy40Njg3NSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xXzQ4MTU5X2dyMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc3LjkzNzUiIHkxPSIxOS4yNjEzMSIgeDI9Ijc3LjkzNzUiIHkyPSIxNTYuMzQ4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTJfNDgxNTlfZ3IyIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMTIzLjYyNSIgeTE9IjE5LjI2MTMxIiB4Mj0iMTIzLjYyNSIgeTI9IjE1Ni4zNDgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItM180ODE1OV9ncjMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4OC42ODc1IiB5MT0iMTkuMjYxMzEiIHgyPSI4OC42ODc1IiB5Mj0iMTU2LjM0OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci00XzQ4MTU5X2dyNCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgdHJhbnNmb3JtPSIiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGc+PHBhdGggZD0iTTg2LDk5LjQzNzVjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NWgtMTAuNzVjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA0IC0yLjY4NzUsLTIuNjg3NXYtMTAuNzVjMCwtMS40ODM1IDEuMjA0LC0yLjY4NzUgMi42ODc1LC0yLjY4NzVoMTAuNzVjMS40ODM1LDAgMi42ODc1LDEuMjA0IDIuNjg3NSwyLjY4NzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTFfNDgxNTlfZ3IxKSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMjksOTEuMzc1aC0xMC43NWMtMi45NjQzMSwwIC01LjM3NSwyLjQxMDY5IC01LjM3NSw1LjM3NXYzMi4yNWgtNjkuODc1di02OS44NzVoMzIuMjVjMi45NjQzMSwwIDUuMzc1LC0yLjQxMDY5IDUuMzc1LC01LjM3NXYtMTAuNzVjMCwtMi45NjQzMSAtMi40MTA2OSwtNS4zNzUgLTUuMzc1LC01LjM3NWgtNDAuMzEyNWMtNy40MDk0NCwwIC0xMy40Mzc1LDYuMDI4MDYgLTEzLjQzNzUsMTMuNDM3NXY4NmMwLDcuNDA5NDQgNi4wMjgwNiwxMy40Mzc1IDEzLjQzNzUsMTMuNDM3NWg4NmM3LjQwOTQ0LDAgMTMuNDM3NSwtNi4wMjgwNiAxMy40Mzc1LC0xMy40Mzc1di00MC4zMTI1YzAsLTIuOTY0MzEgLTIuNDEwNjksLTUuMzc1IC01LjM3NSwtNS4zNzV6TTEyOSwxMzcuMDYyNWMwLDQuNDQ1MTMgLTMuNjE3MzcsOC4wNjI1IC04LjA2MjUsOC4wNjI1aC04NmMtNC40NDUxMiwwIC04LjA2MjUsLTMuNjE3MzggLTguMDYyNSwtOC4wNjI1di04NmMwLC00LjQ0NTEzIDMuNjE3MzgsLTguMDYyNSA4LjA2MjUsLTguMDYyNWg0MC4zMTI1djEwLjc1aC0zMi4yNWMtMi45NjQzMSwwIC01LjM3NSwyLjQxMDY5IC01LjM3NSw1LjM3NXY2OS44NzVjMCwyLjk2NDMxIDIuNDEwNjksNS4zNzUgNS4zNzUsNS4zNzVoNjkuODc1YzIuOTY0MzEsMCA1LjM3NSwtMi40MTA2OSA1LjM3NSwtNS4zNzV2LTMyLjI1aDEwLjc1eiIgZmlsbD0idXJsKCNjb2xvci0yXzQ4MTU5X2dyMikiPjwvcGF0aD48cGF0aCBkPSJNMTM3LjA2MjUsMjEuNWgtMzQuOTM3NWMtMi45NjQzMSwwIC01LjM3NSwyLjQxMDY5IC01LjM3NSw1LjM3NXYxMC43NWMwLDIuOTY0MzEgMi40MTA2OSw1LjM3NSA1LjM3NSw1LjM3NWgyNi44NzV2MjYuODc1YzAsMi45NjQzMSAyLjQxMDY5LDUuMzc1IDUuMzc1LDUuMzc1aDEwLjc1YzIuOTY0MzEsMCA1LjM3NSwtMi40MTA2OSA1LjM3NSwtNS4zNzV2LTM0LjkzNzVjMCwtNy40MDk0NCAtNi4wMjgwNiwtMTMuNDM3NSAtMTMuNDM3NSwtMTMuNDM3NXpNMTQ1LjEyNSw2OS44NzVoLTEwLjc1di0yNi44NzVjMCwtMi45NjQzMSAtMi40MTA2OSwtNS4zNzUgLTUuMzc1LC01LjM3NWgtMjYuODc1di0xMC43NWgzNC45Mzc1YzQuNDQ1MTMsMCA4LjA2MjUsMy42MTczOCA4LjA2MjUsOC4wNjI1eiIgZmlsbD0idXJsKCNjb2xvci0zXzQ4MTU5X2dyMykiPjwvcGF0aD48cGF0aCBkPSJNOTEuMzc1LDc1LjI1aC0yNi44NzVjLTIuOTY0MzEsMCAtNS4zNzUsMi40MTA2OSAtNS4zNzUsNS4zNzV2MjYuODc1YzAsMi45NjQzMSAyLjQxMDY5LDUuMzc1IDUuMzc1LDUuMzc1aDI2Ljg3NWMyLjk2NDMxLDAgNS4zNzUsLTIuNDEwNjkgNS4zNzUsLTUuMzc1di0yNi44NzVjMCwtMC40NzgzNyAtMC4wODMzMSwtMC45MzI1NiAtMC4yMDE1NiwtMS4zNzMzMWwxNi4zMjY1NiwtMTYuMzI2NTZ2MTcuNjk5ODhoNS4zNzV2LTIxLjVjMCwtMi45NjQzMSAtMi40MTA2OSwtNS4zNzUgLTUuMzc1LC01LjM3NWgtMjEuNXY1LjM3NWgxNy42OTk4OGwtMTYuMzI2NTYsMTYuMzIzODhjLTAuNDQwNzUsLTAuMTE1NTYgLTAuODk0OTQsLTAuMTk4ODcgLTEuMzczMzEsLTAuMTk4ODd6TTkxLjM3NSwxMDcuNWgtMjYuODc1di0yNi44NzVoMjYuODc1eiIgZmlsbD0idXJsKCNjb2xvci00XzQ4MTU5X2dyNCkiPjwvcGF0aD48L2c+PHBhdGggZD0iIiBmaWxsPSJub25lIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
                      style={{marginLeft: "60px"}}
                      onClick={this.onclick}
                    />
                  </div>
                  <div
                    id="request"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onclick}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="request"
                        className="dashboard-card-name"
                        style={{ color: "#022d36", fontWeight: 500 }}
                      >
                        Requests
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row dashboard-row-client" style={{ marginTop: 40 }}>
            {/* <div
              class="row dashboard-row"
              //style={{ marginTop: -23 }}
            > */}
              
              <div className="col s4 m4 l4">
                <div class="card dashboard-card modal-trigger" data-target="configure-modal" style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                  <div
                    class="card-image dashboard-card-image modal-trigger"
                    id="window-closure"
                    data-target="configure-modal"
                  >
                    <img
                      id="window-closure"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMjkiIHkxPSI4MC4xNzYxOSIgeDI9IjEyOSIgeTI9Ijk1LjUxMTA2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTFfNDM5ODdfZ3IxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNTYuNDM3NSIgeTE9IjYxLjM2MzY5IiB4Mj0iNTYuNDM3NSIgeTI9IjEwMC43OTIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMl80Mzk4N19ncjIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjUuMzc1IiB4Mj0iODYiIHkyPSIxNjUuMDA0NDQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItM180Mzk4N19ncjMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIxMjAuOTM3NSIgeTE9IjUuMzc1IiB4Mj0iMTIwLjkzNzUiIHkyPSIxNjUuMDA0NDQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItNF80Mzk4N19ncjQiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIyOS41NjI1IiB5MT0iNS4zNzUiIHgyPSIyOS41NjI1IiB5Mj0iMTY1LjAwNDQ0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTVfNDM5ODdfZ3I1Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNzUuMjUiIHkxPSI1LjM3NSIgeDI9Ijc1LjI1IiB5Mj0iMTY1LjAwNDQ0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTZfNDM5ODdfZ3I2Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnPjxwYXRoIGQ9Ik0xNDQuODgzMTIsODAuNjI1Yy0xLjI2MzEyLDcuNjMyNSAtNy45MDEyNSwxMy40Mzc1IC0xNS44ODMxMiwxMy40Mzc1Yy03Ljk4MTg4LDAgLTE0LjYyLC01LjgwNSAtMTUuODgzMTIsLTEzLjQzNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTFfNDM5ODdfZ3IxKSI+PC9wYXRoPjxwYXRoIGQ9Ik03NS4yNSw2MS44MTI1djI2Ljg3NWMtNS45MzkzNywwIC0xMC43NSw0LjgxMDYzIC0xMC43NSwxMC43NWgtMjYuODc1YzAsLTIwLjc3NDM4IDE2Ljg1MDYzLC0zNy42MjUgMzcuNjI1LC0zNy42MjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTJfNDM5ODdfZ3IyKSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNTUuODc1LDc3LjkzNzVjMi45NjQzMSwwIDUuMzc1LC0yLjQxMDY5IDUuMzc1LC01LjM3NXYtNS4zNzVjMCwtMi45NjQzMSAtMi40MTA2OSwtNS4zNzUgLTUuMzc1LC01LjM3NWgtMjguMjY0NDRjLTEyLjEyMzMxLC0xNi44NDUyNSAtMzEuNTc1NDQsLTI2Ljg3NSAtNTIuMzYwNTYsLTI2Ljg3NWMtMzUuNTYzNjksMCAtNjQuNSwyOC45MzYzMSAtNjQuNSw2NC41YzAsMzUuNTYzNjkgMjguOTM2MzEsNjQuNSA2NC41LDY0LjVjMTguMzc0NDQsMCAzNS44MDI4OCwtNy44MzEzOCA0OC4wNDcxMiwtMjEuNWgzMi41Nzc4OGMyLjk2NDMxLDAgNS4zNzUsLTIuNDEwNjkgNS4zNzUsLTUuMzc1di01LjM3NWMwLC0yLjk2NDMxIC0yLjQxMDY5LC01LjM3NSAtNS4zNzUsLTUuMzc1YzAsLTEwLjY0Nzg4IC02LjIzNzY5LC0xOS44MzkxMiAtMTUuMjM4MTIsLTI0LjE4NzVjOS4wMDA0NCwtNC4zNDgzOCAxNS4yMzgxMiwtMTMuNTM5NjIgMTUuMjM4MTIsLTI0LjE4NzV6TTE1NS44NzUsNzIuNTYyNWgtNTMuNzV2LTUuMzc1aDUzLjc1ek05Ni43NSwxMzEuNjg3NXY1LjM3NWMwLDEuODQzNjMgMC45MzUyNSwzLjQ3NDk0IDIuMzU0MjUsNC40NDI0NGMtNy4yMzIwNiw0LjEyNTMxIC0xNS4zNTM2OSw2LjMwNzU2IC0yMy44NTQyNSw2LjMwNzU2Yy0yNS43NjUwNiwwIC00Ni44MzIzNywtMjAuMjY2NDQgLTQ4LjIzNzk0LC00NS42ODc1aDM1LjA3MTg4YzEuMjQ5NjksNi4xMjQ4MSA2LjY3NTc1LDEwLjc1IDEzLjE2NjA2LDEwLjc1YzcuNDA5NDQsMCAxMy40Mzc1LC02LjAyODA2IDEzLjQzNzUsLTEzLjQzNzVjMCwtNi40ODc2MyAtNC42MjUxOSwtMTEuOTE2MzcgLTEwLjc1LC0xMy4xNjYwNnYtMzUuMDc0NTZjMTAuMjI4NjIsMC41NTM2MyAxOS43NzczMSw0LjIzMDEzIDI3LjY0NjMxLDEwLjYxNTYzaC0zLjQ1ODgxYy0yLjk2NDMxLDAgLTUuMzc1LDIuNDEwNjkgLTUuMzc1LDUuMzc1djUuMzc1YzAsMi45NjQzMSAyLjQxMDY5LDUuMzc1IDUuMzc1LDUuMzc1YzAsMTAuNjQ3ODggNi4yNDAzOCwxOS44MzkxMiAxNS4yMzgxMywyNC4xODc1Yy04Ljk5Nzc1LDQuMzQ4MzggLTE1LjIzODEzLDEzLjUzOTYyIC0xNS4yMzgxMywyNC4xODc1Yy0yLjk2NDMxLDAgLTUuMzc1LDIuNDEwNjkgLTUuMzc1LDUuMzc1ek03NS4yNSw5MS4zNzVjNC40NDUxMywwIDguMDYyNSwzLjYxNzM4IDguMDYyNSw4LjA2MjVjMCw0LjQ0NTEyIC0zLjYxNzM3LDguMDYyNSAtOC4wNjI1LDguMDYyNWMtNC40NDUxMywwIC04LjA2MjUsLTMuNjE3MzggLTguMDYyNSwtOC4wNjI1YzAsLTQuNDQ1MTIgMy42MTczNywtOC4wNjI1IDguMDYyNSwtOC4wNjI1ek03Mi41NjI1LDg2LjI3MTQ0Yy01LjI1Njc1LDEuMDcyMzEgLTkuNDA2MjUsNS4yMjE4MSAtMTAuNDc4NTYsMTAuNDc4NTZoLTM1LjA3MTg4YzEuMzU3MTksLTI0LjUyNjEzIDIxLjAyNDMxLC00NC4xOTMyNSA0NS41NTA0NCwtNDUuNTUwNDR6TTc1LjI1LDE1OC41NjI1Yy0zMi42MDIwNiwwIC01OS4xMjUsLTI2LjUyMjk0IC01OS4xMjUsLTU5LjEyNWMwLC0zMi42MDIwNiAyNi41MjI5NCwtNTkuMTI1IDU5LjEyNSwtNTkuMTI1YzE3LjcyMTM4LDAgMzQuMzg2NTYsNy45NjMwNiA0NS41NzQ2MywyMS41aC03LjI1ODk0Yy0xMC4wNjQ2OSwtMTAuMjM5MzcgLTIzLjkzNzU2LC0xNi4xMjUgLTM4LjMxNTY5LC0xNi4xMjVjLTI5LjYzNzc1LDAgLTUzLjc1LDI0LjExMjI1IC01My43NSw1My43NWMwLDI5LjYzNzc1IDI0LjExMjI1LDUzLjc1IDUzLjc1LDUzLjc1YzExLjc0OTc1LDAgMjIuODU0NSwtMy43MzI5NCAzMi4yMDQzMSwtMTAuNzVoOC4zNjYxOWMtMTAuOTI3MzgsMTAuMzA5MjUgLTI1LjM5OTU2LDE2LjEyNSAtNDAuNTcwNSwxNi4xMjV6TTE1NS44NzUsMTM3LjA2MjVoLTUzLjc1di01LjM3NWg1My43NXpNMTUwLjUsMTI2LjMxMjVoLTQzYzAsLTEwLjk0MzUgOC4yMjM3NSwtMTkuOTg0MjUgMTguODEyNSwtMjEuMzE0NTZ2NS4xODk1Nmg1LjM3NXYtNS4xODk1NmMxMC41ODg3NSwxLjMzMDMxIDE4LjgxMjUsMTAuMzcxMDYgMTguODEyNSwyMS4zMTQ1NnpNMTMxLjY4NzUsOTkuMjUyMDZ2LTUuMTg5NTZoLTUuMzc1djUuMTg5NTZjLTEwLjU4ODc1LC0xLjMzMDMxIC0xOC44MTI1LC0xMC4zNzEwNiAtMTguODEyNSwtMjEuMzE0NTZoNDNjMCwxMC45NDM1IC04LjIyMzc1LDE5Ljk4NDI1IC0xOC44MTI1LDIxLjMxNDU2eiIgZmlsbD0idXJsKCNjb2xvci0zXzQzOTg3X2dyMykiPjwvcGF0aD48cGF0aCBkPSJNMTM0LjIzNzk0LDQ3LjEyOGwtMjIuODAwNzUsLTIyLjgwNjEybC0zLjgwMDEzLDMuODAwMTJsMjIuODAwNzUsMjIuODA2MTN6IiBmaWxsPSJ1cmwoI2NvbG9yLTRfNDM5ODdfZ3I0KSI+PC9wYXRoPjxwYXRoIGQ9Ik00Mi44NjI5NCwyOC4xMjJsLTMuODAwMTMsLTMuODAwMTJsLTIyLjgwMDc1LDIyLjgwNjEzbDMuODAwMTMsMy44MDAxM3oiIGZpbGw9InVybCgjY29sb3ItNV80Mzk4N19ncjUpIj48L3BhdGg+PHBhdGggZD0iTTc1LjI1LDI5LjU2MjVjNS45Mjg2MiwwIDEwLjc1LC00LjgyMTM3IDEwLjc1LC0xMC43NWMwLC01LjkyODYyIC00LjgyMTM4LC0xMC43NSAtMTAuNzUsLTEwLjc1Yy01LjkyODYyLDAgLTEwLjc1LDQuODIxMzggLTEwLjc1LDEwLjc1YzAsNS45Mjg2MyA0LjgyMTM4LDEwLjc1IDEwLjc1LDEwLjc1ek03NS4yNSwxMy40Mzc1YzIuOTY0MzEsMCA1LjM3NSwyLjQxMDY5IDUuMzc1LDUuMzc1YzAsMi45NjQzMSAtMi40MTA2OSw1LjM3NSAtNS4zNzUsNS4zNzVjLTIuOTY0MzEsMCAtNS4zNzUsLTIuNDEwNjkgLTUuMzc1LC01LjM3NWMwLC0yLjk2NDMxIDIuNDEwNjksLTUuMzc1IDUuMzc1LC01LjM3NXoiIGZpbGw9InVybCgjY29sb3ItNl80Mzk4N19ncjYpIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
                      style={{marginLeft: "60px"}}
                    />
                  </div>
                  <div
                    id="window-closure"
                    class="btn-flat dashboard-card-action modal-trigger"
                    data-target="configure-modal"
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="window-closure"
                        className="dashboard-card-name"
                        style={{
                          color: "#022d36",
                          fontWeight: 500,
                          // margin: "-44px",
                        }}
                      >
                        Trading Window Closure
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="col s4 m4 l4">
                <div class="card dashboard-card modal-trigger" data-target="confirmation-modal" style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                  <div
                    class="card-image dashboard-card-image modal-trigger"
                    id="annual-declaration"
                    data-target="confirmation-modal"
                  >
                    <img
                      id="annual-declaration"
                      alt="svgImg"
                      src="data:image/png;base64,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"
                      style={{marginLeft: "60px",}}
                    />
                  </div>
                  <div
                    id="annual-declaration"
                    class="btn-flat dashboard-card-action modal-trigger"
                    data-target="confirmation-modal"
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="annual-declaration"
                        className="dashboard-card-name"
                        style={{
                          color: "#022d36",
                          fontWeight: 500,
                          // margin: "-44px",
                        }}
                      >
                        Annual Declaration
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col s4 m4 l4">
                <div class="card dashboard-card" id="upsi" onClick={this.onclick} style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                  <div
                    class="card-image dashboard-card-image"
                    id="upsi"
                    onClick={this.onclick}
                  >
                    <img
                      id="upsi"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMTIuODc1IiB5MT0iNDkuMzgyODEiIHgyPSIxMTIuODc1IiB5Mj0iNzUuOTIxODgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMV80NDA0Nl9ncjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjE3LjEzMjgxIiB4Mj0iODYiIHkyPSIxNTUuNTIyOTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMl80NDA0Nl9ncjIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIxMTIuODc1IiB5MT0iMTcuMTMyODEiIHgyPSIxMTIuODc1IiB5Mj0iMTU1LjUyMjk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTNfNDQwNDZfZ3IzIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNDAuMzEyNSIgeTE9IjE3LjEzMjgxIiB4Mj0iNDAuMzEyNSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci00XzQ0MDQ2X2dyNCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjQwLjMxMjUiIHkxPSIxNy4xMzI4MSIgeDI9IjQwLjMxMjUiIHkyPSIxNTUuNTIyOTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItNV80NDA0Nl9ncjUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI0MC4zMTI1IiB5MT0iMTcuMTMyODEiIHgyPSI0MC4zMTI1IiB5Mj0iMTU1LjUyMjk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTZfNDQwNDZfZ3I2Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjAuNDY4NzUiIHkxPSIxNy4xMzI4MSIgeDI9IjYwLjQ2ODc1IiB5Mj0iMTU1LjUyMjk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTdfNDQwNDZfZ3I3Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjQuNSIgeTE9IjE3LjEzMjgxIiB4Mj0iNjQuNSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci04XzQ0MDQ2X2dyOCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc2LjU5Mzc1IiB5MT0iMTcuMTMyODEiIHgyPSI3Ni41OTM3NSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci05XzQ0MDQ2X2dyOSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc2LjU5Mzc1IiB5MT0iMTcuMTMyODEiIHgyPSI3Ni41OTM3NSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xMF80NDA0Nl9ncjEwIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjQuNSIgeTE9IjE3LjEzMjgxIiB4Mj0iNjQuNSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xMV80NDA0Nl9ncjExIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjAuNDY4NzUiIHkxPSIxNy4xMzI4MSIgeDI9IjYwLjQ2ODc1IiB5Mj0iMTU1LjUyMjk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEyXzQ0MDQ2X2dyMTIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgaWQ9Im9yaWdpbmFsLWljb24iPjxwYXRoIGQ9Ik0xMTIuODc1LDUxLjA2MjVjLTUuOTM3MDYsMCAtMTAuNzUsNC44MTI5NCAtMTAuNzUsMTAuNzVjMCw1LjkzNzA2IDQuODEyOTQsMTAuNzUgMTAuNzUsMTAuNzVjNS45MzcwNiwwIDEwLjc1LC00LjgxMjk0IDEwLjc1LC0xMC43NWMwLC01LjkzNzA2IC00LjgxMjk0LC0xMC43NSAtMTAuNzUsLTEwLjc1eiIgZmlsbD0idXJsKCNjb2xvci0xXzQ0MDQ2X2dyMSkiPjwvcGF0aD48cGF0aCBkPSJNMTQ3LjgxMjUsNTMuNzVoLTMuNzQzNjljLTAuNzY4NjMsLTIuODUxNDQgLTIuMDEyOTQsLTUuNTg0NjIgLTMuNTkwNSwtOC4xNDA0NGwyLjgwMDM4LC0yLjgwMzA2YzMuMTQ0MzcsLTMuMTQ0MzcgMy4xNDQzNywtOC4yNTYgMCwtMTEuNDAwMzdjLTMuMTQ0MzgsLTMuMTQ0MzggLTguMjU2LC0zLjE0NDM3IC0xMS40MDAzNywwbC0yLjgzOCwyLjgzOGMtMi41MzQzMSwtMS41NTA2OSAtNS4yNTY3NSwtMi43ODQyNSAtOC4xMDI4MSwtMy41OTA1di0zLjc3ODYzYzAsLTQuNDQ1MTMgLTMuNjE3MzcsLTguMDYyNSAtOC4wNjI1LC04LjA2MjVjLTQuNDQ1MTMsMCAtOC4wNjI1LDMuNjE3MzcgLTguMDYyNSw4LjA2MjV2My43Nzg2M2MtMi44NDYwNiwwLjgwNjI1IC01LjU2ODUsMi4wMzk4MSAtOC4xMDI4MSwzLjU5MDVsLTIuODM4LC0yLjgzOGMtMy4xNDQzNywtMy4xNDQzNyAtOC4yNTYsLTMuMTQ0MzcgLTExLjQwMDM3LDBjLTEuNzAzODcsMS43MDM4OCAtMi40NTEsMy45ODI4NyAtMi4zMDg1Niw2LjIxNjE5aC01NS45NzUyNWMtNC40NDUxMywwIC04LjA2MjUsMy42MTczOCAtOC4wNjI1LDguMDYyNXY5MS4zNzVjMCwzLjQ5OTEzIDIuMjUyMTIsNi40NTUzOCA1LjM3NSw3LjU2OHYzLjE4NDY5YzAsMi45NjQzMSAyLjQxMDY5LDUuMzc1IDUuMzc1LDUuMzc1aDc3LjkzNzVjMi45NjQzMSwwIDUuMzc1LC0yLjQxMDY5IDUuMzc1LC01LjM3NXYtMy4xODJjMy4xMjI4NywtMS4xMTI2MyA1LjM3NSwtNC4wNjg4OCA1LjM3NSwtNy41Njh2LTMyLjc0NDVjMy4xMjI4NywtMS4xMTI2MyA1LjM3NSwtNC4wNjg4OCA1LjM3NSwtNy41Njh2LTMuNzc4NjJjMi44NDYwNiwtMC44MDYyNSA1LjU2ODUsLTIuMDM5ODEgOC4xMDI4MSwtMy41OTA1bDIuODM4LDIuODM4YzEuNTcyMTksMS41NzIxOSAzLjYzNjE5LDIuMzU2OTQgNS43MDAxOSwyLjM1Njk0YzIuMDY0LDAgNC4xMjgsLTAuNzg0NzUgNS43MDAxOSwtMi4zNTY5NGMzLjE0NDM3LC0zLjE0NDM3IDMuMTQ0MzcsLTguMjU2IDAsLTExLjQwMDM3bC0yLjgwMDM4LC0yLjgwMzA2YzEuNTgwMjUsLTIuNTU1ODEgMi44MjQ1NiwtNS4yODkgMy41OTA1LC04LjE0MDQ0aDMuNzQzNjljNC40NDUxMiwwIDguMDYyNSwtMy42MTczNyA4LjA2MjUsLTguMDYyNWMwLC00LjQ0NTEyIC0zLjYxNzM3LC04LjA2MjUgLTguMDYyNSwtOC4wNjI1ek0xMzUuNjc4NDQsMzUuMjA4OTRjMS4wMTg1NiwtMS4wMTMxOSAyLjc4MTU2LC0xLjAxMzE5IDMuODAwMTMsMGMwLjUwNTI1LDAuNTA3OTQgMC43ODc0NCwxLjE4MjUgMC43ODc0NCwxLjkwMDA2YzAsMC43MTc1NiAtMC4yNzk1LDEuMzkyMTMgLTAuNzg3NDQsMS45MDAwNmwtMi4yNDY3NSwyLjI0Njc1Yy0xLjE3MTc1LC0xLjM1NDUgLTIuNDQyOTQsLTIuNjIwMzEgLTMuODEzNTYsLTMuNzg2Njl6TTg2LjI3MTQ0LDM1LjIwODk0YzEuMDE4NTYsLTEuMDEzMTkgMi43ODE1NiwtMS4wMTMxOSAzLjgwMDEzLDBsMi4yNjI4NywyLjI2MDE5Yy0xLjM3MDYyLDEuMTY2MzggLTIuNjQxODEsMi40MzIxOSAtMy44MTM1NiwzLjc4NjY5bC0yLjI0Njc1LC0yLjI0Njc1Yy0wLjUwNTI1LC0wLjUwNzk0IC0wLjc4NzQ0LC0xLjE4MjUgLTAuNzg3NDQsLTEuOTAwMDZjMCwtMC43MTc1NiAwLjI3NjgxLC0xLjM5MjEzIDAuNzg0NzUsLTEuOTAwMDZ6TTI2Ljg3NSwxNDcuODEyNXYtMi42ODc1aDc3LjkzNzV2Mi42ODc1ek0xMDcuNSwxMzkuNzVoLTgzLjMxMjVjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA0IC0yLjY4NzUsLTIuNjg3NXYtOTEuMzc1YzAsLTEuNDgzNSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1aDU4LjQ3NDYzbDIuNjA5NTYsMi42MDk1NmMtMS41ODAyNSwyLjU1NTgxIC0yLjgyNDU2LDUuMjg2MzEgLTMuNTkzMTksOC4xNDA0NGgtMy43NDFjLTQuNDQ1MTMsMCAtOC4wNjI1LDMuNjE3MzggLTguMDYyNSw4LjA2MjVjMCw0LjQ0NTEzIDMuNjE3MzcsOC4wNjI1IDguMDYyNSw4LjA2MjVoMy43NDM2OWMwLjc2ODYzLDIuODUxNDQgMi4wMTI5NCw1LjU4NDYzIDMuNTkzMTksOC4xNDA0NGwtMi44MDMwNiwyLjgwMzA2Yy0zLjE0NDM3LDMuMTQ0MzcgLTMuMTQ0MzcsOC4yNTYgMCwxMS40MDAzN2MxLjU3MjE5LDEuNTcyMTkgMy42MzYxOSwyLjM1Njk0IDUuNzAwMTksMi4zNTY5NGMyLjA2NCwwIDQuMTI4LC0wLjc4NDc1IDUuNzAwMTksLTIuMzU2OTRsMi44MzgsLTIuODM4YzIuNTM0MzEsMS41NTA2OSA1LjI1Njc1LDIuNzg0MjUgOC4xMDI4MSwzLjU5MDV2My43Nzg2MmMwLDMuNDk5MTIgMi4yNTIxMyw2LjQ1NTM4IDUuMzc1LDcuNTY4djMyLjc0NDVjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NXpNODYuMjcxNDQsODQuNjE1OTRsMi4yNDY3NSwtMi4yNDY3NWMxLjE3MTc1LDEuMzU0NSAyLjQ0Mjk0LDIuNjIwMzEgMy44MTM1NiwzLjc4NjY5bC0yLjI2Mjg3LDIuMjYwMTljLTEuMDE4NTYsMS4wMTMxOSAtMi43ODE1NiwxLjAxMzE5IC0zLjgwMDEzLDBjLTAuNTA1MjUsLTAuNTA3OTQgLTAuNzg3NDQsLTEuMTgyNSAtMC43ODc0NCwtMS45MDAwNmMwLC0wLjcxNzU2IDAuMjgyMTksLTEuMzg5NDQgMC43OTAxMywtMS45MDAwNnpNMTM5LjQ3ODU2LDg0LjYxNTk0YzAuNTA1MjUsMC41MDc5NCAwLjc4NzQ0LDEuMTgyNSAwLjc4NzQ0LDEuOTAwMDZjMCwwLjcxNzU2IC0wLjI3OTUsMS4zOTIxMiAtMC43ODc0NCwxLjkwMDA2Yy0xLjAxODU2LDEuMDEzMTkgLTIuNzgxNTYsMS4wMTMxOSAtMy44MDAxMywwbC0yLjI2Mjg4LC0yLjI2MDE5YzEuMzcwNjIsLTEuMTY2MzggMi42NDE4MSwtMi40MzIxOSAzLjgxMzU2LC0zLjc4NjY5ek0xNDcuODEyNSw2NC41aC04LjEyNDMxbC0wLjQwMzEzLDIuMjAxMDZjLTEuODYyNDQsMTAuMTI5MTkgLTExLjEzOTY5LDE5LjM4NDk0IC0yMS41NzI1NiwyMS41Mjk1NmwtMi4xNSwwLjQ0MDc1djguMDc4NjNjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NWMtMS40ODM1LDAgLTIuNjg3NSwtMS4yMDQgLTIuNjg3NSwtMi42ODc1di04LjA3ODYzbC0yLjE0NzMxLC0wLjQ0MDc1Yy0xMC40MzU1NiwtMi4xNDQ2MyAtMTkuNzEwMTIsLTExLjQwMDM3IC0yMS41NzI1NiwtMjEuNTI5NTZsLTAuNDA1ODEsLTIuMjAxMDZoLTguMTI0MzFjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA0IC0yLjY4NzUsLTIuNjg3NWMwLC0xLjQ4MzUgMS4yMDQsLTIuNjg3NSAyLjY4NzUsLTIuNjg3NWg4LjEyNDMxbDAuNDAzMTMsLTIuMjAxMDZjMS44NjI0NCwtMTAuMTI5MTkgMTEuMTM5NjksLTE5LjM4NDk0IDIxLjU3MjU2LC0yMS41Mjk1NmwyLjE1LC0wLjQ0MDc1di04LjA3ODYzYzAsLTEuNDgzNSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1YzEuNDgzNSwwIDIuNjg3NSwxLjIwNCAyLjY4NzUsMi42ODc1djguMDc4NjNsMi4xNDczMSwwLjQ0MDc1YzEwLjQzNTU2LDIuMTQ0NjMgMTkuNzEwMTIsMTEuNDAwMzggMjEuNTcyNTYsMjEuNTI5NTZsMC40MDU4MSwyLjIwMTA2aDguMTI0MzFjMS40ODM1LDAgMi42ODc1LDEuMjA0IDIuNjg3NSwyLjY4NzVjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NXoiIGZpbGw9InVybCgjY29sb3ItMl80NDA0Nl9ncjIpIj48L3BhdGg+PHBhdGggZD0iTTExMi44NzUsNDAuMzEyNWMtMTEuODU0NTYsMCAtMjEuNSw5LjY0NTQ0IC0yMS41LDIxLjVjMCwxMS44NTQ1NiA5LjY0NTQ0LDIxLjUgMjEuNSwyMS41YzExLjg1NDU2LDAgMjEuNSwtOS42NDU0NCAyMS41LC0yMS41YzAsLTExLjg1NDU2IC05LjY0NTQ0LC0yMS41IC0yMS41LC0yMS41ek0xMTIuODc1LDc3LjkzNzVjLTguODkyOTQsMCAtMTYuMTI1LC03LjIzMjA2IC0xNi4xMjUsLTE2LjEyNWMwLC04Ljg5Mjk0IDcuMjMyMDYsLTE2LjEyNSAxNi4xMjUsLTE2LjEyNWM4Ljg5Mjk0LDAgMTYuMTI1LDcuMjMyMDYgMTYuMTI1LDE2LjEyNWMwLDguODkyOTQgLTcuMjMyMDYsMTYuMTI1IC0xNi4xMjUsMTYuMTI1eiIgZmlsbD0idXJsKCNjb2xvci0zXzQ0MDQ2X2dyMykiPjwvcGF0aD48cGF0aCBkPSJNNDAuMzEyNSw4My4zMTI1Yy00LjQ0NTEyLDAgLTguMDYyNSwzLjYxNzM4IC04LjA2MjUsOC4wNjI1YzAsNC40NDUxMiAzLjYxNzM4LDguMDYyNSA4LjA2MjUsOC4wNjI1YzQuNDQ1MTIsMCA4LjA2MjUsLTMuNjE3MzggOC4wNjI1LC04LjA2MjVjMCwtNC40NDUxMiAtMy42MTczOCwtOC4wNjI1IC04LjA2MjUsLTguMDYyNXpNNDAuMzEyNSw5NC4wNjI1Yy0xLjQ4MzUsMCAtMi42ODc1LC0xLjIwNCAtMi42ODc1LC0yLjY4NzVjMCwtMS40ODM1IDEuMjA0LC0yLjY4NzUgMi42ODc1LC0yLjY4NzVjMS40ODM1LDAgMi42ODc1LDEuMjA0IDIuNjg3NSwyLjY4NzVjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NXoiIGZpbGw9InVybCgjY29sb3ItNF80NDA0Nl9ncjQpIj48L3BhdGg+PHBhdGggZD0iTTQwLjMxMjUsNjEuODEyNWMtNC40NDUxMiwwIC04LjA2MjUsMy42MTczNyAtOC4wNjI1LDguMDYyNWMwLDQuNDQ1MTMgMy42MTczOCw4LjA2MjUgOC4wNjI1LDguMDYyNWM0LjQ0NTEyLDAgOC4wNjI1LC0zLjYxNzM3IDguMDYyNSwtOC4wNjI1YzAsLTQuNDQ1MTMgLTMuNjE3MzgsLTguMDYyNSAtOC4wNjI1LC04LjA2MjV6TTQwLjMxMjUsNzIuNTYyNWMtMS40ODM1LDAgLTIuNjg3NSwtMS4yMDQgLTIuNjg3NSwtMi42ODc1YzAsLTEuNDgzNSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1YzEuNDgzNSwwIDIuNjg3NSwxLjIwNCAyLjY4NzUsMi42ODc1YzAsMS40ODM1IC0xLjIwNCwyLjY4NzUgLTIuNjg3NSwyLjY4NzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTVfNDQwNDZfZ3I1KSI+PC9wYXRoPjxwYXRoIGQ9Ik00MC4zMTI1LDEwNC44MTI1Yy00LjQ0NTEyLDAgLTguMDYyNSwzLjYxNzM4IC04LjA2MjUsOC4wNjI1YzAsNC40NDUxMiAzLjYxNzM4LDguMDYyNSA4LjA2MjUsOC4wNjI1YzQuNDQ1MTIsMCA4LjA2MjUsLTMuNjE3MzggOC4wNjI1LC04LjA2MjVjMCwtNC40NDUxMiAtMy42MTczOCwtOC4wNjI1IC04LjA2MjUsLTguMDYyNXpNNDAuMzEyNSwxMTUuNTYyNWMtMS40ODM1LDAgLTIuNjg3NSwtMS4yMDQgLTIuNjg3NSwtMi42ODc1YzAsLTEuNDgzNSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1YzEuNDgzNSwwIDIuNjg3NSwxLjIwNCAyLjY4NzUsMi42ODc1YzAsMS40ODM1IC0xLjIwNCwyLjY4NzUgLTIuNjg3NSwyLjY4NzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTZfNDQwNDZfZ3I2KSI+PC9wYXRoPjxwYXRoIGQ9Ik01My43NSw3Mi41NjI1aDEzLjQzNzV2NS4zNzVoLTEzLjQzNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTdfNDQwNDZfZ3I3KSI+PC9wYXRoPjxwYXRoIGQ9Ik01My43NSw5NC4wNjI1aDIxLjV2NS4zNzVoLTIxLjV6IiBmaWxsPSJ1cmwoI2NvbG9yLThfNDQwNDZfZ3I4KSI+PC9wYXRoPjxwYXRoIGQ9Ik01My43NSwxMTUuNTYyNWg0NS42ODc1djUuMzc1aC00NS42ODc1eiIgZmlsbD0idXJsKCNjb2xvci05XzQ0MDQ2X2dyOSkiPjwvcGF0aD48cGF0aCBkPSJNNTMuNzUsMTA0LjgxMjVoNDUuNjg3NXY1LjM3NWgtNDUuNjg3NXoiIGZpbGw9InVybCgjY29sb3ItMTBfNDQwNDZfZ3IxMCkiPjwvcGF0aD48cGF0aCBkPSJNNTMuNzUsODMuMzEyNWgyMS41djUuMzc1aC0yMS41eiIgZmlsbD0idXJsKCNjb2xvci0xMV80NDA0Nl9ncjExKSI+PC9wYXRoPjxwYXRoIGQ9Ik01My43NSw2NC41aDEzLjQzNzV2NS4zNzVoLTEzLjQzNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTEyXzQ0MDQ2X2dyMTIpIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
                      style={{marginLeft: "60px"}}
                      onClick={this.onclick}
                    />
                  </div>
                  <div
                    id="upsi"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onclick}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="upsi"
                        className="dashboard-card-name"
                        style={{ color: "#022d36", fontWeight: 500, margin: 8 }}
                      >
                        UPSI
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row dashboard-row-client" style={{ marginTop: 40 }}>
            {/* <div
              class="row dashboard-row"
              //style={{ marginTop: -23 }}
            > */}
              <div className="col s4 m4 l4">
                <div class="card dashboard-card" id="other" onClick={this.onclick} style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                  <div
                    class="card-image dashboard-card-image"
                    id="other"
                    onClick={this.onclick}
                  >
                    <img
                      id="other"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSI1Ni40Mzc1IiB5MT0iMjcuNzY5OTQiIHgyPSI1Ni40Mzc1IiB5Mj0iMTQzLjIzNTY5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTFfNTIxNTdfZ3IxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYjVkMDkiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiYjVkMDkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMTIzLjYyNSIgeTE9IjY0LjUiIHgyPSIxMjMuNjI1IiB5Mj0iOTEuMzc1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTJfNTIxNTdfZ3IyIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmNjk1M2UiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmNjk1M2UiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMTAyLjEyNSIgeTE9IjEyNy45OTIxOSIgeDI9IjEwMi4xMjUiIHkyPSIxNDUuNDkwNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0zXzUyMTU3X2dyMyI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjY5NTNlIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjY5NTNlIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjEyOSIgeTE9IjQxLjIwNzQ0IiB4Mj0iMTI5IiB5Mj0iMTU2LjY3MzE5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTRfNTIxNTdfZ3I0Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYjVkMDkiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiYjVkMDkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMTI5IiB5MT0iNDEuMjA3NDQiIHgyPSIxMjkiIHkyPSIxNTYuNjczMTkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItNV81MjE1N19ncjUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2JiNWQwOSI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2JiNWQwOSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI5NC4wNjI1IiB5MT0iNDEuMjA3NDQiIHgyPSI5NC4wNjI1IiB5Mj0iMTU2LjY3MzE5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTZfNTIxNTdfZ3I2Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYjVkMDkiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiYjVkMDkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnPjxwYXRoIGQ9Ik01MS4wNjI1LDY3LjE4NzVoMTAuNzV2NS4zNzVoLTEwLjc1eiIgZmlsbD0idXJsKCNjb2xvci0xXzUyMTU3X2dyMSkiPjwvcGF0aD48cGF0aCBkPSJNMTQyLjQzNzUsODMuMzEyNWMwLDQuNDQ1MTIgMy42MTczOCw4LjA2MjUgOC4wNjI1LDguMDYyNWM0LjQ0NTEyLDAgOC4wNjI1LC0zLjYxNzM4IDguMDYyNSwtOC4wNjI1di0xMC43NWMwLC00LjQ0NTEzIC0zLjYxNzM4LC04LjA2MjUgLTguMDYyNSwtOC4wNjI1aC01MS4wNjI1Yy01LjkyODYzLDAgLTEwLjc1LDQuODIxMzggLTEwLjc1LDEwLjc1YzAsNS45Mjg2MiA0LjgyMTM3LDEwLjc1IDEwLjc1LDEwLjc1YzUuOTI4NjMsMCAxMC43NSwtNC44MjEzOCAxMC43NSwtMTAuNzVjMCwtMS45NjcyNSAtMC41Njk3NSwtMy43ODY2OSAtMS40OTQyNSwtNS4zNzVoMzMuNzQ0MjV6TTE1MC41LDY5Ljg3NWMxLjQ4MzUsMCAyLjY4NzUsMS4yMDQgMi42ODc1LDIuNjg3NXYxMC43NWMwLDEuNDgzNSAtMS4yMDQsMi42ODc1IC0yLjY4NzUsMi42ODc1Yy0xLjQ4MzUsMCAtMi42ODc1LC0xLjIwNCAtMi42ODc1LC0yLjY4NzV2LTEzLjQzNzV6TTEwNC44MTI1LDc1LjI1YzAsMi45NjQzMSAtMi40MTA2OSw1LjM3NSAtNS4zNzUsNS4zNzVjLTIuOTY0MzEsMCAtNS4zNzUsLTIuNDEwNjkgLTUuMzc1LC01LjM3NWMwLC0yLjk2NDMxIDIuNDEwNjksLTUuMzc1IDUuMzc1LC01LjM3NWMyLjk2NDMxLDAgNS4zNzUsMi40MTA2OSA1LjM3NSw1LjM3NXoiIGZpbGw9InVybCgjY29sb3ItMl81MjE1N19ncjIpIj48L3BhdGg+PHBhdGggZD0iTTk5LjQzNzUsMTI5aDUuMzc1djE2LjEyNWgtNS4zNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTNfNTIxNTdfZ3IzKSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMjAuOTM3NSw5MS4zNzVoMTYuMTI1djUuMzc1aC0xNi4xMjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTRfNTIxNTdfZ3I0KSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMjAuOTM3NSw4MC42MjVoMTYuMTI1djUuMzc1aC0xNi4xMjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTVfNTIxNTdfZ3I1KSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNDIuNDM3NSw5Ni43NXY1LjM3NWgtNjkuODc1di00M2MwLC00LjEzMzM4IC0xLjU3NDg3LC03Ljg5MzE5IC00LjE0MTQ0LC0xMC43NWg2NS45NTM5NGM0LjQ1MzE5LDAgOC4wNjI1LDMuNjA5MzEgOC4wNjI1LDguMDYyNXYyLjY4NzVoNS4zNzV2LTIuNjg3NWMwLC03LjQyMDE5IC02LjAxNzMxLC0xMy40Mzc1IC0xMy40Mzc1LC0xMy40Mzc1aC03Ny45Mzc1Yy04LjkwNjM3LDAgLTE2LjEyNSw3LjIxODYzIC0xNi4xMjUsMTYuMTI1djUxLjA2MjVjMCw0LjQ1MzE5IDMuNjA5MzEsOC4wNjI1IDguMDYyNSw4LjA2MjVoMjEuNWgxMy40Mzc1djUuMzc1YzAsMi45NjQzMSAyLjQxMDY5LDUuMzc1IDUuMzc1LDUuMzc1djIxLjVoLTI2Ljg3NXY1LjM3NWg2NC41di01LjM3NWgtMTAuNzV2LTIxLjVjMi45NjQzMSwwIDUuMzc1LC0yLjQxMDY5IDUuMzc1LC01LjM3NXYtNS4zNzVoMTguODEyNWM0LjQ1MzE5LDAgOC4wNjI1LC0zLjYwOTMxIDguMDYyNSwtOC4wNjI1di0xMy40Mzc1ek02Ny4xODc1LDExMi44NzVoLTE4LjgxMjVjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA0IC0yLjY4NzUsLTIuNjg3NXYtNTAuNTg2ODFjMCwtNS42MTE1IDQuMDkzMDYsLTEwLjYzMTc1IDkuNjc3NjksLTExLjE3NDYzYzYuNDA5NjksLTAuNjIzNSAxMS44MjIzMSw0LjQxNTU2IDExLjgyMjMxLDEwLjY5ODk0ek0xMTAuMTg3NSwxNTAuNWgtMTYuMTI1di0yMS41aDE2LjEyNXpNMTE1LjU2MjUsMTIzLjYyNWgtMjYuODc1di01LjM3NWgyNi44NzV6TTE0Mi40Mzc1LDExMC4xODc1YzAsMS40ODM1IC0xLjIwNCwyLjY4NzUgLTIuNjg3NSwyLjY4NzVoLTY3LjE4NzV2LTUuMzc1aDY5Ljg3NXoiIGZpbGw9InVybCgjY29sb3ItNl81MjE1N19ncjYpIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
                      style={{marginLeft: "60px"}}
                      onClick={this.onclick}
                    />
                  </div>
                  <div
                    id="other"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onclick}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="other"
                        className="dashboard-card-name"
                        style={{ color: "#022d36", fontWeight: 500 }}
                      >
                        Bulk Mail
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col s4 m4 l4">
                <div class="card dashboard-card" id="cp" onClick={this.onclick} style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                  <div
                    class="card-image dashboard-card-image"
                    id="cp"
                    onClick={this.onclick}
                  >
                    <img
                      id="cp"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjI2LjAxNzY5IiB4Mj0iODYiIHkyPSIxNTEuNjY2MzciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMV9rdTgwdC1ybzZ3ZXdfZ3IxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNTcuNTQ0NzUiIHkxPSI0Ny45NzQ1NiIgeDI9IjU3LjU0NDc1IiB5Mj0iMTIyLjA4MjM4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTJfa3U4MHQtcm82d2V3X2dyMiI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc5LjIzNTU2IiB5MT0iNDcuOTc0NTYiIHgyPSI3OS4yMzU1NiIgeTI9IjEyMi4wODIzOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0zX2t1ODB0LXJvNndld19ncjMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIxMDYuMTU2MjUiIHkxPSI0Ny45NzQ1NiIgeDI9IjEwNi4xNTYyNSIgeTI9IjEyMi4wODIzOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci00X2t1ODB0LXJvNndld19ncjQiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjQ3Ljk3NDU2IiB4Mj0iODYiIHkyPSIxMjIuMDgyMzgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItNV9rdTgwdC1ybzZ3ZXdfZ3I1Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnPjxwYXRoIGQ9Ik0xMzcuMDYyNSwxNTAuNWgtMTAyLjEyNWMtNy40MDk0NCwwIC0xMy40Mzc1LC02LjAyODA2IC0xMy40Mzc1LC0xMy40Mzc1di0xMDIuMTI1YzAsLTcuNDA5NDQgNi4wMjgwNiwtMTMuNDM3NSAxMy40Mzc1LC0xMy40Mzc1aDEwMi4xMjVjNy40MDk0NCwwIDEzLjQzNzUsNi4wMjgwNiAxMy40Mzc1LDEzLjQzNzV2MTAyLjEyNWMwLDcuNDA5NDQgLTYuMDI4MDYsMTMuNDM3NSAtMTMuNDM3NSwxMy40Mzc1ek0zNC45Mzc1LDI2Ljg3NWMtNC40NDUxMywwIC04LjA2MjUsMy42MTczNyAtOC4wNjI1LDguMDYyNXYxMDIuMTI1YzAsNC40NDUxMiAzLjYxNzM3LDguMDYyNSA4LjA2MjUsOC4wNjI1aDEwMi4xMjVjNC40NDUxMiwwIDguMDYyNSwtMy42MTczOCA4LjA2MjUsLTguMDYyNXYtMTAyLjEyNWMwLC00LjQ0NTEzIC0zLjYxNzM4LC04LjA2MjUgLTguMDYyNSwtOC4wNjI1eiIgZmlsbD0idXJsKCNjb2xvci0xX2t1ODB0LXJvNndld19ncjEpIj48L3BhdGg+PGc+PGNpcmNsZSBjeD0iMjEuNDEyIiBjeT0iMjAuNSIgdHJhbnNmb3JtPSJzY2FsZSgyLjY4NzUsMi42ODc1KSIgcj0iMi41IiBmaWxsPSJ1cmwoI2NvbG9yLTJfa3U4MHQtcm82d2V3X2dyMikiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjI5LjQ4MyIgY3k9IjIwLjUyOSIgdHJhbnNmb3JtPSJzY2FsZSgyLjY4NzUsMi42ODc1KSIgcj0iMy41IiBmaWxsPSJ1cmwoI2NvbG9yLTNfa3U4MHQtcm82d2V3X2dyMykiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjM5LjUiIGN5PSIyMS41IiB0cmFuc2Zvcm09InNjYWxlKDIuNjg3NSwyLjY4NzUpIiByPSI0LjUiIGZpbGw9InVybCgjY29sb3ItNF9rdTgwdC1ybzZ3ZXdfZ3I0KSI+PC9jaXJjbGU+PHBhdGggZD0iTTEwOC42ODI1LDc1LjcyMDMxYy01Ljc1Mzk0LC0wLjY5ODc1IC0xMS4wODU5NCwxLjA0ODEyIC0xNS4xNDQwNiw0LjMxNjEyYy0xLjU1MzM4LC01Ljc3ODEyIC02LjcxNjA2LC0xMC4wNTEyNSAtMTIuOTEzNDQsLTEwLjA1MTI1Yy00LjY2MDEzLDAgLTguNzYxMjUsMi40MDUzMSAtMTEuMTcxOTQsNi4wNTQ5NGMtMS4zNDEwNiwtNC45MjYxOSAtNi4wMzYxMiwtOC41ODM4OCAtMTEuNjcxODEsLTguNTgzODhjLTYuNjc4NDQsMCAtMTIuMDkzNzUsNS4xMTE2MyAtMTIuMDkzNzUsMTEuNDIxODh2MjAuNTU5MzhoMjEuNXYxMy40Mzc1aDE4LjgxMjV2MTYuMTI1aDQwLjMxMjV2LTMyLjUxMDY5YzAsLTEwLjMwMzg3IC03LjQwMTM3LC0xOS41MjQ2OSAtMTcuNjMsLTIwLjc2OXoiIGZpbGw9InVybCgjY29sb3ItNV9rdTgwdC1ybzZ3ZXdfZ3I1KSI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg=="
                      style={{marginLeft: "60px"}}
                      onClick={this.onclick}
                    />
                  </div>
                  <div
                    id="cp"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onclick}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="cp"
                        className="dashboard-card-name"
                        style={{ color: "#022d36", fontWeight: 500 }}
                      >
                        CP/ DP Management
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col s4 m4 l4">
                <div class="card dashboard-card" id="template" onClick={this.onclick} style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                  <div
                    class="card-image dashboard-card-image"
                    id="template"
                    onClick={this.onclick}
                  >
                    <img
                      id="template"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMzcuMDYyNSIgeTE9IjU1LjA5Mzc1IiB4Mj0iMTM3LjA2MjUiIHkyPSI4My40Mzg4MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xXzQ0MDM1X2dyMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjY5NTNlIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjY5NTNlIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijg2IiB5MT0iMzEuMzU1MDYiIHgyPSI4NiIgeTI9IjE0My4zNDg1NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0yXzQ0MDM1X2dyMiI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYmI1ZDA5Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYmI1ZDA5Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjU5LjEyNSIgeTE9IjMxLjM1NTA2IiB4Mj0iNTkuMTI1IiB5Mj0iMTQzLjM0ODU2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTNfNDQwMzVfZ3IzIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYjVkMDkiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiYjVkMDkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNDguMzc1IiB5MT0iMzEuMzU1MDYiIHgyPSI0OC4zNzUiIHkyPSIxNDMuMzQ4NTYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItNF80NDAzNV9ncjQiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2JiNWQwOSI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2JiNWQwOSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI1OS4xMjUiIHkxPSIzMS4zNTUwNiIgeDI9IjU5LjEyNSIgeTI9IjE0My4zNDg1NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci01XzQ0MDM1X2dyNSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYmI1ZDA5Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYmI1ZDA5Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48Zz48cGF0aCBkPSJNMTM3LjA2MjUsNTkuMTI1Yy01LjkzNzA2LDAgLTEwLjc1LDQuODEyOTQgLTEwLjc1LDEwLjc1YzAsNS45MzcwNiA0LjgxMjk0LDEwLjc1IDEwLjc1LDEwLjc1YzUuOTM3MDYsMCAxMC43NSwtNC44MTI5NCAxMC43NSwtMTAuNzVjMCwtNS45MzcwNiAtNC44MTI5NCwtMTAuNzUgLTEwLjc1LC0xMC43NXoiIGZpbGw9InVybCgjY29sb3ItMV80NDAzNV9ncjEpIj48L3BhdGg+PHBhdGggZD0iTTE1NS44NzUsNDQuMTM5NXYtMy44MjdjMCwtNC40NDUxMiAtMy42MTczOCwtOC4wNjI1IC04LjA2MjUsLTguMDYyNWgtOTEuMzc1Yy00LjQ0NTEyLDAgLTguMDYyNSwzLjYxNzM4IC04LjA2MjUsOC4wNjI1djMuODI3Yy00LjczODA2LDIuMDgwMTMgLTguMDYyNSw2LjgwMjA2IC04LjA2MjUsMTIuMjk4djE4LjgxMjVoLTI0LjE4NzVjLTQuNDQ1MTIsMCAtOC4wNjI1LDMuNjE3MzcgLTguMDYyNSw4LjA2MjV2NDguMzc1YzAsNC40NDUxMiAzLjYxNzM4LDguMDYyNSA4LjA2MjUsOC4wNjI1aDUzLjc1aDUuMzc1aDc1LjI1YzcuNDA5NDQsMCAxMy40Mzc1LC02LjAyODA2IDEzLjQzNzUsLTEzLjQzNzV2LTY5Ljg3NWMwLC01LjQ5NTk0IC0zLjMyNDQ0LC0xMC4yMTc4NyAtOC4wNjI1LC0xMi4yOTh6TTUzLjc1LDQwLjMxMjVjMCwtMS40ODA4MSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1aDkxLjM3NWMxLjQ4MzUsMCAyLjY4NzUsMS4yMDY2OSAyLjY4NzUsMi42ODc1djIuNjg3NWgtOTYuNzV6TTQ1LjY4NzUsNTYuNDM3NWMwLC00LjQ0NTEyIDMuNjE3MzgsLTguMDYyNSA4LjA2MjUsLTguMDYyNWg5Ni43NWM0LjQ0NTEyLDAgOC4wNjI1LDMuNjE3MzggOC4wNjI1LDguMDYyNXY2MC42OTk4N2wtMjQuMDkzNDQsLTI0LjA5MzQ0Yy0yLjUzNywtMi41MzcgLTUuOTA5ODEsLTMuOTM0NSAtOS41MDAzMSwtMy45MzQ1Yy0zLjU5MDUsMCAtNi45NjMzMSwxLjM5NzUgLTkuNTAwMzEsMy45MzQ1bC0xMy4zNDM0NCwxMy4zNDM0NGwtMTguODEyNSwtMTguODEyNXYtNC4yNjIzN2MwLC00LjQ0NTEzIC0zLjYxNzM3LC04LjA2MjUgLTguMDYyNSwtOC4wNjI1aC0yOS41NjI1ek04My4zMTI1LDEzMS42ODc1di0zNi41MTIzN2wzOS4xOTk4NywzOS4xOTk4N2gtMzkuNjk0MzdjMC4zMDEsLTAuODQzODcgMC40OTQ1LC0xLjc0MTUgMC40OTQ1LC0yLjY4NzV6TTEzLjQzNzUsMTA3LjYzNzA2YzE0LjE1Nzc1LDEuMjg0NjMgMjUuNDU2LDEyLjU4MDE5IDI2LjczNzk0LDI2LjczNzk0aC01LjM5NjVjLTEuMjQ0MzEsLTExLjE5MDc1IC0xMC4xNDgsLTIwLjA5NzEzIC0yMS4zNDE0NCwtMjEuMzQxNDR6TTEzLjQzNzUsMTMxLjY4NzV2LTEzLjIyMjVjOC4yMjEwNiwxLjE4NTE5IDE0LjcyNDgxLDcuNjg4OTQgMTUuOTEsMTUuOTFoLTEzLjIyMjVjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA2NjkgLTIuNjg3NSwtMi42ODc1ek02OS44NzUsMTM0LjM3NWgtMjQuMzI0NTZjLTEuMzExNSwtMTcuMTE5MzcgLTE0Ljk5MzU2LC0zMC44MDE0NCAtMzIuMTEyOTQsLTMyLjExMjk0di0xOC45NDk1NmMwLC0xLjQ4MDgxIDEuMjA0LC0yLjY4NzUgMi42ODc1LC0yLjY4NzVoNTkuMTI1YzEuNDgzNSwwIDIuNjg3NSwxLjIwNjY5IDIuNjg3NSwyLjY4NzV2NDguMzc1YzAsMS40ODA4MSAtMS4yMDQsMi42ODc1IC0yLjY4NzUsMi42ODc1ek0xNTAuNSwxMzQuMzc1aC0yMC4zODczN2wtMjQuMTg3NSwtMjQuMTg3NWwxMy4zNDM0NCwtMTMuMzQzNDRjMy4wNDQ5NCwtMy4wNDQ5NCA4LjM1NTQ0LC0zLjA0NDk0IDExLjQwMDM3LDBsMjcuODkzNTYsMjcuODkzNTZ2MS41NzQ4N2MwLDQuNDQ1MTMgLTMuNjE3MzcsOC4wNjI1IC04LjA2MjUsOC4wNjI1eiIgZmlsbD0idXJsKCNjb2xvci0yXzQ0MDM1X2dyMikiPjwvcGF0aD48cGF0aCBkPSJNNTEuMDYyNSw5MS4zNzVoMTYuMTI1djUuMzc1aC0xNi4xMjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTNfNDQwMzVfZ3IzKSI+PC9wYXRoPjxwYXRoIGQ9Ik00MC4zMTI1LDEwMi4xMjVoMTYuMTI1djUuMzc1aC0xNi4xMjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTRfNDQwMzVfZ3I0KSI+PC9wYXRoPjxwYXRoIGQ9Ik01MS4wNjI1LDExMi44NzVoMTYuMTI1djUuMzc1aC0xNi4xMjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTVfNDQwMzVfZ3I1KSI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
                      style={{marginLeft: "60px"}}
                      onClick={this.onclick}
                    />
                  </div>
                  <div
                    id="template"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onclick}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="template"
                        className="dashboard-card-name"
                        style={{ color: "#022d36", fontWeight: 500}}
                      >
                        Template Management
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard" style={{marginTop:"60px"}}>
            <div class="row dashboard-row-client" style={{ marginTop: 40 }}>
              <div className="col s4 m4 l4">
                <div class="card dashboard-card" id="view" onClick={this.onTab} style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                  <div id="view" onClick={this.onTab} class="card-image dashboard-card-image">
                    <img
                      id="view"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNjQiIGhlaWdodD0iNjQiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iMTEwLjE4NzUiIHkxPSI2OC41MzEyNSIgeDI9IjExMC4xODc1IiB5Mj0iOTguMjg0NTYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMV80NDAwNF9ncjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjE1LjQ1MzEzIiB4Mj0iODYiIHkyPSIxNTUuNTIwMjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMl80NDAwNF9ncjIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjE1LjQ1MzEzIiB4Mj0iODYiIHkyPSIxNTUuNTIwMjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItM180NDAwNF9ncjMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI2OS44NzUiIHkxPSIxNS40NTMxMyIgeDI9IjY5Ljg3NSIgeTI9IjE1NS41MjAyNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci00XzQ0MDA0X2dyNCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjY5Ljg3NSIgeTE9IjE1LjQ1MzEzIiB4Mj0iNjkuODc1IiB5Mj0iMTU1LjUyMDI1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTVfNDQwMDRfZ3I1Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjkuODc1IiB5MT0iMTUuNDUzMTMiIHgyPSI2OS44NzUiIHkyPSIxNTUuNTIwMjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItNl80NDAwNF9ncjYiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIxMTAuMTg3NSIgeTE9IjE1LjQ1MzEzIiB4Mj0iMTEwLjE4NzUiIHkyPSIxNTUuNTIwMjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItN180NDAwNF9ncjciPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI1My43NSIgeTE9IjE1LjQ1MzEzIiB4Mj0iNTMuNzUiIHkyPSIxNTUuNTIwMjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItOF80NDAwNF9ncjgiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI2NC41IiB5MT0iMTUuNDUzMTMiIHgyPSI2NC41IiB5Mj0iMTU1LjUyMDI1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTlfNDQwMDRfZ3I5Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNzUuMjUiIHkxPSIxNS40NTMxMyIgeDI9Ijc1LjI1IiB5Mj0iMTU1LjUyMDI1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEwXzQ0MDA0X2dyMTAiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjE1LjQ1MzEzIiB4Mj0iODYiIHkyPSIxNTUuNTIwMjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMTFfNDQwMDRfZ3IxMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjExNS41NjI1IiB5MT0iMTUuNDUzMTMiIHgyPSIxMTUuNTYyNSIgeTI9IjE1NS41MjAyNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xMl80NDAwNF9ncjEyIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjkuODc1IiB5MT0iMTUuNDUzMTMiIHgyPSI2OS44NzUiIHkyPSIxNTUuNTIwMjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMTNfNDQwMDRfZ3IxMyI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48Zz48cGF0aCBkPSJNMTAyLjEyNSw5Ni43NWgxNi4xMjVjMS40ODM1LDAgMi42ODc1LC0xLjIwNCAyLjY4NzUsLTIuNjg3NXYtMjEuNWMwLC0xLjQ4MzUgLTEuMjA0LC0yLjY4NzUgLTIuNjg3NSwtMi42ODc1aC0xNi4xMjVjLTEuNDgzNSwwIC0yLjY4NzUsMS4yMDQgLTIuNjg3NSwyLjY4NzV2MjEuNWMwLDEuNDgzNSAxLjIwNCwyLjY4NzUgMi42ODc1LDIuNjg3NXoiIGZpbGw9InVybCgjY29sb3ItMV80NDAwNF9ncjEpIj48L3BhdGg+PHBhdGggZD0iTTEzMS42ODc1LDI2Ljg3NWgtNS4zNzVjMCwtMi45NjQzMSAtMi40MTA2OSwtNS4zNzUgLTUuMzc1LC01LjM3NWgtMjEuNWMwLC0yLjk2NDMxIC0yLjQxMDY5LC01LjM3NSAtNS4zNzUsLTUuMzc1aC0xNi4xMjVjLTIuOTY0MzEsMCAtNS4zNzUsMi40MTA2OSAtNS4zNzUsNS4zNzVoLTIxLjVjLTIuOTY0MzEsMCAtNS4zNzUsMi40MTA2OSAtNS4zNzUsNS4zNzVoLTUuMzc1Yy0yLjk2NDMxLDAgLTUuMzc1LDIuNDEwNjkgLTUuMzc1LDUuMzc1djExOC4yNWMwLDIuOTY0MzEgMi40MTA2OSw1LjM3NSA1LjM3NSw1LjM3NWg5MS4zNzVjMi45NjQzMSwwIDUuMzc1LC0yLjQxMDY5IDUuMzc1LC01LjM3NXYtMTE4LjI1YzAsLTIuOTY0MzEgLTIuNDEwNjksLTUuMzc1IC01LjM3NSwtNS4zNzV6TTc3LjkzNzUsMjEuNWgxNi4xMjV2MTMuNDM3NWMwLDQuNDQ1MTIgLTMuNjE3MzgsOC4wNjI1IC04LjA2MjUsOC4wNjI1Yy00LjQ0NTEyLDAgLTguMDYyNSwtMy42MTczOCAtOC4wNjI1LC04LjA2MjV6TTQwLjMxMjUsMzIuMjVoMzIuMjV2Mi42ODc1YzAsNy40MDk0NCA2LjAyODA2LDEzLjQzNzUgMTMuNDM3NSwxMy40Mzc1YzcuNDA5NDQsMCAxMy40Mzc1LC02LjAyODA2IDEzLjQzNzUsLTEzLjQzNzV2LTIuNjg3NWgzMi4yNXY4NmgtMjYuODc1Yy0yLjk2NDMxLDAgLTUuMzc1LDIuNDEwNjkgLTUuMzc1LDUuMzc1djI2Ljg3NWgtNTkuMTI1ek0xMDQuODEyNSwxNTAuNXYtMjYuODc1aDI2Ljg3NXYyNi44NzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTJfNDQwMDRfZ3IyKSI+PC9wYXRoPjxwYXRoIGQ9Ik01MS4wNjI1LDU5LjEyNWg2OS44NzV2NS4zNzVoLTY5Ljg3NXoiIGZpbGw9InVybCgjY29sb3ItM180NDAwNF9ncjMpIj48L3BhdGg+PHBhdGggZD0iTTUxLjA2MjUsNjkuODc1aDM3LjYyNXY1LjM3NWgtMzcuNjI1eiIgZmlsbD0idXJsKCNjb2xvci00XzQ0MDA0X2dyNCkiPjwvcGF0aD48cGF0aCBkPSJNNTEuMDYyNSw4MC42MjVoMzcuNjI1djUuMzc1aC0zNy42MjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTVfNDQwMDRfZ3I1KSI+PC9wYXRoPjxwYXRoIGQ9Ik01MS4wNjI1LDkxLjM3NWgzNy42MjV2NS4zNzVoLTM3LjYyNXoiIGZpbGw9InVybCgjY29sb3ItNl80NDAwNF9ncjYpIj48L3BhdGg+PHBhdGggZD0iTTk5LjQzNzUsMTAyLjEyNWgyMS41djUuMzc1aC0yMS41eiIgZmlsbD0idXJsKCNjb2xvci03XzQ0MDA0X2dyNykiPjwvcGF0aD48cGF0aCBkPSJNNTEuMDYyNSwxMjloNS4zNzV2MTAuNzVoLTUuMzc1eiIgZmlsbD0idXJsKCNjb2xvci04XzQ0MDA0X2dyOCkiPjwvcGF0aD48cGF0aCBkPSJNNjEuODEyNSwxMjloNS4zNzV2MTAuNzVoLTUuMzc1eiIgZmlsbD0idXJsKCNjb2xvci05XzQ0MDA0X2dyOSkiPjwvcGF0aD48cGF0aCBkPSJNNzIuNTYyNSwxMjloNS4zNzV2MTAuNzVoLTUuMzc1eiIgZmlsbD0idXJsKCNjb2xvci0xMF80NDAwNF9ncjEwKSI+PC9wYXRoPjxwYXRoIGQ9Ik04My4zMTI1LDEyOWg1LjM3NXYxMC43NWgtNS4zNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTExXzQ0MDA0X2dyMTEpIj48L3BhdGg+PHBhdGggZD0iTTExMC4xODc1LDEzNC4zNzV2NS4zNzVoNS4zNzV2LTUuMzc1aDUuMzc1di01LjM3NWgtNS4zNzVjLTIuOTY0MzEsMCAtNS4zNzUsMi40MTA2OSAtNS4zNzUsNS4zNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTEyXzQ0MDA0X2dyMTIpIj48L3BhdGg+PHBhdGggZD0iTTUxLjA2MjUsMTAyLjEyNWgzNy42MjV2NS4zNzVoLTM3LjYyNXoiIGZpbGw9InVybCgjY29sb3ItMTNfNDQwMDRfZ3IxMykiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=="
                      style={{marginLeft: "60px"}}
                      onClick={this.onTab}
                    />
                  </div>
                  <div
                    id="view"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onTab}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="view"
                        className="dashboard-card-name"
                        style={{ color: "#022d36", fontWeight: 500 }}
                      >
                        View Requests
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col s4 m4 l4">
                <div class="card dashboard-card" id="info" onClick={this.onTab} style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                  <div id="info" class="card-image dashboard-card-image" onClick={this.onTab}>
                    <img
                      id="info"
                      alt="svgImg"
                      onClick={this.onTab}
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNjQiIGhlaWdodD0iNjQiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iODYiIHkxPSIxNS40NTMxMyIgeDI9Ijg2IiB5Mj0iMzguMzA3NjMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMV82OTM3NV9ncjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjE1LjExNzE5IiB4Mj0iODYiIHkyPSIxNTQuOTY5MzEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMl82OTM3NV9ncjIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjUxLjA2MjUiIHgyPSI4NiIgeTI9IjU4LjQ1MzEzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTNfNjkzNzVfZ3IzIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iODYiIHkxPSIxNS4xMTcxOSIgeDI9Ijg2IiB5Mj0iMTU0LjU0NDY5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTRfNjkzNzVfZ3I0Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnPjxwYXRoIGQ9Ik04NiwxNi4xMjVjLTUuOTM3MDYsMCAtMTAuNzUsNC44MTI5NCAtMTAuNzUsMTAuNzVjMCw1LjkzNzA2IDQuODEyOTQsMTAuNzUgMTAuNzUsMTAuNzVjNS45MzcwNiwwIDEwLjc1LC00LjgxMjk0IDEwLjc1LC0xMC43NWMwLC01LjkzNzA2IC00LjgxMjk0LC0xMC43NSAtMTAuNzUsLTEwLjc1eiIgZmlsbD0idXJsKCNjb2xvci0xXzY5Mzc1X2dyMSkiPjwvcGF0aD48cGF0aCBkPSJNODYsNDAuMzEyNWMtNy40MDk0NCwwIC0xMy40Mzc1LC02LjAyODA2IC0xMy40Mzc1LC0xMy40Mzc1YzAsLTcuNDA5NDQgNi4wMjgwNiwtMTMuNDM3NSAxMy40Mzc1LC0xMy40Mzc1YzcuNDA5NDQsMCAxMy40Mzc1LDYuMDI4MDYgMTMuNDM3NSwxMy40Mzc1YzAsNy40MDk0NCAtNi4wMjgwNiwxMy40Mzc1IC0xMy40Mzc1LDEzLjQzNzV6TTg2LDE4LjgxMjVjLTQuNDQ1MTMsMCAtOC4wNjI1LDMuNjE3MzcgLTguMDYyNSw4LjA2MjVjMCw0LjQ0NTEzIDMuNjE3MzcsOC4wNjI1IDguMDYyNSw4LjA2MjVjNC40NDUxMiwwIDguMDYyNSwtMy42MTczNyA4LjA2MjUsLTguMDYyNWMwLC00LjQ0NTEzIC0zLjYxNzM3LC04LjA2MjUgLTguMDYyNSwtOC4wNjI1eiIgZmlsbD0idXJsKCNjb2xvci0yXzY5Mzc1X2dyMikiPjwvcGF0aD48cGF0aCBkPSJNNzUuMjUsNDguMzc1YzAsNS45MzY2OSA0LjgxMzMxLDEwLjc1IDEwLjc1LDEwLjc1YzUuOTM2NjksMCAxMC43NSwtNC44MTMzMSAxMC43NSwtMTAuNzUiIGZpbGw9InVybCgjY29sb3ItM182OTM3NV9ncjMpIj48L3BhdGg+PHBhdGggZD0iTTEwMi4xMjUsNDUuNjg3NWgtMzIuMjVjLTcuNDA5NDQsMCAtMTMuNDM3NSw2LjAyODA2IC0xMy40Mzc1LDEzLjQzNzV2NDNjMCw0LjQ0NTEyIDMuNjE3MzgsOC4wNjI1IDguMDYyNSw4LjA2MjVjMC45NDYsMCAxLjg0MzYzLC0wLjE5MzUgMi42ODc1LC0wLjQ5NDV2MzUuNDMyYzAsNS45Mjg2MyA0LjgyMTM4LDEwLjc1IDEwLjc1LDEwLjc1YzMuMjI3NjksMCA2LjA4OTg3LC0xLjQ1NjYzIDguMDYyNSwtMy43MTQxMmMxLjk3MjYzLDIuMjU3NSA0LjgzNDgxLDMuNzE0MTIgOC4wNjI1LDMuNzE0MTJjNS45Mjg2MywwIDEwLjc1LC00LjgyMTM3IDEwLjc1LC0xMC43NXYtMzUuNDMyYzAuODQzODcsMC4zMDEgMS43NDE1LDAuNDk0NSAyLjY4NzUsMC40OTQ1YzQuNDQ1MTIsMCA4LjA2MjUsLTMuNjE3MzggOC4wNjI1LC04LjA2MjV2LTQzYzAsLTcuNDA5NDQgLTYuMDI4MDYsLTEzLjQzNzUgLTEzLjQzNzUsLTEzLjQzNzV6TTk5LjQzNzUsMTQ1LjEyNWMwLDIuOTY0MzEgLTIuNDEwNjksNS4zNzUgLTUuMzc1LDUuMzc1Yy0yLjk2NDMxLDAgLTUuMzc1LC0yLjQxMDY5IC01LjM3NSwtNS4zNzV2LTMyLjI1di0yLjY4NzVoLTUuMzc1djIuNjg3NXYzMi4yNWMwLDIuOTY0MzEgLTIuNDEwNjksNS4zNzUgLTUuMzc1LDUuMzc1Yy0yLjk2NDMxLDAgLTUuMzc1LC0yLjQxMDY5IC01LjM3NSwtNS4zNzV2LTQzdi0yLjY4NzVoMjYuODc1djIuNjg3NXpNMTEwLjE4NzUsMTAyLjEyNWMwLDEuNDgwODEgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NWMtMS40ODM1LDAgLTIuNjg3NSwtMS4yMDY2OSAtMi42ODc1LC0yLjY4NzV2LTMyLjI1aC01LjM3NXYyNC4xODc1aC0yNi44NzV2LTI0LjE4NzVoLTUuMzc1djMyLjI1YzAsMS40ODA4MSAtMS4yMDQsMi42ODc1IC0yLjY4NzUsMi42ODc1Yy0xLjQ4MzUsMCAtMi42ODc1LC0xLjIwNjY5IC0yLjY4NzUsLTIuNjg3NXYtNDNjMCwtNC40NDUxMiAzLjYxNzM3LC04LjA2MjUgOC4wNjI1LC04LjA2MjVoMzIuMjVjNC40NDUxMiwwIDguMDYyNSwzLjYxNzM4IDguMDYyNSw4LjA2MjV6IiBmaWxsPSJ1cmwoI2NvbG9yLTRfNjkzNzVfZ3I0KSI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
                      style={{marginLeft: "60px"}}
                    />
                  </div>
                  <div
                    id="info"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onTab}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="info"
                        className="dashboard-card-name"
                        style={{ color: "#022d36", fontWeight: 500}}
                        onClick={this.onTab}
                      >
                        Personal Information
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col s4 m4 l4">
                <div
                  class="card dashboard-card"
                  id="request"
                  onClick={this.onTab}
                  style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}
                >
                  <div 
                    class="card-image dashboard-card-image" 
                    id="request"
                    onClick={this.onTab}
                  >
                    <img
                      id="request"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iNzcuOTM3NSIgeTE9Ijg0LjY1NjI1IiB4Mj0iNzcuOTM3NSIgeTI9IjEwMy40Njg3NSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xXzQ4MTU5X2dyMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc3LjkzNzUiIHkxPSIxOS4yNjEzMSIgeDI9Ijc3LjkzNzUiIHkyPSIxNTYuMzQ4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTJfNDgxNTlfZ3IyIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMTIzLjYyNSIgeTE9IjE5LjI2MTMxIiB4Mj0iMTIzLjYyNSIgeTI9IjE1Ni4zNDgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItM180ODE1OV9ncjMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I1NWUwMCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4OC42ODc1IiB5MT0iMTkuMjYxMzEiIHgyPSI4OC42ODc1IiB5Mj0iMTU2LjM0OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci00XzQ4MTU5X2dyNCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYjU1ZTAwIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgdHJhbnNmb3JtPSIiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGc+PHBhdGggZD0iTTg2LDk5LjQzNzVjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NWgtMTAuNzVjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA0IC0yLjY4NzUsLTIuNjg3NXYtMTAuNzVjMCwtMS40ODM1IDEuMjA0LC0yLjY4NzUgMi42ODc1LC0yLjY4NzVoMTAuNzVjMS40ODM1LDAgMi42ODc1LDEuMjA0IDIuNjg3NSwyLjY4NzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTFfNDgxNTlfZ3IxKSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMjksOTEuMzc1aC0xMC43NWMtMi45NjQzMSwwIC01LjM3NSwyLjQxMDY5IC01LjM3NSw1LjM3NXYzMi4yNWgtNjkuODc1di02OS44NzVoMzIuMjVjMi45NjQzMSwwIDUuMzc1LC0yLjQxMDY5IDUuMzc1LC01LjM3NXYtMTAuNzVjMCwtMi45NjQzMSAtMi40MTA2OSwtNS4zNzUgLTUuMzc1LC01LjM3NWgtNDAuMzEyNWMtNy40MDk0NCwwIC0xMy40Mzc1LDYuMDI4MDYgLTEzLjQzNzUsMTMuNDM3NXY4NmMwLDcuNDA5NDQgNi4wMjgwNiwxMy40Mzc1IDEzLjQzNzUsMTMuNDM3NWg4NmM3LjQwOTQ0LDAgMTMuNDM3NSwtNi4wMjgwNiAxMy40Mzc1LC0xMy40Mzc1di00MC4zMTI1YzAsLTIuOTY0MzEgLTIuNDEwNjksLTUuMzc1IC01LjM3NSwtNS4zNzV6TTEyOSwxMzcuMDYyNWMwLDQuNDQ1MTMgLTMuNjE3MzcsOC4wNjI1IC04LjA2MjUsOC4wNjI1aC04NmMtNC40NDUxMiwwIC04LjA2MjUsLTMuNjE3MzggLTguMDYyNSwtOC4wNjI1di04NmMwLC00LjQ0NTEzIDMuNjE3MzgsLTguMDYyNSA4LjA2MjUsLTguMDYyNWg0MC4zMTI1djEwLjc1aC0zMi4yNWMtMi45NjQzMSwwIC01LjM3NSwyLjQxMDY5IC01LjM3NSw1LjM3NXY2OS44NzVjMCwyLjk2NDMxIDIuNDEwNjksNS4zNzUgNS4zNzUsNS4zNzVoNjkuODc1YzIuOTY0MzEsMCA1LjM3NSwtMi40MTA2OSA1LjM3NSwtNS4zNzV2LTMyLjI1aDEwLjc1eiIgZmlsbD0idXJsKCNjb2xvci0yXzQ4MTU5X2dyMikiPjwvcGF0aD48cGF0aCBkPSJNMTM3LjA2MjUsMjEuNWgtMzQuOTM3NWMtMi45NjQzMSwwIC01LjM3NSwyLjQxMDY5IC01LjM3NSw1LjM3NXYxMC43NWMwLDIuOTY0MzEgMi40MTA2OSw1LjM3NSA1LjM3NSw1LjM3NWgyNi44NzV2MjYuODc1YzAsMi45NjQzMSAyLjQxMDY5LDUuMzc1IDUuMzc1LDUuMzc1aDEwLjc1YzIuOTY0MzEsMCA1LjM3NSwtMi40MTA2OSA1LjM3NSwtNS4zNzV2LTM0LjkzNzVjMCwtNy40MDk0NCAtNi4wMjgwNiwtMTMuNDM3NSAtMTMuNDM3NSwtMTMuNDM3NXpNMTQ1LjEyNSw2OS44NzVoLTEwLjc1di0yNi44NzVjMCwtMi45NjQzMSAtMi40MTA2OSwtNS4zNzUgLTUuMzc1LC01LjM3NWgtMjYuODc1di0xMC43NWgzNC45Mzc1YzQuNDQ1MTMsMCA4LjA2MjUsMy42MTczOCA4LjA2MjUsOC4wNjI1eiIgZmlsbD0idXJsKCNjb2xvci0zXzQ4MTU5X2dyMykiPjwvcGF0aD48cGF0aCBkPSJNOTEuMzc1LDc1LjI1aC0yNi44NzVjLTIuOTY0MzEsMCAtNS4zNzUsMi40MTA2OSAtNS4zNzUsNS4zNzV2MjYuODc1YzAsMi45NjQzMSAyLjQxMDY5LDUuMzc1IDUuMzc1LDUuMzc1aDI2Ljg3NWMyLjk2NDMxLDAgNS4zNzUsLTIuNDEwNjkgNS4zNzUsLTUuMzc1di0yNi44NzVjMCwtMC40NzgzNyAtMC4wODMzMSwtMC45MzI1NiAtMC4yMDE1NiwtMS4zNzMzMWwxNi4zMjY1NiwtMTYuMzI2NTZ2MTcuNjk5ODhoNS4zNzV2LTIxLjVjMCwtMi45NjQzMSAtMi40MTA2OSwtNS4zNzUgLTUuMzc1LC01LjM3NWgtMjEuNXY1LjM3NWgxNy42OTk4OGwtMTYuMzI2NTYsMTYuMzIzODhjLTAuNDQwNzUsLTAuMTE1NTYgLTAuODk0OTQsLTAuMTk4ODcgLTEuMzczMzEsLTAuMTk4ODd6TTkxLjM3NSwxMDcuNWgtMjYuODc1di0yNi44NzVoMjYuODc1eiIgZmlsbD0idXJsKCNjb2xvci00XzQ4MTU5X2dyNCkiPjwvcGF0aD48L2c+PHBhdGggZD0iIiBmaWxsPSJub25lIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
                      style={{marginLeft: "60px"}}
                    />
                  </div>
                  <div
                    id="request"
                    class="btn-flat dashboard-card-action"
                    onClick={this.onTab}
                    style={{marginTop: "-60%"}}
                  >
                    <span style={{marginTop: "-10%"}}>
                      <a
                        id="request"
                        className="dashboard-card-name"
                        onClick={this.onTab}
                        style={{ color: "#022d36", fontWeight: 500 }}
                      >
                        Request
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
              { this.props.userData && this.props.userData.userDetails && this.props.userData.userDetails.upsi ?
                <div class="row dashboard-row-client" style={{ marginTop: 40 }}>
                  <div className="col s4 m4 l4">
                    <div class="card dashboard-card" id="upsi" onClick={this.onclick} style={{width: "300px", marginLeft: "0vw", "border-radius": "3px"}}>
                      <div
                        class="card-image dashboard-card-image"
                        id="upsi"
                        onClick={this.onclick}
                      >
                        <img
                          id="upsi"
                          alt="svgImg"
                          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMTIuODc1IiB5MT0iNDkuMzgyODEiIHgyPSIxMTIuODc1IiB5Mj0iNzUuOTIxODgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMV80NDA0Nl9ncjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4NiIgeTE9IjE3LjEzMjgxIiB4Mj0iODYiIHkyPSIxNTUuNTIyOTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItMl80NDA0Nl9ncjIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIxMTIuODc1IiB5MT0iMTcuMTMyODEiIHgyPSIxMTIuODc1IiB5Mj0iMTU1LjUyMjk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTNfNDQwNDZfZ3IzIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiNTVlMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNDAuMzEyNSIgeTE9IjE3LjEzMjgxIiB4Mj0iNDAuMzEyNSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci00XzQ0MDQ2X2dyNCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjQwLjMxMjUiIHkxPSIxNy4xMzI4MSIgeDI9IjQwLjMxMjUiIHkyPSIxNTUuNTIyOTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iY29sb3ItNV80NDA0Nl9ncjUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI0MC4zMTI1IiB5MT0iMTcuMTMyODEiIHgyPSI0MC4zMTI1IiB5Mj0iMTU1LjUyMjk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTZfNDQwNDZfZ3I2Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjAuNDY4NzUiIHkxPSIxNy4xMzI4MSIgeDI9IjYwLjQ2ODc1IiB5Mj0iMTU1LjUyMjk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTdfNDQwNDZfZ3I3Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjQuNSIgeTE9IjE3LjEzMjgxIiB4Mj0iNjQuNSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci04XzQ0MDQ2X2dyOCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc2LjU5Mzc1IiB5MT0iMTcuMTMyODEiIHgyPSI3Ni41OTM3NSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci05XzQ0MDQ2X2dyOSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NzI2Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9Ijc2LjU5Mzc1IiB5MT0iMTcuMTMyODEiIHgyPSI3Ni41OTM3NSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xMF80NDA0Nl9ncjEwIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjQuNSIgeTE9IjE3LjEzMjgxIiB4Mj0iNjQuNSIgeTI9IjE1NS41MjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xMV80NDA0Nl9ncjExIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjk3MjYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNjAuNDY4NzUiIHkxPSIxNy4xMzI4MSIgeDI9IjYwLjQ2ODc1IiB5Mj0iMTU1LjUyMjk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEyXzQ0MDQ2X2dyMTIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmOTcyNiI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgaWQ9Im9yaWdpbmFsLWljb24iPjxwYXRoIGQ9Ik0xMTIuODc1LDUxLjA2MjVjLTUuOTM3MDYsMCAtMTAuNzUsNC44MTI5NCAtMTAuNzUsMTAuNzVjMCw1LjkzNzA2IDQuODEyOTQsMTAuNzUgMTAuNzUsMTAuNzVjNS45MzcwNiwwIDEwLjc1LC00LjgxMjk0IDEwLjc1LC0xMC43NWMwLC01LjkzNzA2IC00LjgxMjk0LC0xMC43NSAtMTAuNzUsLTEwLjc1eiIgZmlsbD0idXJsKCNjb2xvci0xXzQ0MDQ2X2dyMSkiPjwvcGF0aD48cGF0aCBkPSJNMTQ3LjgxMjUsNTMuNzVoLTMuNzQzNjljLTAuNzY4NjMsLTIuODUxNDQgLTIuMDEyOTQsLTUuNTg0NjIgLTMuNTkwNSwtOC4xNDA0NGwyLjgwMDM4LC0yLjgwMzA2YzMuMTQ0MzcsLTMuMTQ0MzcgMy4xNDQzNywtOC4yNTYgMCwtMTEuNDAwMzdjLTMuMTQ0MzgsLTMuMTQ0MzggLTguMjU2LC0zLjE0NDM3IC0xMS40MDAzNywwbC0yLjgzOCwyLjgzOGMtMi41MzQzMSwtMS41NTA2OSAtNS4yNTY3NSwtMi43ODQyNSAtOC4xMDI4MSwtMy41OTA1di0zLjc3ODYzYzAsLTQuNDQ1MTMgLTMuNjE3MzcsLTguMDYyNSAtOC4wNjI1LC04LjA2MjVjLTQuNDQ1MTMsMCAtOC4wNjI1LDMuNjE3MzcgLTguMDYyNSw4LjA2MjV2My43Nzg2M2MtMi44NDYwNiwwLjgwNjI1IC01LjU2ODUsMi4wMzk4MSAtOC4xMDI4MSwzLjU5MDVsLTIuODM4LC0yLjgzOGMtMy4xNDQzNywtMy4xNDQzNyAtOC4yNTYsLTMuMTQ0MzcgLTExLjQwMDM3LDBjLTEuNzAzODcsMS43MDM4OCAtMi40NTEsMy45ODI4NyAtMi4zMDg1Niw2LjIxNjE5aC01NS45NzUyNWMtNC40NDUxMywwIC04LjA2MjUsMy42MTczOCAtOC4wNjI1LDguMDYyNXY5MS4zNzVjMCwzLjQ5OTEzIDIuMjUyMTIsNi40NTUzOCA1LjM3NSw3LjU2OHYzLjE4NDY5YzAsMi45NjQzMSAyLjQxMDY5LDUuMzc1IDUuMzc1LDUuMzc1aDc3LjkzNzVjMi45NjQzMSwwIDUuMzc1LC0yLjQxMDY5IDUuMzc1LC01LjM3NXYtMy4xODJjMy4xMjI4NywtMS4xMTI2MyA1LjM3NSwtNC4wNjg4OCA1LjM3NSwtNy41Njh2LTMyLjc0NDVjMy4xMjI4NywtMS4xMTI2MyA1LjM3NSwtNC4wNjg4OCA1LjM3NSwtNy41Njh2LTMuNzc4NjJjMi44NDYwNiwtMC44MDYyNSA1LjU2ODUsLTIuMDM5ODEgOC4xMDI4MSwtMy41OTA1bDIuODM4LDIuODM4YzEuNTcyMTksMS41NzIxOSAzLjYzNjE5LDIuMzU2OTQgNS43MDAxOSwyLjM1Njk0YzIuMDY0LDAgNC4xMjgsLTAuNzg0NzUgNS43MDAxOSwtMi4zNTY5NGMzLjE0NDM3LC0zLjE0NDM3IDMuMTQ0MzcsLTguMjU2IDAsLTExLjQwMDM3bC0yLjgwMDM4LC0yLjgwMzA2YzEuNTgwMjUsLTIuNTU1ODEgMi44MjQ1NiwtNS4yODkgMy41OTA1LC04LjE0MDQ0aDMuNzQzNjljNC40NDUxMiwwIDguMDYyNSwtMy42MTczNyA4LjA2MjUsLTguMDYyNWMwLC00LjQ0NTEyIC0zLjYxNzM3LC04LjA2MjUgLTguMDYyNSwtOC4wNjI1ek0xMzUuNjc4NDQsMzUuMjA4OTRjMS4wMTg1NiwtMS4wMTMxOSAyLjc4MTU2LC0xLjAxMzE5IDMuODAwMTMsMGMwLjUwNTI1LDAuNTA3OTQgMC43ODc0NCwxLjE4MjUgMC43ODc0NCwxLjkwMDA2YzAsMC43MTc1NiAtMC4yNzk1LDEuMzkyMTMgLTAuNzg3NDQsMS45MDAwNmwtMi4yNDY3NSwyLjI0Njc1Yy0xLjE3MTc1LC0xLjM1NDUgLTIuNDQyOTQsLTIuNjIwMzEgLTMuODEzNTYsLTMuNzg2Njl6TTg2LjI3MTQ0LDM1LjIwODk0YzEuMDE4NTYsLTEuMDEzMTkgMi43ODE1NiwtMS4wMTMxOSAzLjgwMDEzLDBsMi4yNjI4NywyLjI2MDE5Yy0xLjM3MDYyLDEuMTY2MzggLTIuNjQxODEsMi40MzIxOSAtMy44MTM1NiwzLjc4NjY5bC0yLjI0Njc1LC0yLjI0Njc1Yy0wLjUwNTI1LC0wLjUwNzk0IC0wLjc4NzQ0LC0xLjE4MjUgLTAuNzg3NDQsLTEuOTAwMDZjMCwtMC43MTc1NiAwLjI3NjgxLC0xLjM5MjEzIDAuNzg0NzUsLTEuOTAwMDZ6TTI2Ljg3NSwxNDcuODEyNXYtMi42ODc1aDc3LjkzNzV2Mi42ODc1ek0xMDcuNSwxMzkuNzVoLTgzLjMxMjVjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA0IC0yLjY4NzUsLTIuNjg3NXYtOTEuMzc1YzAsLTEuNDgzNSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1aDU4LjQ3NDYzbDIuNjA5NTYsMi42MDk1NmMtMS41ODAyNSwyLjU1NTgxIC0yLjgyNDU2LDUuMjg2MzEgLTMuNTkzMTksOC4xNDA0NGgtMy43NDFjLTQuNDQ1MTMsMCAtOC4wNjI1LDMuNjE3MzggLTguMDYyNSw4LjA2MjVjMCw0LjQ0NTEzIDMuNjE3MzcsOC4wNjI1IDguMDYyNSw4LjA2MjVoMy43NDM2OWMwLjc2ODYzLDIuODUxNDQgMi4wMTI5NCw1LjU4NDYzIDMuNTkzMTksOC4xNDA0NGwtMi44MDMwNiwyLjgwMzA2Yy0zLjE0NDM3LDMuMTQ0MzcgLTMuMTQ0MzcsOC4yNTYgMCwxMS40MDAzN2MxLjU3MjE5LDEuNTcyMTkgMy42MzYxOSwyLjM1Njk0IDUuNzAwMTksMi4zNTY5NGMyLjA2NCwwIDQuMTI4LC0wLjc4NDc1IDUuNzAwMTksLTIuMzU2OTRsMi44MzgsLTIuODM4YzIuNTM0MzEsMS41NTA2OSA1LjI1Njc1LDIuNzg0MjUgOC4xMDI4MSwzLjU5MDV2My43Nzg2MmMwLDMuNDk5MTIgMi4yNTIxMyw2LjQ1NTM4IDUuMzc1LDcuNTY4djMyLjc0NDVjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NXpNODYuMjcxNDQsODQuNjE1OTRsMi4yNDY3NSwtMi4yNDY3NWMxLjE3MTc1LDEuMzU0NSAyLjQ0Mjk0LDIuNjIwMzEgMy44MTM1NiwzLjc4NjY5bC0yLjI2Mjg3LDIuMjYwMTljLTEuMDE4NTYsMS4wMTMxOSAtMi43ODE1NiwxLjAxMzE5IC0zLjgwMDEzLDBjLTAuNTA1MjUsLTAuNTA3OTQgLTAuNzg3NDQsLTEuMTgyNSAtMC43ODc0NCwtMS45MDAwNmMwLC0wLjcxNzU2IDAuMjgyMTksLTEuMzg5NDQgMC43OTAxMywtMS45MDAwNnpNMTM5LjQ3ODU2LDg0LjYxNTk0YzAuNTA1MjUsMC41MDc5NCAwLjc4NzQ0LDEuMTgyNSAwLjc4NzQ0LDEuOTAwMDZjMCwwLjcxNzU2IC0wLjI3OTUsMS4zOTIxMiAtMC43ODc0NCwxLjkwMDA2Yy0xLjAxODU2LDEuMDEzMTkgLTIuNzgxNTYsMS4wMTMxOSAtMy44MDAxMywwbC0yLjI2Mjg4LC0yLjI2MDE5YzEuMzcwNjIsLTEuMTY2MzggMi42NDE4MSwtMi40MzIxOSAzLjgxMzU2LC0zLjc4NjY5ek0xNDcuODEyNSw2NC41aC04LjEyNDMxbC0wLjQwMzEzLDIuMjAxMDZjLTEuODYyNDQsMTAuMTI5MTkgLTExLjEzOTY5LDE5LjM4NDk0IC0yMS41NzI1NiwyMS41Mjk1NmwtMi4xNSwwLjQ0MDc1djguMDc4NjNjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NWMtMS40ODM1LDAgLTIuNjg3NSwtMS4yMDQgLTIuNjg3NSwtMi42ODc1di04LjA3ODYzbC0yLjE0NzMxLC0wLjQ0MDc1Yy0xMC40MzU1NiwtMi4xNDQ2MyAtMTkuNzEwMTIsLTExLjQwMDM3IC0yMS41NzI1NiwtMjEuNTI5NTZsLTAuNDA1ODEsLTIuMjAxMDZoLTguMTI0MzFjLTEuNDgzNSwwIC0yLjY4NzUsLTEuMjA0IC0yLjY4NzUsLTIuNjg3NWMwLC0xLjQ4MzUgMS4yMDQsLTIuNjg3NSAyLjY4NzUsLTIuNjg3NWg4LjEyNDMxbDAuNDAzMTMsLTIuMjAxMDZjMS44NjI0NCwtMTAuMTI5MTkgMTEuMTM5NjksLTE5LjM4NDk0IDIxLjU3MjU2LC0yMS41Mjk1NmwyLjE1LC0wLjQ0MDc1di04LjA3ODYzYzAsLTEuNDgzNSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1YzEuNDgzNSwwIDIuNjg3NSwxLjIwNCAyLjY4NzUsMi42ODc1djguMDc4NjNsMi4xNDczMSwwLjQ0MDc1YzEwLjQzNTU2LDIuMTQ0NjMgMTkuNzEwMTIsMTEuNDAwMzggMjEuNTcyNTYsMjEuNTI5NTZsMC40MDU4MSwyLjIwMTA2aDguMTI0MzFjMS40ODM1LDAgMi42ODc1LDEuMjA0IDIuNjg3NSwyLjY4NzVjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NXoiIGZpbGw9InVybCgjY29sb3ItMl80NDA0Nl9ncjIpIj48L3BhdGg+PHBhdGggZD0iTTExMi44NzUsNDAuMzEyNWMtMTEuODU0NTYsMCAtMjEuNSw5LjY0NTQ0IC0yMS41LDIxLjVjMCwxMS44NTQ1NiA5LjY0NTQ0LDIxLjUgMjEuNSwyMS41YzExLjg1NDU2LDAgMjEuNSwtOS42NDU0NCAyMS41LC0yMS41YzAsLTExLjg1NDU2IC05LjY0NTQ0LC0yMS41IC0yMS41LC0yMS41ek0xMTIuODc1LDc3LjkzNzVjLTguODkyOTQsMCAtMTYuMTI1LC03LjIzMjA2IC0xNi4xMjUsLTE2LjEyNWMwLC04Ljg5Mjk0IDcuMjMyMDYsLTE2LjEyNSAxNi4xMjUsLTE2LjEyNWM4Ljg5Mjk0LDAgMTYuMTI1LDcuMjMyMDYgMTYuMTI1LDE2LjEyNWMwLDguODkyOTQgLTcuMjMyMDYsMTYuMTI1IC0xNi4xMjUsMTYuMTI1eiIgZmlsbD0idXJsKCNjb2xvci0zXzQ0MDQ2X2dyMykiPjwvcGF0aD48cGF0aCBkPSJNNDAuMzEyNSw4My4zMTI1Yy00LjQ0NTEyLDAgLTguMDYyNSwzLjYxNzM4IC04LjA2MjUsOC4wNjI1YzAsNC40NDUxMiAzLjYxNzM4LDguMDYyNSA4LjA2MjUsOC4wNjI1YzQuNDQ1MTIsMCA4LjA2MjUsLTMuNjE3MzggOC4wNjI1LC04LjA2MjVjMCwtNC40NDUxMiAtMy42MTczOCwtOC4wNjI1IC04LjA2MjUsLTguMDYyNXpNNDAuMzEyNSw5NC4wNjI1Yy0xLjQ4MzUsMCAtMi42ODc1LC0xLjIwNCAtMi42ODc1LC0yLjY4NzVjMCwtMS40ODM1IDEuMjA0LC0yLjY4NzUgMi42ODc1LC0yLjY4NzVjMS40ODM1LDAgMi42ODc1LDEuMjA0IDIuNjg3NSwyLjY4NzVjMCwxLjQ4MzUgLTEuMjA0LDIuNjg3NSAtMi42ODc1LDIuNjg3NXoiIGZpbGw9InVybCgjY29sb3ItNF80NDA0Nl9ncjQpIj48L3BhdGg+PHBhdGggZD0iTTQwLjMxMjUsNjEuODEyNWMtNC40NDUxMiwwIC04LjA2MjUsMy42MTczNyAtOC4wNjI1LDguMDYyNWMwLDQuNDQ1MTMgMy42MTczOCw4LjA2MjUgOC4wNjI1LDguMDYyNWM0LjQ0NTEyLDAgOC4wNjI1LC0zLjYxNzM3IDguMDYyNSwtOC4wNjI1YzAsLTQuNDQ1MTMgLTMuNjE3MzgsLTguMDYyNSAtOC4wNjI1LC04LjA2MjV6TTQwLjMxMjUsNzIuNTYyNWMtMS40ODM1LDAgLTIuNjg3NSwtMS4yMDQgLTIuNjg3NSwtMi42ODc1YzAsLTEuNDgzNSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1YzEuNDgzNSwwIDIuNjg3NSwxLjIwNCAyLjY4NzUsMi42ODc1YzAsMS40ODM1IC0xLjIwNCwyLjY4NzUgLTIuNjg3NSwyLjY4NzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTVfNDQwNDZfZ3I1KSI+PC9wYXRoPjxwYXRoIGQ9Ik00MC4zMTI1LDEwNC44MTI1Yy00LjQ0NTEyLDAgLTguMDYyNSwzLjYxNzM4IC04LjA2MjUsOC4wNjI1YzAsNC40NDUxMiAzLjYxNzM4LDguMDYyNSA4LjA2MjUsOC4wNjI1YzQuNDQ1MTIsMCA4LjA2MjUsLTMuNjE3MzggOC4wNjI1LC04LjA2MjVjMCwtNC40NDUxMiAtMy42MTczOCwtOC4wNjI1IC04LjA2MjUsLTguMDYyNXpNNDAuMzEyNSwxMTUuNTYyNWMtMS40ODM1LDAgLTIuNjg3NSwtMS4yMDQgLTIuNjg3NSwtMi42ODc1YzAsLTEuNDgzNSAxLjIwNCwtMi42ODc1IDIuNjg3NSwtMi42ODc1YzEuNDgzNSwwIDIuNjg3NSwxLjIwNCAyLjY4NzUsMi42ODc1YzAsMS40ODM1IC0xLjIwNCwyLjY4NzUgLTIuNjg3NSwyLjY4NzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTZfNDQwNDZfZ3I2KSI+PC9wYXRoPjxwYXRoIGQ9Ik01My43NSw3Mi41NjI1aDEzLjQzNzV2NS4zNzVoLTEzLjQzNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTdfNDQwNDZfZ3I3KSI+PC9wYXRoPjxwYXRoIGQ9Ik01My43NSw5NC4wNjI1aDIxLjV2NS4zNzVoLTIxLjV6IiBmaWxsPSJ1cmwoI2NvbG9yLThfNDQwNDZfZ3I4KSI+PC9wYXRoPjxwYXRoIGQ9Ik01My43NSwxMTUuNTYyNWg0NS42ODc1djUuMzc1aC00NS42ODc1eiIgZmlsbD0idXJsKCNjb2xvci05XzQ0MDQ2X2dyOSkiPjwvcGF0aD48cGF0aCBkPSJNNTMuNzUsMTA0LjgxMjVoNDUuNjg3NXY1LjM3NWgtNDUuNjg3NXoiIGZpbGw9InVybCgjY29sb3ItMTBfNDQwNDZfZ3IxMCkiPjwvcGF0aD48cGF0aCBkPSJNNTMuNzUsODMuMzEyNWgyMS41djUuMzc1aC0yMS41eiIgZmlsbD0idXJsKCNjb2xvci0xMV80NDA0Nl9ncjExKSI+PC9wYXRoPjxwYXRoIGQ9Ik01My43NSw2NC41aDEzLjQzNzV2NS4zNzVoLTEzLjQzNzV6IiBmaWxsPSJ1cmwoI2NvbG9yLTEyXzQ0MDQ2X2dyMTIpIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
                          style={{marginLeft: "60px"}}
                          onClick={this.onclick}
                        />
                      </div>
                      <div
                        id="upsi"
                        class="btn-flat dashboard-card-action"
                        onClick={this.onclick}
                        style={{marginTop: "-60%"}}
                      >
                        <span style={{marginTop: "-10%"}}>
                          <a
                            id="upsi"
                            className="dashboard-card-name"
                            style={{ color: "#022d36", fontWeight: 500, margin: 8 }}
                          >
                            UPSI
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                  </div>
                :null
              }
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    user: state.auth.user,
    userData: state.auth.data,
    common: state.common.leftBarItem,
    weeklyData: state.Hod.weeklyData.variationDatas,
    weeklyDataLoading: state.Hod.weeklyDataLoading,
    weeklyDataSuccess: state.Hod.weeklyDataSuccess,
    weeklyDataError: state.Hod.weeklyDataError,
    compareTransaction: state.Hod.compareTransaction,
    violationTransaction: state.Hod.violationTransaction,
    compareTransactionLoading: state.Hod.compareTransactionLoading,
    violationTransactionLoading: state.Hod.violationTransactionLoading,
    getFolio: state.Hod.getFolio,
    upsiList: state.Hod.upsiList.data,
    activityLog: state.Hod.activityLog,
    activityLogSuccess: state.Hod.activityLogSuccess,
    message: state.Hod.message,
    errorList: state.Hod.errorList,

    uploadBulkEmployeeSuccess: state.Hod.uploadBulkEmployeeSuccess,
    uploadBulkEmployeeError: state.Hod.uploadBulkEmployeeError,
    uploadBulkEmployeeLoading: state.Hod.uploadBulkEmployeeLoading,

    windowConfigLoding: state.Hod.windowConfigLoding,
    windowConfigSuccess: state.Hod.windowConfigSuccess,
    windowConfigError: state.Hod.windowConfigError,

    windowConfigSubmitSendLoding: state.Hod.windowConfigSubmitSendLoding,
    windowConfigSubmitSendSuccess: state.Hod.windowConfigSubmitSendSuccess,
    windowConfigSubmitSendError: state.Hod.windowConfigSubmitSendError,
    windowConfigMsg: state.Hod.windowConfigMsg,

    sharePdfSuccess: state.common.sharePdfSuccess,
    sharePdfLoading: state.common.sharePdfLoading,
    sharePdfError: state.common.sharePdfError,
    sharePdfMsg: state.common.sharePdfMsg,

    company: state.common.getCompanyData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    UploadExcel: (date, excelFile, token) => {
      dispatch(uploadExcel(date, excelFile, token));
    },
    UploadBulkEmployee: (excelFile, token) => {
      dispatch(uploadBulkEmployee(excelFile, token));
    },
    CompareTransaction: (start_date, end_date, token) => {
      dispatch(compareTransaction(start_date, end_date, token));
    },
    ViolationTransaction: (start_date, end_date, token) => {
      dispatch(violationTransaction(start_date, end_date, token));
    },
    WindowConfiguration: (type, from, to, purpose, token) => {
      dispatch(windowConfigure(type, from, to, purpose, token));
    },
    GetFolios: (data, pan, refDate) => {
      dispatch(getFolios(data, pan, refDate));
    },
    GetUpsi: (start_date, end_date, token) => {
      dispatch(getUpsi(start_date, end_date, token));
    },
    LeftBarItemChange: (id) => {
      dispatch(leftBarItemChange(id));
    },
    ActivityLog: (start_date, end_date, token) => {
      dispatch(activityLog(start_date, end_date, token));
    },
    EmailPanRequest: (data, token) => {
      dispatch(emailPanRequest(data, token));
    },
    SharePdf: (type, id, token) => {
      dispatch(sharePdf(type, id, token));
    },
    GoToCompare: (id) => {
      dispatch(gotoCompare(id));
    },
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
