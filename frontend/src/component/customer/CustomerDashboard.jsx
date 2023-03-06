import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearErrors, getAllOrders } from "../../actions/customerAction.js";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import "./CustomerDashboard.css";
import Loader from "../layout/Loader/Loader.js";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { loading, error, orders } = useSelector((state) => state.allCustomers);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllOrders({ useCache: false }));
  }, [dispatch, alert, error]);

  const deleteProductHandler = (id) => {
    history(`/customer/delete/${id}`);
  };
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 100, flex: 1 },
    { field: "phoneNo", headerName: "Phone", minWidth: 100, flex: 1 },
    { field: "particulars", headerName: "Particulars", minWidth: 200, flex: 1 },
    { field: "orderDate", headerName: "Date", minWidth: 100, flex: 1 },
    { field: "deliveryDate", headerName: "Delivery", minWidth: 100, flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "paid",
      headerName: "Paid",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "remain",
      headerName: "Remain",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Done"
          ? "greenColor"
          : "redColor";
      },
    },

    { field: "paymentMode", headerName: "Mode", minWidth: 100, flex: 1 },

    {
      field: "orderStatus",
      headerName: "Order Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "COMPLETED"
          ? "greenColor"
          : "redColor";
      },
    },
    { field: "partyName", headerName: "Party", minWidth: 100, flex: 1 },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/customer/update/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  let totalAmount = 0;
  let totalPaid = 0;
  let cash = 0;
  let ordersRemain = 0;

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        phoneNo: item.phoneNo,
        particulars: item.particulars,
        orderDate: item.orderDate.substring(0, 10),
        deliveryDate: item.deliveryDate.substring(0, 10),
        amount: item.totalAmount,
        paid: item.paidAmount,
        remain: item.remainingAmount,
        paymentStatus: item.paymentStatus,
        paymentMode: item.paymentMode,
        orderStatus: item.orderStatus,
        partyName: item.partyName,
      });
      totalAmount = totalAmount + Number(item.totalAmount);
      totalPaid = totalPaid + Number(item.paidAmount);
      if (item.paymentMode.toLowerCase().includes("cash")) {
        cash += Number(item.paidAmount);
      }
      if (!item.orderStatus.toLowerCase().includes("completed")) {
        ordersRemain += 1;
      }
    });

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard2">
          <div className="productListContainer2">
            <h1 id="productListHeading">ALL ORDERS</h1>
            <div className="overall">
              <p id="productListHeading2">Orders : {orders && orders.length}</p>
              <p id="productListHeading2">Amount : {totalAmount}</p>
              <p id="productListHeading2">Paid : {totalPaid}</p>
              <p id="productListHeading2">Remain : {totalAmount - totalPaid}</p>
              <p id="productListHeading2">Cash : {cash}</p>
              <p id="productListHeading2">Orders Remaining : {ordersRemain}</p>
            </div>

            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={20}
              disableSelectionOnClick
              className="productListTable2"
              autoHeight
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CustomerDashboard;
