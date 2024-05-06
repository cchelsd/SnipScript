const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Import mysql2/promise for async/await support
const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());

const mysqlConfig = {
    host: "localhost", 
    port: 3307,
    user: "developer", 
    password: "devpass3",
    database: "SnipScript"
};

const pool = mysql.createPool(mysqlConfig);

app.listen(port, () => {
    console.log(`Express server is running and listening on port ${port}`);
});

app.get('/boards', async (request, response) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM boards");
        connection.release();
        response.status(200).json(rows);
    } catch (error) {
        console.error("Error executing SQL query:", error);
        response.status(400).json({ Error: "Error in the SQL statement. Please check." });
    }
});

