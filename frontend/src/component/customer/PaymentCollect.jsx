import React, { Fragment, useEffect, useState } from "react";
import "./CustomerCreateOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import {
  CUSTOMER_DETAILS_RESET,
  UPDATE_CUSTOMER_STATUS_RESET,
} from "../../constants/customerConstants";
import {
  getCustomerDetails,
  updateCustomer,
  clearErrors,
} from "../../actions/customerAction";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useParams } from "react-router-dom";
import { NOTIFICATION_RESET } from "../../constants/notificationConstants";
import { createNotification } from "../../actions/notificationAction";
import DrawerComponent from "./Drawer.jsx";
import Loader from "../layout/Loader/Loader";
import CancelIcon from "@mui/icons-material/Cancel";
import { Autocomplete, Divider, Switch } from "@mui/material";
import CardItem from "../common/CardItem";
import { createLogs } from "../../actions/logsAction";
import PaymentBackground from "../../images/PaymentBackground1.png";
import PaymentBackground2 from "../../images/PaymentBackground2.png";
import whiteBackground from "../../images/whiteBackground.png";

const PaymentCollect = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { id } = useParams();

  const { error: updateError, isUpdated } = useSelector(
    (state) => state.customer
  );
  const { loading, error, order } = useSelector(
    (state) => state.customerDetails
  );
  const { user } = useSelector((state) => state.user);

  const [paymentMode, setPaymentMode] = useState(order.paymentMode);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [showTick, setShowTick] = useState(false);
  const [pay, setPay] = useState(0);
  const [checked, setChecked] = useState(false);

  const paymentModeCategories = ["CASH", "BANK", "ONLINE"];

  const orderId = id;
  useEffect(() => {
    if (error) {
      alert.error(error);
      history("/dashboard");
      dispatch(clearErrors());
    }
    if (order && order._id !== orderId) {
      dispatch(getCustomerDetails(orderId));
    } else {
      setOrderStatus(order.orderStatus);
      setPaymentStatus(order.paymentStatus);
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({
        type: UPDATE_CUSTOMER_STATUS_RESET,
      });
      dispatch({ type: CUSTOMER_DETAILS_RESET });
      history("/");
    }
  }, [dispatch, alert, error, history, isUpdated, orderId, order, updateError]);

  const updateCustomerPaymentStatusSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    let paidModify = order.paidAmount + parseInt(pay);
    myForm.set("paidAmount", paidModify);

    let remainModify = order.totalAmount - paidModify - order.discountAmount;
    myForm.set("remainingAmount", remainModify);
    if (remainModify > 0) {
      alert.error(`Please Pay Rs. ${remainModify} more!`);
      return;
    } else if (remainModify < 0) {
      alert.error(
        `Please Check Remain amount cannot exceed by ${-remainModify}`
      );
      return;
    } else {
      myForm.set("paymentStatus", "PAID");
    }
    if (!paymentMode) {
      alert.error("please Choose Payment Mode");
      return;
    }
    myForm.set("paymentMode", paymentMode);
    myForm.set("orderStatus", orderStatus);
    dispatch(updateCustomer(id, myForm));
    dispatch(
      createNotification({
        dateCreated: Date.now(),
        updatedBy: user.name,
        message: order.name,
        action: "Updated Payment",
        link: `/customers/${id}`,
      })
    );
    dispatch({ type: NOTIFICATION_RESET });

    // Payment Updated for Logs
    if (pay > 0) {
      const logsPayload = {
        date: new Date(Date.now()).toLocaleDateString(),
        action: "UPDATED_PAYMENT",
        details: {
          amount: pay,
          message: `Remaining payment of Rs. ${pay} from ${order.name}`,
          referenceID: order._id,
        },
      };

      dispatch(createLogs(logsPayload));
    }
  };

  const checkInputEqualToPayment = (val) => {
    setPay(val);
    if (val == order.remainingAmount) {
      setShowTick(true);
    } else {
      setShowTick(false);
    }
  };

  const mobileCSS = {
    position: "absolute",
    padding: "10px",
    top: "30%",
    display: "flex",
    flexDirection: "column",
  };
  const laptopCSS = {
    position: "absolute",
    top: "30%",
    left: "11%",
    display: "flex",
    flexDirection: "column",
    fontSize: "20px",
  };

  return (
    <Fragment>
      <DrawerComponent />
      {loading ? (
        <Loader />
      ) : (
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "30%",
              color: "black",
              display: window.screen.width < 500 ? "none" : "flex",
            }}
          >
            <div style={window.screen.width < 500 ? mobileCSS : laptopCSS}>
              <Typography style={{ fontFamily: "Montserrat" }}>
                To pay
              </Typography>
              <Typography variant="h4" style={{ fontFamily: "Montserrat" }}>
                ₹ {order?.remainingAmount}
              </Typography>
            </div>
          </div>

          <div style={{ width: "70%" }}>
            <div style={{ margin: "auto", width: "80%", padding: "30px" }}>
              <div style={{ dispay: "flex" }}>
                <Typography
                  variant="h3"
                  style={{ color: "#0a243b", fontFamily: "Montserrat" }}
                >
                  Payments
                </Typography>
              </div>

              <Typography
                variant="h5"
                style={{
                  color: "#0a243b",
                  padding: "10px",
                  fontFamily: "Roboto",
                }}
              >
                {order?.name}
              </Typography>

              <div>
                <CardItem
                  keyItem={"Total"}
                  value={order?.totalAmount}
                  threshold={0}
                  disableIcon={true}
                />
              </div>
              <div>
                <CardItem
                  keyItem={"Paid"}
                  value={order?.paidAmount}
                  threshold={0}
                  disableIcon={true}
                />
              </div>
              <div>
                <CardItem
                  keyItem={"Remain"}
                  value={order?.remainingAmount}
                  threshold={0}
                  disableIcon={true}
                />
              </div>

              <div>
                <Autocomplete
                  disablePortal
                  disableClearable
                  onChange={(event, newValue) => {
                    setPaymentMode(newValue);
                  }}
                  value={paymentMode}
                  options={["CASH", "BANK", "ONLINE"]}
                  sx={{ padding: "10px" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Payment Mode" />
                  )}
                />
              </div>

              <div>
                <Autocomplete
                  disablePortal
                  disableClearable
                  onChange={(event, newValue) => {
                    setOrderStatus(newValue);
                  }}
                  value={orderStatus}
                  options={["START", "COMPLETED"]}
                  sx={{ padding: "10px" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Order Status" />
                  )}
                />
              </div>

              <div style={{ display: "flex", padding: "10px" }}>
                <TextField
                  label={
                    window.screen.width < 500
                      ? `Collect Rs.  ${order?.remainingAmount}`
                      : `Please collect Rs. ${order?.remainingAmount}`
                  }
                  fullWidth
                  sx={{ m: 1 }}
                  type="number"
                  required={true}
                  onChange={(e) => checkInputEqualToPayment(e.target.value)}
                  variant="outlined"
                />
              </div>

              <div style={{ padding: "10px" }}>
                <Button
                  style={{
                    borderRadius: 5,
                    height: "40px",
                    backgroundColor: "#48cfae",
                    width: "200px",
                    opacity: !showTick ? 0.5 : 1,
                  }}
                  disabled={!showTick}
                  onClick={updateCustomerPaymentStatusSubmitHandler}
                >
                  <Typography style={{ color: "#0a243b" }}>Pay Now</Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default PaymentCollect;
