const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Import mysql2/promise for async/await support
const port = 3001;
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const mysqlConfig = {
  host: "snipscript.cehk5rpunxzw.us-east-2.rds.amazonaws.com",
  port: 3306,
  user: "developer",
  password: "devpass3!",
  database: "snipscript",
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
    throw new Error("Error hashing password");
  }
};

// Function to compare a password with its hash
const comparePassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

/**********************************************
 *
 * Endpoints
 *
 **********************************************/

// ------------- Board and Lists ------------- //

// Query 6 of Phase III: Retrieves all the boards of a user and the number of snippets in each board.
app.get("/boards/:userId", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const userId = request.params.userId;
    const [rows] = await connection.query(
      "SELECT B.*, COUNT(CS.id) AS num_of_snippets " +
        "FROM Boards B JOIN Users U ON U.id = B.user_id LEFT JOIN Lists L ON B.id = L.board_id " +
        "LEFT JOIN CodeSnippets CS ON L.id = CS.list_id WHERE U.id = ? GROUP BY B.id ORDER BY B.board_name;",
      [userId]
    );
    connection.release();
    response.status(200).json(rows);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Creates a new board for the user.
app.post("/boards/add", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const userId = request.body.userId;
    const boardName = request.body.boardName;
    const [result] = await connection.query(
      "INSERT INTO Boards (user_id, board_name) VALUES (?, ?)",
      [userId, boardName]
    );
    connection.release();
    if (result.affectedRows === 1) {
      response
        .status(201)
        .json({ success: true, message: "Successfully added board" });
    } else {
      response
        .status(500)
        .json({ success: false, message: "Failed to add board" });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Deletes a board.
app.delete("/boards/:boardId", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const boardId = request.params.boardId;
    const [result] = await connection.query("DELETE FROM Boards WHERE id = ?", [
      boardId,
    ]);
    connection.release();
    if (result.affectedRows === 1) {
      response
        .status(201)
        .json({ success: true, message: "Successfully deleted board" });
    } else {
      response
        .status(500)
        .json({ success: false, message: "Failed to delete board" });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Query 10 of Phase III: Retrieves data about the lists and code snippets within a single board belonging to a user.
// NOTE: Modify to retrieve all columns from CodeSnippets
app.get("/lists/:boardId", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const boardId = request.params.boardId;
    const [result] = await connection.query(
      "SELECT L.list_name, L.id, CS.id AS snippet_id FROM Users U " +
        "JOIN Boards B ON U.id = B.user_id JOIN Lists L ON B.id = L.board_id " +
        "LEFT JOIN CodeSnippets CS ON L.id = CS.list_id WHERE B.id = ?",
      [boardId]
    );
    connection.release();
    response.status(200).json(result);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Creates a new list
app.post("/lists", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const { userId, boardId, listName } = request.body;
    const [result] = await connection.query(
      "INSERT INTO Lists (user_id, board_id, list_name)" + "VALUES (?, ?, ?)",
      [userId, boardId, listName]
    );
    connection.release();
    if (result.affectedRows === 1) {
      response
        .status(201)
        .json({ success: true, message: "Successfully added list" });
    } else {
      response
        .status(500)
        .json({ success: false, message: "Failed to add list" });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// ------------- CodeSnippets ------------- //

// Creates a code snippet
app.post("/snippet", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const { userId, listId, title, description, code, language, tags } =
      request.body;
    await connection.beginTransaction();
    const [result] = await connection.query(
      "INSERT INTO CodeSnippets (user_id, list_id, title, snippet_description, code_content, code_language)" +
        "VALUES (?, ?, ?, ?, ?, ?)",
      [userId, listId, title, description, code, language]
    );
    // Get the newly inserted snippet id
    const snippetId = result.insertId;
    // Insert tags into SnippetTags table
    if (tags && tags.length > 0) {
      const tagQueries = tags.map((tag) =>
        connection.query(
          "INSERT INTO SnippetTags (snippet_id, tag) VALUES (?, ?)",
          [snippetId, tag]
        )
      );
      await Promise.all(tagQueries);
    }
    await connection.commit();
    connection.release();
    if (result.affectedRows === 1) {
      response
        .status(201)
        .json({ success: true, message: "Successfully added snippet" });
    } else {
      response
        .status(500)
        .json({ success: false, message: "Failed to add snippet" });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Retrieves all tags associated with given code snippet
app.get("/snippet/tags/:snippetId", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const snippetId = request.params.snippetId;
    const [result] = await connection.query(
      "SELECT tag FROM SnippetTags WHERE snippet_id = ?",
      [snippetId]
    );
    connection.release();
    const tags = result.map((row) => row.tag);
    response.status(200).json({ tags });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Retrieves all data about a given code snippet
app.get("/snippet/:snippetId", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const snippetId = request.params.snippetId;
    const [result] = await connection.query(
      "SELECT * FROM CodeSnippets WHERE id = ?",
      [snippetId]
    );
    connection.release();
    response.status(200).json(result);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Updates data of a given code snippet
app.put("/snippet/:snippetId", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const id = request.params.snippetId;
    const { title, description, code, privacy, tags } = request.body;
    await connection.beginTransaction();
    // Update the snippet
    await connection.query(
      "UPDATE CodeSnippets SET title = ?, snippet_description = ?, code_content = ?, privacy = ? WHERE id = ?",
      [title, description, code, privacy, id]
    );
    // Delete existing tags
    await connection.query("DELETE FROM SnippetTags WHERE snippet_id = ?", [
      id,
    ]);
    // Insert new tags
    const tagQueries = tags.map((tag) =>
      connection.query(
        "INSERT INTO SnippetTags (snippet_id, tag) VALUES (?, ?)",
        [id, tag]
      )
    );
    await Promise.all(tagQueries);
    await connection.commit();
    connection.release();
    response.status(200).json({ message: "Snippet updated successfully" });
  } catch (error) {
    console.error("Error updating snippet:", error);
    response
      .status(400)
      .json({ Error: "Error updating the snippet. Please check." });
  }
});

// Updates the list a snippet is associated with (i.e. moving a code snippet to a different list).
app.put("/snippet/drag/:listId", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const listId = request.params.listId;
    const snippetId = request.body.snippetId;
    connection.query("UPDATE CodeSnippets set list_id = ? WHERE id = ?", [
      listId,
      snippetId,
    ]);
    connection.release();
    response.status(200).json({ message: "Snippet updated successfully" });
  } catch (error) {
    console.error("Error updating snippet:", error);
    response
      .status(400)
      .json({ Error: "Error updating the snippet. Please check." });
  }
});

// Query 9 of Phase III: Retrieves all public code snippets along with their tags and the username of the snippet owner.
app.get("/explore", async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `SELECT CS.*, U.username, GROUP_CONCAT(ST.tag) AS tags
        FROM CodeSnippets CS
        JOIN Users U ON CS.user_id = U.id
        JOIN SnippetTags ST ON CS.id = ST.snippet_id
        WHERE CS.privacy = 0
        GROUP BY CS.id;`
    );
    connection.release();
    response.status(200).json(result);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Query 2: Retrieve most popular tags among all public code snippets.
app.get("/popular-tags", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `SELECT ST.tag, COUNT(ST.tag) AS tag_count
             FROM CodeSnippets CS
             JOIN SnippetTags ST ON CS.id = ST.snippet_id
             WHERE CS.privacy = 0
             GROUP BY ST.tag
             ORDER BY tag_count DESC
             LIMIT 10;`
    );
    connection.release();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Query 4: Search for code snippets based on title, description, and tags for the explore page.
app.get("/search", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { query } = req.query;

    const [result] = await connection.query(
      `SELECT CS.*, U.username, GROUP_CONCAT(ST.tag) AS tags
             FROM CodeSnippets CS
             JOIN Users U ON CS.user_id = U.id
             LEFT JOIN SnippetTags ST ON CS.id = ST.snippet_id
             WHERE CS.privacy = 0
             AND (CS.title LIKE ? OR CS.snippet_description LIKE ? OR ST.tag LIKE ?)
             GROUP BY CS.id;`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    connection.release();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Query 7: Retrieve the 5 most recent code snippets added by the user across all of their boards.
app.get("/analytics/recent", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const userId = req.query.user_id;

    const [result] = await connection.query(
      `SELECT CS.id, CS.title, CS.snippet_description, CS.code_content, CS.code_language, CS.date_posted
       FROM CodeSnippets CS
       JOIN Users U ON U.id = CS.user_id
       WHERE CS.user_id = ?
       ORDER BY CS.date_posted DESC
       LIMIT 5;`,
      [userId]
    );
    connection.release();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

// Query 8: Retrieve a user's top 5 most popular snippets based on the collective stats of views, copies, and bookmarks.
app.get("/analytics/top", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const userId = req.query.user_id;

    const [result] = await connection.query(
      `SELECT cs.id, cs.title, cs.snippet_description, cs.code_content, cs.code_language, 
              cs.numOfViews, cs.numOfCopies, COALESCE(b.Total_Bookmarks, 0) AS Total_Bookmarks, 
              cs.numOfViews + cs.numOfCopies + COALESCE(b.Total_Bookmarks, 0) AS Total_Stats
       FROM CodeSnippets cs
       LEFT JOIN (
           SELECT snippet_id, COUNT(*) AS Total_Bookmarks
           FROM Bookmarks
           GROUP BY snippet_id
       ) b ON cs.id = b.snippet_id
       WHERE cs.user_id = ? AND cs.privacy = 0 
       ORDER BY Total_Stats DESC
       LIMIT 5;`,
      [userId]
    );
    connection.release();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(400)
      .json({ Error: "Error in the SQL statement. Please check." });
  }
});

/*
 * Query that will update rating, numOfViews, and numOfCopies in CodeSnippets.
 */

// ------------- Authentication ------------- //

// Login authentication
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  try {
    const connection = await pool.getConnection();
    // Check if the user exists with the provided username and password
    const [rows] = await connection.query(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    );
    connection.release();

    if (rows.length > 0) {
      // User found, authentication successful
      const user = rows[0];
      const hashedPassword = user.password_hash;

      // Compare the provided password with the hashed password from the database
      // const match = await comparePassword(password, hashedPassword);

      if (user) {
        // Passwords match, authentication successful
        response
          .status(200)
          .json({ success: true, message: "Login successful", user });
      } else {
        // Passwords don't match, authentication failed
        response
          .status(401)
          .json({ success: false, message: "Login failed. Invalid password." });
      }
    } else {
      // User not found, authentication failed
      response
        .status(401)
        .json({ success: false, message: "Login failed. Invalid username." });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Creates a new user
app.post("/register", async (request, response) => {
  const { username, password } = request.body;
  try {
    const connection = await pool.getConnection();
    // Check if the user already exists
    const [existingUsers] = await connection.query(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    );
    if (existingUsers.length > 0) {
      // User already exists
      response.status(400).json({
        success: false,
        message:
          "User already exists. Please choose a different username or sign in.",
      });
      connection.release();
      return;
    }
    // Insert the new user into the database
    const hashedPassword = await hashPassword(password);
    const [result] = await connection.query(
      "INSERT INTO Users (username, password_hash) VALUES (?, ?)",
      [username, hashedPassword]
    );

    connection.release();

    // Extract the inserted user's id
    const userId = result.insertId;

    if (result.affectedRows === 1) {
      // User registration successful
      response.status(201).json({
        success: true,
        message: "User registration successful",
        userId,
        username,
      });
    } else {
      // User registration failed
      response.status(500).json({
        success: false,
        message: "Failed to register user. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
