require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan");
const winston = require("winston");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Logger setup
const logger = winston.createLogger({
	level: "http",
	transports: [new winston.transports.Console(), new winston.transports.File({ filename: "logfile.log" })],
});

// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(
	morgan("combined", {
		stream: { write: (message) => logger.http(message.trim()) },
	})
);

const usersRouter = require("./routes/users");
const coursesRouter = require("./routes/courses");
const databaseRouter = require("./routes/database");
const authRouter = require("./routes/auth");
const enrollmentRouter = require("./routes/enrollment");

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/database", databaseRouter);
app.use("/api/enrollment", enrollmentRouter);

// Health check route
app.get("/api", (req, res) => {
	res.json({ message: "Hello from server!" });
});

// Google OAuth routes
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
	"/api/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login",
		session: false,
	}),
	(req, res) => {
		// You can generate JWT and send it here instead
		res.redirect(`${FRONTEND_URL}/canvas/student`); // or pass token in query string
	}
);

// Start server
app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
