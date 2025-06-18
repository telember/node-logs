# Node Log Server

[![Docker Pulls](https://img.shields.io/docker/pulls/telember/node-logs)](https://hub.docker.com/r/telember/node-logs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, real-time log server with web interface. Perfect for collecting and monitoring logs from multiple sources.

## Features

- 📝 Simple REST API for sending logs
- 🌐 Real-time web interface for log monitoring
- 🐳 Docker support for easy deployment
- 🔄 Auto-restart capability
- 📊 Clean and readable log format
- 🚀 WebSocket support for live updates

## Quick Start

### Using Docker

```bash
# Build the image
docker build -t node-logs .

# Run the container
docker run -d \
  --name node-logs \
  --restart unless-stopped \
  -p 3002:3002 \
  -v $(pwd)/logs:/app/logs \
  node-logs:latest
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/node-logs.git
cd node-logs

# Install dependencies
npm install

# Start the server
npm start
```

## API Documentation

### Send Logs

**Endpoint:** `POST /api/logs`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "logData": "Your log message here",
    "timestamp": "2024-03-21T10:30:00Z"  // Optional
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3002/api/logs \
  -H "Content-Type: application/json" \
  -d '{"logData": "Test log message"}'
```

**Example using Node.js:**
```javascript
const axios = require('axios');

async function sendLog(message) {
    try {
        await axios.post('http://localhost:3002/api/logs', {
            logData: message
        });
    } catch (error) {
        console.error('Error sending log:', error);
    }
}
```

**Example using Python:**
```python
import requests

def send_log(message):
    try:
        response = requests.post(
            'http://localhost:3002/api/logs',
            json={'logData': message}
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f'Error sending log: {e}')
```

## Web Interface

Access the real-time log viewer at:
```
http://localhost:3002
```

Features:
- Real-time log updates
- Timestamp highlighting
- Auto-scrolling
- Dark theme
- Separator lines for better readability

## Docker Commands

### Basic Operations
```bash
# View logs
docker logs -f node-logs

# Stop container
docker stop node-logs

# Remove container
docker rm node-logs

# Update to latest version
docker pull node-logs:latest
```

### Development
```bash
# Build image
docker build -t node-logs .

# Run container
docker run -d --name node-logs -p 3002:3002 -v $(pwd)/logs:/app/logs node-logs:latest
```

## Log Format

Logs are stored in `logs/app.log` with the following format:
```
[timestamp] log message
--------------------------------------------------------------------------------
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 