import {
  CREATE_CUSTOMER_REQUEST,
  CREATE_CUSTOMER_SUCCESS,
  CREATE_CUSTOMER_FAIL,
  CUSTOMER_DETAILS_REQUEST,
  CUSTOMER_DETAILS_SUCCESS,
  CUSTOMER_DETAILS_FAIL,
  CUSTOMER_DETAILS_RESET,
  NEW_CUSTOMER_RESET,
  ALL_CUSTOMER_REQUEST,
  ALL_CUSTOMER_FAIL,
  ALL_CUSTOMER_UPDATE,
  ALL_CUSTOMER_SUCCESS,
  ALL_CUSTOMER_NAME_FAIL,
  ALL_CUSTOMER_NAME_REQUEST,
  ALL_CUSTOMER_NAME_SUCCESS,
  ALL_CUSTOMER_PARTY_FAIL,
  ALL_CUSTOMER_PARTY_REQUEST,
  ALL_CUSTOMER_PARTY_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  UPDATE_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_RESET,
  UPDATE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAIL,
  DELETE_CUSTOMER_REQUEST,
  DELETE_CUSTOMER_RESET,
  DELETE_CUSTOMER_SUCCESS,
  CLEAR_ERRORS,
  UPDATE_CUSTOMER_STATUS_REQUEST,
  UPDATE_CUSTOMER_STATUS_SUCCESS,
  UPDATE_CUSTOMER_STATUS_FAIL,
  UPDATE_CUSTOMER_STATUS_RESET,
  ALL_CUSTOMER_PARTY_ID_FAIL,
  ALL_CUSTOMER_PARTY_ID_REQUEST,
  ALL_CUSTOMER_PARTY_ID_SUCCESS,
  USER_CUSTOMER_DETAILS_REQUEST,
  USER_CUSTOMER_DETAILS_SUCCESS,
  USER_CUSTOMER_DETAILS_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
} from "../constants/customerConstants";
import _ from "lodash";

export const newCustomerReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_CUSTOMER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_CUSTOMER_SUCCESS:
      return {
        loading: false,
        success: true,
        customer: action.payload,
      };

    case CREATE_CUSTOMER_FAIL:
      return {
        loading: false,
        error: action?.payload?.data?.message,
      };
    case NEW_CUSTOMER_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const customerDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case CUSTOMER_DETAILS_REQUEST:
    case USER_CUSTOMER_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case CUSTOMER_DETAILS_SUCCESS:
    case USER_CUSTOMER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case CUSTOMER_DETAILS_FAIL:
    case USER_CUSTOMER_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CUSTOMER_DETAILS_RESET:
      return {
        ...state,
        order: {},
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const allCustomersReducer = (state = { customers: [] }, action) => {
  switch (action.type) {
    case ALL_CUSTOMER_REQUEST:
      return {
        loading: true,
      };

    case ALL_CUSTOMER_SUCCESS:
      return {
        loading: false,
        orders: action.payload?.orders,
        pendingOrders: action.payload?.pendingOrders,
        pendingPaymentOrders: action.payload?.partyPendingPaymentOrders,
        userPendingPaymentOrders: action.payload?.userPendingPaymentOrders,
        paymentOrders: action.payload?.paymentOrders,
        insights: action.payload?.insights,
        deletedOrders: action.payload?.deletedOrders,
      };

    case ALL_CUSTOMER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case ALL_CUSTOMER_UPDATE:
      return {
        loading: false,
        ...state,
        orders: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const allCustomersByNameReducer = (
  state = { customers: [] },
  action
) => {
  switch (action.type) {
    case ALL_CUSTOMER_NAME_REQUEST:
    case ALL_CUSTOMER_PARTY_REQUEST:
      return {
        loading: true,
      };
    case ALL_CUSTOMER_NAME_SUCCESS:
    case ALL_CUSTOMER_PARTY_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };

    case ALL_CUSTOMER_NAME_FAIL:
    case ALL_CUSTOMER_PARTY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const allCustomersByPartyIDReducer = (
  state = { customers: [] },
  action
) => {
  switch (action.type) {
    case ALL_CUSTOMER_PARTY_ID_REQUEST:
      return {
        loading: true,
      };
    case ALL_CUSTOMER_PARTY_ID_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case ALL_CUSTOMER_PARTY_ID_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const customerReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_CUSTOMER_REQUEST:
    case UPDATE_CUSTOMER_REQUEST:
    case UPDATE_CUSTOMER_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        isUpdated: false,
        error: null,
      };
    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
        isSend: false,
        error: null,
      };
    case DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        isSend: true,
      };

    case UPDATE_CUSTOMER_SUCCESS:
    case UPDATE_CUSTOMER_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_CUSTOMER_FAIL:
    case UPDATE_CUSTOMER_FAIL:
    case UPDATE_CUSTOMER_STATUS_FAIL:
    case SEND_MESSAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_CUSTOMER_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_CUSTOMER_RESET:
    case UPDATE_CUSTOMER_STATUS_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
