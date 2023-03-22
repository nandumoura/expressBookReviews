const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn > 10 || isbn < 1) {
    return res.status(404).json({ message: "Livro não encontrado" });
  } else {
    return res.status(200).json(books[isbn]);
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;

  if (author !== "" || author !== undefined) {
    const book = Object.values(books).filter((book) => book.author == author);
    if (book.length == 0) {
      return res
        .status(404)
        .json({ message: "Author não possui livros cadastrados" });
    } else {
      return res.status(200).json(book);
    }
  } else {
    return res.status(404).json({ message: "Author não encontrado" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  if (title !== "" || title !== undefined) {
    const book = Object.values(books).filter((book) => book.title == title);
    if (book.length == 0) {
      return res.status(404).json({ message: "Titulo não  cadastrado" });
    } else {
      return res.status(200).json(book);
    }
  } else {
    return res.status(404).json({ message: "Titulo não encontrado" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const reviews = books[req.params.isbn].reviews;

  return res.status(200).json(reviews);
});

module.exports.general = public_users;
