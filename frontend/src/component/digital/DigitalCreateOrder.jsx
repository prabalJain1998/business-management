import React, { Fragment, useEffect, useState } from "react";
import "../customer/CustomerDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createDigitalOrder } from "../../actions/digitalAction";
import { useAlert } from "react-alert";
import { Button, Typography } from "@material-ui/core";
// import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { NEW_DIGITAL_RESET } from "../../constants/digitalConstants";
import DeleteIcon from "@mui/icons-material/Delete";
import DrawerComponent from "../customer/Drawer.jsx";
import { getAllProducts } from "../../actions/productAction";
import HeaderActions from "../common/HeaderActions";

const DigitalCreateOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.newDigitalOrder
  );

  const {
    loading: allProductsLoading,
    error: allProductError,
    products,
  } = useSelector((state) => state.allProducts);

  const digitalProduct = [];
  const priceMappings = {};
  products &&
    products.products &&
    products.products.forEach((item) => {
      digitalProduct.push(item.name);
      priceMappings[item.name] = item.price;
    });

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState();
  const [date, setDate] = useState(Date.now());
  const [totalGross, setTotalGross] = useState(0);
  const [totalInternalAmount, setTotalInternalAmount] = useState();
  const [formValues, setFormValues] = useState([]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (allProductError) {
      alert.error(allProductError);
      dispatch(clearErrors());
    }
    dispatch(getAllProducts());
    if (success) {
      alert.success("Digital Entry Created Successfully");
      history(`/digital/orders`, { replace: true });
      dispatch({ type: NEW_DIGITAL_RESET });
    }
  }, [dispatch, alert, error, history, allProductError, success]);

  const createDigitalSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    let d = new Date(date);
    myForm.set("date", d.toLocaleDateString());
    myForm.set("name", name);
    if (phoneNo && phoneNo >= 1000000000 && phoneNo <= 9999999999) {
      myForm.set("phoneNo", phoneNo);
    }

    formValues.map((item) => {
      item.total = Number(item.quantity) * Number(item.price);
    });

    myForm.set("particulars", JSON.stringify(formValues));
    myForm.set("totalAmount", totalGross);
    myForm.set("totalInternalAmount", totalInternalAmount);
    myForm.set("action", "DIGITAL");

    dispatch(createDigitalOrder(myForm));
  };

  let handleChange = (i, e) => {
    e.preventDefault();
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    let totalGrossValue = 0;
    let totalInternalAmount = 0;
    newFormValues.map((obj) => {
      const { quantity, total, digitalProduct } = obj;
      obj["price"] = Number(total) / Number(quantity);
      obj["internalTotal"] = Number(quantity) * priceMappings[digitalProduct];
      totalGrossValue += Number(total);
      totalInternalAmount += Number(quantity) * priceMappings[digitalProduct];
    });
    setTotalGross(totalGrossValue);
    setTotalInternalAmount(totalInternalAmount);
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        item: "",
        quantity: 0,
        price: 1,
        total: 0,
        digitalProduct: digitalProduct[0],
        internalTotal: 0,
      },
    ]);
    let totalGrossValue = 0;
    let totalInternalAmount = 0;
    formValues.map((obj) => {
      const { quantity, total, digitalProduct } = obj;
      obj["price"] = Number(total) * Number(quantity);
      obj["internalTotal"] = Number(quantity) * priceMappings[digitalProduct];
      totalGrossValue += Number(total);
      totalInternalAmount += Number(quantity) * priceMappings[digitalProduct];
    });
    setTotalGross(totalInternalAmount);
    setTotalGross(totalGrossValue);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    let totalGrossValue = 0;
    let totalInternalAmount = 0;

    newFormValues.map((obj) => {
      const { quantity, total, digitalProduct } = obj;
      obj["price"] = Number(total) / Number(quantity);
      obj["internalTotal"] = Number(quantity) * priceMappings[digitalProduct];
      totalGrossValue += Number(total);
      totalInternalAmount += Number(quantity) * priceMappings[digitalProduct];
    });
    setTotalGross(totalGrossValue);
    setTotalInternalAmount(totalInternalAmount);
    setFormValues(newFormValues);
  };

  return (
    <Fragment>
      {
        <div>
          <HeaderActions />
          <div className="create-customer-container">
            <div className="create-customer-container-2">
              <form
                className="create-customer-form"
                onSubmit={createDigitalSubmitHandler}
              >
                <h1 id="fontGreat">Create Digital Entry</h1>

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

                <div>
                  <TextField
                    label="Phone"
                    fullWidth
                    sx={{ m: 1 }}
                    type={Number}
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    variant="outlined"
                  />
                </div>

                <div className="multipleOrders">
                  {formValues.map((element, index) => (
                    <div className="form-inline" key={index}>
                      <DescriptionIcon />
                      <input
                        type="text"
                        placeholder="Item"
                        name="item"
                        value={element.item || ""}
                        onChange={(e) => handleChange(index, e)}
                      />
                      <input
                        style={{ width: "10%" }}
                        type="text"
                        placeholder="Sheets"
                        name="quantity"
                        value={element.quantity || ""}
                        onChange={(e) => handleChange(index, e)}
                      />
                      <input
                        style={{ width: "10%" }}
                        type="number"
                        placeholder="Price"
                        name="price"
                        value={element.total && (element.price || "")}
                        onChange={(e) => handleChange(index, e)}
                        readOnly
                      />
                      <input
                        style={{ width: "10%" }}
                        type="number"
                        placeholder="Total"
                        name="total"
                        value={element.total || ""}
                        onChange={(e) => handleChange(index, e)}
                      />

                      <select
                        style={{ width: "20%" }}
                        name="digitalProduct"
                        onChange={(e) => handleChange(index, e)}
                      >
                        {digitalProduct.map((cate) => (
                          <option key={cate} value={cate}>
                            {cate}
                          </option>
                        ))}
                      </select>

                      <input
                        style={{ width: "10%" }}
                        type="text"
                        placeholder="Internal"
                        name="internalTotal"
                        value={
                          element.quantity *
                            priceMappings[element.digitalProduct] || ""
                        }
                        onChange={(e) => handleChange(index, e)}
                        readOnly
                      />

                      <Button
                        style={{
                          borderRadius: 10,
                          backgroundColor: "#A175E8",
                          height: "40px",
                          marginLeft: "1vmax",
                        }}
                        id="deleteBtn"
                        onClick={() => removeFormFields(index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  ))}

                  <div>
                    <Button
                      style={{
                        marginLeft: "12px",
                        orderRadius: 10,
                        height: "40px",
                        backgroundColor: "#A175E8",
                      }}
                      variant="contained"
                      onClick={() => addFormFields()}
                    >
                      +
                    </Button>
                  </div>

                  <div className="grossBtn">
                    <h3 id="fontGreat">Gross Total :</h3>
                  </div>
                </div>

                <div style={{ display: "flex" }}>
                  <div>
                    <TextField
                      label="Total Amount"
                      fullWidth
                      sx={{ m: 1 }}
                      value={totalGross ? totalGross : 0}
                      variant="outlined"
                      disabled
                    />
                  </div>

                  <div style={{ marginLeft: "20px" }}>
                    <TextField
                      label="Total Internal Amount"
                      fullWidth
                      sx={{ m: 1 }}
                      value={totalInternalAmount ? totalInternalAmount : 0}
                      variant="outlined"
                      disabled
                    />
                  </div>

                  <div style={{ marginTop: "8px", marginLeft: "20px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Order Date"
                        value={date}
                        onChange={(newValue) => {
                          setDate(newValue["$d"].toLocaleDateString());
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>

                  <div>
                    <Button
                      style={{
                        borderRadius: 10,
                        height: "40px",
                        marginTop: "15px",
                        marginLeft: "20px",
                        width: "90px",
                        backgroundColor: "#A175E8",
                      }}
                      type="submit"
                      disabled={loading ? true : false}
                    >
                      <Typography variant="caption">Create</Typography>
                    </Button>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "7px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                ></div>
              </form>
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
};

export default DigitalCreateOrder;
