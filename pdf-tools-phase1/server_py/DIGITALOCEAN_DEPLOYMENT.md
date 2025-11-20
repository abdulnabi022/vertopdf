# 🚀 Digital Ocean Deployment Guide - RarePDFtool Backend

Complete guide to deploying your FastAPI backend on Digital Ocean.

---

## 📋 Table of Contents

1. [Deployment Options](#deployment-options)
2. [Option 1: App Platform (Easiest)](#option-1-app-platform-easiest)
3. [Option 2: Droplet with Ubuntu (Full Control)](#option-2-droplet-with-ubuntu)
4. [Production Configuration](#production-configuration)
5. [Domain & SSL Setup](#domain--ssl-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🎯 Deployment Options

### Option 1: App Platform (Recommended for Beginners)
- ✅ **Pros**: Easy setup, automatic scaling, managed infrastructure
- ❌ **Cons**: More expensive ($5-12/month), less control
- **Best for**: Quick deployment, no server management experience

### Option 2: Droplet (Recommended for Production)
- ✅ **Pros**: Full control, cheaper ($4-6/month), better performance
- ❌ **Cons**: Requires server setup and maintenance
- **Best for**: Production apps, custom configurations

---

## 🌟 Option 1: App Platform (Easiest)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
```bash
cd /Users/abdulnabig/Documents/main_app/pdf-tools-phase1
git add server_py/
git commit -m "feat: prepare backend for Digital Ocean deployment"
git push origin main
```

2. **Create `app.yaml` in server_py/** (already created for you)

### Step 2: Deploy on Digital Ocean

1. **Log into Digital Ocean**: https://cloud.digitalocean.com/
2. **Create New App**:
   - Click "Create" → "Apps"
   - Connect your GitHub repository
   - Select branch: `main`
   - Source directory: `pdf-tools-phase1/server_py`

3. **Configure App**:
   - **Name**: rarepdftool-api
   - **Region**: Choose closest to your users
   - **Build Command**: (auto-detected from app.yaml)
   - **Run Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**:
   - Add in App Platform settings:
     ```
     ENVIRONMENT=production
     PORT=8080
     ```

5. **Resources**:
   - Select plan: Basic ($5/month)
   - Click "Create Resources"

6. **Deploy**:
   - Review and click "Create Resources"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://rarepdftool-api-xxxxx.ondigitalocean.app`

### Step 3: Update Frontend

Update your frontend `.env` file:
```env
VITE_API_URL=https://rarepdftool-api-xxxxx.ondigitalocean.app
```

---

## 💻 Option 2: Droplet with Ubuntu (Full Control)

### Step 1: Create a Droplet

1. **Login to Digital Ocean**: https://cloud.digitalocean.com/
2. **Create Droplet**:
   - **Image**: Ubuntu 24.04 LTS
   - **Plan**: Basic ($4/month - 512MB RAM, 10GB SSD)
   - **Region**: Choose closest to users
   - **Authentication**: SSH keys (recommended) or Password
   - **Hostname**: rarepdftool-api
   - Click "Create Droplet"

3. **Note your IP address** (e.g., 159.223.45.67)

### Step 2: Initial Server Setup

1. **Connect via SSH**:
```bash
ssh root@YOUR_DROPLET_IP
```

2. **Create a non-root user**:
```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

3. **Update system**:
```bash
sudo apt update && sudo apt upgrade -y
```

4. **Install Python and dependencies**:
```bash
# Install Python 3.11+
sudo apt install -y python3 python3-pip python3-venv

# Install system dependencies
sudo apt install -y ghostscript poppler-utils libreoffice

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Supervisor (process manager)
sudo apt install -y supervisor
```

### Step 3: Deploy Application

1. **Create application directory**:
```bash
sudo mkdir -p /var/www/rarepdftool
sudo chown deploy:deploy /var/www/rarepdftool
cd /var/www/rarepdftool
```

2. **Clone or upload your code**:

**Option A - Git Clone**:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
cd pdf-tools-phase1/server_py
```

**Option B - Upload via SCP** (from your local machine):
```bash
# From your local machine
cd /Users/abdulnabig/Documents/main_app/pdf-tools-phase1
scp -r server_py deploy@YOUR_DROPLET_IP:/var/www/rarepdftool/
```

3. **Create Python virtual environment**:
```bash
cd /var/www/rarepdftool/server_py
python3 -m venv venv
source venv/bin/activate
```

4. **Install Python packages**:
```bash
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn  # Production WSGI server
```

5. **Create uploads directory**:
```bash
mkdir -p uploads
chmod 755 uploads
```

6. **Test the app**:
```bash
# Test locally
uvicorn main:app --host 0.0.0.0 --port 8000

# Visit http://YOUR_DROPLET_IP:8000 in browser
# Press Ctrl+C to stop
```

### Step 4: Configure Supervisor (Process Manager)

1. **Create supervisor config**:
```bash
sudo nano /etc/supervisor/conf.d/rarepdftool.conf
```

2. **Add this configuration**:
```ini
[program:rarepdftool]
directory=/var/www/rarepdftool/server_py
command=/var/www/rarepdftool/server_py/venv/bin/gunicorn main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
user=deploy
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/rarepdftool/err.log
stdout_logfile=/var/log/rarepdftool/out.log
environment=ENVIRONMENT="production"
```

3. **Create log directory**:
```bash
sudo mkdir -p /var/log/rarepdftool
sudo chown deploy:deploy /var/log/rarepdftool
```

4. **Start the service**:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start rarepdftool

# Check status
sudo supervisorctl status rarepdftool
```

### Step 5: Configure Nginx (Reverse Proxy)

1. **Create Nginx config**:
```bash
sudo nano /etc/nginx/sites-available/rarepdftool
```

2. **Add this configuration**:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for large file processing
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }
}
```

3. **Enable the site**:
```bash
sudo ln -s /etc/nginx/sites-available/rarepdftool /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

4. **Configure firewall**:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Step 6: Test Your Deployment

Visit: `http://YOUR_DROPLET_IP`

You should see: `{"message": "RarePDFtool server is running and CORS is enabled."}`

---

## 🔐 Production Configuration

### 1. Environment Variables

Create `.env` file in server_py:
```bash
cd /var/www/rarepdftool/server_py
nano .env
```

Add:
```env
ENVIRONMENT=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MAX_FILE_SIZE=104857600
UPLOAD_DIR=uploads
```

### 2. Update main.py for Production

The production config has already been set up in `main.py`. Key features:
- CORS configured for production domains
- File size limits
- Error handling
- Request logging

### 3. Security Hardening

1. **Limit file upload size** (already in Nginx config)
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** (see SSL section below)
4. **Regular updates**:
```bash
sudo apt update && sudo apt upgrade -y
sudo supervisorctl restart rarepdftool
```

---

## 🌐 Domain & SSL Setup

### Step 1: Point Domain to Droplet

1. **In your domain registrar** (Namecheap, GoDaddy, etc.):
   - Add A record: `api.yourdomain.com` → `YOUR_DROPLET_IP`
   - Add A record: `@` → `YOUR_DROPLET_IP` (if hosting API on root)

2. **Wait for DNS propagation** (5 minutes - 48 hours)

### Step 2: Install SSL Certificate (Let's Encrypt)

1. **Install Certbot**:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

2. **Get SSL certificate**:
```bash
sudo certbot --nginx -d api.yourdomain.com
```

3. **Follow prompts**:
   - Enter email
   - Agree to terms
   - Choose to redirect HTTP to HTTPS

4. **Auto-renewal** (already configured):
```bash
sudo certbot renew --dry-run  # Test renewal
```

### Step 3: Update Frontend

Update `.env` in your React app:
```env
VITE_API_URL=https://api.yourdomain.com
```

---

## 📊 Monitoring & Maintenance

### Check Application Logs

```bash
# Supervisor logs
sudo tail -f /var/log/rarepdftool/out.log
sudo tail -f /var/log/rarepdftool/err.log

# Nginx logs
sudo tail -f /var/nginx/access.log
sudo tail -f /var/nginx/error.log
```

### Restart Services

```bash
# Restart application
sudo supervisorctl restart rarepdftool

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo supervisorctl status
sudo systemctl status nginx
```

### Update Application

```bash
cd /var/www/rarepdftool/server_py

# Pull latest changes
git pull origin main

# Update dependencies
source venv/bin/activate
pip install -r requirements.txt

# Restart
sudo supervisorctl restart rarepdftool
```

### Clean Up Uploads

Create a cleanup script:
```bash
nano /var/www/rarepdftool/server_py/cleanup.sh
```

Add:
```bash
#!/bin/bash
# Delete files older than 1 hour
find /var/www/rarepdftool/server_py/uploads -type f -mmin +60 -delete
```

Make executable and add to cron:
```bash
chmod +x /var/www/rarepdftool/server_py/cleanup.sh
crontab -e

# Add this line (runs every hour)
0 * * * * /var/www/rarepdftool/server_py/cleanup.sh
```

---

## 💰 Cost Comparison

### App Platform
- **Basic**: $5/month
- **Professional**: $12/month
- **Total**: ~$5-12/month

### Droplet
- **Droplet**: $4-6/month (512MB - 1GB)
- **Total**: ~$4-6/month

---

## 🆘 Troubleshooting

### Application Won't Start

```bash
# Check logs
sudo supervisorctl tail -f rarepdftool stderr

# Check Python errors
cd /var/www/rarepdftool/server_py
source venv/bin/activate
python main.py
```

### 502 Bad Gateway

```bash
# Check if app is running
sudo supervisorctl status rarepdftool

# Restart if needed
sudo supervisorctl restart rarepdftool
```

### CORS Errors

Update `main.py` allowed origins:
```python
allow_origins=["https://yourdomain.com", "https://www.yourdomain.com"]
```

### File Upload Fails

```bash
# Check permissions
ls -la /var/www/rarepdftool/server_py/uploads

# Fix if needed
sudo chown -R deploy:deploy /var/www/rarepdftool/server_py/uploads
chmod 755 /var/www/rarepdftool/server_py/uploads
```

---

## 📚 Additional Resources

- [Digital Ocean Docs](https://docs.digitalocean.com/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/getting-started/)

---

## ✅ Deployment Checklist

- [ ] Create Digital Ocean account
- [ ] Choose deployment method (App Platform or Droplet)
- [ ] Deploy application
- [ ] Test API endpoints
- [ ] Configure domain (optional)
- [ ] Install SSL certificate
- [ ] Update frontend API URL
- [ ] Test from frontend
- [ ] Set up monitoring
- [ ] Configure automatic backups
- [ ] Set up cleanup cron job

---

**Last Updated**: November 20, 2025  
**Status**: Production Ready  
**Recommended**: Droplet for $4-6/month
