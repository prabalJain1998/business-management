import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userReducer } from "./reducers/userReducer";
import {
  newCustomerReducer,
  customerDetailsReducer,
  allCustomersReducer,
  allCustomersByNameReducer,
  customerReducer,
  allCustomersByPartyIDReducer,
} from "./reducers/customerReducer";
import {
  newPartyReducer,
  allPartyReducer,
  partyDetailsReducer,
  partyReducer,
} from "./reducers/partyReducer";
import {
  newInternalPartyReducer,
  allInternalPartyReducer,
  internalPartyDetailsReducer,
  internalPartyReducer,
} from "./reducers/internalPartyReducer";
import {
  newTrashReducer,
  allTrashReducer,
  trashDeleteReducer,
} from "./reducers/trashReducer";
import {
  newProductReducer,
  productReducer,
  allProductsReducer,
  productDetailsReducer,
} from "./reducers/productReducer";
import {
  newDigitalReducer,
  digitalOrderReducer,
  allDigitalOrderReducer,
  digitalDetailsReducer,
} from "./reducers/digitalReducer";
import { newNotificationReducer } from "./reducers/notificationReducer";
import { showPopUpReducer } from "./reducers/popupReducer.js";
import { cacheReducer } from "./reducers/cacheReducer.js";
import { userPreferencesReducer } from "./reducers/userPreferencesReducer.js";
import { logsReducer } from "./reducers/logsReducer.js";

const reducer = combineReducers({
  user: userReducer,
  newCustomer: newCustomerReducer,
  customerDetails: customerDetailsReducer,
  allCustomers: allCustomersReducer,
  searchByNameOrParty: allCustomersByNameReducer,
  customer: customerReducer,
  newParty: newPartyReducer,
  allparties: allPartyReducer,
  partyDetails: partyDetailsReducer,
  party: partyReducer,
  newInternalParty: newInternalPartyReducer,
  allInternalParties: allInternalPartyReducer,
  internalPartyDetails: internalPartyDetailsReducer,
  internalParty: internalPartyReducer,
  customersByPartyID: allCustomersByPartyIDReducer,
  allTrashOrders: allTrashReducer,
  trashOrder: trashDeleteReducer,
  newTrashOrder: newTrashReducer,
  newProduct: newProductReducer,
  allProducts: allProductsReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  newDigitalOrder: newDigitalReducer,
  allDigitalOrder: allDigitalOrderReducer,
  digitalOrder: digitalOrderReducer,
  digitalDetails: digitalDetailsReducer,
  notification: newNotificationReducer,
  showPopUp: showPopUpReducer,
  cache: cacheReducer,
  userPreferences: userPreferencesReducer,
  logs: logsReducer,
});

let initialState = {
  showPopUp: {
    showPopUp: {
      showReminder: true,
    },
  },
};
const middleWare = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleWare))
);

export default store;
