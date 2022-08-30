import { backendUrl } from "../../config/config";
import { queryBuilder,decryptData, encryptData } from "../../utils/helper";

export const companyData = () => {
  return (dispatch) => {
    var url = backendUrl + "/company";
    fetch(url).then((response) =>
      response.json().then((data) => {
        if (response.status === 200) {
          dispatch({
            type: "GET_COMPANY_DATA_SUCCESS",
            payload: data,
          });
        } else {
          dispatch({
            type: "GET_COMPANY_DATA_ERROR",
          });
        }
      })
    );
  };
};

export const systemReset = (token) => {
  return (dispatch) => {
    dispatch({
      type: "SYSTEM_RESET_LOADING",
    });
    var url = backendUrl + "/initiateDb";
    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) =>
      response.json().then((data) => {
        if (response.status === 200) {
          dispatch({
            type: "SYSTEM_RESET_SUCCESS",
            payload: data,
          });
        } else {
          dispatch({
            type: "SYSTEM_RESET_ERROR",
            message: data.message,
          });
        }
      })
    );
  };
};

export const leftBarItemChange = (id) => {
  return (dispatch) => {
    dispatch({
      type: "NAV_CLICK_SUCCESS",
      payload: id,
    });
  };
};

export const addRelativeFlag = () => {
  return (dispatch) => {
    dispatch({
      type: "ADD_RELATIVE_FLAG_SUCCESS",
      payload: true,
    });
  };
};

export const gotoCompare = (id) => {
  return (dispatch) => {
    dispatch({
      type: "GO_TO_COMPARE_SUCCESS",
      payload: id,
    });
  };
};

export const getRequestList = (status, pan, token) => {
  console.log(status, pan, token);
  return (dispatch) => {
    dispatch({
      type: "FETCH_REQUEST_LIST_LOADING",
    });
    var fullUrl = backendUrl + "/requests";
    if (pan) {
      fullUrl += "?pan=" + pan;
    } else if (status != null) {
      fullUrl += "?request_status=" + status;
    } else if (status == null) {
      fullUrl = backendUrl + "/requests";
    }
    console.log("full url", fullUrl);
    fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        response.json().then((data) => {
          // var respData = JSON.parse(decryptData(data.data))
          // data = respData
          if (response.status === 200) {
            // console.log("action", data)
            var respData = JSON.parse(decryptData(data.data))
            data = respData
            dispatch({
              type: "FETCH_REQUEST_LIST_SUCCESS",
              payload: data.data,
            });
          } else if (response.status === 403 || response.status === 401) {
            dispatch({
              type: "AUTHENTICATION_ERROR",
            });
          } else {
            dispatch({
              type: "FETCH_REQUEST_LIST_ERROR",
            });
          }
        });
      })
      .catch((err) => {
        console.error("FETCH_REQUEST_LIST_ERROR", err);
        dispatch({
          type: "FETCH_REQUEST_LIST_ERROR",
        });
      });
  };
};

export const sharePdf = (type, id, token) => {
  return (dispatch) => {
    if (
      type == "Transaction_request_appoved" ||
      type == "Transaction_request_rejected" ||
      type == "Transaction_details_submit" ||
      type == "New_transaction_request"
    ) {
      var fullUrl = backendUrl + "/sendMail/" + type + "?request_id=" + id;
    } else if (
      type == "New_cp_added" ||
      type == "Cp_update_request" ||
      type == "Cp_update_approved" ||
      type == "Cp_update_rejected" ||
      type == "New_cp_login_details"
    ) {
      var fullUrl = backendUrl + "/sendMail/" + type + "?user_id=" + id;
    } else if (type == "Window_closure" || type == "Cp_annual_declaration" || type == "Co_annual_declaration") {
      var fullUrl = backendUrl + "/sendMail/" + type;
    }
    console.log("full url", fullUrl);
    fetch(fullUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        response.json().then((data) => {
          if (response.status === 200) {
            // console.log("action", data)
            dispatch({
              type: "SHARE_PDF_SUCCESS",
              payload: data.data,
            });
          } else if (response.status === 403 || response.status === 401) {
            dispatch({
              type: "AUTHENTICATION_ERROR",
            });
          } else {
            dispatch({
              type: "SHARE_PDF_ERROR",
              message: data.message,
            });
          }
        });
      })
      .catch((err) => {
        console.error("SHARE_PDF_ERROR", err);
        dispatch({
          type: "SHARE_PDF_ERROR",
        });
      });
  };
};

