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

	let { id, table, field, value } = req.body;

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
			[value, id]
		);
		res.status(200).json(updateResult);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/health', (req, res) => {
    res.send("Able to request!");
})

module.exports = router;
