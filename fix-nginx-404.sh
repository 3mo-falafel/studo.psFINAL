#!/bin/bash

# Quick Fix Script for studo.online Nginx 404 Error
# Run this on your VPS as root

echo "================================================"
echo "🔧 Fixing Nginx Configuration for studo.online"
echo "================================================"
echo ""

echo "Step 1: Checking if nginx config exists..."
if [ -f /etc/nginx/sites-available/studo.online ]; then
    echo "✅ Config file exists"
else
    echo "❌ Config file missing - creating now..."
fi

echo ""
echo "Step 2: Creating nginx configuration..."

cat > /etc/nginx/sites-available/studo.online << 'EOF'
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
EOF

echo "✅ Config file created"

echo ""
echo "Step 3: Enabling the site..."
ln -sf /etc/nginx/sites-available/studo.online /etc/nginx/sites-enabled/

echo ""
echo "Step 4: Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid"
    echo ""
    echo "Step 5: Reloading nginx..."
    systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx config has errors - please check above"
    exit 1
fi

echo ""
echo "Step 6: Checking if app is running on port 3002..."
if netstat -tulpn | grep -q ":3002"; then
    echo "✅ App is running on port 3002"
    netstat -tulpn | grep :3002
else
    echo "❌ WARNING: No app is running on port 3002!"
    echo ""
    echo "You need to start your Next.js app:"
    echo "  cd /var/www/studo-ecommerce"
    echo "  pm2 start npm --name studo-online -- start"
    echo "  Or if app is already in PM2: pm2 restart studo-online"
fi

echo ""
echo "================================================"
echo "✅ Configuration Complete!"
echo "================================================"
echo ""
echo "Test your site:"
echo "  curl -I http://studo.online"
echo "  Or visit: http://studo.online in your browser"
echo ""
echo "To check nginx logs if there are issues:"
echo "  tail -f /var/log/nginx/studo.online-error.log"
echo ""
