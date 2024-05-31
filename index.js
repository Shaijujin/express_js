const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://lunu:lunu1234@cluster0.mxmqnga.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the collection
const crDocumentDataSchema = new mongoose.Schema({
  id: String,
  name: String,
  age: Number,
}, { collection: 'leaveApplication' });

// Define a model using the collection name
const CrDocumentData = mongoose.model('CrDocumentData', crDocumentDataSchema);

// Define a GET route to fetch all items
app.get('/items', async (req, res) => {
  try {
    const items = await CrDocumentData.find();
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Define a GET route to fetch an item by _id
app.get('/items/:id', async (req, res) => {
  try {
    const item = await CrDocumentData.findById(req.params.id);
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Define a POST route to insert data
app.post('/items', async (req, res) => {
  const { id, name, age } = req.body;
  const newItem = new CrDocumentData({ id, name, age });

  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
