import * as React from "react";
import Loader from "../layout/Loader/Loader.js";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearErrors, getAllProducts } from "../../actions/productAction";
import CardItem from "../common/CardItem";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import HeaderActions from "../common/HeaderActions.jsx";

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { loading, error, products } = useSelector(
    (state) => state.allProducts
  );

  const editProductHandler = (id) => {
    history(`/product/update/${id}`);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllProducts());
  }, [dispatch, alert, error]);

  const rows = [];
  products &&
    products.products &&
    products.products.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: item.price,
      });
    });

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard2">
          <HeaderActions />

          <h1 id="productListHeading">ALL PRODUCTS</h1>
          <div className="overall"></div>

          <div
            style={{
              display: "flex",
              overflow: "anywhere",
              justifyContent: "center",
            }}
          >
            {rows.map((a) => (
              <div style={{ maxWidth: "200px" }}>
                <CardItem
                  keyItem={a?.name}
                  value={a?.price}
                  threshold={0}
                  disableIcon={true}
                  component={() =>
                    user.permission === "admin" && (
                      <Button onClick={() => editProductHandler(a?.id)}>
                        <EditIcon
                          style={{
                            color: "blue",
                          }}
                        />
                      </Button>
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Products;
