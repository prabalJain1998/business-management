import ReceiptComponent from "./ReceiptComponent";
import { Divider } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getCustomerDetails,
} from "../../actions/customerAction.js";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";
import DrawerComponent from "../customer/Drawer.jsx";
import "./CombinedReceipt.css";

const CombinedReceipt = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useNavigate();
  const {
    loading: loadingValue,
    order,
    error,
  } = useSelector((state) => state.customerDetails);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      history("/");
    }
    dispatch(getCustomerDetails(id));
    if (loadingValue === false) {
      setLoading(false);
    }
  }, [dispatch, loadingValue, history, error, alert, id]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{ display: "flex", margin: "auto", justifyContent: "center" }}
        >
          <div id="officeReceipt">
            <ReceiptComponent
              orderDate={order?.orderDate}
              deliveryDate={order?.deliveryDate}
              phoneNo={order?.phoneNo}
              whatsappNo={order?.whatsappNo}
              name={order?.name}
              paymentStatus={order?.paymentStatus}
              paymentMode={order?.paymentMode}
              particulars={order?.particulars}
              totalAmount={order?.totalAmount}
              paidAmount={order?.paidAmount}
              remainingAmount={order?.remainingAmount}
              title={"Office Copy"}
            />
          </div>
          <Divider orientation="vertical" flexItem />
          <div>
            <ReceiptComponent
              orderDate={order?.orderDate}
              deliveryDate={order?.deliveryDate}
              phoneNo={order?.phoneNo}
              whatsappNo={order?.whatsappNo}
              name={order?.name}
              paymentStatus={order?.paymentStatus}
              paymentMode={order?.paymentMode}
              particulars={order?.particulars}
              totalAmount={order?.totalAmount}
              paidAmount={order?.paidAmount}
              remainingAmount={order?.remainingAmount}
              title={"Customer Copy"}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CombinedReceipt;
