import React, { Fragment, useEffect, useState } from "react";
import "./CustomerCreateOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button, Typography } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import { getAllParties } from "../../actions/partyAction";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  NEW_CUSTOMER_RESET,
  UPDATE_CUSTOMER_RESET,
} from "../../constants/customerConstants";
import { NOTIFICATION_RESET } from "../../constants/notificationConstants";
import { createNotification } from "../../actions/notificationAction";
import {
  getCustomerDetails,
  updateCustomer,
  clearErrors,
} from "../../actions/customerAction";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderActions from "../common/HeaderActions";
import { useParams } from "react-router-dom";
import { getAllInternalParties } from "../../actions/internalPartyAction";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { createLogs } from "../../actions/logsAction";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Loader from "../layout/Loader/Loader.js";

const CustomerUpdateOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { id } = useParams();

  const {
    loading: customerDetailsLoading,
    error,
    order,
  } = useSelector((state) => state.customerDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.customer);
  const {
    loading: loadingInternalParties,
    error: allInternalPartiesError,
    party: internalParty,
  } = useSelector((state) => state.allInternalParties);
  const {
    loading: loadingAllParties,
    error: allPartiesError,
    party,
  } = useSelector((state) => state.allparties);
  const { user } = useSelector((state) => state.user);

  const parties = party && party.parties;
  const partyNames = [];
  const partyMappings = {};
  partyNames.push("USER");
  parties &&
    parties.map((item) => {
      partyNames.push(item.name);
      partyMappings[item.name] = item._id;
    });
  partyMappings["USER"] = "USER";

  const internalParties = internalParty && internalParty.parties;
  const internalPartyNames = [];
  const internalPartyMappings = {};
  internalParties &&
    internalParties.map((item) => {
      internalPartyNames.push(item.name);
      internalPartyMappings[item._id] = item.name;
    });

  const [totalGross, setTotalGross] = useState(order.totalAmount);
  const [formValues, setFormValues] = useState([]);

  const [name, setName] = useState(order.name);
  const [phoneNo, setPhoneNo] = useState(order.phoneNo);
  const [whatsappNo, setWhatsappNo] = useState(order.whatsappNo);
  const [totalAmount, setTotalAmount] = useState(order.totalAmount);
  const [paidAmount, setPaidAmount] = useState(order.paidAmount);
  const [discount, setDiscountAmount] = useState(order.discountAmount);
  const [paymentMode, setPaymentMode] = useState(order.paymentMode);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [partyName, setPartyName] = useState(order.partyName);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(order.deliveryDate)
  );
  const [orderDate, setOrderDate] = useState(new Date(order.orderDate));
  const [partyDropdown, showPartyDropdown] = useState(false);
  const [initialPaidAmount, setInitialPaidAmount] = useState(order.paidAmount);


  const setShowPartyDropdown = () => {
    showPartyDropdown(!partyDropdown);
  };

  const orderId = id;

  const paymentStatusCategories = ["PAID", "PARTIAL PAID", "NOT PAID"];
  const paymentModeCategories = ["CASH", "BANK", "ONLINE"];

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];

    newFormValues[i][e.target.name] = e.target.value;
    let totalGrossValue = 0;
    newFormValues.map((obj) => {
      const { quantity, price } = obj;
      totalGrossValue += Number(quantity) * Number(price);
    });
    setTotalGross(totalGrossValue);
    setTotalAmount(totalGrossValue);
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        item: "",
        quantity: 0,
        price: 0,
        total: 0,
        partyID: internalPartyMappings[internalPartyNames[0]],
      },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);

    let totalGrossValue = 0;
    newFormValues.map((obj) => {
      const { quantity, price } = obj;
      totalGrossValue += Number(quantity) * Number(price);
    });
    setTotalGross(totalGrossValue);
    setFormValues(newFormValues);
    setTotalAmount(totalGrossValue);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      history("/dashboard");
      dispatch(clearErrors());
    }

    dispatch(getAllInternalParties());
    dispatch(getAllParties());

    if (order && order._id !== orderId) {
      dispatch(getCustomerDetails(orderId));
    } else {
      setName(order.name);
      setPhoneNo(order.phoneNo);
      setWhatsappNo(order.whatsappNo);
      setTotalAmount(order.totalAmount);
      setTotalGross(order.totalAmount);
      setPaidAmount(order.paidAmount);
      setInitialPaidAmount(order.paidAmount);
      setDiscountAmount(order.discountAmount);
      setPartyName(order.partyName);
      setPaymentMode(order.paymentMode);
      setOrderStatus(order.orderStatus);
      setFormValues(order.particulars);
      setDeliveryDate(new Date(order.deliveryDate));
      setOrderDate(new Date(order.orderDate));
    }

    if (allInternalPartiesError) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order Updated Successfully");
      history(`/customers/${order._id}`);
      dispatch({ type: NEW_CUSTOMER_RESET });
      dispatch({ type: UPDATE_CUSTOMER_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    history,
    isUpdated,
    orderId,
    order,
    updateError,
    allInternalPartiesError,
  ]);

  const createCustomerSubmitHandler = (e) => {
    e.preventDefault();

    if (paidAmount > totalGross) {
      alert.error("Paid Amount should not exceed Gross Amount");
      return;
    }

    const myForm = new FormData();
    myForm.set("name", name.trim());
    if (phoneNo && phoneNo >= 1000000000 && phoneNo <= 9999999999) {
      myForm.set("phoneNo", phoneNo);
    }
    if (whatsappNo && whatsappNo >= 1000000000 && whatsappNo <= 9999999999) {
      myForm.set("whatsappNo", whatsappNo);
    }
    formValues.map((item) => {
      item.total = Number(item.quantity) * Number(item.price);
    });
    myForm.set("particulars", JSON.stringify(formValues));
    myForm.set("totalAmount", totalGross);
    myForm.set("paidAmount", paidAmount);

    let payStatus = "NOT PAID";
    if (parseInt(paidAmount) === 0) {
      payStatus = paymentStatusCategories[2];
    } else if (parseInt(paidAmount) < parseInt(totalGross)) {
      payStatus = paymentStatusCategories[1];
    } else if (parseInt(paidAmount) === parseInt(totalGross)) {
      payStatus = paymentStatusCategories[0];
    } else {
      alert.error("Paid amount should be less than Gross Amount");
      return;
    }

    myForm.set("paymentStatus", payStatus);
    myForm.set("paymentMode", paymentMode);
    myForm.set("discountAmount", discount);
    myForm.set("remainingAmount", totalGross - paidAmount - discount);
    myForm.set("orderStatus", orderStatus);
    myForm.set("partyName", partyName);
    myForm.set("deliveryDate", deliveryDate);
    myForm.set("orderDate", orderDate);
    myForm.set("partyID", partyMappings[partyName]);
    dispatch(updateCustomer(id, myForm));
    dispatch(
      createNotification({
        dateCreated: Date.now(),
        updatedBy: user.name,
        message: name,
        action: "updated",
        link: `/customers/${id}`,
      })
    );
    dispatch({ type: NOTIFICATION_RESET });

    // Payment Updated for Logs
    if (parseInt(paidAmount) - parseInt(initialPaidAmount) > 0) {
      const logsPayload = {
        date: new Date(Date.now()).toLocaleDateString(),
        action: "UPDATED_ORDER",
        details: {
          amount: parseInt(paidAmount) - parseInt(initialPaidAmount),
          message: `Initial Payment Amount was updated from Rs.${parseInt(
            initialPaidAmount
          )} to Rs.${parseInt(paidAmount)} results in gain of Rs.${
            parseInt(paidAmount) - parseInt(initialPaidAmount)
          } on Order ${name}`,
          referenceID: id,
        },
      };
      dispatch(createLogs(logsPayload));
    }
  };

  return (
    <Fragment>
      <HeaderActions />
      {customerDetailsLoading ? (
        <Loader />
      ) : (
        <div className="create-customer-container">
          <div className="create-customer-container-2">
            <form
              className="create-customer-form"
              onSubmit={createCustomerSubmitHandler}
            >
              <h1 id="fontGreat">Update Customer</h1>

              <div>
                <TextField
                  label="Customer Name"
                  fullWidth
                  sx={{ m: 1 }}
                  required
                  type={String}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                />
              </div>

              <div id="contactTextFields">
                <div>
                  <TextField
                    label="Phone"
                    fullWidth
                    sx={{ m: 1 }}
                    type="number"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    variant="outlined"
                  />
                </div>

                <div>
                  <TextField
                    label="Whatsapp"
                    fullWidth
                    sx={{ m: 1 }}
                    type="number"
                    value={whatsappNo}
                    onChange={(e) => setWhatsappNo(e.target.value)}
                    variant="outlined"
                  />
                </div>
              </div>

              <div className="multipleOrders">
                {formValues.map((element, index) => (
                  <div className="form-inline" key={index}>
                    <div id="subOrder">
                      <TextField
                        label="Item"
                        sx={{ m: 1, width: 300 }}
                        type={String}
                        name="item"
                        id="item"
                        value={element?.item}
                        required
                        onChange={(e) => handleChange(index, e)}
                        variant="outlined"
                      />

                      <TextField
                        label="Quantity"
                        sx={{ m: 1, width: 100 }}
                        type="number"
                        name="quantity"
                        required
                        value={element?.quantity}
                        onWheel={(event) => {
                          event.preventDefault();
                        }}
                        onChange={(e) => handleChange(index, e)}
                        variant="outlined"
                      />

                      <TextField
                        label="Price"
                        sx={{ m: 1, width: 130 }}
                        required
                        name={"price"}
                        type={Number}
                        value={element?.price}
                        onWheel={(event) => {
                          event.preventDefault();
                        }}
                        onChange={(e) => handleChange(index, e)}
                        variant="outlined"
                      />

                      <TextField
                        label="Total"
                        sx={{ m: 1, width: 150 }}
                        type="number"
                        name={"total"}
                        value={element?.quantity * element?.price}
                        onChange={(e) => handleChange(index, e)}
                        variant="outlined"
                        disabled
                      />

                      <Autocomplete
                        disablePortal
                        disableClearable
                        required
                        value={element?.partyID}
                        onChange={(event, newValue) => {
                          handleChange(index, {
                            target: { value: newValue, name: "partyID" },
                          });
                        }}
                        onInputChange={(event, newValue) => {
                          handleChange(index, {
                            target: { value: newValue, name: "partyID" },
                          });
                        }}
                        id="partyID"
                        options={internalPartyNames ? internalPartyNames : []}
                        sx={{
                          width: 200,
                          backgroundColor: "white",
                          marginTop: "8px",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Internal Party"
                            loading={loadingInternalParties}
                          />
                        )}
                      />

                      <Button
                        style={{
                          borderRadius: 10,
                          height: "40px",
                          color: "red",
                          margin: "auto 10px",
                        }}
                        id="deleteBtn"
                        onClick={() => removeFormFields(index)}
                      >
                        <DeleteIcon style={{ color: "red" }} />
                      </Button>
                    </div>
                  </div>
                ))}

                <div>
                  <Button
                    style={{
                      borderRadius: 10,
                      height: "40px",
                      marginLeft: "8px",
                      backgroundColor: "#A175E8",
                    }}
                    id="deleteBtn"
                    variant="contained"
                    onClick={() => addFormFields()}
                  >
                    <AddIcon style={{ fontSize: "30px" }} />
                  </Button>
                </div>

                <div className="grossBtn">
                  <h3 id="fontGreat">Gross Total :</h3>
                </div>
              </div>

              <div>
                <TextField
                  label="Total Amount"
                  fullWidth
                  sx={{ m: 1 }}
                  type="number"
                  value={totalGross ? totalGross : 0}
                  variant="outlined"
                  disabled
                />
              </div>

              <div>
                <TextField
                  label="Paid"
                  fullWidth
                  sx={{ m: 1 }}
                  type="number"
                  value={paidAmount}
                  required
                  onChange={(e) => setPaidAmount(e.target.value)}
                  variant="outlined"
                />
              </div>

              <div>
                <TextField
                  label="Discount"
                  fullWidth
                  sx={{ m: 1 }}
                  type="number"
                  value={discount}
                  required
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  variant="outlined"
                />
              </div>

              <div>
                <TextField
                  label="Remain"
                  fullWidth
                  sx={{ m: 1 }}
                  type="number"
                  disabled
                  value={totalGross - paidAmount - discount}
                  required
                  variant="outlined"
                />
              </div>

              <div style={{ display: "flex" }}>
                <h3 id="fontGreat">Current party : </h3>
                <h2
                  style={{
                    marginTop: "15px",
                  }}
                >
                  {partyName && partyName}
                  <EditIcon
                    onClick={setShowPartyDropdown}
                    style={{
                      cursor: "pointer",
                      color: "red",
                      marginLeft: "10px",
                    }}
                  />
                </h2>

                {partyDropdown && (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "10px",
                      display: "flex",
                    }}
                  >
                    <Autocomplete
                      disablePortal
                      disableClearable
                      onChange={(event, newValue) => {
                        setPartyName(newValue);
                      }}
                      id="partyDropdownField"
                      options={partyNames && partyNames}
                      sx={{
                        width: 250,
                        marginBottom: "20px",
                        backgroundColor: "white",
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Party" />
                      )}
                      value={partyName}
                    />
                    <Button
                      style={{ maxWidth: "20px" }}
                      id="createCustomerCreateButton"
                      onClick={setShowPartyDropdown}
                    >
                      <DoneIcon />
                    </Button>
                  </div>
                )}
              </div>

              <div className="statusContainer">
                <div>
                  <Autocomplete
                    disablePortal
                    disableClearable
                    onChange={(event, newValue) => {
                      setPaymentMode(newValue);
                    }}
                    id="modeDropdownField"
                    value={paymentMode}
                    options={paymentModeCategories && paymentModeCategories}
                    sx={{ width: 200, backgroundColor: "white" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Payment Mode" />
                    )}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    maxWidth: "400px",
                    marginLeft: "10px",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={orderDate}
                      inputFormat="DD-MM-YYYY"
                      onChange={(newValue) => {
                        setOrderDate(newValue["$d"].toLocaleDateString());
                      }}
                      renderInput={(params) => (
                        <TextField {...params} sx={{ maxWidth: "160px" }} />
                      )}
                    />
                  </LocalizationProvider>
                </div>

                <div
                  style={{
                    display: "flex",
                    maxWidth: "400px",
                    marginLeft: "10px",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Delivery"
                      value={deliveryDate}
                      inputFormat="DD-MM-YYYY"
                      onChange={(newValue) => {
                        setDeliveryDate(newValue["$d"].toLocaleDateString());
                      }}
                      renderInput={(params) => (
                        <TextField {...params} sx={{ maxWidth: "160px" }} />
                      )}
                    />
                  </LocalizationProvider>
                </div>

                <Button
                  id="createCustomerCreateButton"
                  type="submit"
                  disabled={loading ? true : false}
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CustomerUpdateOrder;
