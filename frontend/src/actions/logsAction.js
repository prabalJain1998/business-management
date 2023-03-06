import {
  CREATE_LOG_REQUEST,
  CREATE_LOG_SUCCESS,
  CREATE_LOG_FAIL,
  LOG_RESET,
  CLEAR_ERRORS,
  ALL_LOG_REQUEST,
  ALL_LOG_SUCCESS,
  ALL_LOG_FAIL,
} from "../constants/logsConstants.js";
import axios from "axios";
import store from "../store";

// Create Logs.
export const createLogs = (log) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_LOG_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/v1/logs/new", log, config);

    dispatch({ type: CREATE_LOG_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_LOG_FAIL,
      payload: error.response,
    });
  }
};

// Get All Logs
export const getAllLogs =
  ({ startDate, endDate }) =>
  async (dispatch) => {
    try {
      let link = "/api/v1/logs/all";
      if (startDate && endDate) {
        link = `/api/v1/logs/all?startDate=${startDate}&endDate=${endDate}`;
      }

      dispatch({ type: ALL_LOG_REQUEST });

      const { data } = await axios.get(link);

      const dataClone = data;

      dispatch({
        type: ALL_LOG_SUCCESS,
        payload: {
          logs: dataClone.logs,
          paymentLogs: dataClone.paymentLogs,
        },
      });
    } catch (error) {
      dispatch({
        type: ALL_LOG_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };
