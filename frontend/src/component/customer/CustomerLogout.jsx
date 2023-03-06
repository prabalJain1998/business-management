import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { logout } from "../../actions/userAction";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { positions, useAlert } from "react-alert";

const CustomerLogout = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [logmeout, setLogMeOut] = useState(false);
  const alert = useAlert();
  const logoutUser = () => {
    setLogMeOut(true);
  };

  useEffect(() => {
    if (logmeout) {
      dispatch(logout());
      alert.success("Successfully Logged Out");
      history("/");
    }
  }, [logmeout, alert, history, dispatch]);

  return (
    <Fragment>
      <div style={{ paddingTop: "20%" }}>
        <center>
          <Button
            style={{ backgroundColor: "red", color: "white" }}
            onClick={logoutUser}
          >
            <Typography>LOG OUT</Typography>
          </Button>
        </center>

        <center>
          <Link to="/">
            <Typography style={{ paddingTop: "30px", color: "green" }}>
              Go back to Homepage
            </Typography>
          </Link>
        </center>
      </div>
    </Fragment>
  );
};

export default CustomerLogout;
