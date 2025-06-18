# Node Log Server

[![Docker Pulls](https://img.shields.io/docker/pulls/telember/node-logs)](https://hub.docker.com/r/telember/node-logs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Tests](https://github.com/telember/node-logs/actions/workflows/test.yml/badge.svg)](https://github.com/telember/node-logs/actions/workflows/test.yml)

A real-time log viewing application with a modern web interface. Built with Node.js, Express, and Socket.IO.

## Features

- Real-time log updates using WebSocket
- Modern, responsive web interface
- Dark theme with syntax highlighting
- Auto-scroll functionality
- Clear logs option
- Connection status indicator
- Simple API for log submission

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd logs
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
node server.js
```

The server will start on port 3002.

2. Access the web interface:
- Open `http://localhost:3002/watch` in your browser
- The interface will automatically connect and start displaying logs

3. Send logs to the server:
```bash
curl -X POST http://localhost:3002/api/logs \
  -H "Content-Type: application/json" \
  -d '{"logData": "Your log message", "timestamp": "2024-03-21T12:00:00Z"}'
```

## API Endpoints

- `GET /watch` - Web interface for viewing logs
- `POST /api/logs` - Submit new logs
- `GET /api/logs` - Retrieve all logs

## Web Interface Features

- **Real-time Updates**: Logs appear instantly as they are received
- **Auto-scroll**: Automatically scrolls to new logs (can be toggled)
- **Clear Logs**: Button to clear the current view
- **Connection Status**: Visual indicator of WebSocket connection status
- **Dark Theme**: Easy on the eyes for long viewing sessions
- **Syntax Highlighting**: Timestamps and separators are highlighted

## Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t telember/node-logs .

# Run the container
docker run -p 3002:3002 telember/node-logs
```

## Development

The project uses:
- Express.js for the web server
- Socket.IO for real-time updates
- Modern JavaScript features
- CSS variables for theming

## License

MIT 