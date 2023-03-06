import React, { Fragment } from "react";
import Loader from "../layout/Loader/Loader.js";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  clearErrors,
  getAllOrdersByName,
} from "../../actions/customerAction.js";
import { useAlert } from "react-alert";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Dialog from "@mui/material/Dialog";
import Skeleton from "@mui/material/Skeleton";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DatePicker from "react-datepicker";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./CustomerDashboard.css";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useParams } from "react-router-dom";
import DrawerComponent from "./Drawer.jsx";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import copy from "copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { createNotification } from "../../actions/notificationAction.js";
import TableComponent from "../common/TableComponent.jsx";

const CustomerSearchName = ({ name }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { loading, error, orders } = useSelector(
    (state) => state.searchByNameOrParty
  );
  const { user } = useSelector((state) => state.user);

  const [modalValues, setModalValues] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [reminderDate, setReminderDate] = React.useState(new Date(Date.now()));
  const [checkEntry, setCheckEntry] = React.useState(true);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createReminderHandler = () => {
    const payload = {
      dateCreated: reminderDate,
      message: `Payment reminder of Rs.${modalValues.remain} from ${modalValues.name}`,
      action: "REMINDER",
      updatedBy: user.name,
      link: `/customers/${modalValues.id}`,
    };
    dispatch(createNotification(payload));
    setOpen(false);
  };

  const generateLink = (phone, remain, status) => {
    if (status != "COMPLETED") {
      alert.error("भाई पहले आर्डर पूरा करो");
      return;
    }
    let message = "";
    let messageHindi = "";
    if (Number(remain) === 0) {
      message = `Hi, Welcome to Singhai Printers, your order is ${status} Please Collect it from the Store Thanks!!`;
      messageHindi = `नमस्ते, सिंघई प्रिंटर्स में आपका स्वागत है, आपका ऑर्डर पूरा हो गया है कृपया दुकान से सामान ले जाइए धन्यवाद !!`;
    } else {
      message = `Hi, Welcome to Singhai Printers, your order is ${status} You have remaining Payment of ${remain} Please Complete the Payment and Collect the Order from the Store Thanks!!`;
      messageHindi = `नमस्ते, सिंघई प्रिंटर्स में आपका स्वागत है, आपका ऑर्डर पूरा हो गया है आपके पास ${remain} रुपये का भुगतान शेष है कृपया भुगतान पूरा करें और दुकान से सामान ले जाइए धन्यवाद !!`;
    }

    let text = encodeURI(messageHindi + "     " + message);
    let generatedLink = `https://wa.me/+91${phone}?text=${text}`;
    const win = window.open(generatedLink, "_blank");
    win.focus();
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllOrdersByName(name));
  }, [dispatch, alert, error, name]);

  const showModal = (name, remain, id) => {
    setModalValues({
      name,
      remain,
      id,
    });
    handleClickOpen();
  };

  const columns = [
    { field: "orderDate", headerName: "Date", minWidth: 100, flex: 1 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/customers/${params.getValue(params.id, "id")}`}>
              {params.getValue(params.id, "name")}
            </Link>
          </Fragment>
        );
      },
    },
    {
      field: "id",
      headerName: "Order Actions",
      minWidth: 370,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              style={{
                color: "#1976d2",
              }}
              onClick={() =>
                showModal(
                  params.getValue(params.id, "name"),
                  params.getValue(params.id, "remain"),
                  params.getValue(params.id, "id")
                )
              }
            >
              <NotificationsActiveIcon />
            </Button>

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

            <Button
              style={{
                display: params.getValue(params.id, "whatsappNo")
                  ? "inline"
                  : "None",
                color: params.getValue(params.id, "whatsappNo")
                  ? "green"
                  : "white",
              }}
              onClick={() =>
                generateLink(
                  params.getValue(params.id, "whatsappNo"),
                  params.getValue(params.id, "remain"),
                  params.getValue(params.id, "orderStatus")
                )
              }
            >
              <WhatsAppIcon />
            </Button>
          </Fragment>
        );
      },
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
      hide: true,
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

  orders &&
    orders.forEach((item) => {
      if (
        item.orderStatus !== "PAYMENT" &&
        item.status &&
        item.status === "AVAILABLE"
      ) {
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
          whatsappNo: item.whatsappNo,
        });
      }
    });
  rows.reverse();

  return (
    <Fragment>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="dashboard2">
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{modalValues && modalValues.name}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This is a Reminder for a Remaining Payment of Rs.{" "}
                {modalValues.remain}
              </DialogContentText>

              <div>
                <Typography>Reminder Date</Typography>
                <DatePicker
                  selected={reminderDate}
                  onChange={(date) => setReminderDate(date)}
                />
              </div>

              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={`Type ${modalValues.name} to Confirm`}
                type="email"
                onChange={(e) => {
                  if (e.target.value === modalValues.name) {
                    setCheckEntry(false);
                  } else {
                    setCheckEntry(true);
                  }
                }}
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button disabled={checkEntry} onClick={createReminderHandler}>
                Create Reminder
              </Button>
            </DialogActions>
          </Dialog>

          <div className="productListContainer2">
            <h1 id="productListHeading">ALL ORDERS</h1>
            <TableComponent
              dataset={rows}
              columns={columns}
              pageSize={20}
              disableSelectionOnClick={true}
              autoHeight={true}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CustomerSearchName;
