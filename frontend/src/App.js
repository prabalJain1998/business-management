import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import store from "./store.js";
import { loadUser } from "./actions/userAction.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { permissions } from "./permissions";
import ALLDigitalOrders from "./component/digital/ALLDigitalOrders.jsx";
import CreateProduct from "./component/product/CreateProduct.jsx";
import Products from "./component/product/Products.jsx";
import UpdateProduct from "./component/product/UpdateProduct.jsx";
import TrashOrders from "./component/trash/TrashOrders.jsx";
import DigitalCreateOrder from "./component/digital/DigitalCreateOrder.jsx";
import DigitalUpdateOrder from "./component/digital/DigitalUpdateOrder.jsx";
import CustomerCreateOrder from "./component/customer/CustomerCreateOrder.jsx";
import CustomerDetails from "./component/customer/CustomerDetails.jsx";
import CustomerSearch from "./component/customer/CustomerSearch.jsx";
import CustomerUpdateOrder from "./component/customer/CustomerUpdateOrder.jsx";
import CustomerDeleteOrder from "./component/customer/CustomerDeleteOrder.jsx";
import CustomerHomeBackground from "./component/customer/CustomerHomeBackground.jsx";
import CustomerLogin from "./component/customer/CustomerLogin.jsx";
import CustomerRegister from "./component/customer/CustomerRegister.jsx";
import Dashboard from "./component/customer/Dashboard.jsx";
import CustomerLogout from "./component/customer/CustomerLogout.jsx";
import CustomerUpdatePassword from "./component/customer/CustomerUpdatePassword.jsx";
import CustomerStatement from "./component/customer/CustomerStatement.jsx";
import NotFound from "./component/common/NotFound.jsx";
import CreateParty from "./component/party/CreateParty.jsx";
import ALLParty from "./component/party/ALLParty.jsx";
import Logs from "./component/Logs/Logs.jsx";
import UpdateParty from "./component/party/UpdateParty.jsx";
import PartySearch from "./component/party/PartySearch.jsx";
import PartyDetails from "./component/party/PartyDetails.jsx";
import CustomerPaymentOrder from "./component/customer/CustomerPaymentOrder.jsx";
import CustomerUpdateOrderStatus from "./component/customer/CustomerUpdateOrderStatus.jsx";
import CustomerOrderTrack from "./component/customer/CustomerOrderTrack.jsx";
import CreateInternalParty from "./component/internalParty/CreateInternalParty.jsx";
import ALLInternalParty from "./component/internalParty/ALLInternalParty.jsx";
import UpdateInternalParty from "./component/internalParty/UpdateInternalParty.jsx";
import InternalPartyDetails from "./component/internalParty/InternalPartyDetails.jsx";
import InternalPartyPayment from "./component/internalParty/InternalPartyPayment";
import DigitalPaymentOrder from "./component/digital/DigitalPaymentOrder";
import CombinedReceipt from "./component/common/CombinedReceipt";
import LogsPaymentOrder from "./component/Logs/LogsPaymentOrder";
import PaymentCollect from "./component/customer/PaymentCollect";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const designation = user?.permission;
  const PERMISSIONS = permissions[designation];

  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          "Roboto",
          "Driod Sans",
          "Chilanka",
          "Shalimar",
          "Anton",
          "Varela Round",
          "Pacifico",
          "Montserrat",
        ],
      },
    });
    store.dispatch(loadUser());
  }, []);

  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route exact path="/" element={<CustomerHomeBackground />} />

        {/* Dashboard Route */}
        {isAuthenticated && PERMISSIONS.DASHBOARD_VIEW && (
          <Route exact path="/dashboard" element={<Dashboard />} />
        )}

        {/* Order Routes */}
        {isAuthenticated && PERMISSIONS.ORDER_CREATE && (
          <Route
            exact
            path="/customer/create"
            element={<CustomerCreateOrder />}
          />
        )}
        {isAuthenticated && PERMISSIONS.ORDER_VIEW && (
          <Route path="/customers/:id" element={<CustomerDetails />} />
        )}
        {isAuthenticated && PERMISSIONS.ORDER_VIEW && (
          <Route path="/customers/advance/:id" element={<CombinedReceipt />} />
        )}
        {isAuthenticated && PERMISSIONS.ORDER_UPDATE && (
          <Route
            path="/customer/update/:id"
            element={<CustomerUpdateOrder />}
          />
        )}
        {isAuthenticated && PERMISSIONS.ORDER_DELETE && (
          <Route
            path="/customer/delete/:id"
            element={<CustomerDeleteOrder />}
          />
        )}

        {isAuthenticated && PERMISSIONS.ORDER_UPDATE_STATUS && (
          <Route
            exact
            path="/customer/updateOrderStatus/:id"
            element={<CustomerUpdateOrderStatus />}
          />
        )}
        {isAuthenticated && PERMISSIONS.ORDER_UPDATE_PAYMENT_STATUS && (
          <Route
            exact
            path="/customer/updatePaymentStatus/:id"
            element={<PaymentCollect />}
          />
        )}

        {isAuthenticated && PERMISSIONS.ORDER_SEARCH && (
          <Route exact path="/customer/search" element={<CustomerSearch />} />
        )}
        {isAuthenticated && PERMISSIONS.ORDER_ACCOUNT_STATEMENT_VIEW && (
          <Route path="/customer/statement/" element={<CustomerStatement />} />
        )}

        {/* {Authentication Routes} */}
        <Route exact path="/customer/login" element={<CustomerLogin />} />
        <Route exact path="/customer/register" element={<CustomerRegister />} />
        {isAuthenticated && (
          <Route exact path="/customer/logout" element={<CustomerLogout />} />
        )}
        {isAuthenticated && (
          <Route
            exact
            path="/customer/password/update"
            element={<CustomerUpdatePassword />}
          />
        )}

        {/* {Digital Routes} */}
        {isAuthenticated && PERMISSIONS.DIGITAL_CREATE_ORDER && (
          <Route
            exact
            path="/digital/action/create/"
            element={<DigitalCreateOrder />}
          />
        )}
        {isAuthenticated && PERMISSIONS.DIGITAL_PAYMENT_ORDER && (
          <Route
            exact
            path="/digital/action/payment/"
            element={<DigitalPaymentOrder />}
          />
        )}
        {isAuthenticated && PERMISSIONS.DIGITAL_UPDATE_ORDER && (
          <Route
            path="/digital/action/update/:id"
            element={<DigitalUpdateOrder />}
          />
        )}
        {isAuthenticated && PERMISSIONS.DIGITAL_ALL_ORDER_VIEW && (
          <Route path="/digital/orders" element={<ALLDigitalOrders />} />
        )}

        {/* {Product Routes} */}
        {isAuthenticated && PERMISSIONS.CREATE_PRODUCT && (
          <Route path="/product/create" element={<CreateProduct />} />
        )}
        {isAuthenticated && PERMISSIONS.ALL_PRODUCTS_VIEW && (
          <Route path="/products" element={<Products />} />
        )}
        {isAuthenticated && PERMISSIONS.EDIT_PRODUCT && (
          <Route path="/product/update/:id" element={<UpdateProduct />} />
        )}

        {/* {Trash Routes} */}
        {isAuthenticated && PERMISSIONS.TRASH_VIEW && (
          <Route exact path="/trash/orders/" element={<TrashOrders />} />
        )}

        {/* Party Routes */}
        {isAuthenticated && PERMISSIONS.PARTY_CREATE && (
          <Route exact path="/party/create" element={<CreateParty />} />
        )}
        {isAuthenticated && PERMISSIONS.ALL_PARTY_VIEW && (
          <Route exact path="/party/all" element={<ALLParty />} />
        )}
        {isAuthenticated && PERMISSIONS.PARTY_UPDATE && (
          <Route path="/party/update/:id" element={<UpdateParty />} />
        )}
        {isAuthenticated && PERMISSIONS.PARTY_SEARCH && (
          <Route exact path="/party/partySearch/" element={<PartySearch />} />
        )}
        {isAuthenticated && PERMISSIONS.PARTY_DETAILS && (
          <Route
            path="/party/partySearch/:partyID"
            element={<PartyDetails />}
          />
        )}
        {isAuthenticated && PERMISSIONS.PARTY_ACCEPT_PAYMENT && (
          <Route
            exact
            path="/acceptPayment"
            element={<CustomerPaymentOrder />}
          />
        )}

        {/* Shadi Routes */}
        {/* {isAuthenticated && PERMISSIONS.ORDER_CREATE && <Route exact path="/customer/shadi/create" element={<ShadiCreateOrder />} />} */}

        {/* Internal Party Routes */}
        {isAuthenticated && (
          <Route
            exact
            path="/internal/party/create"
            element={<CreateInternalParty />}
          />
        )}
        {isAuthenticated && PERMISSIONS.INTERNAL_PARTY_VIEW && (
          <Route
            exact
            path="/internal/party/all"
            element={<ALLInternalParty />}
          />
        )}
        {isAuthenticated && PERMISSIONS.INTERNAL_PARTY_UPDATE && (
          <Route
            path="/internal/party/update/:id"
            element={<UpdateInternalParty />}
          />
        )}
        {isAuthenticated && PERMISSIONS.INTERNAL_PARTY_DETAILS && (
          <Route
            path="/internal/party/:partyID"
            element={<InternalPartyDetails />}
          />
        )}
        {isAuthenticated && PERMISSIONS.INTERNAL_PARTY_ACCEPT_PAYMENT && (
          <Route
            exact
            path="/internalPartyPayment"
            element={<InternalPartyPayment />}
          />
        )}

        {/* Test Route */}
        {/* {isAuthenticated && <Route path="/test" element={<Test />} />} */}

        {/* Logs Routes */}
        {isAuthenticated && PERMISSIONS.LOGS_VIEW && (
          <Route exact path="/logs" element={<Logs />} />
        )}
        {isAuthenticated && PERMISSIONS.LOGS_PAYMENT_ORDER && (
          <Route
            exact
            path="/logs/action/payment/"
            element={<LogsPaymentOrder />}
          />
        )}

        {/* <Route exact path="/contact-us" element = {<ContactUs />} />
    <Route exact path="/catalogue" element = {<Catalogue />} /> */}

        {/* {Tracking Route} */}
        <Route path="/track/:id" element={<CustomerOrderTrack />} />

        {/* Unknown Page Routes*/}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
