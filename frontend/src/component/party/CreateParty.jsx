import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createParty } from "../../actions/partyAction.js";
import { useAlert } from "react-alert";
import { Button, TextField } from "@material-ui/core";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import { useNavigate } from "react-router-dom";
import CallIcon from "@mui/icons-material/Call";
import "react-datepicker/dist/react-datepicker.css";
import { NEW_PARTY_RESET } from "../../constants/partyConstants";
import DrawerComponent from "../customer/Drawer.jsx";
import HeaderActions from "../common/HeaderActions.jsx";

const CreateParty = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState();
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("");

  const { party, loading, error, success } = useSelector(
    (state) => state.newParty
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Party Entry Created Successfully");
      history(`/party/all`, { replace: true });
      dispatch({ type: NEW_PARTY_RESET });
    }
  }, [dispatch, alert, error, history, success, party]);

  const createPartySubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("name", name.trim());
    myForm.set("phoneNo", phoneNo);
    myForm.set("details", details);
    myForm.set("address", address);
    dispatch(createParty(myForm));
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
            <h1 id="fontGreat">Create Party</h1>

            <div>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                type={String}
                required
                value={name}
                variant="outlined"
                label="Party Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "10px" }}>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                type={"number"}
                required
                value={phoneNo}
                variant="outlined"
                label="Phone"
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "10px" }}>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                type={String}
                required
                value={details}
                variant="outlined"
                label="Party Details"
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "10px" }}>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                type={String}
                required
                value={address}
                variant="outlined"
                label="Party Address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <Button
              style={{
                borderRadius: 10,
                marginTop: "10px",
                width: "220px",
                height: "40px",
                padding: "1vmax",
                backgroundColor: "#A175E8",
              }}
              type="submit"
              disabled={loading ? true : false}
            >
              Create Party
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateParty;
