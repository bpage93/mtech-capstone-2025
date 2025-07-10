const jwt = require("jsonwebtoken");

// Demo users (mock database)
const users = [
    { email: "teacher@example.com", password: "123", role: "teacher" },
    { email: "student@example.com", password: "123", role: "student" },
];

exports.login = (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        (u) => u.email === email && u.password === password
    );
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, "secret", {
        expiresIn: "1h",
    });

    res.json({ token });
};
