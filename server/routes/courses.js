const express = require("express");
const { pool, query } = require("../database/postgresQuery");

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
                course.id AS course_id,
                course.title AS course_title,
                course.description AS course_description,
                course.schedule AS course_schedule,
                course.classroom_number AS course_classroom_number,
                course.maximum_capacity AS course_maximum_capacity,
                course.credit_hours AS course_credit_hours,
                course.tuition_cost AS course_tuition_cost
            FROM course
            ORDER BY course.id
            LIMIT $1
            OFFSET $2;
        `,
			[coursesPerPage, offset]
        );
        const nonEditableFields = ["id"]
		const modifiedData = coursesResult.rows.map((row) => {
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
		for (const key of Object.keys(coursesResult.rows[0])) {
			const splitKey = key.split("_");
            const [table, field] = [splitKey[0], splitKey.slice(1).join("_")];
            if (field === "id") continue;
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

module.exports = router;
