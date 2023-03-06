import React, { Fragment, useEffect, useState } from "react";
import "./CustomerCreateOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createCustomer } from "../../actions/customerAction.js";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import "react-datepicker/dist/react-datepicker.css";
import { NEW_CUSTOMER_RESET } from "../../constants/customerConstants";
import DeleteIcon from "@mui/icons-material/Delete";
import DrawerComponent from "./Drawer.jsx";
import { getAllParties } from "../../actions/partyAction";
import { getAllInternalParties } from "../../actions/internalPartyAction";
import Loader from "../layout/Loader/Loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import { createLogs } from "../../actions/logsAction";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import HeaderActions from "../common/HeaderActions";

const AllCustomerDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const { customer, loading, error, success } = useSelector(
    (state) => state.newCustomer
  );
  const {
    loading: loadingAllParties,
    error: allPartiesError,
    party,
  } = useSelector((state) => state.allparties);
  const {
    loading: loadingInternalParties,
    error: allInternalPartiesError,
    party: internalParty,
  } = useSelector((state) => state.allInternalParties);

  const parties = party && party.parties;
  const internalParties = internalParty && internalParty.parties;

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState(null);
  const [whatsappNo, setWhatsappNo] = useState();
  const [paidAmount, setPaidAmount] = useState();
  const [paymentMode, setPaymentMode] = useState("NILL");
  const [partyName, setPartyName] = useState("USER");
  const [discountAmount, setDiscountAmount] = useState();
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now()).toLocaleDateString()
  );
  const [orderDate, setOrderDate] = useState(
    new Date(Date.now()).toLocaleDateString()
  );
  const [totalGross, setTotalGross] = useState(0);
  const [formValues, setFormValues] = useState([]);

  const partyNames = [];
  const partyMappings = {};
  partyNames.push("USER");
  parties &&
    parties.map((item) => {
      partyNames.push(item.name);
      partyMappings[item.name] = item._id;
    });
  partyMappings["USER"] = "USER";

  const internalPartyNames = [];
  internalParties &&
    internalParties.map((item) => {
      internalPartyNames.push(item.name);
    });

  const paymentStatusCategories = {
    "NOT PAID": "NOT PAID",
    PAID: "PAID",
    "PARTIAL PAID": "PARTIAL PAID",
  };
  const paymentModeCategories = ["NILL", "CASH", "BANK", "ONLINE"];

  const resetFields = (e) => {
    e.preventDefault();
    setName("");
    setPhoneNo("");
    setWhatsappNo("");
    setPaidAmount("");
    setPaymentMode("NILL");
    setPartyName("USER");
    setDiscountAmount("");
    setOrderDate(Date.now());
    setDeliveryDate(Date.now());
    setTotalGross("");
    setFormValues([]);
  };

  const refresh = (e) => {
    dispatch(getAllInternalParties());
    dispatch(getAllParties());
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (allPartiesError) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (allInternalPartiesError) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllInternalParties());
    dispatch(getAllParties());

    if (success) {
      alert.success("Customer Entry Created Successfully");
      history(`/customers/${customer.data._id}`, { replace: true });
      dispatch({ type: NEW_CUSTOMER_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    history,
    success,
    customer,
    allPartiesError,
    allInternalPartiesError,
  ]);

  const createCustomerSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("name", name.trim());
    if (phoneNo && phoneNo >= 1000000000 && phoneNo <= 9999999999) {
      myForm.set("phoneNo", phoneNo);
    }

    if (whatsappNo && whatsappNo >= 1000000000 && whatsappNo <= 9999999999) {
      myForm.set("whatsappNo", whatsappNo);
    }

    if (!whatsappNo && phoneNo) {
      myForm.set("whatsappNo", phoneNo);
    }

    formValues.map((item) => {
      item.total = Number(item.quantity) * Number(item.price);
    });

    myForm.set("particulars", JSON.stringify(formValues));
    myForm.set("totalAmount", Number(totalGross));
    myForm.set("paidAmount", Number(paidAmount));
    if (parseInt(paidAmount) === 0) {
      myForm.set("paymentMode", "NILL");
    } else {
      myForm.set("paymentMode", paymentMode);
    }
    myForm.set("orderStatus", "START");
    myForm.set("partyName", partyName);
    myForm.set("deliveryDate", deliveryDate);
    myForm.set("discountAmount", Number(discountAmount));

    let remainingAmount =
      Number(totalGross) - Number(paidAmount) - Number(discountAmount);
    myForm.set("remainingAmount", remainingAmount);

    if (remainingAmount === 0) {
      myForm.set("paymentStatus", paymentStatusCategories["PAID"]);
    } else if (remainingAmount < totalGross) {
      myForm.set("paymentStatus", paymentStatusCategories["PARTIAL PAID"]);
    } else if (remainingAmount === totalGross) {
      myForm.set("paymentStatus", paymentStatusCategories["NOT PAID"]);
    } else {
      alert.error("Paid amount should be less than Gross Amount");
      return;
    }

    myForm.set("partyID", partyMappings[partyName]);
    myForm.set("orderDate", orderDate);

    dispatch(createCustomer(myForm));

    // Payment Updated for Logs
    if (paidAmount > 0) {
      const logsPayload = {
        date: new Date(Date.now()).toLocaleDateString(),
        action: "CREATE_ORDER",
        details: {
          amount: parseInt(paidAmount),
          message: `Rs.${parseInt(
            paidAmount
          )} was collected as a new Order from ${name}`,
          referenceID: `ORDER_ID_NOT_AVAILABLE ${name}`,
        },
      };
      dispatch(createLogs(logsPayload));
    }
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    let totalGrossValue = 0;
    newFormValues.map((obj) => {
      const { quantity, price } = obj;
      totalGrossValue += Number(quantity) * Number(price);
    });
    setTotalGross(totalGrossValue);
    setFormValues(newFormValues);
  };

  let calculateValue = (e) => {
    let totalGrossValue = 0;
    formValues.map((obj) => {
      const { quantity, price } = obj;
      totalGrossValue += Number(quantity) * Number(price);
    });
    setTotalGross(totalGrossValue);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      { item: "", quantity: 0, price: 1, total: 0, partyID: "Singhai" },
    ]);
    let totalGrossValue = 0;
    formValues.map((obj) => {
      const { quantity, price } = obj;
      totalGrossValue += Number(quantity) * Number(price);
    });
    setTotalGross(totalGrossValue);
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
  };

  return (
    <Fragment id="createCustomerContainer">
      {!(loadingAllParties && loadingInternalParties) ? (
        <div>
          <HeaderActions />

          <div>
            <div className="create-customer-container">
              <div className="create-customer-container-2">
                <form
                  className="create-customer-form"
                  onSubmit={createCustomerSubmitHandler}
                >
                  <div className="createCustomerActions">
                    <Link
                      to="#"
                      style={{ padding: "5px" }}
                      onClick={resetFields}
                    >
                      <Typography variant="caption">
                        <b>Reset</b>
                      </Typography>
                    </Link>
                    <Link to="#" style={{ padding: "5px" }} onClick={refresh}>
                      <Typography variant="caption">
                        <b>Refresh</b>
                      </Typography>
                    </Link>
                  </div>

                  <h1 id="fontGreat">Create Customer</h1>

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
                            name={"item"}
                            id={"item"}
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
                            value={element.quantity * element.price}
                            onChange={(e) => handleChange(index, e)}
                            variant="outlined"
                            disabled
                          />

                          <Autocomplete
                            disablePortal
                            disableClearable
                            required
                            defaultValue={"Singhai"}
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
                            options={
                              internalPartyNames ? internalPartyNames : []
                            }
                            sx={{
                              width: 200,
                              backgroundColor: "white",
                              marginTop: "8px",
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Internal Party" />
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
                      value={discountAmount}
                      required
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      variant="outlined"
                    />
                  </div>

                  <div className="statusContainer">
                    <Autocomplete
                      disablePortal
                      disableClearable
                      onChange={(event, newValue) => {
                        setPaymentMode(newValue);
                      }}
                      id="modeDropdownField"
                      options={paymentModeCategories && paymentModeCategories}
                      sx={{ width: 200, backgroundColor: "white" }}
                      renderInput={(params) => (
                        <TextField {...params} label="Payment Mode" />
                      )}
                      defaultValue={"NILL"}
                    />

                    <Autocomplete
                      disablePortal
                      onChange={(event, newValue) => {
                        setPartyName(newValue);
                      }}
                      id="partyDropdownField"
                      options={partyNames && partyNames}
                      sx={{ backgroundColor: "white", marginLeft: "10px" }}
                      renderInput={(params) => (
                        <TextField {...params} label="Party" />
                      )}
                      defaultValue={"USER"}
                    />

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
                            setDeliveryDate(
                              newValue["$d"].toLocaleDateString()
                            );
                          }}
                          renderInput={(params) => (
                            <TextField {...params} sx={{ maxWidth: "160px" }} />
                          )}
                        />
                      </LocalizationProvider>
                    </div>

                    <div
                      style={{
                        margin: "auto",
                      }}
                    >
                      <Button
                        id="createCustomerCreateButton"
                        type="submit"
                        disabled={loading ? true : false}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </Fragment>
  );
};

export default AllCustomerDetails;
