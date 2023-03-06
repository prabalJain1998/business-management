import React, { Fragment, useEffect, useState } from "react";
import "../customer/CustomerDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createDigitalOrder } from "../../actions/digitalAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
// import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { NEW_DIGITAL_RESET } from "../../constants/digitalConstants";
import HeaderActions from "../common/HeaderActions";
import { getAllProducts } from "../../actions/productAction";

const DigitalPaymentOrder = () => {
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

    let mockFormValues = [
      {
        digitalProduct: "PAYMENT",
        internalTotal: 0,
        item: "PAYMENT",
        price: 0,
        quantity: 0,
        total: 0,
      },
    ];

    myForm.set("particulars", JSON.stringify(mockFormValues));
    myForm.set("totalAmount", totalGross);
    myForm.set("totalInternalAmount", 0);
    myForm.set("action", "PAYMENT");
    dispatch(createDigitalOrder(myForm));
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
                <h1 id="fontGreat">Create Digital Payment</h1>

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
                    label="Total Amount"
                    fullWidth
                    sx={{ m: 1 }}
                    value={totalGross}
                    variant="outlined"
                    onChange={(e) => setTotalGross(e.target.value)}
                  />
                </div>

                <div style={{ padding: "1vmax" }}>
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
                  Create Payment
                </Button>
              </form>
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
};

export default DigitalPaymentOrder;
