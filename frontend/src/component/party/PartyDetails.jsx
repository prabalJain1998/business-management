import * as React from "react";
import Paper from "@mui/material/Paper";
import Loader from "../layout/Loader/Loader.js";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import jsPDF from "jspdf";
import {
  clearErrors,
  getAllOrdersByPartyID,
} from "../../actions/customerAction";
import { DataGrid } from "@mui/x-data-grid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import DrawerComponent from "../customer/Drawer.jsx";
import { Button, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CollectionsIcon from "@mui/icons-material/Collections";
import { Link } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import copy from "copy-to-clipboard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import { getAllParties } from "../../actions/partyAction.js";
import CardItem from "../common/CardItem.jsx";
import Heading from "../common/Heading.jsx";
import ReceiptComponent from "../common/ReceiptComponent.jsx";
import whiteBackground from "../../images/whiteBackground.png";

const PartyDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { partyID } = useParams();

  const { loading, error, orders } = useSelector(
    (state) => state.customersByPartyID
  );
  const { party } = useSelector((state) => state.allparties);
  const parties = party && party.parties;

  const partyInverseMappings = {};

  parties &&
    parties.map((item) => {
      partyInverseMappings[item._id] = item.name;
      partyInverseMappings["phoneNo"] = item.phoneNo;
    });

  const [checked, setChecked] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const handleSwitchChange = () => {
    setChecked(!checked);
  };
  const [selectedRowData, setSelectedRowData] = React.useState([]);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [receiptData, setReceiptData] = React.useState({});

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
  const generateTrackingLink = (id) => {
    const trackLink = `https://singhaiexpense.herokuapp.com/track/${id}`;
    copy(trackLink);
  };

  const formatParticulars = (particulars) => {
    let desc = "";
    JSON.parse(particulars)?.map((item) => {
      desc += item.item;
      desc += "|";
    });
    return desc;
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllParties());
    dispatch(getAllOrdersByPartyID(partyID));
  }, [dispatch, alert, error, partyID]);

  const columns = [
    { field: "orderDate", headerName: "Date", minWidth: 100, flex: 1 },
    {
      field: "id",
      headerName: "Order Actions",
      minWidth: 250,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              disabled={
                params.getValue(params.id, "orderStatus") === "PAYMENT"
                  ? true
                  : false
              }
              onClick={() => editOrderHandler(params.getValue(params.id, "id"))}
            >
              <EditIcon />
            </Button>

            <Button
              disabled={
                params.getValue(params.id, "orderStatus") === "PAYMENT"
                  ? true
                  : false
              }
              style={{
                color:
                  params.getValue(params.id, "orderStatus") === "COMPLETED"
                    ? "blue"
                    : "red",
                display:
                  params.getValue(params.id, "orderStatus") === "PAYMENT"
                    ? "none"
                    : "inline",
              }}
              onClick={() =>
                updateOrderHandler(params.getValue(params.id, "id"))
              }
            >
              <CheckCircleOutlineIcon />
            </Button>

            <Button
              disabled={
                params.getValue(params.id, "orderStatus") === "PAYMENT"
                  ? true
                  : false
              }
              style={{
                color:
                  params.getValue(params.id, "paymentStatus") === "PAID"
                    ? "blue"
                    : "red",
                display:
                  params.getValue(params.id, "orderStatus") === "PAYMENT"
                    ? "none"
                    : "inline",
              }}
              onClick={() =>
                updatePaymentHandler(params.getValue(params.id, "id"))
              }
            >
              <CurrencyRupeeIcon />
            </Button>
          </Fragment>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Tooltip
              title={formatParticulars(
                params.getValue(params.id, "particulars")
              )}
              size="large"
            >
              <Link
                to={`/customers/${params.getValue(params.id, "id")}`}
                style={{
                  color: "#1976d2",
                  margin: "auto",
                }}
              >
                {params.getValue(params.id, "name")}
              </Link>
            </Tooltip>
          </Fragment>
        );
      },
    },
    {
      field: "particulars",
      headerName: "Particulars",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Typography>
              {formatParticulars(params.getValue(params.id, "particulars"))}
            </Typography>
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
          checked && (
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
          )
        );
      },
    },
  ];

  const rows = [];
  let totalAmount = 0;
  let totalPaid = 0;
  let cash = 0;
  let ordersRemain = 0;
  let online = 0;
  let bank = 0;
  let discount = 0;

  orders &&
    orders.order.forEach((item) => {
      if (item.status === "AVAILABLE") {
        // let desc = ""
        // item.particulars.map((item)=>{
        //   desc += item.item;
        //   desc += "|";
        // })
        rows.push({
          orderDate: item.orderDate
            .substring(0, 10)
            .split("-")
            .reverse()
            .join("-"),
          id: item._id,
          name: item.name,
          particulars: JSON.stringify(item.particulars),
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
          online += Number(item.paidAmount);
        }
        if (item.paymentMode.toLowerCase().includes("bank")) {
          bank += Number(item.paidAmount);
        }

        if (!item.orderStatus.toLowerCase().includes("completed")) {
          ordersRemain += 1;
        }
        discount += item.discountAmount;
      }
    });

  rows.reverse();

  const editPartyDetails = () => {
    history(`/party/update/${partyID}`);
  };

  const generateCummulativeReceipt = () => {
    if (selectionModel?.length === 0) {
      alert.error("No rows selected!");
      return;
    }

    let totalAmount = 0;
    let paidAmount = 0;
    let remainingAmount = 0;
    let cummulativeParticulars = [];

    selectedRowData?.map((a) => {
      JSON.parse(a?.particulars)?.map((b) => {
        cummulativeParticulars.push(b);
      });

      totalAmount += parseInt(a.amount);
      paidAmount += parseInt(a.paid);
      remainingAmount += parseInt(a.remain);
    });

    setReceiptData({
      particulars: cummulativeParticulars,
      totalAmount,
      paidAmount,
      remainingAmount,
    });
    setShowReceipt(true);
  };
  const transformParticulars = (particulars) =>{
   const orderItems = JSON.parse(particulars);
   let modifiedParticulars = "";
   orderItems.map((a)=>{
    modifiedParticulars += `| ${a.item} | ${a.quantity} * ${a.price} -> ${a.total}\n`;
   })
   return modifiedParticulars;
  }
  const exportToPdf = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 30;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(13);

    const headers = [["Date", "Particulars (| Item | Quantity * Price -> Total)", "Amount", "Paid", "Remain"]];
    let downloadPdf =
      rows &&
      rows.map((elt) => [
        elt.orderDate.substring(0, 10),
        transformParticulars(elt.particulars),
        elt.amount,
        elt.paid,
        elt.remain,
      ]);

    let title = `${
      partyInverseMappings[partyID]
    } | Total ${totalAmount} | Paid: ${totalPaid} | Remain ${(
      totalAmount -
      totalPaid -
      discount
    ).toFixed(2)}`;
    let content = { startY: 50, head: headers, body: downloadPdf };
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${partyInverseMappings[partyID]}` + ".pdf");
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard2">
          <DrawerComponent />
          <div className="productListContainer2">
            <Paper
              style={{
                marginLeft: "10px",
              }}
              elevation={2}
              square
            >
              <Accordion style={{ backgroundImage: `url(${whiteBackground})` }}>
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    <Typography variant="h4">
                      <Heading
                        label={
                          partyInverseMappings && partyInverseMappings[partyID]
                        }
                        icon={() => {
                          return <KeyboardArrowDownIcon />;
                        }}
                      />
                    </Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ display: "flex", flexFlow: "wrap" }}>
                    <div>
                      <CardItem
                        keyItem={"Orders"}
                        value={orders && orders.order.length}
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
                        keyItem={"Remain"}
                        value={(totalAmount - totalPaid - discount).toFixed(2)}
                        threshold={0}
                        disableIcon={true}
                      />
                    </div>
                    <div>
                      <CardItem
                        keyItem={"Discount"}
                        value={discount}
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
                    <div>
                      <CardItem
                        keyItem={"Bank"}
                        value={bank}
                        threshold={0}
                        disableIcon={true}
                      />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </Paper>
            {showReceipt && (
              <ReceiptComponent
                orderDate={new Date(Date.now()).toISOString()}
                deliveryDate={new Date(Date.now()).toISOString()}
                phoneNo={partyInverseMappings?.phoneNo}
                name={partyInverseMappings && partyInverseMappings[partyID]}
                particulars={receiptData?.particulars}
                totalAmount={receiptData?.totalAmount}
                paidAmount={receiptData?.paidAmount}
                remainingAmount={
                  parseInt(receiptData?.totalAmount) -
                  parseInt(receiptData?.paidAmount)
                }
                title={"Office Copy"}
                customizeHeight={true}
              />
            )}

            <div style={{ display: "flex", margin: "auto" }}>
              <h1 id="productListHeading">ALL ORDERS</h1>
              <Button
                onClick={() => {
                  handleSwitchChange(!checked);
                }}
              ></Button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "right",
                color: "blue",
                padding: "1vmax",
              }}
            >
              <Button
                style={{
                  color: "#1976d2",
                }}
                onClick={editPartyDetails}
              >
                <EditIcon />
              </Button>

              <Button
                style={{
                  color: "#1976d2",
                }}
                onClick={exportToPdf}
              >
                <DownloadIcon />
              </Button>

              <Button
                style={{
                  color: "#1976d2",
                }}
                onClick={generateCummulativeReceipt}
              >
                <CollectionsIcon />
              </Button>
            </div>

            <DataGrid
              onSelectionModelChange={(newSelectionModel) => {
                const selectedIDs = new Set(newSelectionModel);
                const selectedRowData = rows.filter((row) =>
                  selectedIDs.has(row.id.toString())
                );
                setSelectedRowData(selectedRowData);
                setSelectionModel(newSelectionModel);
              }}
              selectionModel={selectionModel}
              checkboxSelection={true}
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

export default PartyDetails;
