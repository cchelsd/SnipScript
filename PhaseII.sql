/* ********************************
  Project Phase II
  Group 12 (MySQL)
  This SQL Script was tested on
  MySQL. To run, simply load
  this script file and run.
********************************
*/

-- ***************************
-- Part A
-- ***************************

-- Table_USERS: Store data about Users
CREATE TABLE USERS 
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  UNIQUE (username),
  CONSTRAINT CHK_USERNAME_FORMAT CHECK (username REGEXP '^[A-Za-z0-9_]*$')  -- username only contains letters (uppercase and lowercase), numbers, and underscores
);

-- Table_BOARDS: Store data about Boards
CREATE TABLE BOARDS 
(
  id INT PRIMARY KEY AUTO_INCREMENT, 
  user_id INT NOT NULL,
  board_name VARCHAR(255) NOT NULL, 
  color VARCHAR(255) DEFAULT "#FFFFFF", -- default color white
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
  UNIQUE(user_id, board_name), -- Unique board names for each user
  CONSTRAINT CHK_COLOR_HEX CHECK (color REGEXP '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'), -- color is valid hexadecimal value
  CONSTRAINT CHK_NO_LEADING_TRAILING_SPACES CHECK (board_name NOT REGEXP '^ | $') --  board name has no leading or trailing spaces
); 

-- Table_LISTS: Store data about Lists
CREATE TABLE LISTS
(
    id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    board_id INT NOT NULL,
    list_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
    FOREIGN KEY (board_id) REFERENCES BOARDS(id) ON DELETE CASCADE,
    UNIQUE(user_id, list_name) -- Unique list names for each user
);

-- Table_CODESNIPPETS: Store data about Code Snippets
CREATE TABLE CODESNIPPETS
(
  id INT PRIMARY KEY AUTO_INCREMENT, 
  user_id INT NOT NULL, 
  list_id INT NOT NULL,
  title VARCHAR(255) NOT NULL, 
  snippet_description VARCHAR(550), 
  code_content TEXT NOT NULL, 
  code_language VARCHAR(50) NOT NULL,
  date_posted DATETIME DEFAULT CURRENT_TIMESTAMP, -- default time is current time
  rating INT DEFAULT 0, -- default rating is 0
  privacy TINYINT DEFAULT 1, -- default privacy set to private
  numOfViews INT DEFAULT 0, -- default views 0
  numOfCopies INT DEFAULT 0, -- default copies 0
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
  FOREIGN KEY (list_id) REFERENCES LISTS(id) ON DELETE CASCADE,
  CONSTRAINT CHK_LANGUAGE CHECK (code_language NOT REGEXP '^ | $') -- language has no leading or trailing spaces
);

-- Table_SNIPPETTAGS: Store tags for each Code Snippet
CREATE TABLE SNIPPETTAGS
(
  snippet_id INT NOT NULL AUTO_INCREMENT, 
  tag VARCHAR(30) NOT NULL,
  PRIMARY KEY (snippet_id, tag), 
  FOREIGN KEY (snippet_id) REFERENCES CODESNIPPETS(id) ON DELETE CASCADE,
  CONSTRAINT CHK_ONE_WORD CHECK (tag NOT LIKE '% %') -- Ensures each tag only contains one word
);

-- Table_TRENDINGSNIPPETS: Store data about Trending Code Snippets 
CREATE TABLE TRENDINGSNIPPETS
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    snippet_id INT NOT NULL,
    FOREIGN KEY (snippet_id) REFERENCES CODESNIPPETS(id) ON DELETE CASCADE
);

