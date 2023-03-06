import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getCustomerDetails,
} from "../../actions/customerAction.js";
import "./CustomerDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import Divider from "@mui/material/Divider";
import Loader from "../layout/Loader/Loader";
import DrawerComponent from "./Drawer.jsx";
import { formatDate } from "../common/utils.js";
import HeaderActions from "../common/HeaderActions.jsx";

const CustomerDetails = () => {
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
        <div>
          <HeaderActions />
          <div className="both-receipt-container" id="printReceipt">
            <div className="container">
              <div className="brand-section">
                <div className="row">
                  <div className="col-6">
                    <h1 className="text-white">Singhai Printers</h1>
                  </div>

                  <div className="col-6">
                    <div className="company-details">
                      <p className="text-white invoice">
                        Near Dr. Moghe, Krishnapuram
                      </p>
                      <p className="text-white invoice">
                        colony, Shivpuri (M.P.)
                      </p>
                      <p className="text-white invoice">
                        ☏ 9993461758, 7898830709
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="body-section">
                <div className="row">
                  <div className="col-6">
                    {/* <p class="sub-heading invoice">Invoice : {order && order._id}</p> */}
                    <p className="sub-heading">
                      Order Date:{" "}
                      {order &&
                        formatDate(
                          new Date(order?.orderDate).toLocaleDateString()
                        )}{" "}
                    </p>
                    <p className="sub-heading">
                      Delivery Date :{" "}
                      {order &&
                        formatDate(
                          new Date(order?.deliveryDate).toLocaleDateString()
                        )}{" "}
                    </p>
                    <p className="sub-heading">
                      {order &&
                        order.whatsappNo &&
                        `Whatsapp : ${order.whatsappNo}`}{" "}
                    </p>
                  </div>

                  <div className="col-6 subHeader">
                    <p className="sub-heading">
                      <b>
                        <h2>{order && order.name}</h2>
                      </b>
                    </p>
                    <p className="sub-heading">
                      Phone Number: <b>{order && order.phoneNo}</b>
                    </p>
                    <p className="sub-heading">
                      Payment Status: <b>{order && order.paymentStatus}</b>
                    </p>
                    <p className="sub-heading">
                      Payment Mode: <b>{order && order.paymentMode}</b>
                    </p>
                  </div>
                </div>
              </div>

              <div className="body-section">
                <table className="table-bordered">
                  <thead>
                    <tr>
                      <th>
                        <p>Particulars</p>
                      </th>
                      <th className="w-20">
                        <p>Quantity</p>
                      </th>
                      <th className="w-20">
                        <p>Price</p>
                      </th>
                      <th className="w-20">
                        <p>Amount</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order &&
                      order.particulars.map((item) => (
                        <tr>
                          <td>{item.item}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                          <td>{item.total}</td>
                        </tr>
                      ))}

                    <tr>
                      <td colspan="3" className="text-right">
                        <p>Total :</p>
                      </td>
                      <td>
                        {" "}
                        <p>
                          <b>{order && order.totalAmount}</b>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" className="text-right">
                        <p>Paid :</p>
                      </td>
                      <td>
                        <p>
                          <b>{order && order.paidAmount}</b>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" className="text-right">
                        <p>Remain :</p>
                      </td>
                      <td>
                        <p>
                          <b>{order && order.remainingAmount}</b>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CustomerDetails;
