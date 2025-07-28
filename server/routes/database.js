const express = require("express");
const { pool, query } = require("../database/postgresQuery");

const router = express.Router();
const tableReferenceKeys = {
	address: "user_id",
	course: "id",
	enrollment: "user_id",
	user: "id",
};

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
	const referencedKey = tableReferenceKeys[table];
	if (table === "user") table = '"user"';

	try {
		const updateResult = await query(
			`
            UPDATE ${table}
            SET ${field} = $1
            WHERE ${referencedKey} = $2
            RETURNING *;
        `,
			[value, id]
		);
		const updated = updateResult.rowCount !== 0;
		if (!updated) return res.status(500).json({ error: "could not update" });
		res.status(200).json({ table, field, value, referencedKey, id });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
