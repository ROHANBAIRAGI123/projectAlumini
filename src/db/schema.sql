-- User Info
CREATE TABLE User_Info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    graduationYear INT NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    role ENUM('student','alumni','admin') DEFAULT 'student',
    achievement TEXT
);

-- User Misclannous Info
CREATE TABLE User_Misc (
    id INT PRIMARY KEY AUTO_INCREMENT,
    branch VARCHAR(50),
    achievement TEXT,
    avatar VARCHAR(255),
    coverImage VARCHAR(255),
    hideContact BOOLEAN,
    RefreshToken VARCHAR(255),
    FOREIGN KEY (id) REFERENCES User_Info(id) ON DELETE CASCADE
);


-- Employment Details
CREATE TABLE Emp_Details (
    id INT PRIMARY KEY,
    joinDate DATE,
    workplace VARCHAR(100),
    jobTitle VARCHAR(100),
    location VARCHAR(100),
    country VARCHAR(50),
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE
);

-- Contributions
CREATE TABLE Contribution (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE,
    donation DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE SET NULL
);

-- Questions
CREATE TABLE Question (
    questionID INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    topic VARCHAR(100),
    question TEXT,
    timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    isAnswered BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Answers
CREATE TABLE Answer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    AnswerID INT UNIQUE,
    answer TEXT,
    questionID INT,
    FOREIGN KEY (questionID) REFERENCES Question(questionID) ON DELETE CASCADE
);