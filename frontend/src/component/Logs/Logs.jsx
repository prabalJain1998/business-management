import * as React from "react";
import Loader from "../layout/Loader/Loader.js";
import { Fragment } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Chip from "@mui/material/Chip";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { getAllLogs } from "../../actions/logsAction";
import { useAlert } from "react-alert";
import { Alert, Avatar, Button, Snackbar, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CardItem from "../common/CardItem.jsx";
import TableComponent from "../common/TableComponent.jsx";
import { clearErrors } from "../../actions/notificationAction.js";
import "./Logs.css";
import Heading from "../common/Heading.jsx";
import { formatDate } from "../common/utils.js";
import { PAYMENT_COLLECTED } from "../../constants/logsConstants.js";
import DrawerComponent from "../customer/Drawer.jsx";
import HeaderActions from "../common/HeaderActions.jsx";

const COLUMNS = [
  {
    field: "date",
    headerName: "Date",
    minWidth: 100,
    maxWidth: 150,
    flex: 0.5,
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 199,
    maxWidth: 250,
    flex: 0.5,
    sortable: false,
    renderCell: (params) => {
      return (
        <Fragment>
          <Chip
            avatar={<Avatar>{params.getValue(params.id, "action")[0]}</Avatar>}
            label={params.getValue(params.id, "action")}
          />
        </Fragment>
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    minWidth: 90,
    maxWidth: 120,
    flex: 0.5,
    renderCell: (params) => {
      return (
        <Fragment>
          <Chip
            label={params.getValue(params.id, "amount")}
            variant="outlined"
            color="primary"
          />
        </Fragment>
      );
    },
  },
  {
    field: "message",
    headerName: "Message",
    minWidth: 300,
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      return (
        <Fragment>
          <Tooltip
            title={params.getValue(params.id, "message")}
            placement="right"
          >
            {/* <Chip variant='outlined' label={params.getValue(params.id, "message")} color="success"/> */}
            <p>{params.getValue(params.id, "message")}</p>
          </Tooltip>
        </Fragment>
      );
    },
  },
];

export default function Logs() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loadingAllLogs, logs, paymentLogs, errorlogs } = useSelector(
    (state) => state.logs
  );

  const [startDate, setStartDate] = React.useState(new Date(Date.now()));
  const [endDate, setEndDate] = React.useState(new Date(Date.now()));

  const [totalAmount, setTotalAmount] = React.useState(0);
  const [totalPaymentAmount, setPaymentAmount] = React.useState(0);
  const [data, setData] = React.useState([]);

  useEffect(() => {
    if (errorlogs) {
      dispatch(clearErrors());
    }
  }, [dispatch, alert, errorlogs]);

  useEffect(() => {
    dispatch(
      getAllLogs({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      })
    );
  }, [dispatch, startDate, endDate]);

  const formatLogs = (type) => {
    let logsDataset = [];
    let paymentLogsDataset = [];
    let totalPaymentAmount = 0;

    let totalAmount = 0;
    let index = 0;

    logs &&
      logs.forEach((item) => {
        logsDataset.push({
          date: item.date.substring(0, 10).split("-").reverse().join("-"),
          action: item.action,
          amount: item?.details?.amount,
          message: item?.details?.message,
          id: `${item?.details?.referenceID}${index}`,
        });
        totalAmount += Number(item?.details?.amount);
        index += 1;
      });

    paymentLogs &&
      paymentLogs.forEach((item) => {
        paymentLogsDataset.push({
          date: item.date.substring(0, 10).split("-").reverse().join("-"),
          action: item.action,
          amount: item?.details?.amount,
          message: item?.details?.message,
          id: `${item?.details?.referenceID}${index}`,
        });
        totalPaymentAmount += Number(item?.details?.amount);
        index += 1;
      });

    logsDataset.reverse();
    paymentLogsDataset.reverse();

    setTotalAmount(totalAmount);
    setPaymentAmount(totalPaymentAmount);
    setData(type === "LOGS" ? logsDataset : paymentLogsDataset);
  };

  return (
    <div>
      <HeaderActions />
      <Snackbar open={errorlogs} autoHideDuration={2000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          Oops! error fetching logs
        </Alert>
      </Snackbar>

      <div className="dashboard2">
        <div className="productListContainer2">
          <Heading
            label={"Logs"}
            icon={() => {
              return <PointOfSaleIcon color="green" />;
            }}
          />

          <div className="percentage-analytics">
            <div>
              <CardItem keyItem={"Amount"} value={totalAmount} threshold={0} />
            </div>
            <div>
              <CardItem
                keyItem={"Internal Amount"}
                value={parseInt(totalAmount * 0.2)}
                threshold={0}
                disableIcon={true}
              />
            </div>
            <div>
              <CardItem
                keyItem={"Paid Amount"}
                value={parseInt(totalPaymentAmount)}
                threshold={0}
                disableIcon={true}
              />
            </div>
          </div>

          <div className="filterFields-logs">
            <div style={{ padding: "15px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  inputFormat="DD-MM-YYYY"
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
                  inputFormat="DD-MM-YYYY"
                  onChange={(newValue) => {
                    setEndDate(newValue["$d"].toLocaleDateString());
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div style={{ padding: "15px", maxWidth: "80%" }}>
              <Button
                id="logs-filter-search-button"
                onClick={() => {
                  formatLogs("LOGS");
                }}
              >
                Search
              </Button>
            </div>

            <div style={{ padding: "15px", maxWidth: "80%" }}>
              <Button
                id="logs-filter-search-button"
                onClick={() => {
                  formatLogs("PAYMENT");
                }}
              >
                Payment
              </Button>
            </div>
          </div>

          <TableComponent
            dataset={data}
            columns={COLUMNS}
            pageSize={100}
            autoHeight={true}
            disableSelectionOnClick={false}
          />
        </div>
      </div>
    </div>
  );
}
