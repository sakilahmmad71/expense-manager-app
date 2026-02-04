#!/bin/bash

# Regenerate all PWA icons from updated SVG sources
# Run this script after updating icon designs

set -e

echo "🎨 Regenerating All PWA Icons"
echo "=============================="
echo ""

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "❌ Error: ImageMagick is not installed"
    echo "📦 Install it using: brew install imagemagick"
    exit 1
fi

cd "$(dirname "$0")"

echo "📱 Generating favicon sizes..."
magick icon-512.svg -resize 16x16 favicon-16x16.png
magick icon-512.svg -resize 32x32 favicon-32x32.png
magick icon-512.svg -resize 96x96 favicon-96x96.png
magick icon-512.svg -resize 16x16 -colors 256 favicon.ico

echo "🍎 Generating Apple Touch icons..."
magick icon-512.svg -resize 57x57 apple-icon-57x57.png
magick icon-512.svg -resize 60x60 apple-icon-60x60.png
magick icon-512.svg -resize 72x72 apple-icon-72x72.png
magick icon-512.svg -resize 76x76 apple-icon-76x76.png
magick icon-512.svg -resize 114x114 apple-icon-114x114.png
magick icon-512.svg -resize 120x120 apple-icon-120x120.png
magick icon-512.svg -resize 144x144 apple-icon-144x144.png
magick icon-512.svg -resize 152x152 apple-icon-152x152.png
magick icon-512.svg -resize 180x180 apple-icon-180x180.png
magick icon-512.svg -resize 180x180 apple-icon.png
magick icon-512.svg -resize 180x180 apple-icon-precomposed.png

echo "🤖 Generating Android icons..."
magick icon-512.svg -resize 36x36 android-icon-36x36.png
magick icon-512.svg -resize 48x48 android-icon-48x48.png
magick icon-512.svg -resize 72x72 android-icon-72x72.png
magick icon-512.svg -resize 96x96 android-icon-96x96.png
magick icon-512.svg -resize 144x144 android-icon-144x144.png
magick icon-512.svg -resize 192x192 android-icon-192x192.png

echo "🪟 Generating Microsoft icons..."
magick icon-512.svg -resize 70x70 ms-icon-70x70.png
magick icon-512.svg -resize 144x144 ms-icon-144x144.png
magick icon-512.svg -resize 150x150 ms-icon-150x150.png
magick icon-512.svg -resize 310x310 ms-icon-310x310.png

echo ""
echo "✅ All icons regenerated successfully!"
echo "📦 Total icons created: ~30 files"
echo ""
