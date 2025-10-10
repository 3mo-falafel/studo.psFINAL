#!/bin/bash

# DNS Propagation Checker for studo.online
# Run this script on your VPS to check if DNS has propagated

echo "================================================"
echo "🔍 Checking DNS Propagation for studo.online"
echo "================================================"
echo ""

echo "1️⃣ Checking studo.online (root domain)..."
dig +short studo.online @8.8.8.8
RESULT1=$(dig +short studo.online @8.8.8.8)

if [ -z "$RESULT1" ]; then
    echo "   ❌ studo.online - NOT PROPAGATED YET"
    echo "   Expected: 31.97.72.28"
    echo "   Got: (nothing)"
else
    echo "   ✅ studo.online resolves to: $RESULT1"
    if [ "$RESULT1" = "31.97.72.28" ]; then
        echo "   ✅ CORRECT IP!"
    else
        echo "   ⚠️  Wrong IP (expected 31.97.72.28)"
    fi
fi

echo ""
echo "2️⃣ Checking www.studo.online..."
dig +short www.studo.online @8.8.8.8
RESULT2=$(dig +short www.studo.online @8.8.8.8)

if [ -z "$RESULT2" ]; then
    echo "   ❌ www.studo.online - NOT PROPAGATED YET"
    echo "   Expected: 31.97.72.28"
    echo "   Got: (nothing)"
else
    echo "   ✅ www.studo.online resolves to: $RESULT2"
    if [ "$RESULT2" = "31.97.72.28" ]; then
        echo "   ✅ CORRECT IP!"
    else
        echo "   ⚠️  Wrong IP (expected 31.97.72.28)"
    fi
fi

echo ""
echo "================================================"
echo "📊 Summary"
echo "================================================"

if [ "$RESULT1" = "31.97.72.28" ] && [ "$RESULT2" = "31.97.72.28" ]; then
    echo "✅ DNS is fully propagated!"
    echo "✅ You can now run: certbot --nginx -d studo.online -d www.studo.online"
elif [ -z "$RESULT1" ] || [ -z "$RESULT2" ]; then
    echo "⏳ DNS not propagated yet. Please wait 10-30 minutes."
    echo "💡 DNS changes typically take 15-30 minutes to propagate."
    echo ""
    echo "Run this script again in a few minutes:"
    echo "   bash check-dns.sh"
else
    echo "⚠️  DNS propagated but pointing to wrong IP"
    echo "📝 Please check your GoDaddy DNS settings"
fi

echo ""
