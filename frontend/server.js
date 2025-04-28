const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(__dirname));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Handle all routes for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 