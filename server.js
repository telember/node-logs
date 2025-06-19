const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3002;  // Hardcode to 3002 to avoid port conflicts

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, 'app.log');
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
}

// Create HTTP server and Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

// API endpoint to receive logs
app.post('/api/logs', (req, res) => {
    try {
        const { logData, timestamp } = req.body;
        if (!logData) {
            return res.status(400).json({ error: 'Log data is required' });
        }
        const logEntry = `[${timestamp || new Date().toISOString()}] ${logData}\n${'-'.repeat(80)}\n`;
        fs.appendFileSync(logFile, logEntry);
        res.status(200).json({ message: 'Log saved successfully' });
    } catch (error) {
        console.error('Error saving log:', error);
        res.status(500).json({ error: 'Failed to save log' });
    }
});

// Serve the log file contents
app.get('/api/logs', (req, res) => {
    if (fs.existsSync(logFile)) {
        res.sendFile(logFile);
    } else {
        res.status(404).send('Log file not found');
    }
});

// Clear log file endpoint
app.post('/api/logs/clear', (req, res) => {
    try {
        fs.writeFileSync(logFile, '');
        emitLogUpdate();
        res.status(200).json({ message: 'Log file cleared' });
    } catch (error) {
        console.error('Error clearing log file:', error);
        res.status(500).json({ error: 'Failed to clear log file' });
    }
});

// Serve watch interface at /watch
app.get('/watch', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'watch.html'));
});

// Serve custom 404 page for root path
app.get('/', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Serve custom 404 page for all other unknown paths
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Watch the log file for changes and emit updates
let lastLogContent = '';
function emitLogUpdate() {
    if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        if (content !== lastLogContent) {
            lastLogContent = content;
            io.emit('logUpdate', content);
        }
    }
}
fs.watchFile(logFile, { interval: 500 }, emitLogUpdate);

io.on('connection', (socket) => {
    // Send current log content on new connection
    if (fs.existsSync(logFile)) {
        socket.emit('logUpdate', fs.readFileSync(logFile, 'utf8'));
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 