import { Paper, Tooltip } from "@mui/material";
import React from "react";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import StarIcon from "@mui/icons-material/Star";

const CardItem = ({
  keyItem,
  value,
  threshold,
  disableIcon,
  start,
  component,
}) => {
  return (
    <Paper
      style={{
        borderLeft: "5px solid #1976d2",
        margin: "5px",
      }}
      elevation={3}
    >
      <div
        style={{
          marginLeft: "5px",
          padding: "5px",
          fontSize: "15px",
          fontFamily: "Roboto",
        }}
      >
        {keyItem}
      </div>

      <div
        style={{
          color: value > threshold ? "#1976d2" : "red",
          fontSize: "20px",
          marginLeft: "5px",
          padding: "5px",
        }}
      >
        {value}

        {!disableIcon &&
          (value < threshold ? (
            <Tooltip
              title={`Danger!! This should be greater than ${threshold}`}
              placement="top"
            >
              <SentimentVeryDissatisfiedIcon color={"red"} fontSize="10px" />
            </Tooltip>
          ) : start ? (
            <Tooltip
              title={`Wow!! you Have Completed ${value} orders`}
              placement="top"
            >
              <StarIcon color={"green"} fontSize="10px" />
            </Tooltip>
          ) : (
            <Tooltip
              title={`Wow!! you are doing a great job !! Keep it up`}
              placement="top"
            >
              <TagFacesIcon color={"blue"} fontSize="10px" />
            </Tooltip>
          ))}
      </div>

      {component && component()}
    </Paper>
  );
};

export default CardItem;
