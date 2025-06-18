const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Mock the server.js functionality
const app = express();
app.use(express.json());

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
const logFile = path.join(logsDir, 'app.log');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Mock the log endpoint
app.post('/api/logs', (req, res) => {
    const { logData, timestamp } = req.body;
    if (!logData) {
        return res.status(400).json({ error: 'logData is required' });
    }

    const logEntry = `[${timestamp || new Date().toISOString()}] ${logData}\n--------------------------------------------------------------------------------\n`;
    fs.appendFileSync(logFile, logEntry);
    res.status(200).json({ message: 'Log received' });
});

// Mock the web interface endpoint
app.get('/', (req, res) => {
    res.send('Log Viewer');
});

// Mock the logs endpoint
app.get('/api/logs', (req, res) => {
    try {
        const logs = fs.readFileSync(logFile, 'utf8');
        res.status(200).send(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read logs' });
    }
});

describe('Log Server API', () => {
    beforeEach(() => {
        // Clear the log file before each test
        if (fs.existsSync(logFile)) {
            fs.writeFileSync(logFile, '');
        }
    });

    afterAll(() => {
        // Clean up after all tests
        if (fs.existsSync(logFile)) {
            fs.unlinkSync(logFile);
        }
    });

    describe('POST /api/logs', () => {
        test('should accept valid log data', async () => {
            const response = await request(app)
                .post('/api/logs')
                .send({ logData: 'Test log message' });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Log received');
        });

        test('should reject request without logData', async () => {
            const response = await request(app)
                .post('/api/logs')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'logData is required');
        });

        test('should write log to file', async () => {
            const testMessage = 'Test log message';
            await request(app)
                .post('/api/logs')
                .send({ logData: testMessage });

            const fileContent = fs.readFileSync(logFile, 'utf8');
            expect(fileContent).toContain(testMessage);
        });

        test('should accept custom timestamp', async () => {
            const timestamp = '2024-03-21T10:30:00Z';
            await request(app)
                .post('/api/logs')
                .send({ 
                    logData: 'Test message',
                    timestamp: timestamp
                });

            const fileContent = fs.readFileSync(logFile, 'utf8');
            expect(fileContent).toContain(timestamp);
        });
    });

    describe('GET /api/logs', () => {
        test('should return logs from file', async () => {
            const testMessage = 'Test log message';
            fs.appendFileSync(logFile, `[2024-03-21T10:30:00Z] ${testMessage}\n--------------------------------------------------------------------------------\n`);

            const response = await request(app)
                .get('/api/logs');

            expect(response.status).toBe(200);
            expect(response.text).toContain(testMessage);
        });

        test('should handle empty log file', async () => {
            const response = await request(app)
                .get('/api/logs');

            expect(response.status).toBe(200);
            expect(response.text).toBe('');
        });
    });

    describe('Web Interface', () => {
        test('should serve web interface', async () => {
            const response = await request(app)
                .get('/');

            expect(response.status).toBe(200);
            expect(response.text).toBe('Log Viewer');
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid JSON', async () => {
            const response = await request(app)
                .post('/api/logs')
                .send('invalid json')
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
        });

        test('should handle non-existent log file', async () => {
            if (fs.existsSync(logFile)) {
                fs.unlinkSync(logFile);
            }

            const response = await request(app)
                .get('/api/logs');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to read logs');
        });
    });
}); 