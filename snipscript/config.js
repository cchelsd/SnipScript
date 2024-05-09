const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Import mysql2/promise for async/await support
const port = 3001;
const bcrypt = require('bcrypt');

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

// Number of salt rounds determines the strength of the hashing algorithm
const saltRounds = 10;

// Function to hash a password
const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

// Function to compare a password with its hash
const comparePassword = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

/**
 * Endpoints
 */


// ------------- Board and Lists ------------- //

app.get('/boards/:userId', async (request, response) => {
    try {
        const connection = await pool.getConnection();
        const userId = request.params.userId;
        const [rows] = await connection.query("SELECT * FROM boards WHERE user_id = ?", [userId]);
        connection.release();
        response.status(200).json(rows);
    } catch (error) {
        console.error("Error executing SQL query:", error);
        response.status(400).json({ Error: "Error in the SQL statement. Please check." });
    }
});


app.post('/boards/add', async (request, response) => {
    try {
        const connection = await pool.getConnection();
        const userId = request.body.userId;
        const boardName = request.body.boardName;
        const [result] = await connection.query("INSERT INTO boards (user_id, board_name) VALUES (?, ?)", [userId, boardName]);
        connection.release();
        if (result.affectedRows === 1) {
            response.status(201).json({ success: true, message: "Successfully added board"});
        } else {
            response.status(500).json({ success: false, message: "Failed to add board" });
        }
    } catch (error) {
        console.error("Error executing SQL query:", error);
        response.status(400).json({ Error: "Error in the SQL statement. Please check." });
    }
});

app.get('/lists/:boardId', async (request, response) => {
    try {
        const connection = await pool.getConnection();
        const boardId = request.params.boardId;
        const [result] = await connection.query(
            "SELECT L.list_name, L.id, CS.id AS snippet_id FROM Users U " +
            "JOIN Boards B ON U.id = B.user_id JOIN Lists L ON B.id = L.board_id " +
            "LEFT JOIN CodeSnippets CS ON L.id = CS.list_id WHERE B.id = ?", [boardId]);
        connection.release();
        response.status(200).json(result);
    } catch (error) {
        console.error("Error executing SQL query:", error);
        response.status(400).json({ Error: "Error in the SQL statement. Please check." });
    }
})

app.post('/snippet', async(request, response) => {
    try {
        const connection = await pool.getConnection();
        const { userId, listId, title, description, code, language} = request.body;
        const [result] = await connection.query("INSERT INTO CodeSnippets (user_id, list_id, title, snippet_description, code_content, code_language)" + 
        "VALUES (?, ?, ?, ?, ?, ?)", [userId, listId, title, description, code, language]);
        connection.release();
        if (result.affectedRows === 1) {
            response.status(201).json({ success: true, message: "Successfully added snippet"});
        } else {
            response.status(500).json({ success: false, message: "Failed to add snippet" });
        }
    } catch (error) {
        console.error("Error executing SQL query:", error);
        response.status(400).json({ Error: "Error in the SQL statement. Please check." });
    }
})

app.get('/snippet/tags/:snippetId', async(request, response) => {
    try {
        const connection = await pool.getConnection();
        const snippetId = request.params.snippetId;
        const [result] = await connection.query("SELECT tag FROM SnippetTags WHERE snippet_id = ?", [snippetId]);
        connection.release();
        const tags = result.map(row => row.tag);
        response.status(200).json({ tags });
    } catch (error) {
        console.error("Error executing SQL query:", error);
        response.status(400).json({ Error: "Error in the SQL statement. Please check." });
    }
})

app.get('/snippet/:snippetId', async(request, response) => {
    try {
        const connection = await pool.getConnection();
        const snippetId = request.params.snippetId;
        const [result] = await connection.query(
            "SELECT * FROM CodeSnippets WHERE id = ?", [snippetId]);
        connection.release();
        response.status(200).json(result);
    } catch (error) {
        console.error("Error executing SQL query:", error);
        response.status(400).json({ Error: "Error in the SQL statement. Please check." });
    }
})

app.put('/snippet/:snippetId', async(request, response) => {
    try {
        const connection = await pool.getConnection();
        const id = request.params.snippetId;
        const { title, description, code } = request.body;
        connection.query("UPDATE CodeSnippets set title = ?, snippet_description = ?, code_content = ? WHERE id = ?", [title, description, code, id]);
        connection.release();
        response.status(200).json({ message: 'Snippet updated successfully' });
    } catch (error) {
        console.error("Error updating snippet:", error);
        response.status(400).json({ Error: "Error updating the snippet. Please check." });
    }
})

app.put('/snippet/drag/:listId', async(request, response) => {
    try {
        const connection = await pool.getConnection();
        const listId = request.params.listId;
        const snippetId = request.body.snippetId;
        connection.query("UPDATE CodeSnippets set list_id = ? WHERE id = ?", [listId, snippetId]);
        connection.release();
        response.status(200).json({ message: 'Snippet updated successfully' });
    } catch (error) {
        console.error("Error updating snippet:", error);
        response.status(400).json({ Error: "Error updating the snippet. Please check." });
    }
})

// ------------- Authentication ------------- //

app.post('/login', async (request, response) => {
  const { username, password } = request.body;
  try {
      const connection = await pool.getConnection();   
      // Check if the user exists with the provided username and password
      const [rows] = await connection.query("SELECT * FROM users WHERE username = ?", [username]);
      connection.release();

      if (rows.length > 0) {
        // User found, authentication successful
        const user = rows[0];
        const hashedPassword = user.password_hash;

        // Compare the provided password with the hashed password from the database
        // const match = await comparePassword(password, hashedPassword);

        if (user) {
            // Passwords match, authentication successful
            response.status(200).json({ success: true, message: "Login successful", user });
        } else {
            // Passwords don't match, authentication failed
            response.status(401).json({ success: false, message: "Login failed. Invalid password." });
        }
      } else {
        // User not found, authentication failed
        response.status(401).json({ success: false, message: "Login failed. Invalid username." });
      }
  } catch (error) {
      console.error("Error executing SQL query:", error);
      response.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/register', async (request, response) => {
    const { username, password } = request.body;
    try {
        const connection = await pool.getConnection();   
        // Check if the user already exists
        const [existingUsers] = await connection.query("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUsers.length > 0) {
            // User already exists
            response.status(400).json({ success: false, message: "User already exists. Please choose a different username or sign in." });
            connection.release();
            return;
        }
        // Insert the new user into the database
        const hashedPassword = await hashPassword(password);
        const [result] = await connection.query("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, hashedPassword]);
        
        connection.release();

        // Extract the inserted user's id
        const userId = result.insertId;

        if (result.affectedRows === 1) {
            // User registration successful
            response.status(201).json({ success: true, message: "User registration successful", userId, username });
        } else {
            // User registration failed
            response.status(500).json({ success: false, message: "Failed to register user. Please try again later." });
        }
    } catch (error) {
        console.error("Error executing SQL query:", error);
        response.status(500).json({ success: false, message: "Internal server error" });
    }
  });

