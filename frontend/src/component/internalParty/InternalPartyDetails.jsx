import * as React from "react";
import Loader from "../layout/Loader/Loader.js";
import { Fragment, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearErrors, getAllOrders } from "../../actions/customerAction";
import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import AllOutIcon from "@mui/icons-material/AllOut";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import CardItem from "../common/CardItem.jsx";
import Paper from "@mui/material/Paper";
import DrawerComponent from "../customer/Drawer.jsx";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import { getAllInternalParties } from "../../actions/internalPartyAction.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Pagination from "@mui/material/Pagination";
import Heading from "../common/Heading.jsx";
import HeaderActions from "../common/HeaderActions.jsx";

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

const InternalPartyDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, orders, paymentOrders } = useSelector(
    (state) => state.allCustomers
  );
  const {
    loading: loadingInternal,
    error: errorInternal,
    party,
  } = useSelector((state) => state.allInternalParties);

  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [data, setData] = useState();

  const parties = party && party.parties;
  const { partyID } = useParams();

  const internalPartyInverseMappings = {};
  parties &&
    parties.map((item) => {
      internalPartyInverseMappings[item._id] = item.name;
    });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (errorInternal) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllOrders({ useCache: false }));
    dispatch(getAllInternalParties());
  }, [dispatch, alert, error, partyID, errorInternal]);

  const partyMappings = {};
  parties &&
    parties.forEach((item) => {
      partyMappings[item._id] = item.name;
    });

  const columns = [
    { field: "orderDate", headerName: "Date", minWidth: 100, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/customers/${params.getValue(params.id, "details")}`}>
              {params.getValue(params.id, "name")}
            </Link>
          </Fragment>
        );
      },
    },
    {
      field: "particulars",
      headerName: "Particulars",
      minWidth: 250,
      flex: 1.5,
    },
    { field: "quantity", headerName: "Quantity", minWidth: 90, flex: 0.5 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 90,
      flex: 0.5,
      hide: true,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 90,
      flex: 0.5,
    },
    {
      field: "partyID",
      headerName: "Party",
      minWidth: 110,
      flex: 1,
      hide: true,
    },
  ];

  const filterOrders = () => {
    const rows = [];
    let count = 0;
    let total = 0;
    let totalPaid = 0;

    orders &&
      orders.forEach((item) => {
        let dateorder = new Date(item.orderDate.substring(0, 10));

        if (
          dateorder >= new Date(startDate) &&
          dateorder <= new Date(endDate)
        ) {
          item.particulars.map((a) => {
            if (a.partyID && a.partyID == partyMappings[partyID]) {
              rows.push({
                id: count,
                details: item._id,
                orderDate: item.orderDate
                  .substring(0, 10)
                  .split("-")
                  .reverse()
                  .join("-"),
                name: item.name,
                particulars: a.item,
                quantity: a.quantity,
                price: a.price,
                total: a.total,
                partyID: partyMappings[partyID],
              });
              count += 1;
              if (item.orderStatus == "PAYMENT") {
                totalPaid += a.total;
              } else {
                total += a.total;
              }
            }
          });
        }
      });

    paymentOrders?.forEach((item) => {
      let dateorder = new Date(item.orderDate.substring(0, 10));

      if (dateorder >= new Date(startDate) && dateorder <= new Date(endDate)) {
        item.particulars.map((a) => {
          if (a?.partyID == partyMappings[partyID]) {
            rows.push({
              id: count,
              details: item._id,
              orderDate: item.orderDate
                .substring(0, 10)
                .split("-")
                .reverse()
                .join("-"),
              name: item.name,
              particulars: a.item,
              quantity: a.quantity,
              price: a.price,
              total: a.total,
              partyID: partyMappings[partyID],
            });
            count += 1;
            if (item.orderStatus == "PAYMENT") {
              totalPaid += a.total;
            } else {
              total += a.total;
            }
          }
        });
      }
    });

    rows.reverse();
    setDashboardLoading(false);
    setRows(rows);
    setTotalAmount(total);
    setTotalPaid(totalPaid);
    setData(rows);
  };

  const exportToPdf = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(13);

    let title = "Orders";
    const headers = [
      ["Date", "Name", "Particular", "Quantity", "Price", "Total"],
    ];
    let downloadPdf = null;

    if (data && data.length == 0) {
      alert.error("Oops No data found");
      return;
    }

    downloadPdf =
      data &&
      data.map((elt) => [
        elt.orderDate.substring(0, 10),
        elt.name,
        elt.particulars,
        elt.quantity,
        elt.price,
        elt.total,
      ]);

    let content = {
      startY: 50,
      head: headers,
      body: downloadPdf,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(partyMappings[partyID] + "_Statement_InternalParty.pdf");
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <HeaderActions />

          <h1 id="productListHeading">
            ALL ORDERS
            <Button style={{ color: "#131924" }} onClick={exportToPdf}>
              <DownloadIcon />
            </Button>
          </h1>

          <div style={{ display: "flex", flexDirection: "row" }}>
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

            <div style={{ padding: "15px" }}>
              <Button
                style={{
                  backgroundColor: "#131924",
                  color: "white",
                  padding: "5px",
                }}
                onClick={filterOrders}
              >
                Search
              </Button>
            </div>
          </div>

          <Paper
            style={{
              marginLeft: "10px",
              marginTop: "10px",
            }}
            elevation={2}
            square
          >
            <Accordion>
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <Heading
                    label={
                      internalPartyInverseMappings &&
                      internalPartyInverseMappings[partyID]
                    }
                    icon={() => {
                      return <AllOutIcon />;
                    }}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: "flex" }}>
                  <div>
                    <CardItem
                      keyItem={"Total Amount"}
                      value={totalAmount}
                      threshold={0}
                      disableIcon={true}
                    />
                  </div>
                  <div>
                    <CardItem
                      keyItem={"Total Paid"}
                      value={totalPaid}
                      threshold={0}
                      disableIcon={true}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {loadingInternal ? (
            <Loader />
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={20}
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
          )}
        </div>
      )}
    </Fragment>
  );
};

export default InternalPartyDetails;
