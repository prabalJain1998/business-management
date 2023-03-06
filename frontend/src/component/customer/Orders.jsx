import * as React from "react";
import Loader from "../layout/Loader/Loader.js";
import AlarmIcon from "@mui/icons-material/Alarm";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Fragment } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DialogContent from "@mui/material/DialogContent";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  clearErrors,
  getAllOrders,
  updateCustomer,
} from "../../actions/customerAction.js";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useAlert } from "react-alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "jspdf-autotable";
import { Button, Chip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import "./Orders.css";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  createNotification,
  getAllNotifications,
} from "../../actions/notificationAction.js";
import CardItem from "../common/CardItem";
import { HtmlTooltip } from "./StylesUtils.js";
import { exportToPdf, generateLink } from "./CustomerUtils.js";
import TableComponent from "../common/TableComponent.jsx";
import Insights from "./Insights.jsx";
import { UPDATE_CUSTOMER_RESET } from "../../constants/customerConstants.js";
import { LocalizationProvider } from "@mui/x-date-pickers";
import MenuList from "../common/MenuList.jsx";
import HeaderActions from "../common/HeaderActions.jsx";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const AVAILABLE = "AVAILABLE";
const PAYMENT = "PAYMENT";
const COMPLETED = "COMPLETED";

const getOrdersData = (orders) => {
  const allOrders = [];
  const pendingOrders = [];
  const partyPendingPaymentOrders = [];
  const userPendingPaymentOrders = [];
  const paymentOrders = [];
  const deletedOrders = [];

  orders?.map((order) => {
    if (order.status !== AVAILABLE) {
      deletedOrders.push(order);
    }

    if (order.status === AVAILABLE && order.orderStatus !== PAYMENT) {
      if (order.orderStatus !== COMPLETED) {
        pendingOrders.push(order);
      }
      if (order.partyName !== "USER" && order.remainingAmount !== 0) {
        partyPendingPaymentOrders.push(order);
      }
      if (order.partyName === "USER" && order.remainingAmount !== 0) {
        userPendingPaymentOrders.push(order);
      }
      allOrders.push(order);
    }
    if (order.status === AVAILABLE && order.orderStatus === PAYMENT) {
      paymentOrders.push(order);
    }
  });

  return {
    allOrders,
    pendingOrders,
    partyPendingPaymentOrders,
    userPendingPaymentOrders,
    paymentOrders,
    deletedOrders,
  };
};

