const express = require("express");
const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const app = express();

const userRouter = require("./routes/userRoute");
const caseRouter = require("./routes/caseRoute");
const policeRouter = require("./routes/policeRoute");

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.disable("etag");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/cases", caseRouter);
app.use("/api/v1/police", policeRouter);

module.exports = app;
