import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title.jsx";

export default function Deposits({ k, value }) {
  return (
    <React.Fragment>
      <Title>{k}</Title>
      <Typography component="p" variant="h4">
        {value}
      </Typography>
    </React.Fragment>
  );
}
