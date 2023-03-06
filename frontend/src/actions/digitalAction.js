import {
  ALL_DIGITAL_FAIL,
  ALL_DIGITAL_REQUEST,
  ALL_DIGITAL_SUCCESS,
  CREATE_DIGITAL_FAIL,
  CREATE_DIGITAL_REQUEST,
  CREATE_DIGITAL_SUCCESS,
  CLEAR_ERRORS,
  UPDATE_DIGITAL_REQUEST,
  UPDATE_DIGITAL_SUCCESS,
  UPDATE_DIGITAL_FAIL,
  DELETE_DIGITAL_REQUEST,
  DELETE_DIGITAL_SUCCESS,
  DELETE_DIGITAL_FAIL,
  DIGITAL_DETAILS_FAIL,
  DIGITAL_DETAILS_REQUEST,
  DIGITAL_DETAILS_SUCCESS,
} from "../constants/digitalConstants";
import axios from "axios";

// Create Order.
export const createDigitalOrder = (customer) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_DIGITAL_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let dataSend = null;
    let particularsArrayObj = null;
    let paymentDataObj = {};

    for (let [name, value] of customer) {
      if (name === "particulars") {
        particularsArrayObj = JSON.parse(value);
      } else {
        paymentDataObj[name] = value;
      }
    }
    paymentDataObj["particulars"] = particularsArrayObj;

    const { data } = await axios.post(
      "/api/v1/digital/action/create",
      paymentDataObj,
      config
    );
    dataSend = data;

    dispatch({ type: CREATE_DIGITAL_SUCCESS, payload: dataSend });
  } catch (error) {
    dispatch({
      type: CREATE_DIGITAL_FAIL,
      payload: error.response,
    });
  }
};

// Get Digital Order Details
export const getDigitalOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: DIGITAL_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/digital/details/${id}`);

    dispatch({ type: DIGITAL_DETAILS_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: DIGITAL_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Digital Orders
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_DIGITAL_REQUEST });

    const { data } = await axios.get("/api/v1/digital/action/all");

    dispatch({ type: ALL_DIGITAL_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: ALL_DIGITAL_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Digital Order
export const updateDigitalOrder = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_DIGITAL_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    let dataObj = {};
    for (let [name, value] of productData) {
      if (name === "particulars") {
        dataObj[name] = JSON.parse(value);
      } else {
        dataObj[name] = value;
      }
    }

    const { data } = await axios.put(
      `/api/v1/digital/action/update/${id}`,
      dataObj,
      config
    );

    dispatch({
      type: UPDATE_DIGITAL_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_DIGITAL_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Customer
export const deleteDigitalOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_DIGITAL_REQUEST });

    const { data } = await axios.delete(`/api/v1/digital/action/delete/${id}`);

    dispatch({
      type: DELETE_DIGITAL_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_DIGITAL_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
