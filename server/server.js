const express = require("express");
const path = require("path");
const cors = require("cors");
const winston = require("winston");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const morgan = require("morgan");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
    morgan("combined", {
        stream: {
            write: (message) => logger.http(message.trim()),
        },
    })
);

const logger = winston.createLogger({
    level: "http", // Default is info
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logfile.log" }),
    ],
});

app.use(cors());
app.use(express.json()); // Required for req.body
app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
    logger.http("api endpoint requested");

    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
