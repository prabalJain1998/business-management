import React, { Fragment, useEffect, useState } from "react";
import "../customer/CustomerCreateOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import { UPDATE_DIGITAL_RESET } from "../../constants/digitalConstants";
import {
  updateDigitalOrder,
  getDigitalOrderDetails,
  clearErrors,
} from "../../actions/digitalAction";
import DeleteIcon from "@mui/icons-material/Delete";
import DrawerComponent from "../customer/Drawer.jsx";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { getAllProducts } from "../../actions/productAction";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import HeaderActions from "../common/HeaderActions";

const DigitalUpdateOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { id } = useParams();

  const { error, order } = useSelector((state) => state.digitalDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.digitalOrder);
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
  const [totalGross, setTotalGross] = useState(0);
  const [totalInternalAmount, setTotalInternalAmount] = useState();
  const [formValues, setFormValues] = useState([]);
  const [date, setDate] = useState();

  const orderId = id;

  let handleChange = (i, e) => {
    e.preventDefault();
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    let totalGrossValue = 0;
    let totalInternalAmount = 0;
    newFormValues.map((obj) => {
      const { quantity, price, digitalProduct } = obj;
      obj["total"] = Number(quantity) * Number(price);
      obj["internalTotal"] = Number(quantity) * priceMappings[digitalProduct];
      totalGrossValue += Number(quantity) * Number(price);
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
      const { quantity, price, digitalProduct } = obj;
      obj["total"] = Number(quantity) * Number(price);
      obj["internalTotal"] = Number(quantity) * priceMappings[digitalProduct];
      totalGrossValue += Number(quantity) * Number(price);
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
      const { quantity, price, digitalProduct } = obj;
      obj["total"] = Number(quantity) * Number(price);
      obj["internalTotal"] = Number(quantity) * priceMappings[digitalProduct];
      totalGrossValue += Number(quantity) * Number(price);
      totalInternalAmount += Number(quantity) * priceMappings[digitalProduct];
    });
    setTotalGross(totalGrossValue);
    setTotalInternalAmount(totalInternalAmount);
    setFormValues(newFormValues);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      history("/dashboard");
      dispatch(clearErrors());
    }

    dispatch(getAllProducts());

    if (order && order._id !== orderId) {
      dispatch(getDigitalOrderDetails(orderId));
    } else {
      setName(order.name);
      setPhoneNo(order.phoneNo);
      setTotalGross(order.totalAmount);
      setFormValues(order.particulars);
      setTotalInternalAmount(order.totalInternalAmount);
      setDate(order.date);
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order Updated Successfully");
      history(`/digital/orders`);
      dispatch({ type: UPDATE_DIGITAL_RESET });
    }
  }, [dispatch, alert, error, history, isUpdated, orderId, order, updateError]);

  const updateDigitalSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("name", name);
    if (phoneNo && phoneNo >= 1000000000 && phoneNo <= 9999999999) {
      myForm.set("phoneNo", phoneNo);
    }
    let d = new Date(date);
    myForm.set("date", d.toLocaleDateString());
    formValues.map((item) => {
      item.total = Number(item.quantity) * Number(item.price);
    });

    myForm.set("particulars", JSON.stringify(formValues));
    myForm.set("totalAmount", totalGross);
    myForm.set("totalInternalAmount", totalInternalAmount);
    dispatch(updateDigitalOrder(id, myForm));
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
                onSubmit={updateDigitalSubmitHandler}
              >
                <h1 id="fontGreat">Update Digital Entry</h1>

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
                        value={element.price || ""}
                        onChange={(e) => handleChange(index, e)}
                      />
                      <input
                        style={{ width: "10%" }}
                        type="number"
                        placeholder="Total"
                        name="total"
                        value={element.quantity * element.price || ""}
                        onChange={(e) => handleChange(index, e)}
                        readOnly
                      />

                      <select
                        style={{ width: "20%" }}
                        name="digitalProduct"
                        value={element.digitalProduct}
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
                          height: "40px",
                        }}
                        id="deleteBtn"
                        onClick={() => removeFormFields(index)}
                      >
                        <DeleteIcon htmlColor="red" />
                      </Button>
                    </div>
                  ))}

                  <div>
                    <Button
                      style={{
                        borderRadius: 10,
                        height: "40px",
                        marginLeft: "10px",
                        marginTop: "10px",
                        backgroundColor: "#A175E8",
                      }}
                      variant="contained"
                      onClick={() => addFormFields()}
                    >
                      +
                    </Button>
                  </div>

                  <div className="grossBtn">
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

                    <div style={{ marginLeft: "10px" }}>
                      <TextField
                        label="Total Internal Amount"
                        fullWidth
                        sx={{ m: 1 }}
                        type={Number}
                        value={totalInternalAmount ? totalInternalAmount : 0}
                        variant="outlined"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div style={{ padding: "10px" }}>
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

                  <Button
                    style={{
                      borderRadius: 10,
                      height: "40px",
                      margin: "10px 0px 0px 20px",
                      backgroundColor: "#A175E8",
                    }}
                    type="submit"
                    disabled={loading ? true : false}
                  >
                    Update Entry
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
};

export default DigitalUpdateOrder;
