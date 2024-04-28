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
  password_hash VARCHAR(50) NOT NULL,
  UNIQUE (username),
  CONSTRAINT CHK_USERNAME_FORMAT CHECK (username REGEXP '^[A-Za-z0-9_]*$'),  -- username only contains letters (uppercase and lowercase), numbers, and underscores
  CONSTRAINT CHK_PASSWORD_LENGTH CHECK (LENGTH(password_hash) >= 8) -- password is at least 8 characters long
);

-- Table_BOARDS: Store data about Boards
CREATE TABLE BOARDS 
(
  id INT PRIMARY KEY AUTO_INCREMENT, 
  user_id INT NOT NULL, 
  board_name VARCHAR(255) NOT NULL, 
  color VARCHAR(255) DEFAULT "#FFFFFF", -- default color white
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE,
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
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (board_id) REFERENCES BOARDS(id) ON DELETE CASCADE ON UPDATE CASCADE,
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
  code_content VARCHAR(1000) NOT NULL, 
  date_posted DATETIME DEFAULT CURRENT_TIMESTAMP, -- default time is current time
  rating INT DEFAULT 0, -- default rating is 0
  privacy TINYINT DEFAULT 1, -- default privacy set to private
  numOfViews INT DEFAULT 0,
  numOfCopies INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (list_id) REFERENCES LISTS(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table_SNIPPETTAGS: Store tags for each Code Snippet
CREATE TABLE SNIPPETTAGS
(
  snippet_id INT NOT NULL AUTO_INCREMENT, 
  tag VARCHAR(30) NOT NULL,
  PRIMARY KEY (snippet_id, tag), 
  FOREIGN KEY (snippet_id) REFERENCES CODESNIPPETS(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table_TRENDINGSNIPPETS: Store data about Trending Code Snippets 
CREATE TABLE TRENDINGSNIPPETS
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    snippet_id INT NOT NULL,
    FOREIGN KEY (snippet_id) REFERENCES CODESNIPPETS(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table_BOOKMAKRS: Store data about BOOKMARKED SNIPPETS
CREATE TABLE BOOKMARKS
(
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    snippet_id INT NOT NULL,
    FOREIGN KEY (snippet_id) REFERENCES CODESNIPPETS(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ***************************
-- Part B
-- ***************************

-- Sample data for Table_USERS
-- Summary: store data about USERS (username, password)
INSERT INTO USERS (username, password_hash) VALUES
('john_doe', 'password_hash_1'),
('jane_smith', 'password_hash_2'),
('alice_green', 'password_hash_3'),
('bob_jones', 'password_hash_4'),
('sarah_white', 'password_hash_5'),
('mike_brown', 'password_hash_6'),
('emily_davis', 'password_hash_7'),
('david_miller', 'password_hash_8'),
('lisa_wilson', 'password_hash_9'),
('kevin_adams', 'password_hash_10');

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
-- Summary: store data about CODESNIPPETS (user id, list id, title, description, content, date posted, rating, privacy)
INSERT INTO CODESNIPPETS (user_id, list_id, title, snippet_description, code_content, date_posted, rating, privacy, numOfViews, numOfCopies) VALUES
(1, 1, 'Java Basics', 'Introduction to Java programming language', 'public class HelloWorld { public static void main(String[] args) { System.out.println("Hello, World!"); } }', 1, 10, 1, 0, 0),
(2, 2, 'Bubble Sort', 'Implementation of Bubble Sort algorithm in Java', 'public class BubbleSort { public static void bubbleSort(int[] arr) { int n = arr.length; for (int i = 0; i < n-1; i++) { for (int j = 0; j < n-i-1; j++) { if (arr[j] > arr[j+1]) { int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp; } } } } }', DEFAULT, 8, 0, 100, 10),
(3, 3, 'HTML Basics', 'Introduction to HTML', '<!DOCTYPE html><html><head><title>Page Title</title></head><body><h1>This is a Heading</h1><p>This is a paragraph.</p></body></html>', DEFAULT, 6, DEFAULT, 0, 0),
(4, 4, 'CSS Styling', 'Basic CSS styling', 'body { background-color: lightblue; } h1 { color: navy; margin-left: 20px; }', DEFAULT, 7, 1, 0, 0),
(2, 6, 'Python Functions', 'Example of defining and calling functions in Python', 'def greet(name): print("Hello, " + name)greet("Alice")greet("Bob")', DEFAULT, 9, 0, 50, 2),
(2, 6, 'Python Classes', 'Introduction to classes in Python', 'class Person: def __init__(self, name, age): self.name = name self.age = age def greet(self): print("Hello, my name is " + self.name) def celebrate_birthday(self): self.age += 1', DEFAULT, 10, 0, 10, 0),
(7, 7, 'JavaScript Countdown', 'Simple Countdown Timer in JavaScript', 'function startCountdown(seconds) { let counter = seconds; const interval = setInterval(() => { console.log(counter); counter--; if (counter < 0) { clearInterval(interval); console.log("Countdown finished!"); } }, 1000); } startCountdown(10);', DEFAULT, 9, 1, 0, 0),
(8, 8, 'PHP Array Operations', 'Using array functions in PHP', '$arr = [1, 2, 3, 4, 5]; $sum = array_sum($arr); $reversed = array_reverse($arr); print_r($sum); print_r($reversed);', DEFAULT, 8, DEFAULT, 0, 0),
(9, 9, 'Swift Basic Networking', 'Fetching data using URLSession in Swift', 'import Foundation let url = URL(string: "https://api.example.com/data")! let task = URLSession.shared.dataTask(with: url) { (data, response, error) in guard let data = data, error == nil else { return } print(String(data: data, encoding: .utf8)!) } task.resume()', DEFAULT, 10, 0, 20, 1),
(10, 11, 'Go Concurrency', 'Basic concurrency with Goroutines in Go', 'package main import "fmt" func printCount(c chan int) { num := 0 for num >= 0 { num = <-c fmt.Println(num) } } func main() { c := make(chan int) go printCount(c) for i := 0; i < 10; i++ { c <- i } close(c) }', DEFAULT, 9, DEFAULT, 0, 0);

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
(6, 1),
(6, 9),
(7, 9),
(8, 10),
(8, 10),
(9, 10),
(10, 8);

-- ***************************
-- Part C
-- ***************************

-- 1. Computes a join of at least three tables - Join Board, List, Snippets - Search for User by ID 

SELECT 
    U.username,
    B.board_name,
    L.list_name,
    CS.title AS snippet_title,
    CS.snippet_description
FROM USERS U
JOIN BOARDS B ON U.id = B.user_id
JOIN LISTS L ON B.id = L.board_id
JOIN CODESNIPPETS CS ON L.id = CS.list_id
WHERE U.id = 1;  

-- 2. Uses nested queries with the IN, ANY or ALL operator and uses a GROUP BY clause - Search Function - Search for own code snippets by title 

SELECT 
    CS.title,
    CS.code_content
FROM CODESNIPPETS CS
WHERE CS.user_id = 1 AND
      CS.title LIKE '%Java%' AND
      CS.title IN (
          SELECT title 
          FROM CODESNIPPETS 
          WHERE user_id = 1 AND title LIKE '%Java%'
      )
GROUP BY CS.title;

-- 3. A correlated nested query with proper aliasing applied - Filter Function - Filter to find the latest upload to a board

SELECT
    board_name,
    list_name,
    snippet_title,
    snippet_description,
    date_posted
FROM (
    SELECT
        B.board_name,
        L.list_name,
        CS.title AS snippet_title,
        CS.snippet_description,
        CS.date_posted,
        ROW_NUMBER() OVER (PARTITION BY B.id ORDER BY CS.date_posted DESC) AS rn
    FROM BOARDS B
    JOIN LISTS L ON B.id = L.board_id
    JOIN CODESNIPPETS CS ON L.id = CS.list_id
    WHERE B.id = 1
) AS subquery
WHERE rn = 1;


-- 4. Full Outer Join - Gets snippet count across all users regardless of 

SELECT B.id,
COUNT(C.snippet_id) AS num_snippets
FROM BOARDS B
LEFT JOIN LISTS L ON B.id = L.board_id
LEFT JOIN CODESNIPPETS C ON L.id = C.list_id
GROUP BY B.id

UNION

SELECT B.id,
COUNT(C.snippet_id) AS num_snippets
FROM LISTS L
RIGHT JOIN BOARDS B ON B.id = L.board_id
LEFT JOIN CODESNIPPETS C ON L.id = C.list_id
WHERE B.id IS NULL
GROUP BY B.id


-- 5. Nested queries with Set Operation - 