
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Users file path
const USERS_FILE = path.join(__dirname, 'users.json');
let users = [];

// ✅ Step 1: Check if file exists. If not, create empty JSON file
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]');
  console.log('users.json created with empty array.');
}

// ✅ Step 2: Load existing users
try {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
  console.log('Loaded users from users.json');
} catch (err) {
  console.error('Error reading users.json:', err);
  users = [];
}

// ✅ Root route
app.get('/', (req, res) => {
  res.send('API is running successfully 🚀');
});

// ✅ Register route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  console.log("Incoming registration:", req.body);

  if (users.find(user => user.username === username)) {
    return res.json({ success: "false", message: "Username already exists" });
  }

  users.push({ username, password });

  // ✅ Save to file
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log("User registered and saved.");

  return res.json({ success: "true", message: "Registered successfully" });
});

// ✅ Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    return res.json({ success: "true", message: "Login successfully" });
  } else {
    return res.json({ success: "false", message: "Invalid credentials" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

