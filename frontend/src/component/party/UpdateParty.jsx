import React, { Fragment, useEffect, useState } from "react";
import "../customer/CustomerCreateOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import { useNavigate } from "react-router-dom";
import CallIcon from "@mui/icons-material/Call";
import { UPDATE_PARTY_RESET } from "../../constants/partyConstants";
import {
  getPartyDetails,
  updateParty,
  clearErrors,
} from "../../actions/partyAction";
import DrawerComponent from "../customer/Drawer";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

const UpdateParty = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();
  const { id } = useParams();

  const {
    error,
    order,
    loading: partyDetailsLoading,
  } = useSelector((state) => state.partyDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.party);

  const [name, setName] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [details, setDetails] = useState();
  const [address, setAddress] = useState();

  const orderId = id;

  useEffect(() => {
    if (error) {
      alert.error(error);
      history("/dashboard");
      dispatch(clearErrors());
    }

    if (order == null) {
      dispatch(getPartyDetails(orderId));
    } else {
      setName(order.party.name);
      setPhoneNo(order.party.phoneNo);
      setDetails(order.party.details);
      setAddress(order.party.address);
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Party Updated Successfully");
      history(`/dashboard`);
      dispatch({ type: UPDATE_PARTY_RESET });
    }
  }, [dispatch, alert, error, history, isUpdated, orderId, order, updateError]);

  const createCustomerSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("phoneNo", phoneNo);
    myForm.set("address", address);
    myForm.set("details", details);
    dispatch(updateParty(id, myForm));
  };

  return (
    <Fragment>
      <DrawerComponent />
      {partyDetailsLoading ? (
        <Loader />
      ) : (
        <div className="create-customer-container">
          <div className="create-customer-container-2">
            <form
              className="create-customer-form"
              onSubmit={createCustomerSubmitHandler}
            >
              <h1 id="fontGreat">Update Party</h1>
              <div>
                <SpellcheckIcon />
                <input
                  type="text"
                  placeholder="Party Name"
                  required
                  value={name}
                  readOnly
                />
              </div>

              <div>
                <CallIcon />
                <input
                  type="number"
                  placeholder="Phone"
                  required
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>

              <div>
                <StorageIcon />
                <input
                  type="text"
                  placeholder="Party Details"
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div>
                <StorageIcon />
                <input
                  type="text"
                  placeholder="Party Address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                Update
              </Button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UpdateParty;
