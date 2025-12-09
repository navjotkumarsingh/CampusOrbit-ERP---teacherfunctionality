const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Rebuild indexes
const rebuildIndexes = async () => {
  try {
    const Student = require("./models/Student");
    const Admission = require("./models/Admission");

    await Student.syncIndexes();
    await Admission.syncIndexes();
    console.log("✅ Indexes synced successfully");
  } catch (error) {
    console.error("Index sync error:", error.message);
  }
};

// Delay index rebuild to ensure DB connection is established
setTimeout(() => rebuildIndexes(), 1000);

// Enable CORS
const allowedOrigins = [
  "http://localhost:3000", // Default React dev server
  "http://localhost:3001", // Alternative React dev server
  "http://localhost:5000", // Default Node server
  "http://localhost:5001", // Backend server
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5001",
  "https://your-production-domain.com", // Add your production domain here
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "X-Requested-With",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Parse JSON bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Favicon endpoint
app.get("/favicon.ico", (req, res) => {
  res.status(204).send();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Documentation route
app.use("/api/docs", require("./routes/apiDocRoutes"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admissions", require("./routes/admissionsRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/fees", require("./routes/feeRoutes"));
app.use("/api/lms", require("./routes/lmsRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});


// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
