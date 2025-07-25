const express = require("express");
const { pool, query } = require("../database/postgresQuery");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const bcrypt = require("bcrypt");
const saltRounds = 10;

const router = express.Router();

router.get("/view", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}
	const isAdminResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/admin`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const isAdminData = await isAdminResponse.json();
	if (!isAdminResponse.ok) {
		return res.status(403).json({ error: "access denied" });
	}

	const page = parseInt(req.query.page) || 1;
	const usersPerPage = 5;
	const offset = usersPerPage * (page - 1);
	try {
		const totalCountResults = await query(`SELECT count(*) FROM "user"`);
		const totalCount = parseInt(totalCountResults.rows[0].count);
		const maxPage = Math.ceil(totalCount / usersPerPage);
		const userResults = await query(
			`
            SELECT
                usr.id,
                usr.role,
                usr.email,
                usr.firstname,
                usr.lastname,
                usr.telephone,
                usr.username,
                address.street,
                address.city,
                address.state,
                address.zip
            FROM "user" usr JOIN address ON usr.id = address.user_id
            ORDER BY usr.lastname
            LIMIT $1
            OFFSET $2;
        `,
			[usersPerPage, offset]
		);
		res.status(200).json({
			users: userResults.rows,
			pagination: {
				current_page: page,
				total_pages: maxPage,
				has_next_page: page < maxPage,
				has_prev_page: page > 1,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/create", async (req, res) => {
	const user = req.body.user;

	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const hashedPassword = await bcrypt.hash(user.password, saltRounds);
		const userResult = await client.query(
			`
            INSERT INTO "user" (role, email, firstname, lastname, telephone, username, password) VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `,
			["student", user.email, user.firstname, user.lastname, user.telephone, user.username, hashedPassword]
		);

		const userId = userResult.rows[0].id;

		await client.query(
			`
            INSERT INTO address (user_id, street, city, state, zip) VALUES
            ($1, $2, $3, $4, $5)
        `,
			[userId, user.street, user.city, user.state, user.zip]
		);

		await client.query("COMMIT");

		const token = jwt.sign({ userId }, jwtSecret, { expiresIn: "1h" });
		res.status(200).json({ token, role: "student" });
	} catch (error) {
		await client.query("ROLLBACK");
		if (error.code === "23505") {
			if (error.constraint === "user_email_key") {
				return res.status(409).json({
					error: "Email is already associated with an existing user",
				});
			}
		}
		throw error;
	} finally {
		client.release();
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body.credentials;

		if (!email || !password) {
			return res.status(400).json({ error: "Missing Credentials" });
		}

		const userSearch = await query(
			`
            SELECT * FROM "user" WHERE email = $1;
        `,
			[email]
		);

		if (!userSearch.rows || userSearch.rows.length === 0) {
			return res.status(401).json({ error: "Invalid Credentials" });
		} else {
			const user = userSearch.rows[0];
			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				return res.status(401).json({ error: "Invalid Credentials" });
			} else {
				const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });
				return res.status(200).json({ message: "Login successful", token, role: user.role });
			}
		}
	} catch (error) {
		console.error("Login Error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