export const pdfDownload = (startDate, endDate, pan, type, token) => {
  return (dispatch) => {
    if (type === "CONNECTED_PERSONS") {
      fetch(backendUrl + "/usersPdf", {
        headers: {
          // "Content-Type": "application/json",
          // "Content-disposition": "attachment; filename=Connected Persons.pdf",
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-disposition": "attachment; filename=Connected Persons.xlsx",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) =>
          response.blob().then((blob) => {
            if (response.status === 200) {
              const data = window.URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = data;
              link.download = "Connected Persons.xlsx";
              link.click();
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            } else {
              dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
            }
          })
        )
        .catch((err) => {
          dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
        });
    }
    if (type === "VIOLATION_REPORT") {
      fetch(
        backendUrl +
          "/violationPdf" +
          "?startDate=" +
          startDate +
          "&endDate=" +
          endDate,
        {
          headers: {
            "Content-Type": "application/json",
            "Content-disposition": "attachment; filename=Connected Persons.pdf",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) =>
          response.blob().then((blob) => {
            if (response.status === 200) {
              const data = window.URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = data;
              link.download = "Violation Report.pdf";
              link.click();
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            } else {
              dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
            }
          })
        )
        .catch((err) => {
          dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
        });
    }
    if (type === "COMPARE") {
      fetch(
        backendUrl +
          "/compareTransactionPdf" +
          "?startDate=" +
          startDate +
          "&endDate=" +
          endDate,
        {
          headers: {
            "Content-Type": "application/json",
            "Content-disposition": "attachment; filename=Connected Persons.pdf",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) =>
          response.blob().then((blob) => {
            if (response.status === 200) {
              const data = window.URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = data;
              link.download = "Compare Transactions.pdf";
              link.click();
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            } else {
              dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
            }
          })
        )
        .catch((err) => {
          dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
        });
    }
    if (type === "ACTIVITY") {
      fetch(
        backendUrl +
          "/activityPdf" +
          "?startDate=" +
          startDate +
          "&endDate=" +
          endDate,
        {
          headers: {
            "Content-Type": "application/json",
            "Content-disposition": "attachment; filename=Connected Persons.pdf",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) =>
          response.blob().then((blob) => {
            if (response.status === 200) {
              const data = window.URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = data;
              link.download = "Activity Log.pdf";
              link.click();
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            } else {
              dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
            }
          })
        )
        .catch((err) => {
          dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
        });
    }
    if (type === "all") {
      fetch(backendUrl + "/requestPdf", {
        headers: {
          "Content-Type": "application/json",
          "Content-disposition": "attachment; filename=Connected Persons.pdf",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) =>
          response.blob().then((blob) => {
            if (response.status === 200) {
              const data = window.URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = data;
              link.download = "All Transactions.pdf";
              link.click();
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            } else {
              dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
            }
          })
        )
        .catch((err) => {
          dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
        });
    }
    if (type === "POST_TRANSACTION") {
      fetch(backendUrl + "/requestPdf?request_status=Completed", {
        headers: {
          "Content-Type": "application/json",
          "Content-disposition": "attachment; filename=Connected Persons.pdf",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) =>
          response.blob().then((blob) => {
            if (response.status === 200) {
              const data = window.URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = data;
              link.download = "Post Transactions.pdf";
              link.click();
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            } else {
              dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
            }
          })
        )
        .catch((err) => {
          dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
        });
    }
    if (type === "PRE_TRANSACTION") {
      fetch(backendUrl + "/requestPdf?request_status=Pending", {
        headers: {
          "Content-Type": "application/json",
          "Content-disposition": "attachment; filename=Connected Persons.pdf",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) =>
          response.blob().then((blob) => {
            if (response.status === 200) {
              const data = window.URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = data;
              link.download = "Pre Transaction Requests.pdf";
              link.click();
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            } else {
              dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
            }
          })
        )
        .catch((err) => {
          dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
        });
    }
    if (type === "CLIENT_TRANSACTION") {
      fetch(backendUrl + "/requestPdf?pan=" + pan, {
        headers: {
          "Content-Type": "application/json",
          "Content-disposition": "attachment; filename=Connected Persons.pdf",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) =>
          response.blob().then((blob) => {
            if (response.status === 200) {
              const data = window.URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = data;
              link.download = "My Requests.pdf";
              link.click();
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            } else {
              dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
            }
          })
        )
        .catch((err) => {
          dispatch({ type: "ERROR_IN_DOWNLOAD_PDF" });
        });
    }
  };
};

export const updateEmployee = (query,body, token) => {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_EMPLOYEE_LOADING' });
    var newUrl = queryBuilder('/users/canEdit', query)
    fetch(backendUrl + newUrl, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json().then(data => {
        if (res.status == 200) {
          dispatch({
            type: 'UPDATE_EMPLOYEE_SUCCESS',
            message: data.message,
          });
        } else if (res.status === 403 || res.status === 401) {
          dispatch({
            type: "AUTHENTICATION_ERROR",
          });
        } else {
          dispatch({
            type: 'UPDATE_EMPLOYEE_ERROR',
            message: data.message
          });
        }
      }))
      .catch(err => {
        dispatch({
          type: 'UPDATE_EMPLOYEE_ERROR',
          message: 'Internal Error'
        });
      })
  }
}


export const updateUPSIAccess = (query,body, token) => {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_UPSI_ACCESS_LOADING' });
    var newUrl = queryBuilder('/users/haveUPSI', query)
    fetch(backendUrl + newUrl, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json().then(data => {
        if (res.status == 200) {
          dispatch({
            type: 'UPDATE_UPSI_ACCESS_SUCCESS',
            message: data.message,
          });
        } else if (res.status === 403 || res.status === 401) {
          dispatch({
            type: "AUTHENTICATION_ERROR",
          });
        } else {
          dispatch({
            type: 'UPDATE_UPSI_ACCESS_ERROR',
            message: data.message
          });
        }
      }))
      .catch(err => {
        dispatch({
          type: 'UPDATE_EMPLOYEE_ERROR',
          message: 'Internal Error'
        });
      })
  }
}


export const resetReducer = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'RESET_REDUCER',
      data: data
    })
  }
}