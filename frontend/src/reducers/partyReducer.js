import {
  CREATE_PARTY_REQUEST,
  CREATE_PARTY_SUCCESS,
  CREATE_PARTY_FAIL,
  CLEAR_ERRORS,
  NEW_PARTY_RESET,
  ALL_PARTY_FAIL,
  ALL_PARTY_REQUEST,
  ALL_PARTY_SUCCESS,
  UPDATE_PARTY_FAIL,
  UPDATE_PARTY_REQUEST,
  UPDATE_PARTY_RESET,
  UPDATE_PARTY_SUCCESS,
  PARTY_DETAILS_REQUEST,
  PARTY_DETAILS_SUCCESS,
  PARTY_DETAILS_FAIL,
} from "../constants/partyConstants";

export const newPartyReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_PARTY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_PARTY_SUCCESS:
      return {
        loading: false,
        success: true,
        party: action.payload,
      };

    case CREATE_PARTY_FAIL:
      return {
        loading: false,
        error: "Some Error Occured",
      };
    case NEW_PARTY_RESET:
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

export const allPartyReducer = (state = { party: [] }, action) => {
  switch (action.type) {
    case ALL_PARTY_REQUEST:
      return {
        loading: true,
      };
    case ALL_PARTY_SUCCESS:
      return {
        loading: false,
        party: action.payload,
      };
    case ALL_PARTY_FAIL:
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

export const partyDetailsReducer = (state = { party: {} }, action) => {
  switch (action.type) {
    case PARTY_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case PARTY_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case PARTY_DETAILS_FAIL:
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
export const partyReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PARTY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PARTY_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case UPDATE_PARTY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_PARTY_RESET:
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
