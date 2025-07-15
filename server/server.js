require("dotenv").config(); // Load .env variables

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan");
const winston = require("winston");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Logger setup
const logger = winston.createLogger({
    level: "http",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logfile.log" }),
    ],
});

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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
app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: false,
    }),
    (req, res) => {
        // You can generate JWT and send it here instead
        res.redirect("http://localhost:3000/canvas/student"); // or pass token in query string
    }
);

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
