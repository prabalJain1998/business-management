import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DrawerComponent from "../customer/Drawer";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import Loader from "../layout/Loader/Loader";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const { loading, error, isUpdated } = useSelector((state) => state.product);
  const {
    loading: productLoading,
    error: allProductError,
    product,
  } = useSelector((state) => state.productDetails);

  const orderId = id;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (allProductError) {
      alert.error(allProductError);
      dispatch(clearErrors());
    }

    if (!product) {
      dispatch(getProductDetails(orderId));
    } else {
      setName(product.party.name);
      setPrice(product.party.price);
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");
      history(`/dashboard`);
      dispatch({ type: UPDATE_PRODUCT_RESET });
      window.location.reload();
    }
  }, [
    dispatch,
    alert,
    error,
    history,
    isUpdated,
    product,
    allProductError,
    orderId,
  ]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name.trim());
    myForm.set("price", price);
    dispatch(updateProduct(orderId, myForm));
  };

  return (
    <Fragment>
      <DrawerComponent />
      <div className="create-customer-container">
        {productLoading ? (
          <Loader />
        ) : (
          <div className="create-customer-container-2">
            <form
              className="create-customer-form"
              onSubmit={updateProductSubmitHandler}
            >
              <Typography
                style={{
                  color: "red",
                }}
              >
                Remember Product Name must be different from previous Products{" "}
              </Typography>

              <h1 id="fontGreat">Create Product</h1>
              <div>
                <TextField
                  label="Product Name"
                  fullWidth
                  sx={{ m: 1 }}
                  type="string"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  disabled
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
                Update Product
              </Button>
            </form>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
