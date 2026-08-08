// This file sets up the connection between Node.js and MySQL.
// It reads configuration from the .env file to connect to the database.

const mysql = require("mysql2");
require("dotenv").config();

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Enable SSL for production environments (e.g. TiDB Cloud)
if (process.env.DB_SSL === "true") {
    config.ssl = {
        rejectUnauthorized: true
    };
}

const pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed!");
        console.error(err.message);
        return;
    }

    console.log("Database connected successfully!");
    connection.release();
});

module.exports = pool;
