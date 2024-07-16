const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 5; // Adjust the window size as needed
let storedNumbers = [];

app.use(bodyParser.json());

// Helper function to fetch numbers from a third-party server
async function fetchNumbers() {
  const urls = [
    'http://20.244.56.144/test/primes',
    'http://20.244.56.144/test/fibo',
    'http://20.244.56.144/test/rand'
  ];

  const responses = await Promise.all(urls.map(url => axios.get(url)));
  return responses.map(response => response.data);
}

// API to accept number IDs and calculate average
app.post('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;

  if (!isValidNumberId(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  try {
    const numbers = await fetchNumbers();
    storedNumbers = storedNumbers.concat(numbers).slice(-WINDOW_SIZE);

    const average = storedNumbers.reduce((sum, num) => sum + num, 0) / storedNumbers.length;
    res.json({ average, storedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch numbers' });
  }
});

function isValidNumberId(numberId) {
  // Define your validation logic here
  return !isNaN(numberId) && Number(numberId) > 0;
}

// Serve the React app
app.use(express.static(path.join(__dirname, 'client/src')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/src', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:9876`);
});