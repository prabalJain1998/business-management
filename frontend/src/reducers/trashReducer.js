import {
  CREATE_TRASH_FAIL,
  CREATE_TRASH_REQUEST,
  CREATE_TRASH_SUCCESS,
  ALL_TRASH_FAIL,
  ALL_TRASH_REQUEST,
  ALL_TRASH_SUCCESS,
  DELETE_TRASH_FAIL,
  DELETE_TRASH_REQUEST,
  DELETE_TRASH_SUCCESS,
  CLEAR_ERRORS,
  DELETE_TRASH_RESET,
} from "../constants/trashConstants";

export const newTrashReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_TRASH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_TRASH_SUCCESS:
      return {
        loading: false,
        success: true,
        customer: action.payload,
      };
    case CREATE_TRASH_FAIL:
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

export const allTrashReducer = (state = { customers: [] }, action) => {
  switch (action.type) {
    case ALL_TRASH_REQUEST:
      return {
        loading: true,
      };

    case ALL_TRASH_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };

    case ALL_TRASH_FAIL:
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

export const trashDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_TRASH_REQUEST:
      return {
        ...state,
        loading: true,
        isDeleted: false,
        error: null,
      };
    case DELETE_TRASH_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case DELETE_TRASH_RESET:
      return {
        ...state,
        error: null,
        loading: false,
        isDeleted: false,
      };
    case DELETE_TRASH_FAIL:
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
