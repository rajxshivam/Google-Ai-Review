#!/bin/bash
set -e

echo "=== AI Reviews — VPS Setup ==="

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "Docker installed. Log out and back in for group changes."
fi

# Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose plugin..."
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

# Create app directory
sudo mkdir -p /home/ai-reviews
sudo chown $USER:$USER /home/ai-reviews

# Create .env if it doesn't exist
if [ ! -f /home/ai-reviews/.env ]; then
    echo "Creating .env from template..."
    cat > /home/ai-reviews/.env << 'ENVFILE'
# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=CHANGE_ME_NOW

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# JWT
JWT_SECRET=CHANGE_ME_TO_RANDOM_64_CHARS

# Docker Hub (set by CI/CD, or manually for local builds)
DOCKERHUB_USERNAME=rajxshivam
ENVFILE
    echo ">>> EDIT /home/ai-reviews/.env WITH YOUR SECRETS <<<"
fi

# Copy docker-compose if not present
if [ ! -f /home/ai-reviews/docker-compose.yml ]; then
    echo "docker-compose.yml not found at /home/ai-reviews/"
    echo "Clone the repo or copy docker-compose.yml there."
fi

# Setup UFW firewall
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    echo "Firewall configured: SSH(22), HTTP(80), HTTPS(443)"
fi

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

echo ""
echo "=== Setup Complete ==="
echo "1. Edit /home/ai-reviews/.env with your secrets"
echo "2. cd /home/ai-reviews && docker compose up -d --build"
echo ""
