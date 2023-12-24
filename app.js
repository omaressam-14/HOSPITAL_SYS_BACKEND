const express = require("express");
const path = require("path");
const morgan = require("morgan");
const errorController = require("./controllers/errorController");
const AppError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//routes
const medicineRoutes = require("./routes/medicineRoutes");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const medicalRecordsRoutes = require("./routes/medicalRecordRoutes");
const contactusRoutes = require("./routes/contactusRoutes");

const app = express();
// Serving static files
app.use('/public' , express.static(path.join(__dirname, "public")));

//middlewares
app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Add CORS headers middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  next();
});


//securitymiddlewares
app.use(cors());
app.options("*", cors());
app.use(helmet());
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

//routes
app.use("/api/medicine", medicineRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/records", medicalRecordsRoutes);
app.use("/api/contact-us", contactusRoutes);

// handle the route is not found
app.use("*", async (req, res, next) => {
  return next(
    new AppError(
      `The Route ${req.originalUrl} is not defined in this server`,
      404
    )
  );
});

app.use(errorController);

module.exports = app;
