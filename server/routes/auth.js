const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start Google Auth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// Callback route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // Successful auth, redirect to frontend dashboard
        res.redirect("http://localhost:3000/canvas/student"); // or admin, depending on user
    }
);

module.exports = router;
