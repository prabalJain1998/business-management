import React, { Fragment } from "react";
import Loader from "../layout/Loader/Loader.js";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  clearErrors,
  getAllOrdersByParty,
} from "../../actions/customerAction.js";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import "./CustomerDashboard.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const CustomerSearchParty = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { party } = useParams();
  const { loading, error, orders } = useSelector(
    (state) => state.searchByNameOrParty
  );

  const deleteOrderHandler = (id) => {
    history(`/customer/delete/${id}`);
  };

  const editOrderHandler = (id) => {
    history(`/customer/update/${id}`);
  };

  const updateOrderHandler = (id) => {
    history(`/customer/updateOrderStatus/${id}`);
  };

  const updatePaymentHandler = (id) => {
    history(`/customer/updatePaymentStatus/${id}`);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllOrdersByParty(party));
  }, [dispatch, alert, error, party]);

  const columns = [
    { field: "orderDate", headerName: "Date", minWidth: 100, flex: 1 },
    {
      field: "id",
      headerName: "Order Actions",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() => editOrderHandler(params.getValue(params.id, "id"))}
            >
              <EditIcon />
            </Button>

            <Button
              style={{
                color:
                  params.getValue(params.id, "orderStatus") === "COMPLETED"
                    ? "blue"
                    : "red",
              }}
              onClick={() =>
                updateOrderHandler(params.getValue(params.id, "id"))
              }
            >
              <CheckCircleOutlineIcon />
            </Button>

            <Button
              style={{
                color:
                  params.getValue(params.id, "paymentStatus") === "PAID"
                    ? "blue"
                    : "red",
              }}
              onClick={() =>
                updatePaymentHandler(params.getValue(params.id, "id"))
              }
            >
              <CurrencyRupeeIcon />
            </Button>

            <Link to={`/customers/${params.getValue(params.id, "id")}`}>
              {"Details"}
            </Link>
          </Fragment>
        );
      },
      // renderCell: (params) => {
      //   return (
      //     <Fragment>
      //       <Link to={`/customers/${params.getValue(params.id, "id")}`}>
      //         {"Click"}
      //       </Link>
      //     </Fragment>
      //   );
      // }
    },
    { field: "name", headerName: "Name", minWidth: 150, flex: 1 },
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
    { field: "phoneNo", headerName: "Phone", minWidth: 110, flex: 1 },
    { field: "deliveryDate", headerName: "Delivery", minWidth: 100, flex: 1 },
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
      headerName: "Delete",
      minWidth: 50,
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
  let totalAmount = 0;
  let totalPaid = 0;
  let cash = 0;
  let ordersRemain = 0;
  let onlineAmount = 0;

  orders &&
    orders.forEach((item) => {
      let desc = "";
      item.particulars.map((item) => {
        desc += item.item;
        desc += "|";
      });
      rows.push({
        orderDate: item.orderDate
          .substring(0, 10)
          .split("-")
          .reverse()
          .join("-"),
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
      totalAmount = totalAmount + Number(item.totalAmount);
      totalPaid = totalPaid + Number(item.paidAmount);

      if (item.paymentMode.toLowerCase().includes("cash")) {
        cash += Number(item.paidAmount);
      }
      if (item.paymentMode.toLowerCase().includes("online")) {
        onlineAmount += Number(item.paidAmount);
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
            <h1 id="productListHeading">ALL Orders</h1>
            <div className="overall">
              <p id="productListHeading2" className="insights">
                Orders <br /> {orders && orders.length}
              </p>
              <p id="productListHeading2" className="insights">
                Amount <br /> {totalAmount}
              </p>
              <p id="productListHeading2" className="insights">
                Paid <br /> {totalPaid}
              </p>
              <p id="productListHeading2" className="insights">
                Remain <br /> {totalAmount - totalPaid}
              </p>
              <p id="productListHeading2" className="insights">
                Cash <br /> {cash}
              </p>
              <p id="productListHeading2" className="insights">
                Online <br /> {onlineAmount}
              </p>
              <p id="productListHeading2" className="insights">
                Bank <br /> {totalAmount - onlineAmount - cash}
              </p>
              <p id="productListHeading2" className="insights">
                Orders Remaining <br /> {ordersRemain}
              </p>
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

export default CustomerSearchParty;
