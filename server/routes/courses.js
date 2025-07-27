const express = require("express");
const { pool, query } = require("../database/postgresQuery");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

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

	try {
		const coursesPerPage = 5;
		const totalCountResults = await query(`SELECT count(*) FROM course`);
		const totalCount = parseInt(totalCountResults.rows[0].count);
		const maxPage = Math.ceil(totalCount / coursesPerPage);
		const page = parseInt(req.query.page) || 1;
		const offset = coursesPerPage * (page - 1);
		const coursesResult = await query(
			`
            SELECT
                course.id,
                course.title,
                course.description,
                course.schedule,
                course.classroom_number,
                course.maximum_capacity,
                course.credit_hours,
                course.tuition_cost
            FROM course
            ORDER BY course.id
            LIMIT $1
            OFFSET $2;
        `,
			[coursesPerPage, offset]
		);
		const modifiedData = coursesResult.rows.map((row) => {
			const wrapped = {};
			for (const [key, value] of Object.entries(row)) {
				const [table, field] = key.split("_", 2);
				wrapped[field] = {
					value,
					table,
				};
			}
			return wrapped;
		});
		res.status(200).json({
			data: modifiedData,
			table: "course",
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

module.exports = router;
