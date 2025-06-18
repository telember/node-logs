# Log Server API

A simple API server for receiving and storing logs with real-time web viewer.

## Setup

### Option 1: Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

### Option 2: Docker Deployment

#### Development Machine (where you build the image)

1. Build and push the image:
```bash
make deploy-prod
```

This will:
- Build the Docker image
- Tag it as 'latest'
- Push to Docker Hub
- Run the container locally

#### Production Machine (Raspberry Pi)

1. Pull and run the latest version:
```bash
# Stop existing container (if any)
docker stop node-logs
docker rm node-logs

# Pull and run latest version
docker pull telember/node-logs:latest
docker run -d \
  --name node-logs \
  --restart unless-stopped \
  -p 3002:3002 \
  -v ~/works/docker/logs:/app/logs \
  telember/node-logs:latest
```

## API Usage

### Endpoint: POST /api/logs

Send log data to the server. The logs will be appended to a file in the `logs` directory.

#### Request Body:
```json
{
    "logData": "Your log message here",
    "timestamp": "2024-03-21T10:30:00Z"  // Optional, will use server time if not provided
}
```

#### Example using curl:
```bash
curl -X POST http://localhost:3002/api/logs \
  -H "Content-Type: application/json" \
  -d '{"logData": "Test log message"}'
```

#### Example using Android (Kotlin):
```kotlin
val client = OkHttpClient()
val json = JSONObject().apply {
    put("logData", "Test log message")
}

val request = Request.Builder()
    .url("http://your-server:3002/api/logs")
    .post(json.toString().toRequestBody("application/json".toMediaType()))
    .build()

client.newCall(request).execute()
```

## Web Interface

Access the real-time log viewer at:
```
http://localhost:3002
```

The web interface shows logs with:
- Timestamps in blue
- Separator lines between entries
- Auto-scrolling to latest logs
- Dark theme for better readability

## Log File

Logs are stored in `logs/app.log` in the following format:
```
[timestamp] log message
--------------------------------------------------------------------------------
```

## Docker Commands

### Development Machine
- `make build` - Build the Docker image
- `make push` - Push the image to Docker Hub
- `make deploy-prod` - Build, push, and run the container
- `make logs` - View container logs
- `make stop` - Stop the container
- `make clean` - Clean up containers and images

### Production Machine (Raspberry Pi)
- View logs: `docker logs -f node-logs`
- Stop container: `docker stop node-logs`
- Remove container: `docker rm node-logs`
- Update to latest: 
  ```bash
  docker stop node-logs
  docker rm node-logs
  docker pull telember/node-logs:latest
  docker run -d --name node-logs --restart unless-stopped -p 3002:3002 -v ~/works/docker/logs:/app/logs telember/node-logs:latest
  ``` 