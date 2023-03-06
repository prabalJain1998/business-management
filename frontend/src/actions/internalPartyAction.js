import {
  CREATE_INTERNAL_PARTY_REQUEST,
  CREATE_INTERNAL_PARTY_SUCCESS,
  CREATE_INTERNAL_PARTY_FAIL,
  INTERNAL_PARTY_DETAILS_SUCCESS,
  INTERNAL_PARTY_DETAILS_FAIL,
  INTERNAL_PARTY_DETAILS_REQUEST,
  ALL_INTERNAL_PARTY_FAIL,
  ALL_INTERNAL_PARTY_REQUEST,
  ALL_INTERNAL_PARTY_SUCCESS,
  UPDATE_INTERNAL_PARTY_FAIL,
  UPDATE_INTERNAL_PARTY_REQUEST,
  UPDATE_INTERNAL_PARTY_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/internalPartyConstants";
import axios from "axios";

// Create Party
export const createInternalParty = (party) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_INTERNAL_PARTY_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      "/api/v1/internal/party/new",
      party,
      config
    );
    dispatch({ type: CREATE_INTERNAL_PARTY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_INTERNAL_PARTY_FAIL,
      payload: error.response,
    });
  }
};

// Get Party Details
export const getInternalPartyDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: INTERNAL_PARTY_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/internal/party/${id}`);

    dispatch({ type: INTERNAL_PARTY_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: INTERNAL_PARTY_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Parties
export const getAllInternalParties = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_INTERNAL_PARTY_REQUEST });
    const party = await axios.get("/api/v1/internal/party/search/all");

    dispatch({ type: ALL_INTERNAL_PARTY_SUCCESS, payload: party.data });
  } catch (error) {
    dispatch({
      type: ALL_INTERNAL_PARTY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Party
export const updateInternalParty = (id, partyData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_INTERNAL_PARTY_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/v1/internal/party/${id}`,
      partyData,
      config
    );

    dispatch({ type: UPDATE_INTERNAL_PARTY_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_INTERNAL_PARTY_FAIL,
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