export default function Orders({ showInsights }) {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const { loading, error, orders, insights, paymentOrders } = useSelector(
    (state) => state.allCustomers
  );
  const { user } = useSelector((state) => state.user);
  const { tab, allOrderPage } = useSelector((state) => state.userPreferences);

  const [modalValues, setModalValues] = React.useState({});
  const [customReminderValues, setCustomReminderValues] = React.useState({
    date: new Date(Date.now()).toLocaleDateString(),
  });
  const [reminderDate, setReminderDate] = React.useState(new Date(Date.now()));
  const [checkEntry, setCheckEntry] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [customReminderDate, setCustomReminderDate] = React.useState(
    Date.now()
  );
  const [openUpdate, setOpenUpdate] = React.useState(false);

  const [value, setValue] = React.useState(tab);
  const [buttonID, setButtonID] = React.useState(tab);

  const [orderStatus, setOrderStatus] = React.useState();
  const [openCustomReminder, setOpenCustomReminder] = React.useState(false);

  const { isUpdated } = useSelector((state) => state.customer);

  const handleChange = (event, newValue) => {
    dispatch({ type: "SET_TAB", payload: { tabId: newValue } });
    a11yProps(newValue);
    setButtonID(newValue);
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOrderStatus(null);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setOrderStatus(null);
  };

  const deleteOrderHandler = (id) => {
    history(`/customer/delete/${id}`);
  };

  const editOrderHandler = (id) => {
    history(`/customer/update/${id}`);
  };
  const updatePaymentHandler = (id, paymentStatus) => {
    if (paymentStatus === "PAID") {
      alert.error("Payment already completed");
      return;
    }
    history(`/customer/updatePaymentStatus/${id}`);
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_CUSTOMER_RESET });
    }
  }, [dispatch, alert, error, isUpdated]);

  useEffect(() => {
    dispatch(getAllOrders({ useCache: true }));
  }, [dispatch, alert, error]);

  const showModal = (name, remain, id) => {
    setModalValues({
      name,
      remain,
      id,
    });
    handleClickOpen();
  };

  const showModalUpdate = (name, id, orderStatus) => {
    setModalValues({
      name,
      id,
      orderStatus,
    });
    setOpenUpdate(true);
  };

  const COLUMNS = [
    {
      field: "orderDate",
      headerName: "Date",
      minWidth: 99,
      maxWidth: 100,
      flex: 1,
    },
    {
      field: "id",
      headerName: "Order Actions",
      minWidth: 259,
      maxWidth: 260,
      flex: 1,
      sortable: false,
      hide: buttonID == 4 ? true : false,
      renderCell: (params) => {
        return (
          <Fragment>
            <NotificationsActiveIcon
              style={{ margin: "10px", cursor: "pointer" }}
              htmlColor={"#1976d2"}
              onClick={() =>
                showModal(
                  params.getValue(params.id, "name"),
                  params.getValue(params.id, "remain"),
                  params.getValue(params.id, "id")
                )
              }
            />
            <EditIcon
              style={{ margin: "10px", cursor: "pointer" }}
              htmlColor={"#1976d2"}
              onClick={() => editOrderHandler(params.getValue(params.id, "id"))}
            />
            <CheckCircleOutlineIcon
              htmlColor={
                params.getValue(params.id, "orderStatus") === "COMPLETED"
                  ? "#1976d2"
                  : "red"
              }
              style={{ margin: "10px", cursor: "pointer" }}
              onClick={() =>
                showModalUpdate(
                  params.getValue(params.id, "name"),
                  params.getValue(params.id, "id"),
                  params.getValue(params.id, "orderStatus")
                )
              }
            />
            <CurrencyRupeeIcon
              style={{ margin: "10px", cursor: "pointer" }}
              htmlColor={
                params.getValue(params.id, "paymentStatus") === "PAID"
                  ? "#1976d2"
                  : "red"
              }
              onClick={() =>
                updatePaymentHandler(
                  params.getValue(params.id, "id"),
                  params.getValue(params.id, "paymentStatus")
                )
              }
            />
            <Button
              style={{
                color: params.getValue(params.id, "whatsappNo")
                  ? "green"
                  : "#1976d2",
              }}
              disabled={params.getValue(params.id, "whatsappNo") ? false : true}
              onClick={() =>
                generateLink(
                  params.getValue(params.id, "whatsappNo"),
                  params.getValue(params.id, "remain"),
                  params.getValue(params.id, "orderStatus")
                )
              }
            >
              {params.getValue(params.id, "whatsappNo") ? (
                <WhatsAppIcon />
              ) : (
                <LocalPhoneIcon />
              )}
            </Button>
          </Fragment>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">
                    {params.getValue(params.id, "particulars")}
                  </Typography>
                </React.Fragment>
              }
            >
              <Link
                to={`/customers/advance/${params.getValue(params.id, "id")}`}
                style={{
                  color: "#1976d2",
                }}
              >
                {params.getValue(params.id, "name")}
              </Link>
            </HtmlTooltip>
          </Fragment>
        );
      },
    },
    {
      field: "Withdrawal",
      headerName: "Withdrawal",
      minWidth: 200,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        return (
          <Chip
            variant="outlined"
            label={
              params.getValue(params.id, "partyName") === "INTERNAL PARTY"
                ? "Debited"
                : "Credited"
            }
            color={
              params.getValue(params.id, "partyName") === "INTERNAL PARTY"
                ? "error"
                : "success"
            }
          />
        );
      },
      hide: buttonID == 4 ? false : true,
    },
    {
      field: "particulars",
      headerName: "Particulars",
      minWidth: 250,
      flex: 1,
      sortable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 90,
      hide: buttonID == 4 ? true : false,
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
      hide: buttonID == 4 ? true : false,
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "whatsappNo",
      headerName: "Whatsapp",
      minWidth: 99,
      maxWidth: 110,
      hide: buttonID == 4 ? true : false,
      flex: 1,
      sortable: false,
    },
    {
      field: "deliveryDate",
      headerName: "Delivery",
      minWidth: 99,
      maxWidth: 100,
      flex: 1,
      hide: buttonID == 4 ? true : false,
    },
    {
      field: "paymentMode",
      headerName: "Mode",
      minWidth: 100,
      flex: 1,
      maxWidth: 100,
    },
    {
      field: "partyName",
      headerName: "Party",
      minWidth: 100,
      maxWidth: 110,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            {params.getValue(params.id, "partyName") === "USER" ? (
              params.getValue(params.id, "partyName")
            ) : (
              <Link
                to={
                  params.getValue(params.id, "partyName") === "INTERNAL PARTY"
                    ? `internal/party/${params.getValue(params.id, "partyID")}`
                    : `party/partySearch/${params.getValue(
                        params.id,
                        "partyID"
                      )}`
                }
                style={{
                  color: "#1976d2",
                }}
              >
                {params.getValue(params.id, "partyName") === "INTERNAL PARTY"
                  ? `Internal`
                  : params.getValue(params.id, "partyName")}
              </Link>
            )}
          </Fragment>
        );
      },
    },
    {
      field: "phoneNo",
      headerName: "Phone",
      hide: buttonID == 4 ? true : false,
      minWidth: 99,
      maxWidth: 110,
      flex: 1,
      sortable: false,
    },
    {
      field: "actions",
      flex: 0.5,
      headerName: "Delete",
      minWidth: 80,
      sortable: false,
      hide: true,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              style={{ color: "red" }}
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
              }
              disabled={
                params.getValue(params.id, "orderStatus") === "PAYMENT"
                  ? true
                  : false
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const COLUMNS_2 = [
    {
      field: "orderDate",
      headerName: "Date",
      minWidth: 99,
      maxWidth: 100,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <div>
              <MenuList
                routes={[
                  {
                    component: () => (
                      <NotificationsActiveIcon
                        style={{ margin: "10px", cursor: "pointer" }}
                        htmlColor={"#1976d2"}
                        onClick={() =>
                          showModal(
                            params.getValue(params.id, "name"),
                            params.getValue(params.id, "remain"),
                            params.getValue(params.id, "id")
                          )
                        }
                      />
                    ),
                  },
                  {
                    component: () => (
                      <EditIcon
                        style={{ margin: "10px", cursor: "pointer" }}
                        htmlColor={"#1976d2"}
                        onClick={() =>
                          editOrderHandler(params.getValue(params.id, "id"))
                        }
                      />
                    ),
                  },
                  {
                    component: () => (
                      <CheckCircleOutlineIcon
                        htmlColor={
                          params.getValue(params.id, "orderStatus") ===
                          "COMPLETED"
                            ? "#1976d2"
                            : "red"
                        }
                        style={{ margin: "10px", cursor: "pointer" }}
                        onClick={() =>
                          showModalUpdate(
                            params.getValue(params.id, "name"),
                            params.getValue(params.id, "id"),
                            params.getValue(params.id, "orderStatus")
                          )
                        }
                      />
                    ),
                  },
                  {
                    component: () => (
                      <WhatsAppIcon
                        style={{ margin: "10px", cursor: "pointer" }}
                        disabled={
                          params.getValue(params.id, "whatsappNo")
                            ? false
                            : true
                        }
                        htmlColor={
                          params.getValue(params.id, "whatsappNo")
                            ? "green"
                            : "#1976d2"
                        }
                        onClick={() =>
                          generateLink(
                            params.getValue(params.id, "whatsappNo"),
                            params.getValue(params.id, "remain"),
                            params.getValue(params.id, "orderStatus")
                          )
                        }
                      />
                    ),
                  },
                  {
                    component: () => (
                      <CurrencyRupeeIcon
                        style={{ margin: "10px", cursor: "pointer" }}
                        htmlColor={
                          params.getValue(params.id, "paymentStatus") === "PAID"
                            ? "#1976d2"
                            : "red"
                        }
                        onClick={() =>
                          updatePaymentHandler(
                            params.getValue(params.id, "id"),
                            params.getValue(params.id, "paymentStatus")
                          )
                        }
                      />
                    ),
                  },
                ]}
                flex={"column"}
                actionTitle={"⋮"}
              />
            </div>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">
                    {params.getValue(params.id, "particulars")}
                  </Typography>
                </React.Fragment>
              }
            >
              <Link
                to={`/customers/advance/${params.getValue(params.id, "id")}`}
                style={{
                  color: "#1976d2",
                }}
              >
                {params.getValue(params.id, "name")}
              </Link>
            </HtmlTooltip>
          </Fragment>
        );
      },
    },
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
      field: "whatsappNo",
      headerName: "Whatsapp",
      minWidth: 99,
      maxWidth: 110,
      flex: 1,
      sortable: false,
    },
    {
      field: "deliveryDate",
      headerName: "Delivery",
      minWidth: 99,
      maxWidth: 100,
      flex: 1,
    },
    {
      field: "paymentMode",
      headerName: "Mode",
      minWidth: 100,
      flex: 1,
      maxWidth: 100,
    },
    {
      field: "partyName",
      headerName: "Party",
      minWidth: 100,
      maxWidth: 110,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            {params.getValue(params.id, "partyName") === "USER" ? (
              "USER"
            ) : (
              <Link
                to={`party/partySearch/${params.getValue(
                  params.id,
                  "partyID"
                )}`}
                style={{
                  color: "#1976d2",
                }}
              >
                {params.getValue(params.id, "partyName")}
              </Link>
            )}
          </Fragment>
        );
      },
    },
    {
      field: "phoneNo",
      headerName: "Phone",
      minWidth: 99,
      maxWidth: 110,
      flex: 1,
      sortable: false,
    },
    {
      field: "actions",
      flex: 0.5,
      headerName: "Delete",
      minWidth: 80,
      sortable: false,
      hide: true,
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

  const createDataset = (data) => {
    const dataset = [];
    data?.map((a) => {
      let description = "";
      a?.particulars?.map((b) => {
        description += b.item;
        description += ", ";
      });
      dataset.push({
        orderDate: a?.orderDate
          ?.substring(0, 10)
          .split("-")
          .reverse()
          .join("-"),
        id: a._id,
        name: a.name,
        particulars: description,
        amount: a.totalAmount,
        paid: a.paidAmount,
        remain: a.remainingAmount,
        phoneNo: a.phoneNo,
        deliveryDate: a?.deliveryDate
          ?.substring(0, 10)
          .split("-")
          .reverse()
          .join("-"),
        paymentStatus: a.paymentStatus,
        paymentMode: a.paymentMode,
        orderStatus: a.orderStatus,
        partyName: a.partyName,
        partyID: a.partyID,
        whatsappNo: a.whatsappNo,
      });
    });
    return dataset;
  };

  const createPaymentDataset = (data) => {
    const dataset = [];
    data?.map((a) => {
      let description = "";
      a?.particulars?.map((b) => {
        description += b.item;
        description += ", ";
      });
      dataset.push({
        orderDate: a?.orderDate
          ?.substring(0, 10)
          .split("-")
          .reverse()
          .join("-"),
        id: a._id,
        name: a.name,
        particulars: description,
        amount: a.totalAmount,
        paid:
          a.partyName === "INTERNAL PARTY"
            ? a?.particulars[0]?.total
            : a.paidAmount,
        remain: a.remainingAmount,
        phoneNo: a.phoneNo,
        deliveryDate: a?.deliveryDate
          ?.substring(0, 10)
          .split("-")
          .reverse()
          .join("-"),
        paymentStatus: a.paymentStatus,
        paymentMode: a.paymentMode,
        orderStatus: a.orderStatus,
        partyName: a.partyName,
        partyID: a.partyID,
        whatsappNo: a.whatsappNo,
      });
    });
    return dataset;
  };

  const { pendingOrders, partyPendingPaymentOrders, userPendingPaymentOrders } =
    getOrdersData(orders);

  const allOrdersDataset = createDataset(orders);
  const pendingOrdersDataset = createDataset(pendingOrders);
  const partyPendingPaymentOrdersDataset = createDataset(
    partyPendingPaymentOrders
  );
  const userPendingPaymentOrdersDataset = createDataset(
    userPendingPaymentOrders
  );
  const paymentOrdersDataset = createPaymentDataset(paymentOrders);

  const buttonDatasetMapping = {
    0: { dataset: allOrdersDataset, name: "All Orders" },
    1: { dataset: pendingOrdersDataset, name: "Pending Orders" },
    2: {
      dataset: partyPendingPaymentOrdersDataset,
      name: "Party Pending Payment",
    },
    3: {
      dataset: userPendingPaymentOrdersDataset,
      name: "User Pending Payment",
    },
    4: { dataset: paymentOrdersDataset, name: "Payment Orders" },
  };

  const exportToPdf_one = () => {
    exportToPdf(buttonDatasetMapping, buttonID);
  };

  const createReminderHandler = () => {
    const payload = {
      dateCreated: reminderDate,
      message: `Payment reminder of Rs.${modalValues?.remain} from ${modalValues?.name}`,
      action: "REMINDER",
      updatedBy: user.name,
      link: `/customers/${modalValues?.id}`,
    };
    dispatch(createNotification(payload));
    setModalValues({});
    setOpen(false);
    dispatch(getAllNotifications());
  };

  const createCustomReminderHandler = () => {
    const payload = {
      dateCreated: customReminderValues?.date,
      message: `Payment reminder of Rs.${customReminderValues?.amount} from ${customReminderValues?.name}`,
      action: "REMINDER",
      updatedBy: user.name,
      link: `#`,
    };
    dispatch(createNotification(payload));
    setCustomReminderValues({
      date: new Date(Date.now()).toLocaleDateString(),
    });
    setOpenCustomReminder(false);
  };

  const updateOrderHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("orderStatus", orderStatus);
    dispatch(updateCustomer(modalValues?.id, myForm, orderStatus, orders));
    setOpenUpdate(false);
    setOrderStatus(null);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard2">
          <HeaderActions />
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{modalValues?.name}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This is a Reminder for a Remaining Payment of Rs.{" "}
                {modalValues?.remain}
              </DialogContentText>

              <div style={{ marginTop: "20px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={reminderDate}
                    onChange={(newValue) => {
                      setReminderDate(newValue["$d"].toLocaleDateString());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={`Type ${modalValues?.name} to Confirm`}
                type="email"
                onChange={(e) => {
                  if (e.target.value === modalValues?.name) {
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

          <Dialog
            open={openCustomReminder}
            onClose={() => {
              setOpenCustomReminder(false);
            }}
          >
            <DialogTitle>Custom Reminder</DialogTitle>

            <DialogContent>
              <div>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label={`Enter Name`}
                  onChange={(e) => {
                    setCustomReminderValues({
                      ...customReminderValues,
                      name: e.target.value,
                    });
                  }}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  margin="dense"
                  id="name"
                  label={`Enter Amount`}
                  type="number"
                  onChange={(e) => {
                    setCustomReminderValues({
                      ...customReminderValues,
                      amount: e.target.value,
                    });
                  }}
                  fullWidth
                  variant="standard"
                />

                <div style={{ marginTop: "20px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={customReminderDate}
                      inputFormat="DD-MM-YYYY"
                      onChange={(newValue) => {
                        setCustomReminderValues({
                          ...customReminderValues,
                          date: newValue["$d"].toLocaleDateString(),
                        });
                        setCustomReminderDate(
                          newValue["$d"].toLocaleDateString()
                        );
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenCustomReminder(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  customReminderValues?.name &&
                  customReminderValues?.date &&
                  customReminderValues?.amount
                    ? false
                    : true
                }
                onClick={createCustomReminderHandler}
              >
                Create Custom Reminder
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openUpdate} onClose={handleCloseUpdate}>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogContent>
              <DialogContentText>{modalValues?.name}</DialogContentText>

              <div
                style={{
                  display: "flex",
                  marginTop: "5px",
                  padding: "2px",
                }}
              >
                <Button
                  color="success"
                  onClick={() => setOrderStatus("START")}
                  disabled={modalValues?.orderStatus === "START"}
                >
                  START
                </Button>

                <Button
                  color="success"
                  onClick={() => setOrderStatus("COMPLETED")}
                  disabled={modalValues?.orderStatus === "COMPLETED"}
                >
                  COMPLETED
                </Button>
              </div>

              <div>
                <CardItem
                  keyItem={"Order Status is "}
                  value={orderStatus ? orderStatus : modalValues?.orderStatus}
                  threshold={0}
                  disableIcon={true}
                />
              </div>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseUpdate}>Cancel</Button>
              <Button
                disabled={orderStatus ? false : true}
                onClick={updateOrderHandler}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>

          <div className="order-buttons">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
            >
              <Tab label="All Orders" {...a11yProps(0)} />
              <Tab label="Pending Orders" {...a11yProps(1)} />
              <Tab label="Party Pending Payment" {...a11yProps(2)} />
              <Tab label="User Pending Payment" {...a11yProps(3)} />
              {user.permission === "admin" && (
                <Tab label="Payment Orders" {...a11yProps(4)} />
              )}
            </Tabs>
            {/* {showInsights ? (
           <div style={{ height:"20%", width:"50%", display:"flex" }}>
             <Bar options={options1} data={data1} />
             <Bar options={options2} data={data2} />
          </div> 
        ):(<></>)} */}
          </div>

          <div className="productListContainer2">
            <div id="productListHeading">
              <Typography variant="h4">
                {buttonDatasetMapping[buttonID].name}

                <Button
                  style={{
                    maxWidth: "30px",
                    maxHeight: "30px",
                    minWidth: "30px",
                    minHeight: "30px",
                    margin: "5px",
                  }}
                  onClick={exportToPdf_one}
                >
                  <FileDownloadIcon />
                </Button>

                <Button
                  style={{
                    maxWidth: "30px",
                    maxHeight: "30px",
                    minWidth: "30px",
                    minHeight: "30px",
                    margin: "5px",
                  }}
                  onClick={() => {
                    setOpenCustomReminder(true);
                  }}
                >
                  <AlarmIcon />
                </Button>
              </Typography>
            </div>

            <div className="percentage-analytics">
              <div>
                <CardItem
                  keyItem={"Order Completion Rate"}
                  value={insights?.orders?.orderPercentage}
                  threshold={95}
                  disableIcon={true}
                />
              </div>
              <div>
                <CardItem
                  keyItem={"Payment fulfillment Rate"}
                  value={insights?.amount?.amountPercentage}
                  threshold={55}
                  disableIcon={true}
                />
              </div>
              <div>
                <CardItem
                  keyItem={"User Payment fulfillment Rate"}
                  value={insights?.user?.userPercentage}
                  threshold={60}
                  disableIcon={true}
                />
              </div>
              <div>
                <CardItem
                  keyItem={"Party Payment fulfillment Rate"}
                  value={insights?.party?.partyPercentage}
                  threshold={50}
                  disableIcon={true}
                />
              </div>
            </div>

            {showInsights ? (
              <div id="insights">
                <Insights />
              </div>
            ) : (
              <></>
            )}

            <TableComponent
              page={allOrderPage}
              onPageChange={(newPage) => {
                dispatch({ type: "SET_ALL_ORDER_PAGE", payload: newPage });
              }}
              dataset={buttonDatasetMapping[buttonID].dataset}
              columns={window.screen.width < 500 ? COLUMNS_2 : COLUMNS}
              pageSize={30}
              autoHeight={true}
              disableSelectionOnClick={false}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}
