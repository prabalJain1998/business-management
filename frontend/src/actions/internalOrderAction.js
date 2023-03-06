import {} from "../constants/customerConstants";
import axios from "axios";

// Create Order. [ Not used]
export const createCustomer = (customer) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CUSTOMER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let send_payment_data = false;

    for (let [name, value] of customer) {
      if (name === "orderStatus") {
        if (value === "PAYMENT") {
          send_payment_data = true;
          break;
        }
      }
    }

    let dataObj = {};
    let dataSend = null;

    if (!send_payment_data) {
      for (let [name, value] of customer) {
        if (name === "particulars") {
          dataObj[name] = JSON.parse(value);
        } else {
          dataObj[name] = value;
        }
      }
      const { data } = await axios.post(
        "/api/v1/customer/new",
        dataObj,
        config
      );

      dataSend = data;
    } else {
      let paymentDataObj = {};

      for (let [name, value] of customer) {
        if (name === "particulars") {
          paymentDataObj[name] = [
            {
              item: value,
              quantity: 0,
              price: 0,
              total: 0,
            },
          ];
        } else {
          paymentDataObj[name] = value;
        }
      }

      const { data } = await axios.post(
        "/api/v1/customer/new",
        paymentDataObj,
        config
      );
      dataSend = data;
    }
    dispatch({ type: CREATE_CUSTOMER_SUCCESS, payload: dataSend });
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
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_CUSTOMER_REQUEST });

    const { data } = await axios.get("/api/v1/customer/admin/orders");

    dispatch({ type: ALL_CUSTOMER_SUCCESS, payload: data.orders });
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
export const updateCustomer = (id, productData) => async (dispatch) => {
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
  } catch (error) {
    dispatch({
      type: UPDATE_CUSTOMER_FAIL,
      payload: error.response.data.message,
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
  } catch (error) {
    dispatch({
      type: UPDATE_CUSTOMER_STATUS_FAIL,
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
