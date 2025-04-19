// backend/server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Needed to allow frontend access

const app = express();

app.use(cors()); // ✅ Allow frontend (React) access
app.use(bodyParser.json());

// ✅ POST /api/login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Create fake SQL query string to simulate real query
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  try {
    // Send query string to ML model (Flask)
    const mlRes = await axios.post('http://localhost:8000/detect', {
      query,
    });

    const prediction = mlRes.data.prediction;

    if (prediction === 'Malicious') {
      return res.status(403).json({ message: 'Malicious query detected!' });
    }

    return res.status(200).json({ message: 'Login looks safe' });
  } catch (err) {
    console.error("ML model error:", err.message);
    return res.status(500).json({ error: 'ML model error' });
  }
});

// ✅ Start the server
app.listen(5000, () => {
  console.log('Backend running at http://localhost:5000');
});
