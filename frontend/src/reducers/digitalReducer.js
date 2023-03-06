import {
  ALL_DIGITAL_FAIL,
  ALL_DIGITAL_REQUEST,
  ALL_DIGITAL_SUCCESS,
  CREATE_DIGITAL_FAIL,
  DELETE_DIGITAL_RESET,
  CREATE_DIGITAL_REQUEST,
  CREATE_DIGITAL_SUCCESS,
  CLEAR_ERRORS,
  UPDATE_DIGITAL_REQUEST,
  UPDATE_DIGITAL_SUCCESS,
  UPDATE_DIGITAL_FAIL,
  UPDATE_DIGITAL_RESET,
  DELETE_DIGITAL_REQUEST,
  DELETE_DIGITAL_SUCCESS,
  DELETE_DIGITAL_FAIL,
  NEW_DIGITAL_RESET,
  DIGITAL_DETAILS_FAIL,
  DIGITAL_DETAILS_REQUEST,
  DIGITAL_DETAILS_SUCCESS,
} from "../constants/digitalConstants";

export const newDigitalReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_DIGITAL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_DIGITAL_SUCCESS:
      return {
        loading: false,
        success: true,
        customer: action.payload,
      };
    case NEW_DIGITAL_RESET:
      return {
        ...state,
        success: false,
      };
    case CREATE_DIGITAL_FAIL:
      return {
        loading: false,
        error: action.payload.data.message,
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

export const digitalDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case DIGITAL_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case DIGITAL_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case DIGITAL_DETAILS_FAIL:
      return {
        ...state,
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

export const allDigitalOrderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ALL_DIGITAL_REQUEST:
      return {
        loading: true,
      };

    case ALL_DIGITAL_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case ALL_DIGITAL_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case NEW_DIGITAL_RESET:
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

export const digitalOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_DIGITAL_REQUEST:
    case UPDATE_DIGITAL_REQUEST:
      return {
        ...state,
        loading: true,
        isUpdated: false,
        error: null,
      };
    case DELETE_DIGITAL_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_DIGITAL_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_DIGITAL_FAIL:
    case UPDATE_DIGITAL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_DIGITAL_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_DIGITAL_RESET:
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
