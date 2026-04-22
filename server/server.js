const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { connectDB } = require("./config/db");

dotenv.config();

// DB connect
connectDB();

// Passport strategies
require("./config/passport");

const app = express();

// Security & core middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("combined", {
  skip: (req, res) => req.url.includes('/notifications') || req.url === '/' || res.statusCode < 400
}));

// Serve uploads
app.use("/uploads", express.static("uploads"));

// Passport init (IMPORTANT)
app.use(passport.initialize());

// Health check
app.get("/", (req, res) => {
  res.send("Job Portal API is running...");
});

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/jobs", require("./routes/jobRoutes"));
app.use("/api/v1/companies", require("./routes/companyRoutes"));
app.use("/api/v1/applications", require("./routes/applicationRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/support", require("./routes/supportRoutes"));
app.use("/api/v1/admin/support", require("./routes/adminSupportRoutes"));
app.use("/api/v1/work-opportunities", require("./routes/workOpportunityRoutes"));

// Error handling (LAST)
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
