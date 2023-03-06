import React, { Fragment, useEffect, useState } from "react";
import "./CustomerCreateOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createCustomer } from "../../actions/customerAction.js";
import { createNotification } from "../../actions/notificationAction.js";
import { useAlert } from "react-alert";
import { Button, TextField } from "@material-ui/core";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import { useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CallIcon from "@mui/icons-material/Call";
import "react-datepicker/dist/react-datepicker.css";
import { NEW_CUSTOMER_RESET } from "../../constants/customerConstants";
import { NOTIFICATION_RESET } from "../../constants/notificationConstants";
import DrawerComponent from "./Drawer.jsx";
import { getAllParties } from "../../actions/partyAction";
import { createLogs } from "../../actions/logsAction";
import { Autocomplete } from "@mui/material";
import HeaderActions from "../common/HeaderActions";

const CustomerPaymentOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const { customer, loading, error, success } = useSelector(
    (state) => state.newCustomer
  );
  const { user } = useSelector((state) => state.user);
  const { error: allPartiesError, party } = useSelector(
    (state) => state.allparties
  );
  const parties = party && party.parties;

  const [name, setName] = useState("PAYMENT");
  const [phoneNo, setPhoneNo] = useState(1111111111);

  const [paymentDescription, setPaymentDescription] = useState(
    "Payment made to Singhai Printers"
  );

  const [paidAmount, setPaidAmount] = useState();

  const [paymentMode, setPaymentMode] = useState("");

  const [partyName, setPartyName] = useState("USER");

  const partyNames = [];
  const partyMappings = {};
  parties &&
    parties.map((item) => {
      partyNames.push(item.name);
      partyMappings[item.name] = item._id;
    });
  partyNames.push("USER");
  partyMappings["USER"] = "USER";

  const paymentModeCategories = ["CASH", "BANK", "ONLINE"];

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (allPartiesError) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllParties());
    if (success) {
      alert.success("Payment made Successfully");
      history(`/customers/${customer.data._id}`, { replace: true });
      dispatch({ type: NEW_CUSTOMER_RESET });
    }
  }, [dispatch, alert, error, history, success, customer, allPartiesError]);

  const createCustomerSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("phoneNo", Number(phoneNo));
    let particulars = [
      {
        item: paymentDescription,
        partyID: "PARTY PAYMENT",
        price: 0,
        quantity: 0,
        total: 0,
      },
    ];

    myForm.set("particulars", JSON.stringify(particulars));
    myForm.set("totalAmount", 0);
    myForm.set("paidAmount", Number(paidAmount));
    myForm.set("paymentStatus", "PAID");
    myForm.set("paymentMode", paymentMode);
    myForm.set("orderStatus", "PAYMENT");
    myForm.set("partyName", partyName);
    myForm.set("remainingAmount", 0);
    myForm.set("partyID", partyMappings[partyName]);

    dispatch(createCustomer(myForm));
    dispatch(
      createNotification({
        dateCreated: Date.now(),
        updatedBy: user.name,
        message: name,
        action: "payment",
        link: "/",
      })
    );
    dispatch({ type: NOTIFICATION_RESET });

    // Payment Updated for Logs
    if (parseInt(paidAmount) > 0) {
      const logsPayload = {
        date: new Date(Date.now()).toLocaleDateString(),
        action: "PAYMENT_ORDER",
        details: {
          amount: parseInt(paidAmount),
          message: `Rs.${parseInt(
            paidAmount
          )} was collected from Party as a new Payment Order from ${name}`,
          referenceID: `ORDER_ID_NOT_AVAILABLE ${name}`,
        },
      };
      dispatch(createLogs(logsPayload));
    }
  };

  return (
    <Fragment>
      <HeaderActions />
      <div className="create-customer-container">
        <div className="create-customer-container-2">
          <form
            className="create-customer-form"
            onSubmit={createCustomerSubmitHandler}
          >
            <h1 id="fontGreat">Accept Payment</h1>

            <div style={{ marginTop: "15px" }}>
              <TextField
                label="Customer Name"
                fullWidth
                sx={{ m: 1 }}
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <TextField
                label="Phone"
                fullWidth
                sx={{ m: 1 }}
                type="number"
                value={phoneNo}
                required
                onChange={(e) => setPhoneNo(e.target.value)}
                variant="outlined"
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <TextField
                label="Payment Description"
                fullWidth
                sx={{ m: 1 }}
                type="text"
                value={paymentDescription}
                required
                onChange={(e) => setPaymentDescription(e.target.value)}
                variant="outlined"
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <TextField
                label="Amount Paid"
                fullWidth
                sx={{ m: 1 }}
                type="number"
                value={paidAmount}
                required
                onChange={(e) => setPaidAmount(e.target.value)}
                variant="outlined"
              />
            </div>

            <div className="statusContainer">
              <Autocomplete
                disablePortal
                fullWidth
                disableClearable
                onChange={(event, newValue) => {
                  setPaymentMode(newValue);
                }}
                id="modeDropdownField"
                options={paymentModeCategories && paymentModeCategories}
                sx={{ width: "100%", backgroundColor: "white" }}
                renderInput={(params) => (
                  <TextField {...params} label="Payment Mode" />
                )}
                defaultValue={"NILL"}
              />
              <div style={{ padding: "10px" }}></div>
              <Autocomplete
                disablePortal
                disableClearable
                onChange={(event, newValue) => {
                  setPartyName(newValue);
                }}
                id="partyDropdownField"
                options={partyNames && partyNames}
                sx={{ backgroundColor: "white" }}
                renderInput={(params) => (
                  <TextField {...params} label="Party" />
                )}
                defaultValue={"USER"}
              />
            </div>

            <Button
              style={{
                borderRadius: 10,
                height: "40px",
                padding: "1vmax",
                width: "100px",
                backgroundColor: "#A175E8",
              }}
              type="submit"
              disabled={loading ? true : false}
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CustomerPaymentOrder;
