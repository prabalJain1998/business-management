import React, { Fragment, useEffect, useState } from "react";
import "./CustomerCreateOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createCustomer } from "../../actions/customerAction.js";
import { useAlert } from "react-alert";
import { Button, Typography } from "@material-ui/core";
import DatePicker from "react-datepicker";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { NEW_CUSTOMER_RESET } from "../../constants/customerConstants";
import DeleteIcon from "@mui/icons-material/Delete";
import DrawerComponent from "./Drawer.jsx";
import { getAllParties } from "../../actions/partyAction";
import { getAllInternalParties } from "../../actions/internalPartyAction";
import Loader from "../layout/Loader/Loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const ShadiCreateOrder = () => {
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
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [phoneNo, setPhoneNo] = useState();
  const [whatsappNo, setWhatsappNo] = useState();
  const [paidAmount, setPaidAmount] = useState();
  const [paymentMode, setPaymentMode] = useState("Nill");
  const [partyName, setPartyName] = useState("USER");
  const [discountAmount, setDiscountAmount] = useState();
  const [deliveryDate, setDeliveryDate] = useState(Date.now());
  const [orderDate, setOrderDate] = useState(Date.now());
  const [totalGross, setTotalGross] = useState(0);

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
  internalPartyNames.reverse();

  const shadiProductNames = [];
  shadiProductNames.push(
    "Single Card",
    "Main Card",
    "Multicolor Card",
    "Bulawa Amantran",
    "Gift Card",
    "Flex Banner"
  );

  const paymentStatusCategories = {
    "NOT PAID": "NOT PAID",
    PAID: "PAID",
    "PARTIAL PAID": "PARTIAL PAID",
  };
  const paymentModeCategories = ["NILL", "CASH", "BANK", "ONLINE"];

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
    let generatedName =
      firstName.trim() + "**" + secondName.trim() + "**" + familyName.trim();
    setName(generatedName);
    myForm.set("name", generatedName);

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
    if (parseInt(paidAmount) === 0) {
      myForm.set("paymentMode", "NILL");
    } else {
      myForm.set("paymentMode", paymentMode);
    }
    myForm.set("orderStatus", "START");
    myForm.set("partyName", partyName);
    myForm.set("deliveryDate", deliveryDate);
    myForm.set("discountAmount", discountAmount);
    let remainingAmount = totalGross - paidAmount - discountAmount;
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
  };

  const [formValues, setFormValues] = useState([]);

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

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        item: "Single Card",
        quantity: 0,
        price: 1,
        total: 0,
        partyID: "Singhai",
      },
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
    <Fragment>
      {!(loadingAllParties && loadingInternalParties) ? (
        <div>
          <DrawerComponent />
          <div className="create-customer-container">
            <div className="create-customer-container-2">
              <form
                className="create-customer-form"
                onSubmit={createCustomerSubmitHandler}
              >
                <h1 id="fontGreat">Create Wedding Order</h1>

                <div style={{ display: "flex" }}>
                  <TextField
                    label="Name"
                    fullWidth
                    sx={{ m: 1 }}
                    required
                    type={String}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="outlined"
                  />

                  <div style={{ margin: "auto" }}>
                    <Typography>Weds</Typography>
                  </div>

                  <TextField
                    label="Name"
                    fullWidth
                    sx={{ m: 1 }}
                    required
                    type={String}
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                    variant="outlined"
                  />

                  <div style={{ margin: "auto", paddingLeft: "10px" }}>
                    <Typography>Family</Typography>
                  </div>

                  <TextField
                    label="Family Name"
                    fullWidth
                    sx={{ m: 1 }}
                    required
                    type={String}
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    variant="outlined"
                  />
                </div>

                <div>
                  <TextField
                    label="Phone"
                    fullWidth
                    sx={{ m: 1 }}
                    type="number"
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

                <div className="multipleOrders">
                  {formValues.map((element, index) => (
                    <div className="form-inline" key={index}>
                      <div style={{ display: "flex", marginLeft: "8px" }}>
                        {/* <select style={{
                height:"55px",
                marginTop:"8px",
                fontSize:"large",
                width:"300px",
                paddingLeft:"12px"
              }} name="item" onChange={(e) => handleChange(index, e)}>
                {shadiProductNames.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select> */}

                        <Autocomplete
                          disablePortal
                          disableClearable
                          freeSolo
                          onChange={(event, newValue) => {
                            handleChange(index, {
                              target: { value: newValue, name: "item" },
                            });
                          }}
                          onInputChange={(event, newValue) => {
                            handleChange(index, {
                              target: { value: newValue, name: "item" },
                            });
                          }}
                          id="item"
                          options={shadiProductNames && shadiProductNames}
                          sx={{
                            width: 200,
                            backgroundColor: "white",
                            marginTop: "8px",
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Item Name" />
                          )}
                        />

                        <TextField
                          label="Quantity"
                          sx={{ m: 1, width: 100 }}
                          type="number"
                          name={"quantity"}
                          required
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                        />

                        <TextField
                          label="Price"
                          sx={{ m: 1, width: 130 }}
                          required
                          name={"price"}
                          type="number"
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

                        {/* <select style={{
                height:"55px",
                marginTop:"8px",
                fontSize:"large",
                width:"300px",
                paddingLeft:"12px"
              }} name="partyID" onChange={(e) => handleChange(index, e)}>
                {internalPartyNames.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select> */}

                        <Autocomplete
                          disablePortal
                          disableClearable
                          required
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
                          id="item"
                          options={internalPartyNames && internalPartyNames}
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
                            backgroundColor: "#A175E8",
                            height: "40px",
                            margin: "auto 10px",
                          }}
                          id="deleteBtn"
                          onClick={() => removeFormFields(index)}
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <Button
                      style={{
                        borderRadius: 10,
                        height: "40px",
                        backgroundColor: "#A175E8",
                      }}
                      id="deleteBtn"
                      variant="contained"
                      onClick={() => addFormFields()}
                    >
                      Add Item
                    </Button>
                  </div>

                  <div className="grossBtn">
                    <h1 id="fontGreat">Gross Total :</h1>
                  </div>
                </div>

                <div>
                  <TextField
                    label="Total Amount"
                    fullWidth
                    sx={{ m: 1 }}
                    type={Number}
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
                    type={Number}
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
                    type={Number}
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
                    sx={{
                      width: 350,
                      backgroundColor: "white",
                      marginLeft: "10px",
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Party" />
                    )}
                    defaultValue={"USER"}
                  />

                  <div style={{ display: "flex" }}>
                    <h3 id="fontGreat">Date</h3>
                    <DatePicker
                      selected={orderDate}
                      onChange={(date) => setOrderDate(date)}
                    />
                  </div>

                  <div style={{ display: "flex" }}>
                    <h3 id="fontGreat">Delivery</h3>
                    <DatePicker
                      selected={deliveryDate}
                      onChange={(date) => setDeliveryDate(date)}
                    />
                  </div>
                </div>

                <div
                  style={{
                    padding: "5px",
                  }}
                ></div>

                <Button
                  style={{
                    borderRadius: 10,
                    height: "40px",
                    padding: "1vmax",
                    backgroundColor: "#A175E8",
                  }}
                  type="submit"
                  disabled={loading ? true : false}
                >
                  Create
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </Fragment>
  );
};

export default ShadiCreateOrder;
