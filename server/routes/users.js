const express = require("express");
const { pool, query } = require("../database/postgresQuery");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = express.Router();

router.get("/get", async (req, res) => {
	try {
        const results = await query(`
            SELECT
                usr.role,
                usr.email,
                usr.firstname,
                usr.lastname,
                usr.telephone,
                usr.username,
                address.street,
                address.city,
                address.state,
                address.zip
            FROM "user" usr JOIN address ON usr.id = address.user_id;
        `);
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
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        const userResult = await client.query(`
            INSERT INTO "user" (role, email, firstname, lastname, telephone, username, password) VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `, ["student", user.email, user.firstname, user.lastname, user.telephone, user.username, hashedPassword]);

        const userId = userResult.rows[0].id;

        await client.query(`
            INSERT INTO address (user_id, street, city, state, zip) VALUES
            ($1, $2, $3, $4, $5)
        `, [userId, user.street, user.city, user.state, user.zip]);

        await client.query("COMMIT");

		res.status(200).json(user);
    } catch (error) {
        await client.query('ROLLBACK');
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


module.exports = router;