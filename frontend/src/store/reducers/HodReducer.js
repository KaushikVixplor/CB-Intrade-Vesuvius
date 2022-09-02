const initState = {
  weeklyData: "",
  message: "",
  weeklyDataSuccess: false,
  weeklyDataError: false,
  weeklyDataLoading: false,
  weeklyDataMsg: "",
  errorList: null,

  uploadBulkEmployee: "",
  uploadBulkEmployeeSuccess: false,
  uploadBulkEmployeeError: false,
  uploadBulkEmployeeLoading: false,
  uploadBulkEmployeeMsg: "",

  getKmp: [],
  getKmpSuccess: false,
  getKmpError: false,
  getKmpLoading: false,

  compareTransaction: [],
  compareTransactionSuccess: false,
  compareTransactionError: false,
  compareTransactionLoading: false,

  violationTransaction: [],
  violationTransactionSuccess: false,
  violationTransactionError: false,
  violationTransactionLoading: false,

  correctionRequest: [],
  correctionRequestSuccess: false,
  correctionRequestError: false,
  correctionRequestLoading: false,
  correctionRequestMsg: null,

  kmRelative: [],
  kmpRelativeSuccess: false,
  kmpRelativeError: false,
  kmpRelativeLoading: false,

  getFolio: [],
  getFolioSuccess: false,
  getFolioError: false,

  upsiList: [],
  upsiFetchSuccess: false,
  upsiFetchError: false,
  upsiFetchLoading: false,

  correctionUserList: [],
  correctionUserSuccess: true,
  correctionUserError: false,
  correctionUserLoading: false,

  releseKmpList: [],
  releseKmpSuccess: false,
  releseKmpError: false,
  releseKmpLoading: false,
  releseKmpMsg: "",

  activityLog: [],
  activityLogSuccess: false,
  activityLogError: false,
  activityLogLoading: false,

  requestActionSuccess: false,
  requestActionError: false,
  requestActionLoading: false,
  request: null,
  requestMessage: null,

  bulkMailSuccess: false,
  bulkMailError: false,
  bulkMailLoading: false,
  bulkMailMessage: null,

  shareUpsiSuccess: false,
  shareUpsiError: false,
  shareUpsiLoading: false,
  shareUpsiMsg: "",

  resetPass: "",
  resestPassSuccess: false,
  resestPassError: false,
  resestPassLoading: false,
  resestPassMsg: "",

  windowConfigLoding: false,
  windowConfigSuccess: false,
  windowConfigError: false,

  windowConfigSubmitSendLoding: false,
  windowConfigSubmitSendSuccess: false,
  windowConfigSubmitSendError: false,
  windowConfigMsg: "",

  emailPanRequestLoading: false,
  emailPanRequestSuccess: false,
  emailPanRequestError: false,
  errorMassege: "",

  templateLoading: false,
  templateSuccess: false,
  templateError: false,
  tempaltes: [],

  updateTemplateLoading: false,
  updateTemplateSuccess: false,
  updateTemplateError: false,
  message: "",

  restoreLoading: false,
  restoreSuccess: false,
  restoreError: false,

  backupLoading: false,
  backupSuccess: false,
  backupError: false,
};

