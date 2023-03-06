import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_FAIL,
  CLEAR_ERRORS,
  ALL_NOTIFICATIONS_REQUEST,
  ALL_NOTIFICATIONS_SUCCESS,
  ALL_NOTIFICATIONS_FAIL,
  DELETE_NOTIFICATION_FAIL,
  DELETE_NOTIFICATION_REQUEST,
  DELETE_NOTIFICATION_SUCCESS,
} from "../constants/notificationConstants";
import axios from "axios";

const REMINDER = "REMINDER";

// Create Notifications.
export const createNotification = (notification) => async (dispatch) => {
  try {
    dispatch({ type: NOTIFICATION_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/v1/notification/new",
      notification,
      config
    );
    dispatch({ type: NOTIFICATION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_FAIL,
      payload: error.response,
    });
  }
};

// Get All Notifications
export const getAllNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_NOTIFICATIONS_REQUEST });

    const { data } = await axios.get("/api/v1/notification/all");
    const dataClone = data;

    let reminderNotifications = [];
    let actionNotifications = [];

    dataClone?.orders.map((a) => {
      if (a.action === REMINDER) {
        reminderNotifications.push(a);
      } else {
        actionNotifications.push(a);
      }
    });

    dispatch({
      type: ALL_NOTIFICATIONS_SUCCESS,
      payload: { reminderNotifications, actionNotifications },
    });
  } catch (error) {
    dispatch({
      type: ALL_NOTIFICATIONS_FAIL,
      payload: error?.response?.data?.message,
    });
  }
};

// Delete Notification
export const deleteNotification = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_NOTIFICATION_REQUEST });

    const { data } = await axios.delete(`/api/v1/notification/delete/${id}`);

    dispatch({
      type: DELETE_NOTIFICATION_SUCCESS,
      payload: data.id,
    });
  } catch (error) {
    dispatch({
      type: DELETE_NOTIFICATION_FAIL,
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
