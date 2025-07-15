require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan");
const winston = require("winston");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { query } = require("./database/postgresQuery");

const authRoutes = require("./routes/auth");

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

// Sessions (required for Passport)
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
	})
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/api/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			const user = {
				googleId: profile.id,
				email: profile.emails[0].value,
				name: profile.displayName,
			};

			// You would save or lookup the user in your DB here
			return done(null, user);
		}
	)
);

// Serialize user to session (if using sessions)
passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((obj, done) => {
	done(null, obj);
});

// Routes
app.use("/api/auth", authRoutes);

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

app.use("/api/users", async (req, res) => {
	try {
		const results = await query('SELECT * FROM "user"');
		res.status(200).json(results.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Start server
app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
