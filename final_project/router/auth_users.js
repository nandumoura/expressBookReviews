const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(201).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.session.authorization.username;
  // checks if the user already has a review on the book
  let review = req.body.review;
  books[req.params.isbn].reviews[user] = review;
  if (!review || review == "") {
    return res.status(400).json({
      message:
        "you need send a review with the folowing format {'review': 'your text review'}",
    });
  } else {
    return res.status(201).json({ message: "review added with success" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // get the user session logged
  const user = req.session.authorization.username;
  // get reviews
  const reviews = books[req.params.isbn].reviews;
  //delete reviews of this user
  delete reviews[user];
  // send a response with the remaining reviews
  return res.status(201).json(reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
