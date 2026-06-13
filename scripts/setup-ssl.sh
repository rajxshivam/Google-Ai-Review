#!/bin/bash
set -e

DOMAIN=${1:-yourdomain.com}

echo "=== Setting up SSL for $DOMAIN ==="

# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot

# Stop nginx temporarily
docker compose stop frontend

# Get certificate
sudo certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Copy certs to a location nginx can access
sudo mkdir -p /home/ai-reviews/certs
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /home/ai-reviews/certs/fullchain.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /home/ai-reviews/certs/privkey.pem
sudo chmod 644 /home/ai-reviews/certs/fullchain.pem
sudo chmod 600 /home/ai-reviews/certs/privkey.pem

# Setup auto-renewal
echo "0 3 * * * sudo certbot renew --quiet --deploy-hook 'docker compose -f /home/ai-reviews/docker-compose.yml restart frontend'" | sudo crontab -

# Start nginx with SSL
docker compose start frontend

echo ""
echo "=== SSL Setup Complete ==="
echo "Update nginx.conf to use the SSL certificate paths"
echo "Certificate renews automatically at 3 AM daily"
