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
                usr.id AS user_id,
                usr.role AS user_role,
                usr.email AS user_email,
                usr.firstname AS user_firstname,
                usr.lastname AS user_lastname,
                usr.telephone AS user_telephone,
                usr.username AS user_username,
                address.id AS address_id,
                address.street AS address_street,
                address.city AS address_city,
                address.state AS address_state,
                address.zip AS address_zip,
                enrollment.id AS enrollment_id,
                enrollment.course_id AS enrollment_course_id
            FROM "user" usr
            JOIN address ON usr.id = address.user_id
            LEFT JOIN enrollment ON usr.id = enrollment.user_id
            ORDER BY usr.lastname
            LIMIT $1
            OFFSET $2;
        `,
			[usersPerPage, offset]
		);
		const modifiedData = userResults.rows.map((row) => {
			const wrapped = {};
			for (const [key, value] of Object.entries(row)) {
				const splitKey = key.split("_");
				const [table, field] = [splitKey[0], splitKey.slice(1).join("_")];
				const primary_key = row[`${table}_id`];
				if (field === "id") continue;
				wrapped[field] = {
					value,
					table,
					creation: false,
					primary_key,
				};
			}
			return wrapped;
		});
		const creationColumn = {};
		for (const key of Object.keys(userResults.rows[0])) {
			const splitKey = key.split("_");
			const [table, field] = [splitKey[0], splitKey.slice(1).join("_")];
			if (["id", "course_id"].includes(field)) continue;
			creationColumn[field] = {
				value: "",
				table,
				creation: true,
				primary_key: null,
			};
		}
		modifiedData.push(creationColumn);
		res.status(200).json({
			data: modifiedData,
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
	const token = req.headers.authorization?.split(" ")[1];
	let isAdmin = false;
	if (token) {
		const isAdminResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/admin`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (isAdminResponse.ok) {
			isAdmin = true;
		}
	}

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
			[isAdmin ? user.role : "student", user.email, user.firstname, user.lastname, user.telephone, user.username, hashedPassword]
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

router.delete("/delete", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}
	const isAdminResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/admin`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!isAdminResponse.ok) {
		return res.status(403).json({ error: "access denied" });
	}

	const user_id = req.body.user_id;
	if (!user_id) return res.status(400).json({ message: "missing user_id" });

	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		await client.query("DELETE FROM enrollment WHERE user_id = $1", [user_id]);
		await client.query("DELETE FROM address WHERE user_id = $1", [user_id]);

		await client.query('DELETE FROM "user" WHERE id = $1', [user_id]);

		await client.query("COMMIT");

		res.status(200).json({ message: "User and related data deleted." });
	} catch (err) {
		await client.query("ROLLBACK");
		res.status(500).json({ error: "Internal server error" });
	} finally {
		client.release();
	}
});

router.get("/self", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(400).json({ error: "Missing token" });

	try {
		const { userId } = jwt.verify(token, process.env.JWT_SECRET);

		try {
			const userSearchResult = await query(
				`
                SELECT
                    u.email,
                    u.firstname,
                    u.lastname,
                    u.telephone,
                    u.username
                FROM "user" u
                WHERE u.id = $1 
            `,
				[userId]
			);
			if (userSearchResult.rows.length === 0) return res.status(401).json({ error: "Couldn't find user" });
			const user = userSearchResult.rows[0];

			return res.status(200).json({ user });
		} catch (error) {
			return res.status(500).json({ error: "Internal server error" });
		}
	} catch {
		res.status(401).json({ error: "Invalid token", token });
	}
});

router.patch("/self/update", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(400).json({ error: "Missing token" });
	const { user } = req.body;
	if (!user) return res.status(400).json({ error: "Missing user" });

	let userId;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		userId = decoded.userId;
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
	try {
		await query(
			`
            UPDATE "user"
            SET email = $1,
                firstname = $2,
                lastname = $3,
                telephone = $4,
                username = $5
            WHERE id = $6
            RETURNING *;
        `,
			[user.email, user.firstname, user.lastname, user.telephone, user.username, userId]
		);
		return res.status(200).json({ message: "Successfully updated user" });
	} catch (error) {
		return res.status(500).json({ error: "Failed to update user" });
	}
});

module.exports = router;
