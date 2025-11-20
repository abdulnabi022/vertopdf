# 🚀 Quick Start Guide - Digital Ocean Deployment

Choose your deployment method based on your needs:

---

## ⚡ Option 1: App Platform (Easiest - 5 Minutes)

**Perfect for**: Beginners, quick deployment, no server management

### Steps:

1. **Push code to GitHub**:
   ```bash
   cd /Users/abdulnabig/Documents/main_app/pdf-tools-phase1
   git add server_py/
   git commit -m "feat: add Digital Ocean deployment configs"
   git push origin main
   ```

2. **Go to Digital Ocean**: https://cloud.digitalocean.com/apps

3. **Create New App**:
   - Click "Create" → "Apps"
   - Connect GitHub → Select your repo
   - Source Directory: `pdf-tools-phase1/server_py`
   - It will auto-detect `app.yaml`

4. **Configure**:
   - Name: `rarepdftool-api`
   - Plan: Basic ($5/month)
   - Click "Create Resources"

5. **Get your URL**:
   - Copy the app URL (e.g., `https://rarepdftool-api-xxxxx.ondigitalocean.app`)
   - Update frontend `.env`:
     ```env
     VITE_API_URL=https://rarepdftool-api-xxxxx.ondigitalocean.app
     ```

6. **Done!** ✅ Your API is live!

**Cost**: $5/month  
**Time**: 5-10 minutes  
**Skill Level**: Beginner

---

## 💻 Option 2: Droplet (Best Value - 30 Minutes)

**Perfect for**: Production apps, custom control, lower cost

### Quick Setup:

1. **Create Droplet**:
   - Go to: https://cloud.digitalocean.com/droplets
   - Ubuntu 24.04 LTS
   - Basic plan: $4/month (512MB RAM)
   - Choose region closest to users
   - Add SSH key or use password
   - Create Droplet

2. **Run this automated script on your droplet**:
   ```bash
   # SSH into your droplet
   ssh root@YOUR_DROPLET_IP
   
   # Run this one-liner
   curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/pdf-tools-phase1/server_py/deploy.sh | bash
   ```

3. **Or manual setup** - Follow the detailed guide in `DIGITALOCEAN_DEPLOYMENT.md`

4. **Update frontend**:
   ```env
   VITE_API_URL=http://YOUR_DROPLET_IP
   ```

5. **Done!** ✅ Your API is live!

**Cost**: $4/month  
**Time**: 30 minutes  
**Skill Level**: Intermediate

---

## 🌐 Optional: Add Custom Domain + SSL

After deployment:

1. **Point domain to your server**:
   - App Platform: Follow DO instructions in app settings
   - Droplet: Add A record pointing to droplet IP

2. **Add SSL** (Droplet only):
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

3. **Update frontend**:
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

---

## 📊 Cost Breakdown

| Method | Monthly Cost | Setup Time | Maintenance |
|--------|-------------|------------|-------------|
| App Platform | $5-12 | 5 min | None |
| Droplet | $4-6 | 30 min | Minimal |

---

## 🆘 Need Help?

- **Detailed Guide**: See `DIGITALOCEAN_DEPLOYMENT.md`
- **Troubleshooting**: Check logs section in deployment guide
- **Digital Ocean Docs**: https://docs.digitalocean.com/

---

## ✅ Deployment Checklist

- [ ] Choose deployment method
- [ ] Create Digital Ocean account ($200 free credit for 60 days)
- [ ] Deploy backend
- [ ] Test API endpoint
- [ ] Update frontend API URL
- [ ] Test from frontend
- [ ] (Optional) Add custom domain
- [ ] (Optional) Enable SSL

---

**Recommended**: Start with App Platform for easy deployment, migrate to Droplet later for cost savings.

**Free Trial**: Digital Ocean gives $200 credit for 60 days - try both methods!
