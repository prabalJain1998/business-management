import * as React from "react";
import Loader from "../layout/Loader/Loader.js";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import {
  clearErrors,
  getAllTrashOrders,
  deleteTrashOrder,
} from "../../actions/trashAction.js";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import DeleteIcon from "@mui/icons-material/Delete";
import "jspdf-autotable";
import { Button } from "@mui/material";
import "../customer/Orders.css";
import { deleteCustomer, getAllOrders } from "../../actions/customerAction.js";
import { DELETE_TRASH_RESET } from "../../constants/trashConstants.js";
import HeaderActions from "../common/HeaderActions.jsx";

export default function TrashOrders() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, deletedOrders } = useSelector(
    (state) => state.allCustomers
  );

  const { isDeleted, error: errorDelete } = useSelector(
    (state) => state.customer
  );

  const deleteOrderHandler = (id) => {
    dispatch(deleteCustomer(id));
    dispatch({ type: DELETE_TRASH_RESET });
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (errorDelete) {
      alert.error(errorDelete);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Deleted Successfully");
      dispatch({ type: DELETE_TRASH_RESET });
    }

    dispatch(getAllOrders({ useCache: false }));
  }, [dispatch, alert, error, errorDelete, isDeleted]);

  const columns = [
    { field: "orderDate", headerName: "Date", minWidth: 100, flex: 1 },
    {
      field: "id",
      headerName: "Order Actions",
      minWidth: 100,
      flex: 1,
      sortable: false,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    { field: "particulars", headerName: "Particulars", minWidth: 200, flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 90,
      flex: 0.5,
    },
    {
      field: "paid",
      headerName: "Paid",
      type: "number",
      minWidth: 90,
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
      field: "phoneNo",
      headerName: "Phone",
      minWidth: 110,
      flex: 1,
      sortable: false,
    },
    { field: "deliveryDate", headerName: "Delivery", minWidth: 100, flex: 1 },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minWidth: 150,
      flex: 0.5,
    },
    { field: "paymentMode", headerName: "Mode", minWidth: 100, flex: 1 },
    {
      field: "orderStatus",
      headerName: "Order Status",
      minWidth: 150,
      flex: 0.5,
    },
    { field: "partyName", headerName: "Party", minWidth: 100, flex: 1 },
    {
      field: "actions",
      flex: 1,
      headerName: "Delete",
      minWidth: 80,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              style={{ color: "red" }}
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
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

  deletedOrders?.forEach((item) => {
    let desc = "";
    item.particulars.map((item) => {
      desc += item.item;
      desc += "|";
    });
    rows.push({
      orderDate: item.orderDate.substring(0, 10).split("-").reverse().join("-"),
      id: item._id,
      name: item.name,
      particulars: desc,
      amount: item.totalAmount,
      paid: item.paidAmount,
      remain: item.remainingAmount,
      phoneNo: item.phoneNo,
      deliveryDate: item.deliveryDate
        .substring(0, 10)
        .split("-")
        .reverse()
        .join("-"),
      paymentStatus: item.paymentStatus,
      paymentMode: item.paymentMode,
      orderStatus: item.orderStatus,
      partyName: item.partyName,
    });
  });

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard2">
          <HeaderActions />
          <div className="productListContainer2">
            <h1 id="productListHeading">
              <Typography variant="h4">
                {"Trash"} <DeleteIcon />
              </Typography>
            </h1>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={100}
              disableSelectionOnClick
              className="productListTable2"
              autoHeight
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}
