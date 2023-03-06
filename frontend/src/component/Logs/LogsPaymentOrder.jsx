import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../actions/digitalAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import DrawerComponent from "../customer/Drawer.jsx";
import { createLogs } from "../../actions/logsAction";
import HeaderActions from "../common/HeaderActions";

const LogsPaymentOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const { loadingCreateLog, errorCreateLog, createLogSuccess } = useSelector(
    (state) => state.logs
  );

  const [name, setName] = useState("");
  const [date, setDate] = useState(Date.now());
  const [totalGross, setTotalGross] = useState(0);

  useEffect(() => {
    if (errorCreateLog) {
      alert.error(errorCreateLog);
      dispatch(clearErrors());
    }
    if (createLogSuccess) {
      alert.success("Logs Entry Created Successfully");
      history(`/logs`, { replace: true });
    }
  }, [dispatch, alert, errorCreateLog, history, createLogSuccess]);

  const createLogsPaymentSubmitHandler = (e) => {
    e.preventDefault();
    const logsPayload = {
      date: new Date(date).toLocaleDateString(),
      action: "PAYMENT_COLLECTED",
      details: {
        amount: parseInt(totalGross),
        message: `Rs.${parseInt(
          totalGross
        )} was collected as Logs Payment from Singhai Printers`,
        referenceID: `ORDER_ID_NOT_AVAILABLE ${name}`,
      },
    };
    dispatch(createLogs(logsPayload));
  };

  return (
    <div>
      {
        <div>
          <HeaderActions />
          <div className="create-customer-container">
            <div className="create-customer-container-2">
              <form
                className="create-customer-form"
                onSubmit={createLogsPaymentSubmitHandler}
              >
                <h1 id="fontGreat">Create Logs Payment</h1>

                <div>
                  <TextField
                    label="Payment Description"
                    fullWidth
                    sx={{ m: 1 }}
                    required
                    type={String}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                  />
                </div>

                <div>
                  <TextField
                    label="Total Amount"
                    fullWidth
                    sx={{ m: 1 }}
                    value={totalGross}
                    variant="outlined"
                    onChange={(e) => setTotalGross(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Order Date"
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue["$d"].toLocaleDateString());
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>

                <Button
                  style={{
                    borderRadius: 10,
                    height: "40px",
                    padding: "1vmax",
                    backgroundColor: "#A175E8",
                  }}
                  type="submit"
                  loading={loadingCreateLog}
                >
                  Create Logs Payment
                </Button>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default LogsPaymentOrder;
