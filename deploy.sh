#!/bin/bash

###############################################################################
# Production Deployment Script for PayNxt Frontend
# Optimized for best practices and performance
###############################################################################

set -e  # Exit on any error

echo "🚀 Starting PayNxt Frontend Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/ubuntu/paynxt-frontend"
APP_NAME="paynxt-frontend"
PORT=3000

# Load Node.js environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Navigate to project directory
cd $PROJECT_DIR

echo -e "${GREEN}✓${NC} Current directory: $(pwd)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠${NC}  .env file not found. Please create it from .env.example"
    exit 1
fi

# Pull latest changes
echo -e "${GREEN}📥${NC} Pulling latest changes from repository..."
git pull origin main || git pull origin master

# Install/Update dependencies
echo -e "${GREEN}📦${NC} Installing dependencies..."
pnpm install --frozen-lockfile --production=false

# Build the application
echo -e "${GREEN}🔨${NC} Building production application..."
NODE_ENV=production pnpm build

# Create logs directory if it doesn't exist
mkdir -p logs

# Stop existing PM2 process if running
echo -e "${GREEN}🛑${NC} Stopping existing PM2 processes..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Start application with PM2
echo -e "${GREEN}▶️${NC}  Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
echo -e "${GREEN}⚙️${NC}  Setting up PM2 startup script..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu | grep -v "PM2" | sudo bash || true

# Show PM2 status
echo -e "${GREEN}📊${NC} PM2 Status:"
pm2 status

# Show application logs
echo -e "${GREEN}📋${NC} Recent application logs:"
pm2 logs $APP_NAME --lines 20 --nostream

echo -e "${GREEN}✅${NC} Deployment completed successfully!"
echo -e "${GREEN}🌐${NC} Application should be running on port $PORT"
echo -e "${GREEN}📝${NC} View logs: pm2 logs $APP_NAME"
echo -e "${GREEN}📊${NC} View status: pm2 status"
echo -e "${GREEN}🔄${NC} Restart app: pm2 restart $APP_NAME"

