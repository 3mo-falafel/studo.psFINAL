#!/bin/bash
# VPS Deployment Script for Studo.ps E-commerce
# Run this on your VPS at 31.97.72.28

echo "=== Studo.ps Deployment Script ==="
echo ""

# Step 1: Navigate to projects directory
echo "Step 1: Setting up directory..."
cd /var/www || exit

# Step 2: Clone repository
echo "Step 2: Cloning repository..."
if [ -d "studo-ecommerce" ]; then
    echo "Directory exists, pulling latest changes..."
    cd studo-ecommerce
    git pull
else
    echo "Cloning fresh repository..."
    git clone https://github.com/3mo-falafel/studo.psFINAL.git studo-ecommerce
    cd studo-ecommerce
fi

# Step 3: Install dependencies
echo "📦 Installing dependencies..."
npm install --production --legacy-peer-deps

# Step 4: Create .env.local file
echo "Step 4: Creating environment file..."
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://kkulikrjfnvrttamgdxh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdWxpa3JqZm52cnR0YW1nZHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTI1MTMsImV4cCI6MjA3NTI2ODUxM30.THGTDZE7K_zXQU-p1oO7OhaLNn4uvzZ8eakcKiYShC4
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOF

echo "✅ Environment file created"
echo ""

# Step 5: Build application
echo "Step 5: Building Next.js application..."
npm run build

# Step 6: Check if PM2 process exists
echo "Step 6: Managing PM2 process..."
if pm2 list | grep -q "studo-ecommerce"; then
    echo "Restarting existing PM2 process..."
    pm2 restart studo-ecommerce
else
    echo "Starting new PM2 process on port 3002..."
    pm2 start npm --name "studo-ecommerce" -- start -- -p 3002
fi

# Save PM2 configuration
pm2 save

# Step 7: Check status
echo ""
echo "=== Deployment Status ==="
pm2 list
echo ""
echo "=== Logs (last 20 lines) ==="
pm2 logs studo-ecommerce --lines 20 --nostream

echo ""
echo "✅ Deployment complete!"
echo "Access your site at:"
echo "  - http://31.97.72.28:3002"
echo "  - http://studo.ps (if domain configured)"
echo ""
echo "Useful commands:"
echo "  pm2 logs studo-ecommerce    # View logs"
echo "  pm2 restart studo-ecommerce # Restart app"
echo "  pm2 stop studo-ecommerce    # Stop app"
echo "  pm2 monit                   # Monitor resources"
