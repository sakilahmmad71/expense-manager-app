# Security Headers Configuration for Production

**Important:** Some security headers have been removed from the HTML `<meta>` tags because they only work when delivered as HTTP headers via the web server. Below is the recommended Nginx configuration for production deployment.

## Headers Removed from index.html

The following headers were removed from `<meta>` tags because they must be HTTP headers:

1. **X-Frame-Options** - Prevents clickjacking attacks
2. **frame-ancestors** (CSP directive) - Ignored when delivered via meta tags

## Recommended Nginx Configuration

Add these headers to your Nginx server configuration:

```nginx
# /etc/nginx/sites-available/expenser-app or in docker nginx.conf

server {
    listen 80;
    server_name app.expenser.site;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Content Security Policy with frame-ancestors
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.expenser.site https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;

    # Additional recommended security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Serve static files
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

## Apache Configuration (.htaccess)

If using Apache instead of Nginx:

```apache
# Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content Security Policy
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.expenser.site https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"

# Additional security
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

## Development vs Production CSP

**Current Setup:**

- The HTML meta tag CSP now includes localhost and local network IPs for development
- `connect-src` allows: `'self'`, `http://localhost:*`, `http://192.168.0.*:*`, production API, and Google Analytics

**For Production:**

- The Nginx/Apache HTTP headers should use the stricter CSP (without localhost)
- HTTP headers take precedence over meta tags, so production will be secure

## Verification

After deploying with these headers, verify them using:

1. **Online Tools:**
   - https://securityheaders.com
   - https://observatory.mozilla.org

2. **Browser DevTools:**
   - Open DevTools → Network tab → Click on the main document
   - Check Response Headers section

3. **Command Line:**
   ```bash
   curl -I https://app.expenser.site
   ```

## Notes

- The `always` parameter in Nginx ensures headers are sent even on error responses
- `frame-ancestors` is more flexible than `X-Frame-Options` but must be in HTTP headers
- For HTTPS-only sites, enable HSTS (Strict-Transport-Security)
- Adjust CSP directives based on your actual third-party service requirements
