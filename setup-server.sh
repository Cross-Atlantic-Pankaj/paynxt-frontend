#!/bin/bash

###############################################################################
# Server Setup Script for PayNxt Frontend
# Installs and configures all required services
###############################################################################

set -e

echo "🔧 Setting up production server for PayNxt Frontend..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Update system
echo -e "${GREEN}📦${NC} Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install essential packages
echo -e "${GREEN}📦${NC} Installing essential packages..."
sudo apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    nginx \
    ufw \
    certbot \
    python3-certbot-nginx

# Install Node.js via NVM (if not already installed)
if [ ! -d "$HOME/.nvm" ]; then
    echo -e "${GREEN}📦${NC} Installing NVM and Node.js..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm use --lts
    nvm alias default node
fi

# Install PM2 globally
echo -e "${GREEN}📦${NC} Installing PM2..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm install -g pm2 pnpm

# Setup firewall
echo -e "${GREEN}🔥${NC} Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create necessary directories
echo -e "${GREEN}📁${NC} Creating directories..."
mkdir -p /home/ubuntu/paynxt-frontend/logs
mkdir -p /var/cache/nginx/paynxt
sudo chown -R ubuntu:ubuntu /var/cache/nginx/paynxt

# Setup Nginx
echo -e "${GREEN}🌐${NC} Configuring Nginx..."
if [ -f /home/ubuntu/paynxt-frontend/nginx.conf ]; then
    sudo cp /home/ubuntu/paynxt-frontend/nginx.conf /etc/nginx/sites-available/paynxt-frontend
    sudo ln -sf /etc/nginx/sites-available/paynxt-frontend /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl enable nginx
    sudo systemctl restart nginx
fi

# Optimize system settings
echo -e "${GREEN}⚙️${NC}  Optimizing system settings..."

# Increase file descriptor limits
sudo bash -c 'cat >> /etc/security/limits.conf << EOF
* soft nofile 65535
* hard nofile 65535
EOF'

# Optimize kernel parameters
sudo bash -c 'cat >> /etc/sysctl.conf << EOF
# Network optimizations
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_intvl = 15
EOF'

sudo sysctl -p

echo -e "${GREEN}✅${NC} Server setup completed!"
echo -e "${YELLOW}📝${NC} Next steps:"
echo -e "   1. Create .env file in /home/ubuntu/paynxt-frontend/"
echo -e "   2. Run: chmod +x deploy.sh && ./deploy.sh"
echo -e "   3. Setup SSL: sudo certbot --nginx -d yourdomain.com"

