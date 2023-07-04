const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const port = 5500;

app.get('/', (req, res) => {
  res.send('My name is Yash Khopkar, my student id is N01569593.');
});

app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'books.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log(data);
      res.send('JSON data is loaded and ready!');
    }
  });
});

app.get('/data/isbn/:index', (req, res) => {
  const { index } = req.params;
  const filePath = path.join(__dirname, 'books.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);
      const bookIsbn = jsonData[index]?.book_isbn;
      if (bookIsbn) {
        res.json({ book_isbn: bookIsbn });
      } else {
        res.status(404).send('Book ISBN not found!');
      }
    }
  });
});

app.get('/data/search/isbn', (req, res) => {
  res.sendFile(path.join(__dirname, 'books-search.html'));
});

app.get('/data/search/isbn/results', (req, res) => {
  const isbn = req.query.isbn;
  console.log(isbn);
  const filePath = path.join(__dirname, 'books.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);
      const book = jsonData.find((item) => item.book_isbn === isbn);
      if (book) {
        res.json(book);
      } else {
        res.status(404).send('Book not found!');
      }
    }
  });
});

app.get('/data/search/title/', (req, res) => {
  res.sendFile(path.join(__dirname, 'book-title-search.html'));
});

app.post(
  '/data/search/title/',
  express.urlencoded({ extended: true }),
  (req, res) => {
    const { title } = req.body;
    console.log(title);
    const filePath = path.join(__dirname, 'books.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const jsonData = JSON.parse(data);
        const books = jsonData.filter((book) =>
          book.title.toLowerCase().includes(title.toLowerCase())
        );
        if (books.length > 0) {
          const results = books.slice(0, 3).map((book) => ({
            book_isbn: book.book_isbn,
            book_title: book.title,
            book_author: book.author,
          }));
          res.json(results);
        } else {
          res.status(404).send('No books found!');
        }
      }
    });
  }
);

app.use((req, res, next) => {
  res.status(404).send('This webpage is not available!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
