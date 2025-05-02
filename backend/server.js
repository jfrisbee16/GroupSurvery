const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/scripts', express.static(path.join(__dirname, '../frontend/scripts')));
app.use('/node_modules', express.static(path.join(__dirname, '../frontend/node_modules')));

// --- SQLite3 Setup ---
const DB_PATH = path.join(__dirname, 'group_survey_project.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// --- Body parser for JSON ---
app.use(express.json());

// --- API: Create new group ---
app.post('/api/groups', (req, res) => {
  const { GroupName, CourseID } = req.body;
  if (!GroupName || !CourseID) return res.status(400).json({ error: 'GroupName and CourseID required' });
  db.run('INSERT INTO tblCourseGroups (GroupName, CourseID) VALUES (?, ?)', [GroupName, CourseID], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ GroupID: this.lastID, GroupName, CourseID });
  });
});

// --- API: Create new survey (assessment) ---
app.post('/api/assessments', (req, res) => {
  const { Name, StartDate, EndDate, Status, Type } = req.body;
  if (!Name || !StartDate || !EndDate || !Status || !Type) return res.status(400).json({ error: 'All fields required' });
  db.run('INSERT INTO tblAssessments (Name, StartDate, EndDate, Status, Type) VALUES (?, ?, ?, ?, ?)', [Name, StartDate, EndDate, Status, Type], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ AssessmentID: this.lastID, Name, StartDate, EndDate, Status, Type });
  });
});

// --- API: Add student to group ---
app.post('/api/groups/:groupId/members', (req, res) => {
  const { UserID } = req.body;
  const { groupId } = req.params;
  if (!UserID) return res.status(400).json({ error: 'UserID required' });
  db.run('INSERT INTO tblGroupMembers (GroupID, UserID) VALUES (?, ?)', [groupId, UserID], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ GroupMemberID: this.lastID, GroupID: groupId, UserID });
  });
});

// --- API: List groups ---
app.get('/api/groups', (req, res) => {
  db.all('SELECT * FROM tblCourseGroups', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- API: List assessments ---
app.get('/api/assessments', (req, res) => {
  db.all('SELECT * FROM tblAssessments', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- API: List group members ---
app.get('/api/groups/:groupId/members', (req, res) => {
  const { groupId } = req.params;
  db.all('SELECT u.* FROM tblGroupMembers gm JOIN tblUsers u ON gm.UserID = u.UserID WHERE gm.GroupID = ?', [groupId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- API: Assign survey to group (example join table, not present, so just placeholder) ---
// You may want to create a tblGroupAssessments join table for this functionality.
// For now, this is a placeholder endpoint.
app.post('/api/groups/:groupId/assessments', (req, res) => {
  res.status(501).json({ error: 'Assigning surveys to groups not yet implemented. Consider adding a tblGroupAssessments table.' });
});

// Handle all routes for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});