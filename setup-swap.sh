#!/bin/bash

###############################################################################
# Swap Space Setup Script for Small Servers
# Prevents OOM (Out of Memory) crashes during builds
###############################################################################

set -e

echo "💾 Setting up swap space for small server..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if swap already exists
if swapon --show | grep -q /swapfile; then
    echo -e "${YELLOW}⚠${NC}  Swap file already exists!"
    swapon --show
    exit 0
fi

# Check available disk space
AVAILABLE_SPACE=$(df -BG / | tail -1 | awk '{print $4}' | sed 's/G//')
if [ "$AVAILABLE_SPACE" -lt 3 ]; then
    echo -e "${RED}❌${NC}  Not enough disk space (need at least 3GB, have ${AVAILABLE_SPACE}GB)"
    exit 1
fi

echo -e "${GREEN}📦${NC} Creating 2GB swap file..."
sudo fallocate -l 2G /swapfile

echo -e "${GREEN}🔒${NC} Setting secure permissions..."
sudo chmod 600 /swapfile

echo -e "${GREEN}🔧${NC} Formatting swap file..."
sudo mkswap /swapfile

echo -e "${GREEN}▶️${NC}  Enabling swap..."
sudo swapon /swapfile

echo -e "${GREEN}💾${NC} Making swap permanent..."
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swap usage
echo -e "${GREEN}⚙️${NC}  Optimizing swap settings..."
sudo sysctl vm.swappiness=10
sudo sysctl vm.vfs_cache_pressure=50

# Make optimizations permanent
sudo bash -c 'cat >> /etc/sysctl.conf << EOF

# Swap optimizations
vm.swappiness=10
vm.vfs_cache_pressure=50
EOF'

echo -e "${GREEN}✅${NC} Swap space setup completed!"
echo ""
echo -e "${GREEN}📊${NC} Current memory status:"
free -h
echo ""
echo -e "${GREEN}💡${NC} Swap will help prevent crashes during builds"
echo -e "${GREEN}💡${NC} Server will use swap when RAM is full"

