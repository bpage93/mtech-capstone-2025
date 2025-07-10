const express = require("express");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json()); // Required for req.body
app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
