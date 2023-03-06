import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DrawerComponent from "../customer/Drawer";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import {
  CREATE_PRODUCT_RESET,
  PRODUCT_TAG,
} from "../../constants/productConstants";
import HeaderActions from "../common/HeaderActions";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const { loading, error, success } = useSelector((state) => state.newProduct);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      history(`/dashboard`, { replace: true });
      dispatch({ type: CREATE_PRODUCT_RESET });
      window.location.reload();
    }
  }, [dispatch, alert, error, history, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name.trim());
    myForm.set("price", price);
    myForm.set("tag", PRODUCT_TAG);
    dispatch(createProduct(myForm));
  };

  return (
    <Fragment>
      <HeaderActions />
      <div className="create-customer-container">
        <div className="create-customer-container-2">
          <form
            className="create-customer-form"
            onSubmit={createProductSubmitHandler}
          >
            <Typography
              style={{
                color: "red",
              }}
            >
              Remember New Product Name must be different from previous Products{" "}
            </Typography>
            <h1 id="fontGreat">Create Product</h1>
            <div>
              <TextField
                label="Product Name"
                fullWidth
                sx={{ m: 1 }}
                type={String}
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </div>

            <div>
              <TextField
                label="Price"
                fullWidth
                sx={{ m: 1 }}
                type={Number}
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
                variant="outlined"
              />
            </div>

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
              Create Product
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateProduct;
