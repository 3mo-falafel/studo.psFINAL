# 🌐 Domain Setup Guide: studo.online → VPS (31.97.72.28:3002)

## Overview
- **Domain:** studo.online (GoDaddy)
- **VPS IP:** 31.97.72.28
- **App Port:** 3002
- **Goal:** Connect domain to your Next.js app running on port 3002

---

## 📋 Step-by-Step Guide

### **PART 1: Configure DNS on GoDaddy**

#### Step 1: Login to GoDaddy
1. Go to [GoDaddy.com](https://www.godaddy.com)
2. Login to your account
3. Go to **My Products** → **Domains**
4. Find `studo.online` and click **DNS** button

#### Step 2: Add DNS Records
Add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 31.97.72.28 | 600 |
| A | www | 31.97.72.28 | 600 |

**Instructions:**
1. Click **Add** button
2. Select **Type: A**
3. **Name:** `@` (for root domain studo.online)
4. **Value:** `31.97.72.28`
5. **TTL:** 600 seconds (or default)
6. Click **Save**

7. Click **Add** again
8. Select **Type: A**
9. **Name:** `www` (for www.studo.online)
10. **Value:** `31.97.72.28`
11. **TTL:** 600 seconds
12. Click **Save**

#### Step 3: Wait for DNS Propagation
- DNS changes can take **15 minutes to 48 hours** to propagate
- Usually takes **15-30 minutes**
- You can check propagation at: https://www.whatsmydns.net/

---

### **PART 2: Configure Nginx on Your VPS**

#### Step 1: SSH into Your VPS
```bash
ssh root@31.97.72.28
```

#### Step 2: Install Nginx (if not already installed)
```bash
# Check if nginx is installed
nginx -v

# If not installed, install it:
apt update
apt install nginx -y

# Start and enable nginx
systemctl start nginx
systemctl enable nginx
```

#### Step 3: Create Nginx Configuration for studo.online
```bash
# Create new config file
nano /etc/nginx/sites-available/studo.online
```

**Paste this configuration:**
```nginx
# Redirect www to non-www
server {
    listen 80;
    server_name www.studo.online;
    return 301 http://studo.online$request_uri;
}

# Main server block
server {
    listen 80;
    server_name studo.online;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Logging
    access_log /var/log/nginx/studo.online-access.log;
    error_log /var/log/nginx/studo.online-error.log;

    # Proxy to Next.js app on port 3002
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3002;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Public static files
    location /static {
        proxy_pass http://localhost:3002;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Favicon and common files
    location ~* \.(ico|css|js|gif|jpeg|jpg|png|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3002;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

#### Step 4: Enable the Site
```bash
# Create symbolic link to enable the site
ln -s /etc/nginx/sites-available/studo.online /etc/nginx/sites-enabled/

# Remove default nginx page (if it exists)
rm -f /etc/nginx/sites-enabled/default
```

#### Step 5: Test and Reload Nginx
```bash
# Test nginx configuration
nginx -t

# If test passes, reload nginx
systemctl reload nginx
```

---

### **PART 3: Setup SSL Certificate (HTTPS) with Let's Encrypt**

#### Step 1: Install Certbot
```bash
# Install certbot and nginx plugin
apt install certbot python3-certbot-nginx -y
```

#### Step 2: Obtain SSL Certificate
```bash
# Get certificate for both domain and www subdomain
certbot --nginx -d studo.online -d www.studo.online
```

**Follow the prompts:**
1. Enter your email address
2. Agree to terms (type `Y`)
3. Choose whether to share email (type `Y` or `N`)
4. Choose option **2** (Redirect HTTP to HTTPS)

#### Step 3: Verify Auto-Renewal
```bash
# Test auto-renewal
certbot renew --dry-run

# Certbot will automatically renew certificates before they expire
```

---

### **PART 4: Ensure Your Next.js App is Running**

#### Step 1: Check if App is Running on Port 3002
```bash
# Check if something is listening on port 3002
netstat -tulpn | grep 3002

# Or use lsof
lsof -i :3002
```

#### Step 2: If App is NOT Running, Start It
```bash
# Navigate to your app directory
cd /path/to/your/studo-ecommerce

# Build the app
npm run build

# Start with PM2 (recommended)
pm2 start npm --name "studo-online" -- start

# Or specify port if needed
pm2 start npm --name "studo-online" -- start -- -p 3002

# Save PM2 process list
pm2 save

# Enable PM2 startup on boot
pm2 startup
```

#### Step 3: Verify App is Accessible Locally
```bash
# Test from VPS
curl http://localhost:3002

# Should return HTML content
```

---

### **PART 5: Configure Firewall**

```bash
# Allow HTTP and HTTPS through firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp  # SSH (make sure this is already allowed!)

# Check firewall status
ufw status

# If firewall is inactive, enable it (ONLY if SSH is allowed!)
ufw enable
```

---

### **PART 6: Verification & Testing**

#### After DNS Propagates (15-30 minutes):

1. **Test HTTP:**
   ```bash
   curl -I http://studo.online
   # Should return 301 redirect to HTTPS (after SSL setup)
   ```

2. **Test HTTPS:**
   ```bash
   curl -I https://studo.online
   # Should return 200 OK
   ```

3. **Open in Browser:**
   - Visit: https://studo.online
   - Visit: https://www.studo.online (should redirect to non-www)

4. **Check SSL Certificate:**
   - Click the padlock icon in browser
   - Should show "Let's Encrypt" certificate
   - Valid for 90 days

---

## 🔧 Troubleshooting

### DNS not working?
```bash
# Check DNS propagation
nslookup studo.online

# Or use dig
dig studo.online +short
# Should return: 31.97.72.28
```

### Nginx errors?
```bash
# Check nginx error logs
tail -f /var/log/nginx/studo.online-error.log

# Check nginx access logs
tail -f /var/log/nginx/studo.online-access.log

# Test nginx config
nginx -t
```

### SSL certificate issues?
```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew

# Check certificate files
ls -la /etc/letsencrypt/live/studo.online/
```

### App not responding?
```bash
# Check if app is running
pm2 list

# Check app logs
pm2 logs studo-online

# Restart app
pm2 restart studo-online

# Check port 3002
netstat -tulpn | grep 3002
```

### Port already in use?
```bash
# Find what's using port 3002
lsof -i :3002

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

---

## 📝 Quick Command Summary

```bash
# 1. SSH into VPS
ssh root@31.97.72.28

# 2. Create nginx config
nano /etc/nginx/sites-available/studo.online

# 3. Enable site
ln -s /etc/nginx/sites-available/studo.online /etc/nginx/sites-enabled/

# 4. Test and reload nginx
nginx -t && systemctl reload nginx

# 5. Install SSL
certbot --nginx -d studo.online -d www.studo.online

# 6. Check app is running
pm2 list
netstat -tulpn | grep 3002

# 7. Test domain
curl -I https://studo.online
```

---

## ✅ Success Checklist

- [ ] DNS A records added in GoDaddy (@ and www → 31.97.72.28)
- [ ] DNS propagated (15-30 minutes wait)
- [ ] Nginx installed and running
- [ ] Nginx config created for studo.online
- [ ] Nginx config tested and reloaded
- [ ] SSL certificate installed with certbot
- [ ] Next.js app running on port 3002
- [ ] Firewall allows ports 80 and 443
- [ ] https://studo.online works in browser
- [ ] www.studo.online redirects to non-www
- [ ] SSL certificate shows as valid

---

## 🎉 Once Complete

Your website will be accessible at:
- ✅ **https://studo.online** (main)
- ✅ **https://www.studo.online** (redirects to main)
- ✅ Secure with SSL/HTTPS
- ✅ Fast with Nginx reverse proxy

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review nginx and app logs
3. Verify DNS propagation
4. Ensure app is running on port 3002

Good luck! 🚀
