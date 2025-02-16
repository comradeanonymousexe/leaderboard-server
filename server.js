const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;

const FILE_PATH = 'leaderboard.json';

app.use(express.json());

// Function to load leaderboard data
function loadLeaderboard() {
    if (fs.existsSync(FILE_PATH)) {
        return JSON.parse(fs.readFileSync(FILE_PATH));
    }
    return [];
}

// Function to save leaderboard data
function saveLeaderboard(leaderboard) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(leaderboard, null, 2));
}

// API to update leaderboard
app.post('/update_leaderboard', (req, res) => {
    const { name, score } = req.body;

    let leaderboard = loadLeaderboard();

    // Add new entry
    leaderboard.push({ name, score });

    // Sort leaderboard by highest score
    leaderboard.sort((a, b) => b.score - a.score);

    // Save to file
    saveLeaderboard(leaderboard);

    res.json({ message: "Leaderboard updated!" });
});

// API to fetch leaderboard
app.get('/leaderboard', (req, res) => {
    res.json(loadLeaderboard());
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
