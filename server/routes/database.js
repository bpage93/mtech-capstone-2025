const express = require("express");
const { pool, query } = require("../database/postgresQuery");

const router = express.Router();

router.patch("/update", async (req, res) => {
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

	let { primaryKey, table, field, value } = req.body;

	if (!value) return res.status(400).json({ error: "Must be a value" });
	if (field === "id") return res.status(403).json({ error: "access denied" });
	if (table === "user") table = '"user"';

	try {
		const updateResult = await query(
			`
            UPDATE ${table}
            SET ${field} = $1
            WHERE id = $2
            RETURNING *;
        `,
			[value, primaryKey]
		);
		const updated = updateResult.rowCount !== 0;
		if (!updated) return res.status(500).json({ error: "could not update" });
		res.status(200).json({ table, field, value, primaryKey });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put("/create/enrollment", async (req, res) => {
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

	const { primaryKey, table, field, value, user_id } = req.body;

	if (table !== "enrollment") return res.status(400).json({ error: "table must be enrollment" });
	if (!value) return res.status(400).json({ error: "must be a value" });
	if (!user_id) return res.status(400).json({ error: "missing user_id" });

	try {
		const creationResult = await query(
			`
            INSERT INTO enrollment (user_id, course_id) VALUES
            ($1, $2)    
        `,
			[user_id, value]
		);
		if (creationResult.rowCount === 0) return res.status(500).json({ error: "failed to create" });
		return res.status(200).json({ message: "successfully created" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

router.delete("/delete/enrollment", async (req, res) => {
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

	const primary_key = req.body.primary_key;
	if (!primary_key) return res.status(400).json({ error: "missing primary_key" });

	try {
		const deletionResult = await query(
			`
            DELETE FROM enrollment
            WHERE id = $1
        `,
			[primary_key]
		);

		if (deletionResult.rowCount === 0) return res.status(500).json({ error: "failed to delete" });
		return res.status(200).json({ message: "successfully deleted row" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
