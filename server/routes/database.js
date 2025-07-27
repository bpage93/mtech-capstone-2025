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

	let { table, field, value } = req.body;

	if (field === "id") return res.status(403).json({ error: "access denied" });
	if (table === "user") table = '"user"';

	try {
		const updateResult = query(
			`
            UPDATE $1
            SET email = $2
            WHERE id = $3
        `,
			[table, field, value]
		);
		res.status(200).json(updateResult);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
