const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).send("User successfully registered");
    } else {
      return res.status(404).send("User already there");
    }
  }
  return res.status(404).send("Failed to register User");
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   //Write your code here
//   return res.status(200).send(JSON.stringify(books, null, 4));
// });

function getAllBooks(){
  return JSON.stringify(books, null, 4)
}
public_users.get('/', async function(req, res){
  try {
    const allBooks = await getAllBooks()

    // If books are successfully retrieved, send them back in the response
    return res.status(200).send(allBooks);
  } catch (error){
    return res.status(500).send('Unable to get all book details');
  }
})


// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   return res.status(200).send(books[isbn]);
// });

function getBookByISBN(isbn){
  return books[isbn]
}
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const bookDetails = await getBookByISBN(req.params.isbn)
    return res.status(200).send(bookDetails);
  } catch(error) {
    return res.status(500).send('Unable to get details based on ISBN');
  }
})


// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author;

//   for (let i = 0; i < Object.keys(books).length; i++) {
//     if (books[i + 1]["author"] === author) {
//       return res
//         .status(200)
//         .send(
//           "Book written by " +
//             books[i + 1]["author"] +
//             " Title " +
//             books[i + 1]["title"]
//         );
//     }
//   }
//   return res.status(400).send("Book not found");
// });

function getBookByAuthor(author){
  for (let i = 0; i < Object.keys(books).length; i++) {
    if (books[i + 1]["author"] === author) {
      return books[i + 1]
    }
  }
}
public_users.get("/author/:author", async function (req, res) {
  try {
    const book = await getBookByAuthor(req.params.author)
    if (!book){
      return res.status(400).send("Book not found");
    }

    return res.status(200).send({"booksByAuthor": [book]}); 

  } catch(error) {
    return res.status(500).send('Unable to get details based on Author');
  }
})


// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;

//   for (let i = 0; i < Object.keys(books).length; i++) {
//     if (books[i + 1]["title"] === title) {
//       return res
//         .status(200)
//         .send(
//           "Book written by " +
//             books[i + 1]["author"] +
//             " Title " +
//             books[i + 1]["title"] +
//             " with Reviews " +
//             books[i + 1]["reviews"]
//         );
//     }
//   }
//   return res.status(400).send("Book not found");
// });

function getBookByTitle(title){
  for (let i = 0; i < Object.keys(books).length; i++) {
    if (books[i + 1]["title"] === title) {
      return books[i + 1]
    }
  }
}
public_users.get("/title/:title", async function (req, res) {
  try {
    const book = await getBookByTitle(req.params.title)
    if (!book){
      return res.status(400).send("Book not found");
    }

    return res
        .status(200)
        .send({"booksByTitle": [book]});

  } catch(error) {
    return res.status(500).send('Unable to get details based on Title');
  }
})


//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  return res
    .status(200)
    .send(
      "Reviews from book " +
        books[isbn]["title"] +
        " are " +
        books[isbn]["reviews"]
    );
});

module.exports.general = public_users;
