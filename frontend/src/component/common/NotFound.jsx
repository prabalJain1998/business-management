import { Typography } from "@mui/material";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";

const NotFound = () => {
  const history = useNavigate();
  const goToHome = () => {
    history("/");
  };
  return (
    <Fragment>
      <center>
        <div className="deleteOrderPage">
          <h2>
            <Typography>You are trying to access an unknown page.</Typography>
          </h2>
          <h2>
            <Typography>
              Press the button Below to return to homepage
            </Typography>
          </h2>
          <Button type="button" onClick={goToHome}>
            Home
          </Button>
        </div>
      </center>
    </Fragment>
  );
};

export default NotFound;
