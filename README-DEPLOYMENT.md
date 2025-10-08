# Studo.ps VPS Deployment Guide

## 📦 Files Created for Deployment

1. **deploy-vps.sh** - Automated deployment script
2. **nginx-studo.conf** - Nginx configuration file
3. **README-DEPLOYMENT.md** - This file (deployment instructions)

---

## 🚀 Quick Deployment (3 Steps)

### **Step 1: Upload deployment script to VPS**

```bash
# On your local machine, upload the script
scp deploy-vps.sh root@31.97.72.28:/root/
```

OR manually copy the content of `deploy-vps.sh` to your VPS.

### **Step 2: Run deployment script on VPS**

```bash
# SSH into your VPS
ssh root@31.97.72.28

# Make script executable and run it
chmod +x /root/deploy-vps.sh
bash /root/deploy-vps.sh
```

The script will:
- Clone the repository to `/var/www/studo-ecommerce`
- Install dependencies
- Prompt you to create `.env.local` file
- Build the application
- Start/restart PM2 process on port 3002

### **Step 3: Configure Nginx**

```bash
# Copy nginx config to sites-available
sudo cp /var/www/studo-ecommerce/nginx-studo.conf /etc/nginx/sites-available/studo-ecommerce

# Edit if needed (change domain name)
sudo nano /etc/nginx/sites-available/studo-ecommerce

# Enable the site
sudo ln -s /etc/nginx/sites-available/studo-ecommerce /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 📝 Manual Deployment (Detailed Steps)

If you prefer to run commands manually:

### 1. Clone Repository

```bash
cd /var/www
git clone https://github.com/3mo-falafel/studo.psFINAL.git studo-ecommerce
cd studo-ecommerce
```

### 2. Create Environment File

```bash
nano .env.local
```

Paste your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### 3. Install and Build

```bash
npm install --production
npm run build
```

### 4. Start with PM2

```bash
pm2 start npm --name "studo-ecommerce" -- start -- -p 3002
pm2 save
pm2 list
```

### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/studo-ecommerce
```

Paste the content from `nginx-studo.conf` file.

```bash
sudo ln -s /etc/nginx/sites-available/studo-ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 SSL Setup (Optional but Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d studo.ps -d www.studo.ps

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL is configured, edit nginx config and uncomment the HTTPS section.

---

## ✅ Verify Deployment

```bash
# Check PM2 status
pm2 list

# View logs
pm2 logs studo-ecommerce

# Check if port 3002 is listening
netstat -tuln | grep 3002

# Test locally
curl http://localhost:3002

# Check Nginx status
sudo systemctl status nginx
```

**Access your site:**
- Without domain: `http://31.97.72.28:3002`
- With domain (after Nginx): `http://studo.ps`
- With SSL: `https://studo.ps`

---

## 🔄 Future Updates

When you push changes to GitHub:

```bash
cd /var/www/studo-ecommerce
git pull
npm install --production
npm run build
pm2 restart studo-ecommerce
```

Or simply run:

```bash
bash /root/deploy-vps.sh
```

---

## 🛠️ Useful PM2 Commands

```bash
pm2 list                          # List all processes
pm2 logs studo-ecommerce          # View real-time logs
pm2 logs studo-ecommerce --lines 100  # View last 100 log lines
pm2 restart studo-ecommerce       # Restart app
pm2 stop studo-ecommerce          # Stop app
pm2 delete studo-ecommerce        # Remove from PM2
pm2 monit                         # Monitor CPU/Memory usage
pm2 save                          # Save current process list
pm2 startup                       # Enable PM2 on system boot
```

---

## 🐛 Troubleshooting

### Issue: Port 3002 already in use

```bash
# Find process using port 3002
sudo lsof -i :3002

# Kill the process
sudo kill -9 <PID>

# Restart PM2
pm2 restart studo-ecommerce
```

### Issue: Nginx shows 502 Bad Gateway

```bash
# Check if app is running
pm2 list

# Check logs
pm2 logs studo-ecommerce

# Restart app
pm2 restart studo-ecommerce

# Check Nginx error logs
sudo tail -f /var/nginx/error.log
```

### Issue: Build fails

```bash
# Check Node.js version (needs 18+)
node -v

# Upgrade if needed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Try build again
npm run build
```

---

## 📊 Site Structure

After deployment:

```
/var/www/studo-ecommerce/
├── .env.local              # Your environment variables
├── .next/                  # Built application
├── app/                    # Next.js app directory
├── components/             # React components
├── public/                 # Static files
├── scripts/                # Database scripts
├── deploy-vps.sh           # Deployment script
├── nginx-studo.conf        # Nginx configuration
└── package.json            # Dependencies
```

---

## ✨ Features Included

✅ Product reviews & ratings
✅ Site testimonials with infinite scrolling ticker
✅ Suggested products on product pages
✅ Admin dashboard with approve/reject/delete
✅ Bilingual support (English/Arabic)
✅ Mobile responsive
✅ Discount codes
✅ Order tracking
✅ Stock management

---

## 📞 Need Help?

- **PM2 Documentation**: https://pm2.keymetrics.io/docs
- **Nginx Documentation**: https://nginx.org/en/docs
- **Next.js Documentation**: https://nextjs.org/docs

---

**Repository**: https://github.com/3mo-falafel/studo.psFINAL.git
**VPS IP**: 31.97.72.28
**Port**: 3002
**Stack**: Next.js 15, React 19, Supabase, PM2, Nginx
