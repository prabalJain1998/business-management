import {
  CLEAR_ERRORS,
  POPUP_FAIL,
  POPUP_REQUEST,
  POPUP_SUCCESS,
  POPUP_RESET,
} from "../constants/notificationConstants";

export const showPopUpReducer = (state = { showReminder: true }, action) => {
  switch (action.type) {
    case POPUP_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POPUP_SUCCESS:
      return {
        loading: false,
        showReminder: true,
      };
    case POPUP_RESET:
      return {
        loading: null,
        showPopUp: {
          showReminder: false,
        },
      };
    case POPUP_FAIL:
      return {
        ...state,
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
