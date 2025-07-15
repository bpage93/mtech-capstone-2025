const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

// Required SSL configuration
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
	// ssl: false, // Set to false when working on a locally hosted database
});

module.exports = {
	query: (text, params) => {
		return pool.query(text, params);
	},
};
