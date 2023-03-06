import * as React from "react";
import { useSelector } from "react-redux";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Divider from "@mui/material/Divider";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { mainListItems, secondaryListItems } from "./listItems";
import { useDispatch } from "react-redux";
import Orders from "./Orders.jsx";
import "./Dashboard.css";
import { Button, Paper, Switch, TextField } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAlert } from "react-alert";
import { permissions } from "../../permissions";
import BasicCard2 from "../common/BasicCard";
import {
  getAllNotifications,
  clearErrors,
} from "../../actions/notificationAction";
import { useNavigate } from "react-router-dom";
import AlarmIcon from "@mui/icons-material/Alarm";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { POPUP_RESET } from "../../constants/notificationConstants";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Copyright(props) {
  return (
    <div>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        Made with
        <FavoriteIcon htmlColor={"red"} /> by
        <Link
          href="https://prabaljain1998.github.io/prabal.github.io/"
          style={{ marginLeft: "10px", cursor: "pointer" }}
        >
          Prabal Jain
        </Link>
      </Typography>
    </div>
  );
}

const drawerWidth = 190;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const NOTIFICATION = "NOTIFICATION";
const REMINDER_NOTIFICATION = "REMINDER_NOTIFICATION";
const ACTION_NOTIFICATION = "ACTION_NOTIFICATION";

function DashboardContent() {
  const history = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { drawer } = useSelector((state) => state.userPreferences);

  const [open, setOpen] = React.useState(true);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [showDrawer, setshowDrawer] = React.useState(drawer);

  const { user } = useSelector((state) => state.user);
  const { error, reminderNotifications, actionNotifications } = useSelector(
    (state) => state.notification
  );
  const { showPopUp } = useSelector((state) => state.showPopUp);
  const [showInsights, setShowInsights] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(NOTIFICATION);

  const [showReminderNotification, setShowReminderNotification] =
    React.useState(false);

  const [authenticatePIN, setAuthenticatePIN] = React.useState("");
  const [insightsAuthenticated, setInsightsAuthenticated] =
    React.useState(false);

  const [openPopUp, setOpenPopUp] = React.useState(showPopUp?.showReminder);

  React.useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllNotifications());
  }, [error, notificationsOpen]);

  const designation = user?.permission;
  const PERMISSIONS = permissions[designation];

  const handleSwitchChange = () => {
    setshowDrawer(!showDrawer);
    dispatch({ type: "SET_DRAWER", payload: { drawer: !showDrawer } });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "300px",
    overflowY: "auto",
  };

  const numberOfDays = (date) => {
    let currentDate = new Date(Date.now());
    let previousDate = new Date(date);
    return (
      (currentDate.getTime() - previousDate.getTime()) / (1000 * 3600 * 24)
    );
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={showPopUp?.showReminder}
        onClose={() => setOpenPopUp(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showPopUp?.showReminder}>
          <Paper sx={style}>
            <CancelIcon
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                color: "red",
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch({ type: POPUP_RESET });
              }}
            />

            {reminderNotifications &&
              reminderNotifications.map(
                (item) =>
                  new Date(Date.now()).getTime() >=
                    new Date(item.dateCreated).getTime() && (
                    <BasicCard2
                      numberOfDays={numberOfDays(item.dateCreated)}
                      disabled={
                        new Date(Date.now()).getTime() >=
                        new Date(item.dateCreated).getTime()
                          ? false
                          : true
                      }
                      id={item._id}
                      dateCreated={item.dateCreated
                        .substring(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                      message={item.message}
                      action={item.action}
                      updatedBy={item.updatedBy}
                      link={item.link}
                    />
                  )
              )}
          </Paper>
        </Fade>
      </Modal>

      {insightsAuthenticated && (
        <div style={{ margin: "auto", marginTop: "100px", maxWidth: "200px" }}>
          <TextField
            label="Enter PIN"
            fullWidth
            sx={{ m: 1 }}
            type="password"
            value={authenticatePIN}
            variant="outlined"
            onChange={(e) => setAuthenticatePIN(e.target.value)}
          />

          <Button
            onClick={() => {
              if (authenticatePIN == 1998) {
                setShowInsights(true);
                setAuthenticatePIN("");
              } else {
                alert.error("Oops unauthorized");
              }
            }}
          >
            Authenticate
          </Button>

          <Button
            onClick={() => {
              setAuthenticatePIN("");
              setInsightsAuthenticated(false);
              setShowInsights(false);
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            position="absolute"
            open={false}
            style={{ backgroundColor: "#131921" }}
          >
            <Toolbar sx={{ pr: "20px" }}>
              <div id="hamburgerHeader">
                <MenuIcon onClick={handleSwitchChange} />
              </div>
              <h1 id="headerText" style={{ fontFamily: "Montserrat" }}>
                Singhai Printers
              </h1>

              {/* <p id="subheaderText" style={{ marginLeft: "1vmax", color: "aqua" }}>Expense</p> */}
              <p
                style={{
                  marginLeft: "1vmax",
                  color: "aqua",
                  fontFamily: "Shalimar",
                }}
              >{`${user.name}'s workspace`}</p>

              <div
                style={{
                  position: "absolute",
                  right: "10px",
                }}
              >
                <Button
                  onClick={(e) => {
                    setAuthenticatePIN("");
                    setInsightsAuthenticated(!insightsAuthenticated);
                    if (insightsAuthenticated) {
                      setShowInsights(false);
                    }
                  }}
                >
                  <AnalyticsIcon htmlColor="#d1afd8" />
                </Button>

                <Button
                  aria-controls={
                    showReminderNotification ? "basic-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={showReminderNotification ? "true" : undefined}
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setNotificationType(REMINDER_NOTIFICATION);
                  }}
                >
                  <AlarmIcon
                    style={{ paddingRight: "3px", color: "#d1afd8" }}
                  />
                  <Typography
                    fontSize={15}
                    marginTop={"-10px"}
                    color={"#d1afd8"}
                  >
                    {reminderNotifications?.length}
                  </Typography>
                </Button>

                <Button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setNotificationType(ACTION_NOTIFICATION);
                  }}
                >
                  <NotificationsActiveIcon
                    style={{ paddingRight: "3px", color: "#ffc106" }}
                  />
                  <Typography
                    fontSize={15}
                    marginTop={"-10px"}
                    color={"#ffc106"}
                  >
                    {actionNotifications?.length}
                  </Typography>
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          {showDrawer && (
            <Drawer variant="permanent" open={open}>
              <Toolbar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: [1],
                }}
              ></Toolbar>
              <Divider />
              <List component="nav">
                {mainListItems}
                <Divider sx={{ my: 1 }} />
                {secondaryListItems}
              </List>
            </Drawer>
          )}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />

            <Container maxWidth="100%">
              {notificationsOpen && (
                <Paper id="notificationDiv" square elevation={3}>
                  {(notificationType === ACTION_NOTIFICATION
                    ? actionNotifications
                    : reminderNotifications
                  )?.map((item) => (
                    <BasicCard2
                      numberOfDays={numberOfDays(item.dateCreated)}
                      id={item._id}
                      dateCreated={item.dateCreated
                        .substring(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                      message={item.message}
                      action={item.action}
                      updatedBy={item.updatedBy}
                      link={item.link}
                    />
                  ))}
                </Paper>
              )}

              {PERMISSIONS.DASHBOARD_VIEW ? (
                <Orders showInsights={showInsights} />
              ) : (
                "Oops you have no permissions to Access/View this Page kindly contact Admin"
              )}
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
