const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Dummy users (you should replace this with a real DB)
const users = [
    {
        id: 1,
        email: "student@example.com",
        password: "student123",
        role: "student",
    },
    {
        id: 2,
        email: "teacher@example.com",
        password: "teacher123",
        role: "teacher",
    },
];

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const valid = password === user.password; // use bcrypt.compare in real apps
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "defaultSecret",
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({ token, role: user.role });
};

module.exports = { login };
