import React, { Fragment, useEffect, useState } from "react";
import "./CustomerCreateOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button, Typography } from "@material-ui/core";
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
import { useParams } from "react-router-dom";
import DrawerComponent from "./Drawer.jsx";
import Loader from "../layout/Loader/Loader";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const CustomerUpdateOrderStatus = () => {
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
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);

  const orderStatusCategories = ["START", "PRINTING", "COMPLETED"];
  const paymentStatusCategories = ["PAID", "PARTIAL PAID", "NOT PAID"];

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
      alert.success("Status Updated Successfully");
      dispatch({
        type: UPDATE_CUSTOMER_STATUS_RESET,
      });
      dispatch({ type: CUSTOMER_DETAILS_RESET });
      history("/");
      // window.location.reload();
    }
  }, [dispatch, alert, error, history, isUpdated, orderId, order, updateError]);

  const updateCustomerOrderStatusSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("orderStatus", orderStatus);
    dispatch(updateCustomer(id, myForm));
  };

  const updateCustomerPaymentStatusSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("paymentStatus", paymentStatus);
    dispatch(updateCustomer(id, myForm));
  };

  return (
    <Fragment>
      <DrawerComponent />

      <div
        style={{
          padding: "2vmax",
          color: "green",
        }}
      >
        {order.whatsappNo && (
          <Typography variant="h5">
            {" "}
            <WhatsAppIcon /> Available{" "}
          </Typography>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div>
          <form
            className="create-customer-form"
            onSubmit={updateCustomerOrderStatusSubmitHandler}
          >
            <center>
              <h2>
                <Typography>{order && order.name}</Typography>
              </h2>
            </center>
            <div>
              <select onChange={(e) => setOrderStatus(e.target.value)}>
                <option value="">{orderStatus && orderStatus}</option>
                {orderStatusCategories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ padding: "1vmax" }}></div>
            <Button
              style={{
                borderRadius: 5,
                height: "30px",
                padding: "2vmax",
                backgroundColor: "#A175E8",
              }}
              type="submit"
            >
              Update Status
            </Button>
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default CustomerUpdateOrderStatus;
