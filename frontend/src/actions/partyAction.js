import {
  CREATE_PARTY_REQUEST,
  CREATE_PARTY_SUCCESS,
  CREATE_PARTY_FAIL,
  PARTY_DETAILS_SUCCESS,
  PARTY_DETAILS_FAIL,
  PARTY_DETAILS_REQUEST,
  ALL_PARTY_FAIL,
  ALL_PARTY_REQUEST,
  ALL_PARTY_SUCCESS,
  UPDATE_PARTY_FAIL,
  UPDATE_PARTY_REQUEST,
  UPDATE_PARTY_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/partyConstants";
import axios from "axios";

// Create Party
export const createParty = (party) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PARTY_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post("/api/v1/party/new", party, config);
    dispatch({ type: CREATE_PARTY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_PARTY_FAIL,
      payload: error.response,
    });
  }
};

// Get Party Details
export const getPartyDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PARTY_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/party/${id}`);

    dispatch({ type: PARTY_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PARTY_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Parties
export const getAllParties = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PARTY_REQUEST });
    const party = await axios.get("/api/v1/party/search/all");

    dispatch({ type: ALL_PARTY_SUCCESS, payload: party.data });
  } catch (error) {
    dispatch({
      type: ALL_PARTY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Party
export const updateParty = (id, partyData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PARTY_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(`/api/v1/party/${id}`, partyData, config);

    dispatch({ type: UPDATE_PARTY_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PARTY_FAIL,
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
