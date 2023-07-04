const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'hbs');

// Set up handlebars engine
app.engine(
  'hbs',
  handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
      extend: () => null,
      displayPages: (pages) => {
        return pages === 0 ? 'ZERO' : pages;
      },
      eq: (a, b) => {
        return a == b;
      },
    },
  })
);

// Set up static files
app.use(express.static(__dirname + '/public'));

// Route to render index template
app.get('/', (req, res) => {
  const myPet = {
    name: 'Fido',
    species: 'Dog',
    description: 'Fido is a very cuddly dog who loves to nap in sunbeams.',
    image: '/images/Fido.jpeg',
  };

  res.render('index', { layout: 'main', myPet: myPet, title: 'Home Page' });
});

app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'books.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log(data);
      res.render('data', {
        layout: 'main',
        response: 'JSON data is loaded and ready!',
        title: 'JSON Data Page',
      });
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
        res.render('index-search', {
          layout: 'main',
          response: { book_isbn: bookIsbn },
          title: 'Index Search',
        });
      } else {
        res.status(404).render('index-search', {
          layout: 'main',
          response: 'Book ISBN not found!',
          title: 'Index Search',
        });
      }
    }
  });
});

// app.get('/data/search/isbn', (req, res) => {
//   res.sendFile(path.join(__dirname, 'books-search.html'));
// });

app.get('/data/search/isbn/results', (req, res) => {
  const isbn = req.query.isbn;
  // console.log(isbn);
  const filePath = path.join(__dirname, 'books.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);
      const book = jsonData.find((item) => item.book_isbn === isbn);
      // console.log(book);
      if (book) {
        res.render('books-search', {
          layout: 'main',
          response: book,
          title: 'ISBN Search',
        });
      } else {
        res.status(404).render('books-search', {
          layout: 'main',
          response: 'Book not found!',
          title: 'ISBN Search',
        });
      }
    }
  });
});

// app.get('/data/search/title/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'book-title-search.html'));
// });

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
          res.render('books-title-search', {
            layout: 'main',
            response: results,
            title: 'Title Search',
          });
        } else {
          res.status(404).render('books-title-search', {
            layout: 'main',
            response: 'Book not found!',
            title: 'Title Search',
          });
        }
      }
    });
  }
);

app.get('/allData', (req, res) => {
  const filePath = path.join(__dirname, 'books.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);
      if (jsonData) {
        res.render('allData', {
          layout: 'main',
          response: jsonData,
          title: 'All Data',
        });
      } else {
        res.status(404).render('allData', {
          layout: 'main',
          response: 'Book ISBN not found!',
          title: 'All Data',
        });
      }
    }
  });
});

app.use((req, res, next) => {
  res.status(404).send('This webpage is not available!');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
