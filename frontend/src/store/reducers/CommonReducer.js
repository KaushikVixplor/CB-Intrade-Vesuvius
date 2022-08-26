const initState = {
  leftBarItem: "",
  leftBarSuccess: false,
  leftBarError: false,
  leftBarLoading: false,

  goToCompare: "",
  goToCompareSuccess: false,
  goToCompareError: false,
  goToCompareLoading: false,

  addRelativeFlag: "",
  addRelativeFlagSuccess: false,
  addRelativeFlagError: false,
  addRelativeFlagLoading: false,

  requestFetchLoading: false,
  requestFetch: false,
  requestFetchLoading: false,
  requests: [],

  getCompanyData: [],
  getCompanyDataLoading: false,
  getCompanyDataSuccess: false,
  getCompanyDataError: false,

  sharePdfSuccess: false,
  sharePdfLoading: false,
  sharePdfError: false,
  sharePdfMsg: null,

  systemResetSuccess: false,
  systemResetLoading: false,
  systemResetError: false,
  message: null,

  pdfDownloadError: false,

  updateEmployeeLoading: false,
  updateEmployeeSuccess: false,
  updateEmployeeErroe: false,
  updateEmployeeData: null,
  updateEmployeeMsg: null,

  
  updateUPSIAccessLoading: false,
  updateUPSIAccessSuccess: false,
  updateUPSIAccessError: false,
  updateUPSIAccessData: null,
  updateUPSIAccessMsg: null
};

const CommonReducer = (state = initState, action) => {
  switch (action.type) {
    case "NAV_CLICK_SUCCESS":
      return {
        ...state,
        leftBarItem: action.payload,
        leftBarSuccess: true,
        leftBarError: false,
        leftBarLoading: false,
      };
    case "GO_TO_COMPARE_SUCCESS":
      return {
        ...state,
        goToCompare: action.payload,
        goToCompareSuccess: true,
        goToCompareError: false,
        goToCompareLoading: false,
      };
    case "ADD_RELATIVE_FLAG_SUCCESS":
      return {
        ...state,
        addRelativeFlag: action.payload,
        addRelativeFlagSuccess: true,
        addRelativeFlagError: false,
        addRelativeFlagLoading: false,
      };
    case "FETCH_REQUEST_LIST_LOADING":
      return {
        ...state,
        requestFetchLoading: true,
        requestFetchSuccess: false,
        requestFetchError: false,
        requests: [],
      };
    case "FETCH_REQUEST_LIST_SUCCESS":
      console.error("in reducer:: ",action.payload)
      return {
        ...state,
        requestFetchLoading: false,
        requestFetchSuccess: true,
        requestFetchError: false,
        requests: action.payload,
      };
    case "FETCH_REQUEST_LIST_ERROR":
      return {
        ...state,
        requestFetchLoading: false,
        requestFetchSuccess: false,
        requestFetchError: true,
      };
    case "GET_COMPANY_DATA_SUCCESS":
      return {
        getCompanyData: action.payload.data["0"],
        getCompanyDataLoading: false,
        getCompanyDataSuccess: true,
        getCompanyDataError: false,
      };
    case "GET_COMPANY_DATA_ERROR":
      return {
        getCompanyDataLoading: false,
        getCompanyDataSuccess: false,
        getCompanyDataError: true,
      };
    case "SYSTEM_RESET_LOADING":
      return {
        systemResetSuccess: false,
        systemResetLoading: true,
        systemResetError: false,
      };
    case "SYSTEM_RESET_SUCCESS":
      return {
        systemResetSuccess: true,
        systemResetLoading: false,
        systemResetError: false,
      };
    case "SYSTEM_RESET_ERROR":
      return {
        systemResetSuccess: false,
        systemResetLoading: false,
        systemResetError: true,
        message: action.message,
      };
    case "SHARE_PDF_SUCCESS":
      return {
        ...state,
        sharePdfSuccess: true,
        sharePdfLoading: false,
        sharePdfError: false,
      };
    case "SHARE_PDF_ERROR":
      return {
        ...state,
        sharePdfSuccess: false,
        sharePdfLoading: false,
        sharePdfError: true,
        sharePdfMsg: action.message,
      };
    case "SHARE_PDF_LOADING":
      return {
        ...state,
        sharePdfSuccess: false,
        sharePdfLoading: true,
        sharePdfError: false,
      };
    case 'UPDATE_EMPLOYEE_LOADING':
      return {
        ...state,
        updateEmployeeLoading: true,
        updateEmployeeSuccess: false,
        updateEmployeeErroe: false,
        updateEmployeeData: null,
        updateEmployeeMsg: null
      }
    case 'UPDATE_EMPLOYEE_SUCCESS':
      return {
        ...state,
        updateEmployeeLoading: false,
        updateEmployeeSuccess: true,
        updateEmployeeErroe: false,
        updateEmployeeData: action.data,
        updateEmployeeMsg: action.message
      }
    case 'UPDATE_EMPLOYEE_ERROR':
      return {
        ...state,
        updateEmployeeLoading: false,
        updateEmployeeSuccess: false,
        updateEmployeeErroe: true,
        updateEmployeeData: action.data,
        updateEmployeeMsg: action.message
      }
    case 'UPDATE_UPSI_ACCESS_LOADING':
      return {
        ...state,
        updateUPSIAccessLoading: true,
        updateUPSIAccessSuccess: false,
        updateUPSIAccessError: false,
        updateUPSIAccessData: null,
        updateUPSIAccessMsg: null
      }
    case 'UPDATE_UPSI_ACCESS_SUCCESS':
      return {
        ...state,
        updateUPSIAccessLoading: false,
        updateUPSIAccessSuccess: true,
        updateUPSIAccessError: false,
        updateUPSIAccessData: action.data,
        updateUPSIAccessMsg: action.message
      }
    case 'UPDATE_UPSI_ACCESS_ERROR':
      return {
        ...state,
        updateUPSIAccessLoading: false,
        updateUPSIAccessSuccess: false,
        updateUPSIAccessError: true,
        updateUPSIAccessData: action.data,
        updateUPSIAccessMsg: action.message
      }
    // case "LOGOUT_SUCCESS":
    //   return {
    //     leftBarItem: "",
    //     leftBarSuccess: false,
    //     leftBarError: false,
    //     leftBarLoading: false,

    //     goToCompare: "",
    //     goToCompareSuccess: false,
    //     goToCompareError: false,
    //     goToCompareLoading: false,

    //     addRelativeFlag: "",
    //     addRelativeFlagSuccess: false,
    //     addRelativeFlagError: false,
    //     addRelativeFlagLoading: false,

    //     requestFetchLoading: false,
    //     requestFetch: false,
    //     requestFetchLoading: false,
    //     requests: [],

    //     sharePdfSuccess: false,
    //     sharePdfLoading: false,
    //     sharePdfError: false,

    //     systemResetSuccess: false,
    //     systemResetLoading: false,
    //     systemResetError: false,
    //   };
    case "ERROR_IN_DOWNLOAD_PDF":
      return {
        ...state,
        pdfDownloadError: true,
      };
    case 'RESET_REDUCER': 
    return {
      ...state, ...action.data
    }
    default:
      return state;
  }
};
export default CommonReducer;
