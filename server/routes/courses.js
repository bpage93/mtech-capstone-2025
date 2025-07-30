const express = require("express");
const { pool, query } = require("../database/postgresQuery");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/view/all", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}
	const isLoggedIn = await fetch(`${process.env.BACKEND_URL}/api/auth/token?route=/canvas/courses`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!isLoggedIn.ok) {
		return res.status(403).json({ error: "access denied" });
	}

	try {
		const courses = await query(
			`
            SELECT
                c.id,
                c.title,
                c.description,
                c.schedule,
                c.classroom_number
            FROM course c;
        `
		);

		return res.status(200).json({ courses: courses.rows });
	} catch (err) {
		return res.status(500).json({ err });
	}
});

router.get("/view/enrolled", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}
	const isAdminResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/admin`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (isAdminResponse.ok) {
		return res.status(403).json({ error: "access denied" });
	}

	const userIdResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/token/user_id`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token }),
	});

	if (!userIdResponse.ok) return res.status(403).json({ error: "error" });
	const { user_id } = await userIdResponse.json();

	try {
		const enrolledCourses = await query(
			`
            SELECT
                c.id,
                c.title,
                c.description,
                c.schedule,
                c.classroom_number
            FROM course c
            INNER JOIN enrollment e ON c.id = e.course_id
            WHERE e.user_id = $1;
        `,
			[user_id]
		);

		return res.status(200).json({ enrolledCourses: enrolledCourses.rows });
	} catch (err) {
		return res.status(500).json({ err });
	}
});

router.get("/view/:id", async (req, res) => {
	const courseId = req.params.id;
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ error: "No token provided" });
	if (!courseId) return res.status(401).json({ error: "No course id provided" });

	try {
		jwt.verify(token, process.env.JWT_SECRET);

		try {
			const userEnrolledSearch = await query(
				`
                    SELECT *
                    FROM course c
                    WHERE c.id = $1;
                `,
				[courseId]
			);

			if (userEnrolledSearch.rows.length === 0) return res.status(403).json({ error: "student is not enrolled in the course" });
			return res.status(200).json({ course: userEnrolledSearch.rows[0] });
		} catch (err) {
			return res.status(500).json({ err });
		}
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
});

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

router.put("/create", async (req, res) => {
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
		const course = req.body.course;

		for (const value of Object.values(course)) {
			if (!value) {
				return res.status(400).json({ error: "missing fields" });
			}
		}

		const courseCreationResponse = await query(
			`
            INSERT INTO course (title, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost) VALUES
            ($1, $2, $3, $4, $5, $6, $7)    
        `,
			[course.title, course.description, course.schedule, course.classroom_number, course.maximum_capacity, course.credit_hours, course.tuition_cost]
		);

		if (courseCreationResponse.rowCount === 0) return res.status(500).json({ error: "failed to create" });

		return res.status(200).json({ message: "created course" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
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

	const course_id = req.body.course_id;
	if (!course_id) return res.status(400).json({ message: "missing course_id" });

	try {
		await query("DELETE FROM course WHERE id = $1", [course_id]);

		return res.status(200).json({ message: "Course deleted." });
	} catch (err) {
		return res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
