.PHONY: build push run stop clean logs deploy-prod version

# Docker image name and version
IMAGE_NAME = telember/node-logs
VERSION ?= 1.0.0
CONTAINER_NAME = node-logs
PORT = 3002

# Build the Docker image with version
build:
	docker build -t $(IMAGE_NAME):$(VERSION) .
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest

# Push the image to Docker Hub with version
push:
	docker push $(IMAGE_NAME):$(VERSION)
	docker push $(IMAGE_NAME):latest

# Run the container (development mode)
run:
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):$(PORT) \
		-v ~/works/docker/logs:/app/logs \
		$(IMAGE_NAME):latest

# Run the container (production mode with auto-restart)
run-prod:
	docker run -d \
		--name $(CONTAINER_NAME) \
		--restart unless-stopped \
		-p $(PORT):$(PORT) \
		-v ~/works/docker/logs:/app/logs \
		$(IMAGE_NAME):latest

# Stop and remove the container
stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Clean up (stop container and remove image)
clean: stop
	docker rmi $(IMAGE_NAME):$(VERSION) || true
	docker rmi $(IMAGE_NAME):latest || true

# View container logs
logs:
	docker logs -f $(CONTAINER_NAME)

# Restart the container
restart: stop run

# Deploy to production (build, push, and run with auto-restart)
deploy-prod: build push run-prod

# Update version (usage: make version VERSION=1.0.1)
version:
	@echo "Current version: $(VERSION)"
	@echo "To update version, run: make deploy-prod VERSION=x.y.z"

# Help command
help:
	@echo "Available commands:"
	@echo "  make build      - Build the Docker image"
	@echo "  make push       - Push the image to Docker Hub"
	@echo "  make run        - Run the container (development mode)"
	@echo "  make run-prod   - Run the container (production mode with auto-restart)"
	@echo "  make stop       - Stop and remove the container"
	@echo "  make clean      - Clean up (stop container and remove image)"
	@echo "  make logs       - View container logs"
	@echo "  make restart    - Restart the container"
	@echo "  make deploy-prod - Build, push, and run in production mode"
	@echo "  make version    - Show current version"
	@echo ""
	@echo "To update version:"
	@echo "  make deploy-prod VERSION=x.y.z" 