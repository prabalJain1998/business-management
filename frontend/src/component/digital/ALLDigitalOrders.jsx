import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Loader from "../layout/Loader/Loader.js";
import { Fragment } from "react";
// import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DownloadIcon from "@mui/icons-material/Download";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Switch from "@mui/material/Switch";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import {
  clearErrors,
  deleteDigitalOrder,
  getAllOrders,
} from "../../actions/digitalAction";
import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { useAlert } from "react-alert";
import { DELETE_DIGITAL_RESET } from "../../constants/digitalConstants.js";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "jspdf-autotable";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { formatDate } from "../common/utils.js";
import CardItem from "../common/CardItem.jsx";
import HeaderActions from "../common/HeaderActions.jsx";

const alertPopup = () => {
  alert("Hi Alert");
};
const useStyle = {
  "order-buttons": {
    width: "23%",
    padding: "3px",
    marginLeft: "3px",
    color: "white",
    backgroundColor: "#131924",
  },
};

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

export default function Orders() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { loading, error, orders } = useSelector(
    (state) => state.allDigitalOrder
  );
  const { isDeleted } = useSelector((state) => state.digitalOrder);
  const [paymentReceived, setPaymentReceived] = React.useState(0);
  const [today, setToday] = React.useState(false);

  const deleteOrderHandler = (id) => {
    let inp = prompt(
      "DANGER!!! Are you sure you want to delete this ? Please Type `YES` to delete."
    );
    if (inp.toLowerCase().includes("yes")) {
      dispatch(deleteDigitalOrder(id));
      dispatch({ type: DELETE_DIGITAL_RESET });
    }
  };

  const editOrderHandler = (id) => {
    history(`/digital/action/update/${id}`);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Deleted Successfully");
      dispatch({ type: DELETE_DIGITAL_RESET });
    }
    dispatch(getAllOrders({ useCache: false }));
  }, [dispatch, alert, error, isDeleted]);

  const columns = [
    { field: "orderDate", headerName: "Date", minWidth: 50, flex: 0.5 },
    {
      field: "id",
      headerName: "Order Actions",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              disabled={showPayment ? true : false}
              onClick={() => editOrderHandler(params.getValue(params.id, "id"))}
            >
              <EditIcon />
            </Button>

            {checked && (
              <Button
                style={{ color: "red" }}
                onClick={() =>
                  deleteOrderHandler(params.getValue(params.id, "id"))
                }
                disabled={showPayment}
              >
                <DeleteIcon />
              </Button>
            )}
          </Fragment>
        );
      },
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
      field: "totalAmount",
      headerName: "Total Amount",
      type: "number",
      minWidth: 90,
      flex: 0.5,
    },
    {
      field: "totalInternalAmount",
      headerName: "Internal Amount",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },
  ];

  const [startDate, setStartDate] = React.useState(new Date(2022, 7, 14));
  const [endDate, setEndDate] = React.useState(new Date(Date.now() + 2));
  const [showPayment, setShowPayment] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [totalInternalAmount, setTotalInternalAmount] = React.useState(0);
  const [data, setData] = React.useState();

  const [checked, setChecked] = React.useState(false);

  const handleSwitchChange = () => {
    setChecked(!checked);
  };

  const filterOrders = () => {
    setShowPayment(false);
    let rows = [];
    let totalAmount = 0;
    let totalInternalAmount = 0;
    let paymentReceived = 0;

    orders &&
      orders.forEach((item) => {
        let dateorder = new Date(item.date);
        dateorder = new Date(dateorder.toLocaleDateString());

        let start = new Date(startDate);
        start = new Date(start.toLocaleDateString());

        let end = new Date(endDate);
        end = new Date(end.toLocaleDateString());

        if (
          start.getTime() <= dateorder &&
          end.getTime() >= dateorder &&
          item.action &&
          item.action !== "PAYMENT"
        ) {
          let desc = "";
          item.particulars.map((item) => {
            desc += item.item;
            desc += ",";
          });

          rows.push({
            orderDate: formatDate(dateorder).split("-").reverse().join("/"),
            id: item._id,
            name: item.name,
            particulars: desc,
            totalAmount: item.totalAmount,
            totalInternalAmount: item.totalInternalAmount,
            phoneNo: item.phoneNo,
          });

          totalAmount += Number(item.totalAmount);
          totalInternalAmount += Number(item.totalInternalAmount);
        }

        if (
          start.getTime() <= dateorder &&
          end.getTime() >= dateorder &&
          item.action &&
          item.action === "PAYMENT"
        ) {
          paymentReceived += Number(item.totalAmount);
        }
        rows.reverse();
        setTotalInternalAmount(totalInternalAmount);
        setRows(rows);
        setTotalAmount(totalAmount);
        setData(rows);
        setPaymentReceived(paymentReceived);
      });
  };

  const todayButton = () => {
    setShowPayment(true);
    setToday(true);
    let rows = [];
    let paymentReceived = 0;

    orders &&
      orders.forEach((item) => {
        if (item.action && item.action === "PAYMENT") {
          let desc = "";
          item.particulars.map((item) => {
            desc += item.item;
            desc += ",";
          });

          rows.push({
            orderDate: item.date
              .substring(0, 10)
              .split("-")
              .reverse()
              .join("-"),
            id: item._id,
            name: item.name,
            particulars: desc,
            totalAmount: item.totalAmount,
            totalInternalAmount: item.totalInternalAmount,
            phoneNo: item.phoneNo,
          });
          paymentReceived += Number(item.totalAmount);
        }
        rows.reverse();
        setRows(rows);
        setData(rows);
        setPaymentReceived(paymentReceived);
      });
  };

  const exportToPdf = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(13);
    const headers = [["Order Date", "Name", "Total", "Internal"]];
    let downloadPdf =
      data &&
      data.map((elt) => [
        elt.orderDate.substring(0, 10),
        elt.name,
        elt.totalAmount,
        elt.totalInternalAmount,
      ]);
    let title =
      "Digital Orders " +
      `Date : ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()} Total Income : ${totalAmount}`;
    let content = { startY: 50, head: headers, body: downloadPdf };
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("Digital Orders.pdf");
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard2">
          <HeaderActions />
          <div className="productListContainer2">
            <h1 id="productListHeading">
              ALL ORDERS
              <Button style={{ color: "#131924" }} onClick={exportToPdf}>
                <DownloadIcon />
              </Button>
              <Switch
                checked={checked}
                onChange={handleSwitchChange}
                inputProps={{ "aria-label": "controlled" }}
                color="warning"
              />
            </h1>

            <div className="percentage-analytics">
              <div>
                {!showPayment && (
                  <CardItem
                    keyItem={"Orders"}
                    value={rows && rows.length}
                    threshold={0}
                    disableIcon={true}
                  />
                )}
              </div>
              <div>
                {!showPayment && (
                  <CardItem
                    keyItem={"Total Amount"}
                    value={totalAmount}
                    threshold={0}
                    disableIcon={true}
                  />
                )}
              </div>
              <div>
                {!showPayment && (
                  <CardItem
                    keyItem={"Total Internal"}
                    value={totalInternalAmount}
                    threshold={0}
                    disableIcon={true}
                  />
                )}
              </div>
              <div>
                {!showPayment && (
                  <CardItem
                    keyItem={"Profit"}
                    value={totalAmount - totalInternalAmount}
                    threshold={0}
                    disableIcon={true}
                  />
                )}
              </div>
              <div>
                {!showPayment && (
                  <CardItem
                    keyItem={"Remain Payment"}
                    value={totalInternalAmount - paymentReceived}
                    threshold={0}
                    disableIcon={true}
                  />
                )}
              </div>
              <div>
                {showPayment && (
                  <CardItem
                    keyItem={"Payment Received"}
                    value={paymentReceived}
                    threshold={totalInternalAmount - 1}
                  />
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ padding: "15px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue["$d"].toLocaleDateString());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <div style={{ padding: "15px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue["$d"].toLocaleDateString());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <div style={{ padding: "15px" }}>
                <Button
                  style={{
                    backgroundColor: "#131924",
                    color: "white",
                    padding: "5px",
                    marginTop: "10px",
                  }}
                  onClick={filterOrders}
                >
                  Search
                </Button>
              </div>

              <div style={{ padding: "15px" }}>
                <Button
                  style={{
                    backgroundColor: "#131924",
                    color: "white",
                    padding: "5px",
                    marginTop: "10px",
                  }}
                  onClick={todayButton}
                >
                  Payment
                </Button>
              </div>
            </div>

            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={100}
              disableSelectionOnClick
              className="productListTable2"
              autoHeight
              components={{
                Toolbar: GridToolbar,
                Pagination: CustomPagination,
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}
