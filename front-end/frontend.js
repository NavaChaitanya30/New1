const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;  // Change this to the port you want to use for the front-end

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Front-end server is running on port ${PORT}`);
});
