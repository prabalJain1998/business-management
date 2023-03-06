import {
  CREATE_INTERNAL_PARTY_REQUEST,
  CREATE_INTERNAL_PARTY_SUCCESS,
  CREATE_INTERNAL_PARTY_FAIL,
  NEW_INTERNAL_PARTY_RESET,
  ALL_INTERNAL_PARTY_FAIL,
  ALL_INTERNAL_PARTY_REQUEST,
  ALL_INTERNAL_PARTY_SUCCESS,
  UPDATE_INTERNAL_PARTY_FAIL,
  UPDATE_INTERNAL_PARTY_REQUEST,
  UPDATE_INTERNAL_PARTY_RESET,
  UPDATE_INTERNAL_PARTY_SUCCESS,
  INTERNAL_PARTY_DETAILS_REQUEST,
  INTERNAL_PARTY_DETAILS_SUCCESS,
  INTERNAL_PARTY_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/internalPartyConstants";

export const newInternalPartyReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_INTERNAL_PARTY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_INTERNAL_PARTY_SUCCESS:
      return {
        loading: false,
        success: true,
        party: action.payload,
      };
    case CREATE_INTERNAL_PARTY_FAIL:
      return {
        loading: false,
        error: action.payload.data.message,
      };

    case NEW_INTERNAL_PARTY_RESET:
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

export const allInternalPartyReducer = (state = { party: [] }, action) => {
  switch (action.type) {
    case ALL_INTERNAL_PARTY_REQUEST:
      return {
        loading: true,
      };

    case ALL_INTERNAL_PARTY_SUCCESS:
      return {
        loading: false,
        party: action.payload,
      };

    case ALL_INTERNAL_PARTY_FAIL:
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

export const internalPartyDetailsReducer = (state = { party: {} }, action) => {
  switch (action.type) {
    case INTERNAL_PARTY_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };

    case INTERNAL_PARTY_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };

    case INTERNAL_PARTY_DETAILS_FAIL:
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

// Update Party Reducer
export const internalPartyReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_INTERNAL_PARTY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_INTERNAL_PARTY_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case UPDATE_INTERNAL_PARTY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_INTERNAL_PARTY_RESET:
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
