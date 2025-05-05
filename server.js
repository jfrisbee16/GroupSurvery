const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 