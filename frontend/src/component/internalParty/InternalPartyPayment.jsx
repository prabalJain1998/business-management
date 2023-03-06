import React, { Fragment, useEffect, useState } from "react";
import "../customer/CustomerCreateOrder.jsx";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createCustomer } from "../../actions/customerAction.js";
import { useAlert } from "react-alert";
import { NOTIFICATION_RESET } from "../../constants/notificationConstants";
import { createNotification } from "../../actions/notificationAction";
import { Button, TextField } from "@material-ui/core";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import { useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CallIcon from "@mui/icons-material/Call";
import "react-datepicker/dist/react-datepicker.css";
import { NEW_CUSTOMER_RESET } from "../../constants/customerConstants";
import DrawerComponent from "../customer/Drawer.jsx";
import { getAllInternalParties } from "../../actions/internalPartyAction";
import { Autocomplete } from "@mui/material";
import HeaderActions from "../common/HeaderActions.jsx";

const InternalPartyPayment = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const { customer, loading, error, success } = useSelector(
    (state) => state.newCustomer
  );
  const {
    loading: internalPartyLoading,
    error: internalPartyError,
    party,
  } = useSelector((state) => state.allInternalParties);
  const { user } = useSelector((state) => state.user);
  const parties = party && party.parties;

  const [name, setName] = useState("PAYMENT");
  const [phoneNo, setPhoneNo] = useState(1111111111);
  const [paymentDescription, setPaymentDescription] = useState(
    "Payment made to Internal Party"
  );
  const [paidAmount, setPaidAmount] = useState();
  const [paymentMode, setPaymentMode] = useState("");

  const [internalPartyName, setInternalPartyName] = useState("USER");

  const internalPartyNames = [];
  const internalPartyMappings = {};
  parties &&
    parties.map((item) => {
      internalPartyNames.push(item.name);
      internalPartyMappings[item.name] = item._id;
    });

  const paymentModeCategories = ["CASH", "BANK", "ONLINE"];

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (internalPartyError) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllInternalParties());

    if (success) {
      alert.success("Payment made Successfully");
      history(`/internal/party/${internalPartyMappings[internalPartyName]}`, {
        replace: true,
      });
      dispatch({ type: NEW_CUSTOMER_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    history,
    success,
    customer,
    internalPartyError,
    internalPartyName,
  ]);

  const createCustomerSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("phoneNo", Number(phoneNo));
    let particulars = [
      {
        item: paymentDescription,
        price: 0,
        quantity: 0,
        total: paidAmount,
        partyID: internalPartyName,
      },
    ];
    myForm.set("particulars", JSON.stringify(particulars));
    myForm.set("totalAmount", 0);
    myForm.set("paidAmount", 0);
    myForm.set("paymentStatus", "PAID");
    myForm.set("paymentMode", paymentMode);
    myForm.set("orderStatus", "PAYMENT");
    myForm.set("partyName", "INTERNAL PARTY");
    myForm.set("remainingAmount", 0);
    myForm.set("partyID", internalPartyMappings[internalPartyName]);

    dispatch(createCustomer(myForm));
    dispatch(
      createNotification({
        dateCreated: Date.now(),
        updatedBy: user.name,
        message: name,
        action: "Internal Party Payment",
        link: "/",
      })
    );
    dispatch({ type: NOTIFICATION_RESET });
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
            <h1 id="fontGreat">Payment To Internal Party</h1>

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
                disableClearable
                disablePortal
                onChange={(event, newValue) => {
                  setInternalPartyName(newValue);
                }}
                id="partyDropdownField"
                options={internalPartyNames && internalPartyNames}
                sx={{ backgroundColor: "white" }}
                renderInput={(params) => (
                  <TextField {...params} label="Party" />
                )}
                defaultValue={"Singhai"}
              />
            </div>
            <Button
              style={{
                borderRadius: 10,
                height: "40px",
                padding: "1vmax",
                backgroundColor: "#A175E8",
                width: "100px",
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

export default InternalPartyPayment;
