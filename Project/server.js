require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const restaurantRoutes = require('./routes/restaurentRoute');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const CONNECTION_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.xpi1r7z.mongodb.net/${DB_NAME}`;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

app.use('/api/restaurants', restaurantRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
