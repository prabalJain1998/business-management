import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteNotification } from "../../actions/notificationAction";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Chip, Paper } from "@mui/material";

const BasicCard = ({
  id,
  message,
  action,
  updatedBy,
  link,
  disabled,
  numberOfDays,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [checkEntry, setCheckEntry] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const goToPage = () => {
    history(link);
  };

  const deleteHandler = (id) => {
    dispatch(deleteNotification(id));
    if (action === "REMINDER") {
      setOpen(false);
    }
  };

  return (
    <div
      style={{
        zIndex: 1501,
      }}
    >
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Payment Received</DialogTitle>
        <DialogContent>
          <Typography variant="caption">
            Remember, you have to manually update payment in Orders as well.
          </Typography>

          <DialogContentText>{message}</DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={`Type Done if Payment has received`}
            type="email"
            onChange={(e) => {
              if (e.target.value === "Done") {
                setCheckEntry(false);
              } else {
                setCheckEntry(true);
              }
            }}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={checkEntry} onClick={() => deleteHandler(id)}>
            Dismiss Reminder
          </Button>
        </DialogActions>
      </Dialog>

      <Paper
        elevation={1}
        square
        style={{
          color: "black",
          borderBottom: "1px solid white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "5px" }}>
            <Button
              style={{ color: action === "deleted" ? "red" : "blue" }}
              size="large"
              disabled
            >
              {action === "Updated Payment" && (
                <CurrencyRupeeIcon fontSize="5px" />
              )}
              {action === "updated" && <EditIcon fontSize="5px" />}
              {action === "REMINDER" && <AccessAlarmIcon fontSize="5px" />}
              {action === "deleted" && <DeleteIcon fontSize="5px" />}
            </Button>
          </div>
          <div>
            <Typography
              variant="body"
              style={{
                color: "black",
                fontSize: "12px",
                fontFamily: "Varela Round",
              }}
            >
              {`${message} - ${updatedBy.toUpperCase()}`}
            </Typography>
            {numberOfDays >= 1 && (
              <Chip
                label={`${parseInt(numberOfDays)} days ago`}
                color={parseInt(numberOfDays) >= 6 ? "warning" : "info"}
                sx={{
                  fontSize: "9px",
                  padding: "none",
                  maxHeight: "15px",
                  opacity: 0.7,
                  marginLeft: "10px",
                }}
              />
            )}
          </div>
        </div>

        <div style={{ marginLeft: "auto", marginRight: "5px" }}>
          {action == "deleted" ? (
            <></>
          ) : (
            <Button
              onClick={goToPage}
              style={{
                fontSize: "8px",
                color: "white",
                boxShadow:
                  "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                background: "green",
                marginBottom: "10px",
                padding: "3px",
                marginLeft: "5px",
              }}
            >
              Track
            </Button>
          )}

          {action !== "REMINDER" ? (
            <Button
              disabled={disabled}
              onClick={(e) => deleteHandler(id)}
              style={{
                fontSize: "8px",
                color: "white",
                padding: "3px",
                background: "#731924",
                boxShadow:
                  "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                marginBottom: "10px",
                marginLeft: "5px",
              }}
            >
              Dismiss
            </Button>
          ) : (
            <Button
              disabled={disabled}
              onClick={handleClickOpen}
              style={{
                fontSize: "8px",
                padding: "3px",
                color: "white",
                background: "#731924",
                boxShadow:
                  "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                marginBottom: "10px",
                marginLeft: "5px",
              }}
            >
              Dismiss
            </Button>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default BasicCard;
