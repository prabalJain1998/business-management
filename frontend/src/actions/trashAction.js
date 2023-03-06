import {
  ALL_TRASH_FAIL,
  ALL_TRASH_REQUEST,
  ALL_TRASH_SUCCESS,
  CREATE_TRASH_FAIL,
  CREATE_TRASH_REQUEST,
  CREATE_TRASH_SUCCESS,
  DELETE_TRASH_FAIL,
  DELETE_TRASH_REQUEST,
  DELETE_TRASH_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/trashConstants";
import axios from "axios";

// Create Trash Order.
export const createTrashOrder = (customer) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TRASH_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let route = `/api/v1/trash/new`;
    const { data } = await axios.post(route, customer, config);

    dispatch({ type: CREATE_TRASH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_TRASH_FAIL,
      payload: error.response,
    });
  }
};

// Get All Trash Orders (admin)
export const getAllTrashOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_TRASH_REQUEST });

    const { data } = await axios.get("/api/v1/trash/orders");

    dispatch({ type: ALL_TRASH_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: ALL_TRASH_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Trash Order
export const deleteTrashOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TRASH_REQUEST });

    const { data } = await axios.delete(`/api/v1/trash/order/${id}`);

    dispatch({
      type: DELETE_TRASH_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_TRASH_FAIL,
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
