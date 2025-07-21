const express = require("express");
const { pool, query } = require("../database/postgresQuery");


const router = express.Router();

router.get("/get", async (req, res) => {
	try {
		const results = await query('SELECT * FROM "user"');
		res.status(200).json(results.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/create", async (req, res) => {
    const user = req.body.user;
    
    const client = await pool.connect();
	try {
        await client.query('BEGIN');
        const userResult = await client.query(`
            INSERT INTO "user" (role, email, firstname, lastname, telephone, username, password) VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `, ["student", user.email, user.firstname, user.lastname, user.telephone, user.username, user.password]);

        const userId = userResult.rows[0].id;

        await client.query(`
            INSERT INTO address (user_id, street, city, state, zip) VALUES
            ($1, $2, $3, $4, $5)
        `, [userId, user.street, user.city, user.state, user.zip]);

        await client.query("COMMIT");

		res.status(200).json(user);
    } catch (error) {
        if (error.code === "23505") {
            if (error.constraint === "user_email_key") {
				return res.status(409).json({
					error: "Email is already associated with an existing user",
				});
			}
        }
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});


module.exports = router;