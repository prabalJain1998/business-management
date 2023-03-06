import { Button, Typography } from "@material-ui/core";
import React, { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearErrors,
  getCustomerDetails,
  updateCustomer,
} from "../../actions/customerAction";
import { createTrashOrder } from "../../actions/trashAction";
import { createNotification } from "../../actions/notificationAction";
import {
  CUSTOMER_DETAILS_RESET,
  UPDATE_CUSTOMER_RESET,
  NEW_CUSTOMER_RESET,
} from "../../constants/customerConstants";
import Loader from "../layout/Loader/Loader";
import "./CustomerDeleteOrder.css";
import DrawerComponent from "./Drawer.jsx";
import { NOTIFICATION_RESET } from "../../constants/notificationConstants";

const CustomerDeleteOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { id } = useParams();
  const orderId = id;

  const { error, order } = useSelector((state) => state.customerDetails);
  const { user } = useSelector((state) => state.user);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.customer);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (order && order._id !== orderId) {
      dispatch(getCustomerDetails(orderId));
    }

    if (isUpdated) {
      alert.success("Order Deleted Successfully");
      dispatch({ type: NEW_CUSTOMER_RESET });
      dispatch({ type: UPDATE_CUSTOMER_RESET });
      history("/");
    }
  }, [dispatch, alert, isUpdated, history, error, updateError, order, orderId]);

  const confirmCustomerDeleteHandler = (e) => {
    e.preventDefault();
    order["id"] = id;
    const myForm = new FormData();
    myForm.set("status", "DELETED");
    dispatch(updateCustomer(id, myForm));
    dispatch(
      createNotification({
        dateCreated: Date.now(),
        updatedBy: user.name,
        message: order.name,
        action: "deleted",
        link: "/",
      })
    );
    dispatch({ type: NOTIFICATION_RESET });
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <DrawerComponent />
          {loading ? (
            <Loader />
          ) : (
            <div className="deleteOrderPage">
              <h2>
                Are you Sure ? Note : The DELETED ORDER CAN NOT BE RETRIEVE
                BACK!
              </h2>
              <h2>Press the button Below to Delete Order Permanently</h2>
              <div
                style={{
                  padding: "2vmax",
                  color: "white",
                  backgroundColor: "red",
                }}
                clasName="detailsDiv"
              >
                <Typography>Customer Details Below </Typography>
                <Typography>Name : {order.name}</Typography>
                <Typography>Phone No :{order.phoneNo} </Typography>
              </div>
              <Button type="button" onClick={confirmCustomerDeleteHandler}>
                DELETE PERMANENTLY
              </Button>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default CustomerDeleteOrder;
