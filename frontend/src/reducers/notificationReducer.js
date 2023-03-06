import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_FAIL,
  NOTIFICATION_RESET,
  CLEAR_ERRORS,
  ALL_NOTIFICATIONS_REQUEST,
  ALL_NOTIFICATIONS_SUCCESS,
  ALL_NOTIFICATIONS_FAIL,
  DELETE_NOTIFICATION_FAIL,
  DELETE_NOTIFICATION_REQUEST,
  DELETE_NOTIFICATION_SUCCESS,
} from "../constants/notificationConstants";

export const newNotificationReducer = (state = {}, action) => {
  switch (action.type) {
    case NOTIFICATION_REQUEST:
    case ALL_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_NOTIFICATION_REQUEST:
      return {
        ...state,
        isDeleted: false,
      };
    case NOTIFICATION_SUCCESS:
      return {
        loading: false,
        success: true,
        ...state,
      };
    case DELETE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        reminderNotifications: action.payload
          ? state.reminderNotifications.filter((item) => {
              return item._id !== action.payload;
            })
          : [],
        actionNotifications: action.payload
          ? state.actionNotifications.filter((item) => {
              return item._id !== action.payload;
            })
          : [],
      };
    case ALL_NOTIFICATIONS_SUCCESS:
      return {
        loading: false,
        success: true,
        reminderNotifications: action.payload?.reminderNotifications,
        actionNotifications: action.payload?.actionNotifications,
      };
    case ALL_NOTIFICATIONS_FAIL:
    case NOTIFICATION_FAIL:
      return {
        loading: false,
        error: action.payload?.data?.message,
      };
    case DELETE_NOTIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case NOTIFICATION_RESET:
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