-- Table_BOOKMARKS: Store data about BOOKMARKED SNIPPETS
CREATE TABLE BOOKMARKS
(
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    snippet_id INT NOT NULL,
    FOREIGN KEY (snippet_id) REFERENCES CODESNIPPETS(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- ***************************
-- Part B
-- ***************************

-- Sample data for Table_USERS
-- Summary: store data about USERS (username, password)
INSERT INTO USERS (username, password_hash) VALUES
('john_doe', '$2a$04$t1sQd.J8bKvkwq96BV9dY.Wvg6WKxeJXN9553lg3FKmb7FJxO2OTe'),
('jane_smith', '$2a$04$qj1hlmFkyj8SE5awSOu4BuOROhxpcSczyDHTVmBqBJOdnZzvlbDPO'),
('alice_green', '$2a$04$SwiMJnTpDbsrqVLBTHI56e3hZJOe79zmJnjbUCsAFj9POmg9H/1KK'),
('bob_jones', '$2a$04$Sa/XlR5PNaWqSXwqjjoB0.mRohcU5wT5zn9iAIF6YUPEdm.8xdWt6'),
('sarah_white', '$2a$04$npEVNr7RNqVcP/dV/AxC7e0SOBb0Yco60HIaGFeen9udFuTVjexJ2'),
('mike_brown', '$2a$04$AQVUUs1sp8QOyMbw9ssiAeuFOnw0LZX3/tikLQayS152.1SK8Fcje'),
('emily_davis', '$2a$04$x/46XZCt.h/4v5LuKV4tPOvfMd7YrTEEr4z4q8uqgt4wMgpSAHrHC'),
('david_miller', '$2a$04$XaUFLs/RmNceh/aqqys0buEUlP20wiYeBveEtS2ODgc9a1WLzV41S'),
('lisa_wilson', '$2a$04$q3y24td4M.cdeXaiR5B39ugqJfUH/mmyw69x3dQ/8rtwPbrwAhbFa'),
('kevin_adams', '$2a$04$0L95X1Ja88wihxzAHbrN4OpQ8iU9Rg86AHJY0bLM0RhRhgDTmRl4e');

-- Sample data for Table_BOARDS (place to organize snippets into lists)
-- Summary: store data about BOARDS (user id, name, color,)
INSERT INTO BOARDS (user_id, board_name, color) VALUES
(1, 'Java Programming', '#0000FF'),
(2, 'Python', '#008000'),
(3, 'Web Development', DEFAULT),
(4, 'Web Development', DEFAULT),
(4, 'Algorithms', DEFAULT),
(5, 'Database Management', '#FFC0CB'),
(6, 'Machine Learning', '#FFA500'),
(7, 'JavaScript Development', '#FF0000'),
(8, 'PHP Development', '#A52A2A'),
(9, 'Swift Programming', '#808080'),
(10, 'Go Programming', '#008080');

-- Sample data for Table_LISTS (sections in a board to organize the snippets)
-- Summary: store data about LISTS (user id, board id, name)
INSERT INTO LISTS (user_id, board_id, list_name) VALUES
(1, 1, 'Basics'),
(2, 2, 'Data Structures'),
(3, 3, 'HTML/CSS'),
(4, 4, 'HTML/CSS'),
(4, 4, 'Sorting Algorithms'),
(2, 2, 'Basics'),
(6, 6, 'Regression Models'),
(7, 7, 'DOM Manipulation'),
(8, 8, 'Backend Development'),
(9, 9, 'iOS App Development'),
(10, 10, 'Concurrency');

-- Sample data for Table_CODESNIPPETS 
-- Summary: store data about CODESNIPPETS (user id, list id, title, description, content, date posted, rating, privacy, numOfViews, numOfCopies)
INSERT INTO CODESNIPPETS (user_id, list_id, title, snippet_description, code_content, code_language, date_posted, rating, privacy, numOfViews, numOfCopies) VALUES
(1, 1, 'Java Basics', 'Introduction to Java programming language', 'public class HelloWorld { public static void main(String[] args) { System.out.println("Hello, World!"); } }', 'Java', DEFAULT, 10, 0, 0, 0),
(2, 2, 'Bubble Sort', 'Implementation of Bubble Sort algorithm in Java', 'public class BubbleSort { public static void bubbleSort(int[] arr) { int n = arr.length; for (int i = 0; i < n-1; i++) { for (int j = 0; j < n-i-1; j++) { if (arr[j] > arr[j+1]) { int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp; } } } } }', 'Java', DEFAULT, 8, 0, 100, 10),
(3, 3, 'HTML Basics', 'Introduction to HTML', '<!DOCTYPE html><html><head><title>Page Title</title></head><body><h1>This is a Heading</h1><p>This is a paragraph.</p></body></html>', 'HTML', DEFAULT, 6, DEFAULT, 0, 0),
(4, 4, 'CSS Styling', 'Basic CSS styling', 'body { background-color: lightblue; } h1 { color: navy; margin-left: 20px; }', 'CSS', DEFAULT, 7, 1, 0, 0),
(4, 4, 'Responsive Web Design', 'Responsive web design using CSS media queries', '@media only screen and (max-width: 600px) { body { background-color: lightblue; }}', 'CSS', DEFAULT, 5, 1, 120, 15),
(2, 6, 'Python Functions', 'Example of defining and calling functions in Python', 'def greet(name): print("Hello, " + name)greet("Alice")greet("Bob")', 'Python', DEFAULT, 9, 0, 50, 2),
(2, 6, 'Python Classes', 'Introduction to classes in Python', 'class Person: def __init__(self, name, age): self.name = name self.age = age def greet(self): print("Hello, my name is " + self.name) def celebrate_birthday(self): self.age += 1', 'Python', DEFAULT, 10, 0, 10, 0),
(7, 7, 'JavaScript Countdown', 'Simple Countdown Timer in JavaScript', 'function startCountdown(seconds) { let counter = seconds; const interval = setInterval(() => { console.log(counter); counter--; if (counter < 0) { clearInterval(interval); console.log("Countdown finished!"); } }, 1000); } startCountdown(10);', 'JavaScript', DEFAULT, 9, 1, 0, 0),
(8, 8, 'PHP Array Operations', 'Using array functions in PHP', '$arr = [1, 2, 3, 4, 5]; $sum = array_sum($arr); $reversed = array_reverse($arr); print_r($sum); print_r($reversed);', 'PHP', DEFAULT, 8, DEFAULT, 0, 0),
(9, 9, 'Swift Basic Networking', 'Fetching data using URLSession in Swift', 'import Foundation let url = URL(string: "https://api.example.com/data")! let task = URLSession.shared.dataTask(with: url) { (data, response, error) in guard let data = data, error == nil else { return } print(String(data: data, encoding: .utf8)!) } task.resume()', 'Swift', DEFAULT, 10, 0, 20, 1),
(10, 11, 'Go Concurrency', 'Basic concurrency with Goroutines in Go', 'package main import "fmt" func printCount(c chan int) { num := 0 for num >= 0 { num = <-c fmt.Println(num) } } func main() { c := make(chan int) go printCount(c) for i := 0; i < 10; i++ { c <- i } close(c) }', 'Go', DEFAULT, 9, DEFAULT, 0, 0);

-- Sample data for Table_SNIPPETTAGS 
-- Summary: store data about SNIPPETTAGS (Tags associated to a code snippet)
INSERT INTO SNIPPETTAGS (snippet_id, tag) VALUES
(1, 'Java'),
(2, 'Java'),
(2, 'Useful'),
(3, 'HTML'),
(4, 'CSS'),
(5, 'Python'),
(6, 'Python'),
(7, 'JavaScript'),
(8, 'PHP'),
(9, 'Swift'),
(10, 'Go'),
(10, 'Concurrency');

-- Sample data for Table_TRENDINGSNIPPETS
-- Summary: store data about TRENDING SNIPPETS (snippet id)
INSERT INTO TRENDINGSNIPPETS (snippet_id) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);

INSERT INTO BOOKMARKS (user_id, snippet_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 4),
(3, 1),
(3, 8),
(4, 8),
(4, 1),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(5, 11),
(6, 2),
(6, 9),
(7, 9),
(8, 10),
(8, 10),
(9, 10),
(10, 8);

-- ***************************
-- Part C
-- ***************************

-- Query 1: Retrieve the top 5 most popular snippets within a user's board based on the number of upvotes they've received.
-- Query 2: Retrieve most popular tags among all public code snippets. This can help users discover trending topics on the explore page.
-- Query 3: Retrieve top contributors based on the number of public snippets they've posted. 
-- Query 4: Search for code snippets based on title, description, and tags for the explore page (searches all user's public snippets).
-- Query 5: Search for code snippets across both a user's own snippets and their bookmarked snippets.
-- Query 6: Retrieve all the boards of a user and the number of snippets in each board. 
-- Query 7: Retrieve the 5 most recent code snippets added by the user across all of their boards.
-- Query 8: Retrieve a user's top 5 most popular snippets based on the collective stats of views, copies, and bookmarks.
-- Query 9: Retrieve all public code snippets along with their tags and the username of the snippet owner.
-- Query 10: Retrieve data about the lists and code snippets within a single board belonging to the current user.

-- Query 1
-- PURPOSE: Retrieves the top 5 most popular snippets within a user's board based on the number of upvotes they've received.
-- EXPECTED: A table containing the snippet ID and the number of upvotes (rating) of the top 5 most popular snippets, 
-- ordered by the number of upvotes in descending order.
-- NOTE: Board id will be dynamically set based on user interacrtion. For testing purposes, we'll set board id to 2.
SELECT CS.id AS Snippet_ID, CS.rating AS Upvotes
FROM BOARDS B
JOIN LISTS L ON B.id = L.board_id
JOIN CODESNIPPETS CS ON L.id = CS.list_id
WHERE B.id = 2
ORDER BY Upvotes DESC
LIMIT 5;

-- Query 2
-- PURPOSE: Retrieve most popular tags among all public code snippets. This can help users discover trending topics on the explore page.
-- EXPECTED: A table containing the top 10 tags and the count of occurrences (tag_count), ordered by the count in descending order.
SELECT tag, COUNT(*) AS tag_count
FROM SNIPPETTAGS
WHERE 
    snippet_id IN (
        SELECT id
        FROM CODESNIPPETS
        WHERE privacy = 0
    )
GROUP BY tag
ORDER BY tag_count DESC
LIMIT 10;

-- Query 3 
-- PURPOSE: Retrieve top contributors based on the number of public snippets they've posted. This will be helpful for users to discover snippets by top users.
-- EXPECTED: A table containing the top 8 contributor's usernames and the total count of public snippets they've posted, 
-- ordered by the total count in descending order.
SELECT u.username AS author,
    (
        SELECT COUNT(*) 
        FROM CODESNIPPETS c 
        WHERE c.user_id = u.id AND c.privacy = 0
    ) AS Total_Public_Snippets
FROM 
    USERS u
ORDER BY 
    Total_Public_Snippets DESC
LIMIT 8;

-- Query 4 
-- PURPOSE: Search for code snippets based on title, description, and tags for the explore page (searches all user's public snippets).
-- EXPECTED: A table including the distinct snippet ID, title, and snippet description of public snippets matching the search criteria.
-- NOTE: Keywords will be dynamically set based on user input.
-- NOTE: MySQL does not natively support FULL OUTER JOIN; we can emulate it by using LEFT JOIN, RIGHT JOIN, and UNION.
SELECT DISTINCT CS.id, CS.title, CS.snippet_description
FROM CODESNIPPETS CS
LEFT JOIN SNIPPETTAGS ST ON CS.id = ST.snippet_id
WHERE privacy = 0  AND (CS.title LIKE '%Python%' OR CS.snippet_description LIKE '%introduction%')

UNION DISTINCT

SELECT DISTINCT CS.id, CS.title, CS.snippet_description
FROM CODESNIPPETS CS
RIGHT JOIN SNIPPETTAGS ST ON CS.id = ST.snippet_id
WHERE privacy = 0 AND ST.tag = 'useful';

-- Query 5 
-- PURPOSE: Search for code snippets across both a user's own snippets and their bookmarked snippets
-- EXPECTED: A table including the snippet ID, title, and snippet description of snippets matching the search criteria, 
-- limited to snippets either owned by the user or bookmarked by them.
-- NOTE: Keyword and User ID will be dynamically set based on current user and interaction. For now, we'll test with user 2 and keyword 'java'.
SELECT id, title, snippet_description
FROM (
    SELECT id, title, snippet_description, user_id
    FROM CODESNIPPETS
    WHERE user_id = 2
    UNION
    SELECT CS.id, CS.title, CS.snippet_description, CS.user_id
    FROM CODESNIPPETS CS
    JOIN BOOKMARKS B ON CS.id = B.snippet_id
    WHERE B.user_id = 2
) AS combined_results
WHERE title LIKE '%java%' OR snippet_description LIKE '%java%';

-- Query 6
-- PURPOSE: Retrieves all the boards of a user and the number of snippets in each board. 
-- EXPECTED: A table including info about all of a user's boards, including the board ID and the count of snippets in each board.
-- NOTE: User will be dynamically set based on current user. For now, we'll test with user 1.
SELECT b.id AS "Board ID", COUNT(CS.id) AS "Number of Snippets"
FROM USERS U
JOIN BOARDS B ON U.id = B.user_id
LEFT JOIN LISTS L ON B.id = L.board_id
LEFT JOIN CODESNIPPETS CS ON L.id = CS.list_id
WHERE U.id = 4
GROUP BY B.id;

-- Query 7
-- PURPOSE: Retrieve the 10 most recent code snippets added by the user across all of their boards.
-- EXPECTED: A table including the snippet ID and the date posted of a user's most recent snippets, ordered by the date posted in descending order.
-- NOTE: User will be dynamically set based on current user. For now, we'll test with user 2.
SELECT CS.id, CS.date_posted
FROM CODESNIPPETS CS
JOIN USERS U ON U.id = CS.user_id
WHERE CS.user_id = 2
ORDER BY CS.date_posted DESC
LIMIT 10;

-- Query 8 
-- PURPOSE: Retrieves a user's top 5 most popular snippets based on the collective stats of views, copies, and bookmarks.
-- EXPECTED: A table including the stats of a user's top 5 most popular snippets, including views, copies, bookmarks, 
-- ordered by total stats in descending order.
-- NOTE: User will be dynamically set based on current user. For now, we'll test with user 2.
SELECT 
    cs.id, 
    cs.numOfViews, 
    cs.numOfCopies, 
    COALESCE(b.Total_Bookmarks, 0) AS Total_Bookmarks, 
    cs.numOfViews + cs.numOfCopies + COALESCE(b.Total_Bookmarks, 0) AS Total_Stats
FROM CODESNIPPETS cs
LEFT JOIN (
    SELECT snippet_id, COUNT(*) AS Total_Bookmarks
    FROM Bookmarks
    GROUP BY snippet_id
) b ON cs.id = b.snippet_id
WHERE cs.user_id = 2 AND cs.privacy = 0 
ORDER BY Total_Stats DESC
LIMIT 5;

-- Query 9 
-- PURPOSE: Retrieve all public code snippets along with their tags and the username of the snippet owner. Will be used for the explore page.
-- EXPECTED: A table including all public code snippets, including the snippet id, the username of the owner, and associated tags concatenated into a single string.
SELECT CS.id, U.username, GROUP_CONCAT(ST.tag) AS tags
FROM CODESNIPPETS CS
JOIN USERS U ON CS.user_id = U.id
JOIN SNIPPETTAGS ST ON CS.id = ST.snippet_id
WHERE CS.privacy = 0
GROUP BY CS.id;

-- Query 10 
-- PURPOSE: Retrieve data about the lists and code snippets within a single board belonging to the current user.
-- EXPECTED: A table including all of the list ID's and the code snippet ID's within a specified board belonging to the user.
-- NOTE: Board id will be dynamically set based on current user and interaction with app. For now we'll test with board id of '4'.
SELECT L.id AS "List ID", CS.id AS "Code Snippet ID"
FROM Users U
JOIN Boards B ON U.id = B.user_id
JOIN Lists L ON B.id = L.board_id
LEFT JOIN CodeSnippets CS ON L.id = CS.list_id
WHERE B.id = 4;

-- Query 11
-- PURPOSE: Retrieve data about the number of views each code snippet has within a single board belonging to any user. 
-- EXPECTED: A table including the title, language the snippet is in, and the user within a specific board. 
SELECT 
    CS.title, 
    CS.code_language, 
    U.username AS posted_by_user
FROM 
    CODESNIPPETS CS
JOIN 
    USERS U ON CS.user_id = U.id
JOIN 
    LISTS L ON CS.list_id = L.id
WHERE 
    CS.numOfViews > 5
ORDER BY 
    CS.date_posted DESC
LIMIT 5;
