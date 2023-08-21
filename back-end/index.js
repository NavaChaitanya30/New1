const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Add this line

const app = express();
const PORT = 3000;

app.use(cors()); // Use the cors middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const csvFilePath = path.join(__dirname, 'user_data.csv');

// Create the CSV file if it doesn't exist
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, 'name,email,password\n', 'utf8');
}

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare data for CSV format
    const userData = `${name},${email},${hashedPassword}\n`;

    // Append data to the CSV file
    fs.appendFileSync(csvFilePath, userData, 'utf8');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Read user data from CSV
    const userCsv = fs.readFileSync(csvFilePath, 'utf8');
    const userData = userCsv.trim().split('\n').map(line => line.split(','));

    // Find user by email
    const user = userData.find(user => user[1] === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const hashedPassword = user[2];
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
