import {
  CREATE_CUSTOMER_REQUEST,
  CREATE_CUSTOMER_SUCCESS,
  CREATE_CUSTOMER_FAIL,
  CLEAR_ERRORS,
  CUSTOMER_DETAILS_REQUEST,
  CUSTOMER_DETAILS_SUCCESS,
  CUSTOMER_DETAILS_FAIL,
  ALL_CUSTOMER_FAIL,
  ALL_CUSTOMER_REQUEST,
  ALL_CUSTOMER_SUCCESS,
  ALL_CUSTOMER_NAME_FAIL,
  ALL_CUSTOMER_NAME_REQUEST,
  ALL_CUSTOMER_NAME_SUCCESS,
  ALL_CUSTOMER_PARTY_FAIL,
  ALL_CUSTOMER_PARTY_REQUEST,
  ALL_CUSTOMER_PARTY_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  UPDATE_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAIL,
  DELETE_CUSTOMER_REQUEST,
  DELETE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_STATUS_FAIL,
  UPDATE_CUSTOMER_STATUS_REQUEST,
  UPDATE_CUSTOMER_STATUS_SUCCESS,
  ALL_CUSTOMER_PARTY_ID_REQUEST,
  ALL_CUSTOMER_PARTY_ID_SUCCESS,
  ALL_CUSTOMER_PARTY_ID_FAIL,
  USER_CUSTOMER_DETAILS_FAIL,
  USER_CUSTOMER_DETAILS_SUCCESS,
  USER_CUSTOMER_DETAILS_REQUEST,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  ALL_CUSTOMER_UPDATE,
} from "../constants/customerConstants";
import axios from "axios";
import store from "../store";

// Send Whatsapp
export const sendMessages = (messages) => async (dispatch) => {
  try {
    dispatch({ type: SEND_MESSAGE_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      "/api/v1/singhai/send",
      { data: messages },
      config
    );

    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: { success: true } });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: error.response,
    });
  }
};

// Create Order.
export const createCustomer = (customer) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CUSTOMER_REQUEST });
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
      "/api/v1/customer/new",
      paymentDataObj,
      config
    );
    dataSend = data;

    dispatch({ type: CREATE_CUSTOMER_SUCCESS, payload: dataSend });

    dispatch({
      type: "CACHE_SET",
      payload: {
        useCacheOrder: false,
      },
    });
  } catch (error) {
    dispatch({
      type: CREATE_CUSTOMER_FAIL,
      payload: error.response,
    });
  }
};

// Get Order Details
export const getCustomerDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/customer/${id}`);

    dispatch({ type: CUSTOMER_DETAILS_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: CUSTOMER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Order Details for User
export const getOrderDetailsForUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_CUSTOMER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/singhai/track/${id}`);
    const resp = {
      name: data.order.name,
      remainingAmount: data.order.remainingAmount,
      orderStatus: data.order.orderStatus,
    };
    dispatch({ type: USER_CUSTOMER_DETAILS_SUCCESS, payload: resp });
  } catch (error) {
    dispatch({
      type: USER_CUSTOMER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Order Details by Party ID
export const getAllOrdersByPartyID = (partyID) => async (dispatch) => {
  try {
    dispatch({ type: ALL_CUSTOMER_PARTY_ID_REQUEST });

    const { data } = await axios.get(`/api/v1/customer/party/${partyID}`);

    dispatch({ type: ALL_CUSTOMER_PARTY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ALL_CUSTOMER_PARTY_ID_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Orders (admin)
export const getAllOrders =
  ({ useCache, startDate, endDate }) =>
  async (dispatch) => {
    try {
      if (useCache && store.getState()?.cache?.useCacheOrder) {
        return;
      }

      let link = "/api/v1/customer/admin/orders";
      if (startDate && endDate) {
        link = `/api/v1/customer/admin/orders?startDate=${startDate}&endDate=${endDate}`;
      }

      dispatch({ type: ALL_CUSTOMER_REQUEST });
      const { data } = await axios.get(link);

      dispatch({
        type: ALL_CUSTOMER_SUCCESS,
        payload: {
          orders: data.orders,
          pendingOrders: data.pendingOrders,
          pendingPaymentOrders: data.pendingPaymentOrders,
          userPendingPaymentOrders: data.userPendingPaymentOrders,
          paymentOrders: data.paymentOrders,
          insights: data.insights,
          deletedOrders: data.deletedOrders,
        },
      });

      dispatch({
        type: "CACHE_SET",
        payload: {
          useCacheOrder: startDate && endDate ? false : true,
        },
      });
    } catch (error) {
      dispatch({
        type: ALL_CUSTOMER_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Get All Orders by Name (admin)
export const getAllOrdersByName = (name) => async (dispatch) => {
  try {
    dispatch({ type: ALL_CUSTOMER_NAME_REQUEST });
    const { data } = await axios.get(`/api/v1/customer/search/${name}`);

    dispatch({ type: ALL_CUSTOMER_NAME_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: ALL_CUSTOMER_NAME_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Orders by Party (admin)
export const getAllOrdersByParty = (partyName) => async (dispatch) => {
  try {
    dispatch({ type: ALL_CUSTOMER_PARTY_REQUEST });
    const { data } = await axios.get(
      `/api/v1/customer/search/party/${partyName}`
    );
    dispatch({ type: ALL_CUSTOMER_PARTY_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: ALL_CUSTOMER_PARTY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Customer
export const updateCustomer =
  (id, productData, orderStatus, orders) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_CUSTOMER_REQUEST });

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
        `/api/v1/customer/order/${id}`,
        dataObj,
        config
      );

      dispatch({
        type: UPDATE_CUSTOMER_SUCCESS,
        payload: data.success,
      });

      if (orderStatus) {
        for (let i = 0; i < orders.length; i++) {
          if (orders[i]._id === id) {
            orders[i]["orderStatus"] = orderStatus;
            break;
          }
        }

        dispatch({
          type: ALL_CUSTOMER_UPDATE,
          payload: orders,
        });
      }

      dispatch({
        type: "CACHE_SET",
        payload: {
          useCacheOrder: orderStatus ? true : false,
        },
      });
    } catch (error) {
      dispatch({
        type: UPDATE_CUSTOMER_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

// Update Customer
export const updateCustomerStatus = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CUSTOMER_STATUS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v1/customer/update/status/${id}`,
      productData,
      config
    );

    dispatch({
      type: UPDATE_CUSTOMER_STATUS_SUCCESS,
      payload: data.success,
    });

    dispatch({
      type: "CACHE_SET",
      payload: {
        useCacheOrder: false,
      },
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CUSTOMER_STATUS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Customer
export const sendCompletionMessage = (completionData) => async (dispatch) => {
  try {
    dispatch({ type: SEND_MESSAGE_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      `/api/v1/customer/send`,
      completionData,
      config
    );

    dispatch({
      type: SEND_MESSAGE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Customer
export const deleteCustomer = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CUSTOMER_REQUEST });

    const { data } = await axios.delete(`/api/v1/customer/order/${id}`);

    dispatch({
      type: DELETE_CUSTOMER_SUCCESS,
      payload: data.success,
    });

    dispatch({
      type: "CACHE_SET",
      payload: {
        useCacheOrder: false,
      },
    });
  } catch (error) {
    dispatch({
      type: DELETE_CUSTOMER_FAIL,
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
