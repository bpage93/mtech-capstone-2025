const express = require("express");
const { pool, query } = require("../database/postgresQuery");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.put("/enroll", async (req, res) => {
	const { course_id } = req.body;
	const token = req.headers.authorization?.split(" ")[1];
	const userIsStudentResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/student`, {
		headers: {
			authorization: `Bearer ${token}`,
		},
	});
	if (!userIsStudentResponse.ok) return res.status(403).json({ error: "User is not a student" });
	const { userId } = jwt.decode(token);

	const enrollmentResult = await query(
		`
        INSERT INTO enrollment (user_id, course_id) VALUES
        ($1, $2)
        RETURNING *   
    `,
		[userId, course_id]
	);

	if (enrollmentResult.rows.length === 0) return res.status(401).json({ error: "Failed to enroll" });
	return res.status(200).json({ message: "Enrollment successful" });
});

router.delete("/unenroll", async (req, res) => {
	const { course_id } = req.body;
	const token = req.headers.authorization?.split(" ")[1];
	const userIsStudentResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/student`, {
		headers: {
			authorization: `Bearer ${token}`,
		},
	});
	if (!userIsStudentResponse.ok) return res.status(403).json({ error: "User is not a student" });
	const { userId } = jwt.decode(token);

	const unenrollmentResult = await query(
		`
        DELETE FROM enrollment
        WHERE course_id = $1 AND user_id = $2
        RETURNING *
    `,
		[course_id, userId]
	);

	if (unenrollmentResult.rows.length === 0) return res.status(401).json({ error: "Failed to unenroll" });
	return res.status(200).json({ message: "Unenrollment successful" });
});

module.exports = router;
