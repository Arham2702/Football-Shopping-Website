const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (your HTML, CSS, and images)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
  });

// Routes
app.post('/register', (req, res) => {
  const { userId, email, password, agree } = req.body;

  // Load existing users from the JSON file
  let users = [];
  try {
    const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8');
    users = JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
  }

  // Check if the user already exists
  const userExists = users.some(user => user.userId === userId || user.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Add the new user
  const newUser = { userId, email, password, agree };
  users.push(newUser);

  // Save the updated user list to the JSON file
  fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), 'utf8');

  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { userId, password } = req.body;

  // Load existing users from the JSON file
  let users = [];
  try {
    const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8');
    users = JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
  }

  // Check if the user exists and the password matches
  const user = users.find(u => u.userId === userId && u.password === password);
  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.url);
  
    // Check if the requested file is a CSS, image, or HTML file
    if (filePath.endsWith('.css') || /\.(jpg|jpeg|png|gif|ico)$/.test(filePath) || filePath.endsWith('.html')) {
      res.sendFile(filePath);
    } else {
      res.sendFile(path.join(__dirname, 'signup.html'));
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
