import {
  CREATE_LOG_REQUEST,
  CREATE_LOG_SUCCESS,
  CREATE_LOG_FAIL,
  LOG_RESET,
  CLEAR_ERRORS,
  ALL_LOG_FAIL,
  ALL_LOG_REQUEST,
  ALL_LOG_RESET,
  ALL_LOG_SUCCESS,
  PAYMENT_COLLECTED,
} from "../constants/logsConstants.js";

const initialState = {
  loadingCreateLog: null,
  createLogSuccess: null,
  errorCreateLog: null,
  loadingAllLogs: null,
  logs: null,
  paymentLogs: null,
  errorlogs: null,
};

export const logsReducer = (
  state = {
    ...initialState,
  },
  action
) => {
  switch (action.type) {
    case CREATE_LOG_REQUEST:
      return {
        ...state,
        loadingCreateLog: true,
      };

    case ALL_LOG_REQUEST:
      return {
        ...state,
        loadingAllLogs: true,
      };

    case CREATE_LOG_SUCCESS:
      return {
        ...state,
        loadingCreateLog: false,
        createLogSuccess: true,
      };

    case ALL_LOG_SUCCESS:
      return {
        ...state,
        loadingAllLogs: false,
        logs: action.payload?.logs,
        paymentLogs: action.payload?.paymentLogs,
      };

    case CREATE_LOG_FAIL:
      return {
        ...state,
        loadingCreateLog: false,
        errorCreateLog: true,
      };

    case ALL_LOG_FAIL:
      return {
        ...state,
        loadingAllLogs: false,
        logs: null,
        paymentLogs: null,
        errorlogs: true,
      };
    case CLEAR_ERRORS:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
