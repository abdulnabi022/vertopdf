#!/bin/bash
# Quick deployment script for Digital Ocean Droplet

echo "🚀 RarePDFtool Backend Deployment Script"
echo "========================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/rarepdftool/server_py"
VENV_DIR="$APP_DIR/venv"
USER="deploy"

echo -e "${YELLOW}Step 1: Pulling latest code...${NC}"
cd $APP_DIR
git pull origin main

echo -e "${YELLOW}Step 2: Activating virtual environment...${NC}"
source $VENV_DIR/bin/activate

echo -e "${YELLOW}Step 3: Installing/updating dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

echo -e "${YELLOW}Step 4: Restarting application...${NC}"
sudo supervisorctl restart rarepdftool

echo -e "${YELLOW}Step 5: Checking status...${NC}"
sleep 2
sudo supervisorctl status rarepdftool

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}Check logs with: sudo tail -f /var/log/rarepdftool/out.log${NC}"
