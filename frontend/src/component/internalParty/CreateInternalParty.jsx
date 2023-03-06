import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  createInternalParty,
} from "../../actions/internalPartyAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import { useNavigate } from "react-router-dom";
import CallIcon from "@mui/icons-material/Call";
import "react-datepicker/dist/react-datepicker.css";
import { NEW_INTERNAL_PARTY_RESET } from "../../constants/internalPartyConstants";
import { Typography } from "@mui/material";
import HeaderActions from "../common/HeaderActions";

const CreateInternalParty = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState();
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("");

  const { party, loading, error, success } = useSelector(
    (state) => state.newInternalParty
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Internal Party Entry Created Successfully");
      history(`/dashboard`, { replace: true });
      dispatch({ type: NEW_INTERNAL_PARTY_RESET });
    }
  }, [dispatch, alert, error, history, success, party]);

  const createPartySubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("name", name.trim());
    myForm.set("phoneNo", phoneNo);
    myForm.set("details", details);
    myForm.set("address", address);
    dispatch(createInternalParty(myForm));
  };

  return (
    <Fragment>
      <HeaderActions />
      <div className="create-customer-container">
        <div className="create-customer-container-2">
          <form
            className="create-customer-form"
            onSubmit={createPartySubmitHandler}
          >
            <Typography
              style={{
                color: "red",
              }}
            >
              Remember New Internal Party Name must be different from previous
              Internal Parties{" "}
            </Typography>
            <h1 id="fontGreat">Create Internal Party</h1>
            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Party Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Party Details"
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Party address"
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
              Create Internal Party
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateInternalParty;
