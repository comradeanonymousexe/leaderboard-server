const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS for all requests
app.use(cors());
app.use(express.json());

const leaderboardFile = 'leaderboard.json';

// Load existing leaderboard
function loadLeaderboard() {
    try {
        const data = fs.readFileSync(leaderboardFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        return [];
    }
}

// Save leaderboard data
function saveLeaderboard(leaderboard) {
    fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard, null, 2));
}

// ✅ Handle GET request for leaderboard
app.get('/leaderboard', (req, res) => {
    const leaderboard = loadLeaderboard();
    res.json(leaderboard.sort((a, b) => b.score - a.score)); // Ensure descending order
});

// ✅ Handle POST request to update leaderboard
app.post('/update_leaderboard', (req, res) => {
    const { name, score } = req.body;
    
    if (!name || isNaN(score)) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    let leaderboard = loadLeaderboard();
    leaderboard.push({ name, score });
    saveLeaderboard(leaderboard);

    res.json({ message: "Leaderboard updated successfully!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
