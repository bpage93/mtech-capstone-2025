const express = require("express");
const jwt = require("jsonwebtoken");
const { query } = require("../database/postgresQuery");
const router = express.Router();

const USER_PERMISSIONS = {
	"/canvas/student": ["student"],
	"/canvas/admin": ["admin"],
	"/canvas/profile": ["student", "admin"],
	"/canvas/messages": ["student", "admin"],
	"/canvas/assignments": ["student", "admin"],
	"/canvas/courses": ["student", "admin"],
};

function getAllowedRoles(path) {
	for (const route in USER_PERMISSIONS) {
		if (path === route || path.startsWith(route + "/")) {
			return USER_PERMISSIONS[route];
		}
	}
	return null;
}

router.get("/token", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}
	const requestedRoute = req.query.route;
	if (!requestedRoute) {
		return res.status(400).json({ error: "No route specified" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { userId } = decoded;
		const userSearch = await query(
			`
            SELECT * FROM "user" WHERE id = $1;
        `,
			[userId]
		);
		if (!userSearch || userSearch.rows.length === 0) {
			return res.status(401).json({ error: "Could not find the user" });
		} else {
			const user = userSearch.rows[0];
			const allowedRoles = getAllowedRoles(requestedRoute);
			if (!allowedRoles || !allowedRoles.includes(user.role)) {
				return res.status(403).json({ error: "Access denied" });
			}
			return res.status(200).json({ user: { userId: user.id, role: user.role, email: user.email, firstname: user.firstname, lastname: user.lastname, username: user.username, telephone: user.telephone, street: user.street, city: user.city, state: user.state, zip: user.zip } });
		}
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
});

router.get("/admin", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { userId } = decoded;
		const userSearch = await query(
			`
            SELECT * FROM "user" WHERE id = $1;
        `,
			[userId]
		);
		if (!userSearch || userSearch.rows.length === 0) {
			return res.status(401).json({ error: "Could not find the user" });
		} else {
			const user = userSearch.rows[0];
			if (user.role === "admin") {
				return res.status(200).json({ message: "User is an admin" });
			} else {
				return res.status(403).json({ error: "Access Denied" });
			}
		}
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
});

router.post("/token/user_id", (req, res) => {
	try {
		const token = req.body.token;
		if (!token) throw error;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { userId } = decoded;
		return res.status(200).json({ user_id: userId });
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
});

router.get("/student", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ error: "no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { userId } = decoded;

		const userIsStudentResult = await query(
			`
            SELECT
                u.role
            FROM "user" u
            WHERE u.id = $1
        `,
			[userId]
		);
		if (userIsStudentResult.rows.length === 0) return res.status(401).json({ error: "User not found" });
		return res.status(200).send("User is a student");
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
});

module.exports = router;
