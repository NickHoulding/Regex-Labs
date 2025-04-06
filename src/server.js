const express = require('express');
const generateTestCases = require('./utils/aiGenerator');
const app = express();

app.use(express.static('public'));

app.get('/api/generate-tests', (req, res) => {
    const tests = generateTestCases();
    res.json(tests);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});