const HodReducer = (state = initState, action) => {
  console.error("hod reducer:: ",action)
  switch (action.type) {
    case "ADD_DATA_LOADING":
      return {
        ...state,
        weeklyDataSuccess: false,
        weeklyDataError: false,
        weeklyDataLoading: true,
        weeklyDataMsg: ""
      };
    case "ADD_DATA_SUCCESS":
      return {
        ...state,
        weeklyData: action.payload,
        weeklyDataSuccess: true,
        weeklyDataError: false,
        weeklyDataLoading: false,
        weeklyDataMsg: action.message,
        errorList: action.error
      };
    case "ADD_DATA_ERROR":
      return {
        ...state,
        weeklyDataSuccess: false,
        weeklyDataError: true,
        weeklyDataLoading: false,
        weeklyDataMsg: action.message
      };
    case "ADD_BULK_KMP_LOADING":
      return {
        ...state,
        uploadBulkEmployeeSuccess: false,
        uploadBulkEmployeeError: false,
        uploadBulkEmployeeLoading: true,
      };
    case "ADD_BULK_KMP_SUCCESS":
      return {
        ...state,
        uploadBulkEmployee: action.payload,
        uploadBulkEmployeeSuccess: true,
        uploadBulkEmployeeError: false,
        uploadBulkEmployeeLoading: false,
      };
    case "ADD_BULK_KMP_ERROR":
      return {
        ...state,
        uploadBulkEmployeeSuccess: false,
        uploadBulkEmployeeError: true,
        uploadBulkEmployeeLoading: false,
        uploadBulkEmployeeMsg: action.message
      };
    case "KMP_FETCH_SUCCESS":
      return {
        ...state,
        getKmpSuccess: true,
        getKmpError: false,
        getKmp: action.payload,
      };
    case "KMP_FETCH_ERROR":
      return {
        ...state,
        getKmpSuccess: false,
        getKmpError: true,
      };
    case "COMPARE_TRANSACTION_FETCH_LOADING":
      return {
        ...state,
        compareTransactionError: false,
        compareTransactionSuccess: false,
        compareTransactionLoading: true,
      };
    case "COMPARE_TRANSACTION_FETCH_SUCCESS":
      return {
        ...state,
        compareTransaction: action.payload,
        compareTransactionSuccess: true,
        compareTransactionError: false,
        compareTransactionLoading: false,
      };
    case "COMPARE_TRANSACTION_FETCH_ERROR":
      return {
        ...state,
        compareTransactionError: true,
        compareTransactionSuccess: false,
        compareTransactionLoading: false,
      };
    case "VIOLATION_TRANSACTION_FETCH_LOADING":
      return {
        ...state,
        violationTransactionError: false,
        violationTransactionSuccess: false,
        violationTransactionLoading: true,
      };
    case "VIOLATION_TRANSACTION_FETCH_SUCCESS":
      return {
        ...state,
        violationTransaction: action.payload,
        violationTransactionSuccess: true,
        violationTransactionError: false,
        violationTransactionLoading: false,
      };
    case "VIOLATION_TRANSACTION_FETCH_ERROR":
      return {
        ...state,
        violationTransactionError: true,
        violationTransactionSuccess: false,
        violationTransactionLoading: false,
      };
    case "CORRECTION_REQUEST_LOADING":
      return {
        ...state,
        correctionRequestError: false,
        correctionRequestSuccess: false,
        correctionRequestLoading: true,
      };
    case "CORRECTION_REQUEST_SUCCESS":
      return {
        ...state,
        correctionRequest: action.payload,
        correctionRequestSuccess: true,
        correctionRequestError: false,
        correctionRequestLoading: false,
      };
    case "CORRECTION_REQUEST_FAILED":
      return {
        ...state,
        correctionRequestError: true,
        correctionRequestSuccess: false,
        correctionRequestLoading: false,
        correctionRequestMsg: action.message,
      };
    case "KMP_RELATIVE_FETCH_LOADING":
      return {
        ...state,
        kmRelativeError: false,
        kmRelativeSuccess: false,
        kmRelativeLoading: true,
      };
    case "KMP_RELATIVE_FETCH_SUCCESS":
      return {
        ...state,
        kmRelativeError: false,
        kmRelativeSuccess: true,
        kmRelativeLoading: false,
        kmRelative: action.payload,
      };
    case "KMP_RELATIVE_FETCH_ERROR":
      return {
        ...state,
        kmRelativeError: true,
        kmRelativeSuccess: false,
        kmRelativeLoading: false,
      };
    case "GET_FOILIOS_SUCCESS":
      return {
        ...state,
        getFolio: action.payload,
        getFolioSuccess: true,
        getFolioError: false,
      };
    case "UPSI_FETCH_LOADING":
      return {
        ...state,
        upsiFetchSuccess: false,
        upsiFetchError: false,
        upsiFetchLoading: true,
      };
    case "UPSI_FETCH_SUCCESS":
      return {
        ...state,
        upsiList: action.payload,
        upsiFetchSuccess: true,
        upsiFetchError: false,
        upsiFetchLoading: false,
      };
    case "UPSI_FETCH_ERROR":
      return {
        ...state,
        upsiFetchSuccess: false,
        upsiFetchError: true,
        upsiFetchLoading: false,
      };
    case "CORRECTION_FETCH_LOADING":
      return {
        ...state,
        correctionUserSuccess: false,
        correctionUserError: false,
        correctionUserLoading: true,
      };
    case "CORRECTION_FETCH_SUCCESS":
      return {
        ...state,
        correctionUserList: action.payload,
        correctionUserSuccess: true,
        correctionUserError: false,
        correctionUserLoading: false,
      };
    case "CORRECTION_FETCH_ERROR":
      return {
        ...state,
        correctionUserSuccess: false,
        correctionUserError: true,
        correctionUserLoading: false,
      };
    case "RELESE_KMP_LOADING":
      return {
        ...state,
        releseKmpSuccess: false,
        releseKmpError: false,
        releseKmpLoading: true,
      };
    case "RELESE_KMP_SUCCESS":
      return {
        ...state,
        releseKmpList: action.payload,
        releseKmpSuccess: true,
        releseKmpError: false,
        releseKmpLoading: false,
      };
    case "RELESE_KMP_ERROR":
      return {
        ...state,
        releseKmpSuccess: false,
        releseKmpError: true,
        releseKmpLoading: false,
        releseKmpMsg: action.message
      };
    case "ACTIVITY_LOG_SUCCESS":
      return {
        ...state,
        activityLog: action.payload,
        activityLogSuccess: true,
        activityLogError: false,
        activityLogLoading: false,
      };
    case "ACTIVITY_LOG_ERROR":
      return {
        ...state,
        activityLogSuccess: false,
        activityLogError: true,
        activityLogLoading: false,
      };
    case "REQUEST_ACTION_LOADING":
      return {
        ...state,
        requestActionSuccess: false,
        requestActionError: false,
        requestActionLoading: true,
      };
    case "REQUEST_ACTION_SUCCESS":
      return {
        ...state,
        request: action.payload,
        requestActionSuccess: true,
        requestActionError: false,
        requestActionLoading: false,
      };
    case "REQUEST_ACTION_FAIL":
      return {
        ...state,
        requestActionSuccess: false,
        requestActionError: true,
        requestActionLoading: false,
        requestMessage: action.message,
      };
    case "BULK_MAIL_LOADING":
      return {
        ...state,
        bulkMailSuccess: false,
        bulkMailError: false,
        bulkMailLoading: true,
      };
    case "BULK_MAIL_SUCCESS":
      return {
        ...state,
        bulkMailSuccess: true,
        bulkMailError: false,
        bulkMailLoading: false,
      };
    case "BULK_MAIL_ERROR":
      return {
        ...state,
        bulkMailSuccess: false,
        bulkMailError: true,
        bulkMailLoading: false,
        bulkMailMessage: action.message,
      };
    case "SHARE_UPSI_LOADING":
      return {
        ...state,
        shareUpsiSuccess: false,
        shareUpsiError: false,
        shareUpsiLoading: true,
      };
    case "SHARE_UPSI_SUCCESS":
      return {
        ...state,
        shareUpsiSuccess: true,
        shareUpsiError: false,
        shareUpsiLoading: false,
      };
    case "SHARE_UPSI_ERROR":
      return {
        ...state,
        shareUpsiSuccess: false,
        shareUpsiError: true,
        shareUpsiLoading: false,
        shareUpsiMsg: action.message,
      };
    case "RESET_PASSWORD_LOADING":
      return {
        ...state,
        resestPassSuccess: false,
        resestPassError: false,
        resestPassLoading: true,
      };
    case "RESET_PASSWORD_SUCCESS":
      return {
        ...state,
        resetPass: action.payload,
        resestPassSuccess: true,
        resestPassError: false,
        resestPassLoading: false,
        resestPassMsg: action.message
      };
    case "RESET_PASSWORD_FAIL":
      return {
        ...state,
        resestPassSuccess: false,
        resestPassError: true,
        resestPassLoading: false,
      };
    case "WINDOW_CONFIGURATION_LOADING":
      return {
        ...state,
        windowConfigLoding: true,
        windowConfigSuccess: false,
        windowConfigError: false,
      };
    case "WINDOW_CONFIGURATION_ERROR":
      return {
        ...state,
        windowConfigLoding: false,
        windowConfigSuccess: false,
        windowConfigError: true,
        windowConfigMsg: action.message,
      };
    case "WINDOW_CONFIGURATION_SUCCESS":
      return {
        ...state,
        windowConfigLoding: false,
        windowConfigSuccess: true,
        windowConfigError: false,
      };
    case "WINDOW_CONFIGURATION_SUBMIT_&_SEND_LOADING":
      return {
        ...state,
        windowConfigSubmitSendLoding: true,
        windowConfigSubmitSendSuccess: false,
        windowConfigSubmitSendError: false,
      };
    case "WINDOW_CONFIGURATION_SUBMIT_&_SEND_ERROR":
      return {
        ...state,
        windowConfigSubmitSendLoding: false,
        windowConfigSubmitSendSuccess: false,
        windowConfigSubmitSendError: true,
        windowConfigMsg: action.message,
      };
    case "WINDOW_CONFIGURATION_SUBMIT_&_SEND_SUCCESS":
      return {
        ...state,
        windowConfigSubmitSendLoding: false,
        windowConfigSubmitSendSuccess: true,
        windowConfigSubmitSendError: false,
      };
    case "EMAILPAN_REQUEST_LOADING":
      return {
        ...state,
        emailPanRequestLoading: true,
        emailPanRequestSuccess: false,
        emailPanRequestError: false,
      };
    case "EMAILPAN_REQUEST_SUCCESS":
      return {
        ...state,
        emailPanRequestLoading: false,
        emailPanRequestSuccess: true,
        emailPanRequestError: false,
      };
    case "EMAILPAN_REQUEST_FAILED":
      return {
        ...state,
        emailPanRequestLoading: false,
        emailPanRequestSuccess: false,
        emailPanRequestError: true,
        errorMassege: action.massege,
      };
    case "TEMPLATE_FETCH_SUCCESS":
      return {
        ...state,
        tempalteLoading: false,
        tempalteSuccess: true,
        tempalteError: false,
        tempaltes: action.payload,
      };
    case "TEMPLATE_FETCH_ERROR":
      return {
        ...state,
        tempalteLoading: false,
        tempalteSuccess: true,
        tempalteError: false,
      };
    case "UPDATE_TEMPLATE_LOADING":
      return {
        ...state,
        updateTemplateLoading: true,
        updateTemplateSuccess: false,
        updateTemplateError: false,
      };
    case "UPDATE_TEMPLATE_SUCCESS":
      return {
        ...state,
        updateTemplateLoading: false,
        updateTemplateSuccess: true,
        updateTemplateError: false,
      };
    case "UPDATE_TEMPLATE_ERROR":
      return {
        ...state,
        updateTemplateLoading: false,
        updateTemplateSuccess: false,
        updateTemplateError: true,
        message: action.message,
      };
    case "RESTORE_LOADING":
      return {
        ...state,
        restoreLoading: true,
        restoreSuccess: false,
        restoreError: false,
      }
    case "RESTORE_SUCCESS":
      return {
        ...state,
        restoreLoading: false,
        restoreSuccess: true,
        restoreError: false,
      }
    case "RESTORE_ERROR":
      return {
        ...state,
        restoreLoading: false,
        restoreSuccess: false,
        restoreError: true,
      }
    case "BACKUP_LOADING":
      return {
        ...state,
        backupLoading: true,
        backupSuccess: false,
        backupError: false,
      }
    case "BACKUP_SUCCESS":
      return {
        ...state,
        backupLoading: false,
        backupSuccess: true,
        backupError: false,
      }
    case "BACKUP_ERROR":
      return {
        ...state,
        backupLoading: false,
        backupSuccess: false,
        backupError: true,
      }
    case "LOGOUT_SUCCESS":
      return initState;
    default:
      return state;
  }
};
export default HodReducer;
