.PHONY: build push run stop clean logs deploy-prod

# Docker image name
IMAGE_NAME = telember/node-logs
CONTAINER_NAME = node-logs
PORT = 3002

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the container (development mode)
run:
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):$(PORT) \
		-v $(PWD)/logs:/app/logs \
		$(IMAGE_NAME)

# Run the container (production mode with auto-restart)
run-prod:
	docker run -d \
		--name $(CONTAINER_NAME) \
		--restart unless-stopped \
		-p $(PORT):$(PORT) \
		-v $(PWD)/logs:/app/logs \
		$(IMAGE_NAME)

# Stop and remove the container
stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Clean up (stop container and remove image)
clean: stop
	docker rmi $(IMAGE_NAME) || true

# View container logs
logs:
	docker logs -f $(CONTAINER_NAME)

# Restart the container
restart: stop run

# Deploy to production (build and run with auto-restart)
deploy-prod: build run-prod

# Help command
help:
	@echo "Available commands:"
	@echo "  make build      - Build the Docker image"
	@echo "  make run        - Run the container (development mode)"
	@echo "  make run-prod   - Run the container (production mode with auto-restart)"
	@echo "  make stop       - Stop and remove the container"
	@echo "  make clean      - Clean up (stop container and remove image)"
	@echo "  make logs       - View container logs"
	@echo "  make restart    - Restart the container"
	@echo "  make deploy-prod - Build and run in production mode" 