import { Button, LinearProgress, Skeleton, TextField } from "@mui/material";
import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearErrors, getAllOrders } from "../../actions/customerAction.js";
import { useAlert } from "react-alert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Loader from "../layout/Loader/Loader";
import DrawerComponent from "./Drawer.jsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Heading from "../common/Heading";
import CardItem from "../common/CardItem";
import { formatDate } from "../common/utils";
import TableComponent from "../common/TableComponent";
import HeaderActions from "../common/HeaderActions.jsx";

const COLUMNS = [
  { field: "orderDate", headerName: "Date", minWidth: 100, flex: 1 },
  { field: "name", headerName: "Name", minWidth: 100, flex: 1 },
  { field: "particulars", headerName: "Particulars", minWidth: 200, flex: 1 },
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
  { field: "phoneNo", headerName: "Phone", minWidth: 100, flex: 1 },
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
];

const CustomerStatement = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, orders } = useSelector((state) => state.allCustomers);

  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState();
  const [data, setData] = useState();
  const [rows, setRows] = useState([]);
  const [totalPaid, setTotalPaid] = useState();
  const [cash, setCash] = useState();
  const [ordersRemain, setOrderRemain] = useState();
  const [online, setOnline] = useState();
  const [totalDiscount, setDiscountAmount] = useState();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(
      getAllOrders({
        useCache: false,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      })
    );
  }, [dispatch, alert, error, startDate, endDate]);

  const filterOrders = () => {
    const rows = [];
    let totalAmount = 0;
    let totalPaid = 0;
    let cash = 0;
    let ordersRemain = 0;
    let online = 0;
    let totalDiscount = 0;

    orders &&
      orders.forEach((item) => {
        let desc = "";
        item.particulars.map((item) => {
          desc += item.item;
          desc += "|";
        });
        rows.push({
          id: item._id,
          name: item.name,
          phoneNo: item.phoneNo,
          amount: item.totalAmount,
          paid: item.paidAmount,
          remain: item.remainingAmount,
          particulars: desc,
          orderDate: item.orderDate.substring(0, 10),
          deliveryDate: item.deliveryDate.substring(0, 10),
          paymentStatus: item.paymentStatus,
          paymentMode: item.paymentMode,
          orderStatus: item.orderStatus,
          partyName: item.partyName,
          whatsappNo: item.whatsappNo,
        });
        totalAmount = totalAmount + Number(item.totalAmount);
        totalPaid = totalPaid + Number(item.paidAmount);
        if (item.paymentMode.toLowerCase().includes("cash")) {
          cash += Number(item.paidAmount);
        }
        if (item.paymentMode.toLowerCase().includes("online")) {
          online += Number(item.paidAmount);
        }
        if (!item.orderStatus.toLowerCase().includes("completed")) {
          ordersRemain += 1;
        }
        totalDiscount += item.discountAmount;
      });

    setRows(rows);
    setTotalAmount(totalAmount);
    setTotalPaid(totalPaid);
    setCash(cash);
    setOrderRemain(ordersRemain);
    setOnline(online);
    setDashboardLoading(false);
    setData(rows);
    setDiscountAmount(totalDiscount);
  };

  const exportToPdf = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 30;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(13);
    const title = `Account Statement ${formatDate(startDate)} to ${formatDate(
      endDate
    )}`;
    const headers = [
      [
        "Name",
        "Particulars",
        "Phone",
        "Total",
        "Paid",
        "Remain",
        "Date",
        "Whatsapp",
      ],
    ];
    const dataModify =
      data &&
      data.map((elt) => [
        elt?.name,
        elt?.particulars,
        elt?.phoneNo,
        elt?.amount,
        elt?.paid,
        elt?.remain,
        elt?.orderDate.substring(0, 10),
        elt?.whatsappNo,
      ]);
    let content = {
      startY: 50,
      head: headers,
      body: dataModify,
    };
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(
      `Account Statement ${formatDate(startDate)} to ${formatDate(endDate)}.pdf`
    );
  };

  return (
    <Fragment>
      <HeaderActions />
      <Heading
        label={"Orders Statement"}
        icon={() => {
          return <CalendarMonthIcon />;
        }}
      />
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

        <div style={{ padding: "15px", maxWidth: "100%" }}>
          <Button id="logs-filter-search-button" onClick={filterOrders}>
            Search
          </Button>
        </div>

        <div style={{ padding: "15px", maxWidth: "100%" }}>
          <Button
            id="logs-filter-search-button"
            onClick={exportToPdf}
            disabled={rows?.length === 0 ? true : false}
            style={{
              backgroundColor: rows?.length === 0 ? "#e8edeb" : "#0a95ff",
            }}
          >
            Export
          </Button>
        </div>
      </div>

      {dashboardLoading ? (
        <div>
          <LinearProgress />
        </div>
      ) : (
        <div className="dashboard2">
          <div className="productListContainer2">
            <h1 id="productListHeading">ALL ORDERS</h1>
            <div className="overall">
              <div style={{ display: "flex", flexFlow: "wrap" }}>
                <div>
                  <CardItem
                    keyItem={"Orders"}
                    value={rows?.length}
                    threshold={0}
                    disableIcon={true}
                  />
                </div>
                <div>
                  <CardItem
                    keyItem={"Remaining"}
                    value={ordersRemain}
                    threshold={0}
                    disableIcon={true}
                  />
                </div>
                <div>
                  <CardItem
                    keyItem={"Amount"}
                    value={totalAmount}
                    threshold={0}
                    disableIcon={true}
                  />
                </div>
                <div>
                  <CardItem
                    keyItem={"Paid"}
                    value={totalPaid}
                    threshold={0}
                    disableIcon={true}
                  />
                </div>
                <div>
                  <CardItem
                    keyItem={"Discount"}
                    value={totalDiscount}
                    threshold={0}
                    disableIcon={true}
                  />
                </div>
                <div>
                  <CardItem
                    keyItem={"Remain"}
                    value={totalAmount - totalPaid - totalDiscount}
                    threshold={0}
                    disableIcon={true}
                  />
                </div>
                <div>
                  <CardItem
                    keyItem={"Cash"}
                    value={cash}
                    threshold={0}
                    disableIcon={true}
                  />
                </div>
                <div>
                  <CardItem
                    keyItem={"Online"}
                    value={online}
                    threshold={0}
                    disableIcon={true}
                  />
                </div>
              </div>
            </div>
            <TableComponent
              dataset={rows}
              columns={COLUMNS}
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

export default CustomerStatement;
