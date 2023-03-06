const express = require("express");
const app = express();
const errorMiddleWare = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Router Imports
const user = require("./routes/userRoute");
const customer = require("./routes/customerRoute");
const party = require("./routes/partyRoute");
const internalParty = require("./routes/internalPartyRoutes");
const trash = require("./routes/trashRoute");
const digital = require("./routes/digitalRoute");
const product = require("./routes/productRoute");
const notification = require("./routes/notificationRoute");
const logs = require("./routes/logsRoute");

app.use("/api/v1", user);
app.use("/api/v1", customer);
app.use("/api/v1", party);
app.use("/api/v1", internalParty);
app.use("/api/v1", trash);
app.use("/api/v1", digital);
app.use("/api/v1", product);
app.use("/api/v1", notification);
app.use("/api/v1", logs);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middle ware for Error
app.use(errorMiddleWare);

module.exports = app;
