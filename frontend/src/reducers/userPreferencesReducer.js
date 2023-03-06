const SET_TAB = "SET_TAB";
const SET_DRAWER = "SET_DRAWER";

export const userPreferencesReducer = (
  state = {
    tab: 1,
    drawer: false,
  },
  action
) => {
  switch (action.type) {
    case SET_TAB:
      return {
        ...state,
        tab: action.payload?.tabId,
      };
    case SET_DRAWER:
      return {
        ...state,
        drawer: action.payload?.drawer,
      };
    default:
      return state;
  }
};
