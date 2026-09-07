# Sekelela Loans - Deployment Guide

Complete guide for deploying the Sekelela Loans application to production environments.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Options](#deployment-options)
- [Environment Setup](#environment-setup)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

Before deploying to production, ensure:

### Code Quality
- [ ] All code has been reviewed
- [ ] No console errors or warnings
- [ ] JavaScript minified (optional but recommended)
- [ ] CSS optimized
- [ ] HTML validated

### Functionality Testing
- [ ] Calculator works correctly on all devices
- [ ] Form validation works as expected
- [ ] File uploads function properly
- [ ] All buttons and links work
- [ ] Modal dialogs open/close correctly
- [ ] Mobile responsiveness verified (320px - 1920px)

### Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Edge (desktop)

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Mobile performance verified
- [ ] No memory leaks

### Security
- [ ] HTTPS certificate obtained
- [ ] Security headers configured
- [ ] Input validation working
- [ ] File upload restrictions enforced
- [ ] CORS properly configured

### Documentation
- [ ] README.md updated
- [ ] BACKEND-SETUP.md completed
- [ ] Contact information verified
- [ ] Terms & Conditions reviewed

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended for Static Hosting)

**Pros:**
- Free tier available
- Automatic HTTPS
- GitHub integration
- Low maintenance

**Cons:**
- Static content only
- Limited customization
- GitHub account required

**Steps:**

1. **Enable GitHub Pages**
```bash
# 1. Go to repository settings
# 2. Navigate to "Pages" section
# 3. Under "Source", select "Deploy from a branch"
# 4. Select "main" branch
# 5. Click "Save"
```

2. **Wait for deployment**
   - GitHub will build and deploy automatically
   - Site available at: `https://mstembo127-ai.github.io/sekelela-loans/`

3. **Custom domain (optional)**
```bash
# 1. Add a CNAME file to repository root with your domain
# 2. Configure DNS settings at your domain registrar
# 3. Point DNS to GitHub Pages
```

4. **Verify deployment**
   - Visit your site URL
   - Test all features
   - Check mobile responsiveness

---

### Option 2: Netlify (Recommended for Modern Deployment)

**Pros:**
- Generous free tier
- Automatic deployments from GitHub
- Built-in CDN
- Automatic HTTPS
- Form submissions support
- Environmental variables

**Cons:**
- Requires Netlify account
- Free tier has limits

**Steps:**

1. **Create Netlify Account**
   - Visit https://netlify.com
   - Sign up with GitHub
   - Authorize Netlify

2. **Connect Repository**
```bash
# Option A: Via Netlify UI
# 1. Click "New site from Git"
# 2. Select GitHub
# 3. Authorize and select repository
# 4. Click "Deploy"

# Option B: Via Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
```

3. **Configure Build Settings**
```
Build command: (leave empty)
Publish directory: .
```

4. **Set Environment Variables (if needed)**
```
In Netlify UI:
Site settings → Build & deploy → Environment
Add any API keys or configuration
```

5. **Deploy**
```bash
netlify deploy --prod
```

6. **Custom Domain**
```
Site settings → Domain management → Add domain
Follow DNS configuration instructions
```

---

### Option 3: Vercel (Modern & Fast)

**Pros:**
- Optimized for speed
- Automatic deployments
- Built-in analytics
- Free tier with GitHub

**Cons:**
- Requires account
- Free tier limits

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Configure Custom Domain**
```
Following the CLI prompts during deployment
Or configure in Vercel dashboard
```

---

### Option 4: Traditional Hosting (Apache/Nginx)

**Pros:**
- Full control
- No vendor lock-in
- Can run backend code

**Cons:**
- Requires server knowledge
- Manual maintenance
- Requires HTTPS certificate

#### Apache Setup

1. **Prepare Files**
```bash
# Create project directory
mkdir -p /var/www/sekelela-loans
cd /var/www/sekelela-loans

# Clone repository
git clone https://github.com/mstembo127-ai/sekelela-loans.git .
```

2. **Configure Apache Virtual Host**
```apache
# /etc/apache2/sites-available/sekelela-loans.conf

<VirtualHost *:80>
    ServerName sekelela.zm
    ServerAlias www.sekelela.zm
    ServerAdmin support@sekelela.zm
    
    DocumentRoot /var/www/sekelela-loans
    
    <Directory /var/www/sekelela-loans>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Enable mod_rewrite for single-page app
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/sekelela-loans-error.log
    CustomLog ${APACHE_LOG_DIR}/sekelela-loans-access.log combined
    
    # Redirect HTTP to HTTPS
    Redirect permanent / https://sekelela.zm/
</VirtualHost>

# HTTPS Configuration
<VirtualHost *:443>
    ServerName sekelela.zm
    ServerAlias www.sekelela.zm
    ServerAdmin support@sekelela.zm
    
    DocumentRoot /var/www/sekelela-loans
    
    # SSL Certificate (Let's Encrypt)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/sekelela.zm/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/sekelela.zm/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/sekelela.zm/chain.pem
    
    # Security Headers
    Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    
    <Directory /var/www/sekelela-loans>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
    
    ErrorLog ${APACHE_LOG_DIR}/sekelela-loans-error.log
    CustomLog ${APACHE_LOG_DIR}/sekelela-loans-access.log combined
</VirtualHost>
```

3. **Enable Apache Modules**
```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
```

4. **Enable Virtual Host**
```bash
sudo a2ensite sekelela-loans.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest  # Should return "Syntax OK"
sudo systemctl restart apache2
```

5. **Set Permissions**
```bash
sudo chown -R www-data:www-data /var/www/sekelela-loans
sudo chmod -R 755 /var/www/sekelela-loans
```

#### Nginx Setup

1. **Prepare Files**
```bash
mkdir -p /var/www/sekelela-loans
cd /var/www/sekelela-loans
git clone https://github.com/mstembo127-ai/sekelela-loans.git .
```

2. **Configure Nginx**
```nginx
# /etc/nginx/sites-available/sekelela-loans

server {
    listen 80;
    listen [::]:80;
    server_name sekelela.zm www.sekelela.zm;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sekelela.zm www.sekelela.zm;
    
    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/sekelela.zm/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sekelela.zm/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    root /var/www/sekelela-loans;
    index index.html;
    
    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss;
    gzip_vary on;
    gzip_min_length 1000;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Single Page App routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Logging
    access_log /var/log/nginx/sekelela-loans-access.log;
    error_log /var/log/nginx/sekelela-loans-error.log;
}
```

3. **Enable Configuration**
```bash
sudo ln -s /etc/nginx/sites-available/sekelela-loans /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

4. **Set Permissions**
```bash
sudo chown -R www-data:www-data /var/www/sekelela-loans
sudo chmod -R 755 /var/www/sekelela-loans
```

---

### Option 5: Docker Container

**Benefits:**
- Consistent environment
- Easy scaling
- Portable deployment

**Dockerfile:**
```dockerfile
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1
```

**nginx.conf for Docker:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript;
    gzip_vary on;
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    error_page 404 /index.html;
}
```

**Build and Run:**
```bash
# Build image
docker build -t sekelela-loans:latest .

# Run container
docker run -d -p 80:80 --name sekelela-loans sekelela-loans:latest

# Push to registry (optional)
docker tag sekelela-loans:latest your-registry/sekelela-loans:latest
docker push your-registry/sekelela-loans:latest
```

---

## 🔧 Environment Setup

### SSL/TLS Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-apache  # For Apache
# OR
sudo apt-get install certbot python3-certbot-nginx   # For Nginx

# Obtain certificate
sudo certbot certonly --standalone -d sekelela.zm -d www.sekelela.zm

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

### Performance Optimization

1. **Enable Gzip Compression**
```apache
# Apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

2. **Browser Caching**
```apache
# Apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 day"
    ExpiresByType text/css "access plus 30 days"
    ExpiresByType text/javascript "access plus 30 days"
    ExpiresByType image/* "access plus 30 days"
</IfModule>
```

3. **Minification**
```bash
# Minify CSS (optional)
# Use: https://cssnano.co/

# Minify JS (optional)
# Use: https://terser.org/
```

4. **CDN Setup**
   - Use Cloudflare for free CDN
   - Configure DNS CNAME to Cloudflare
   - Enable caching rules

---

## 📊 Monitoring & Logging

### Error Monitoring

1. **Sentry (Error Tracking)**
```javascript
// Add to app.js
if (window.location.hostname !== 'localhost') {
    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/7.0.0/bundle.min.js';
    document.head.appendChild(script);
    
    window.addEventListener('load', () => {
        Sentry.init({
            dsn: 'YOUR_SENTRY_DSN',
            environment: 'production',
            tracesSampleRate: 0.1,
        });
    });
}
```

2. **Google Analytics**
```javascript
// Add to index.html before </head>
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Log Rotation

```bash
# /etc/logrotate.d/sekelela-loans
/var/log/apache2/sekelela-loans-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload apache2 > /dev/null 2>&1 || true
    endscript
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. HTTPS Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Check expiration
echo | openssl s_client -servername sekelela.zm -connect sekelela.zm:443 2>/dev/null | openssl x509 -noout -dates
```

#### 2. 404 Errors on Page Refresh
**Solution**: Configure server to serve `index.html` for all routes

**Apache (already configured above)**
**Nginx (already configured above)**

#### 3. CORS Errors
```apache
# Apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"
```

#### 4. Slow Performance
```bash
# Check load
top
htop

# Check disk space
df -h

# Check memory
free -h

# Analyze with Lighthouse
# Visit: https://developer.chrome.com/docs/lighthouse
```

#### 5. File Permission Issues
```bash
# Reset permissions
sudo chown -R www-data:www-data /var/www/sekelela-loans
sudo chmod -R 755 /var/www/sekelela-loans
sudo chmod 644 /var/www/sekelela-loans/*.{html,css,js}
```

### Debug Mode

```bash
# Check Apache error log
sudo tail -f /var/log/apache2/sekelela-loans-error.log

# Check Nginx error log
sudo tail -f /var/log/nginx/sekelela-loans-error.log

# Check application console (browser DevTools)
# F12 → Console tab
```

---

## 📈 Post-Deployment

### Verification Checklist

- [ ] Site loads without errors
- [ ] HTTPS is active and valid
- [ ] Performance score > 90 (Lighthouse)
- [ ] Mobile responsiveness confirmed
- [ ] All forms work correctly
- [ ] Calculator displays accurate results
- [ ] File uploads function
- [ ] Contact information is correct
- [ ] Terms & Conditions load properly
- [ ] No console errors
- [ ] Monitoring is active

### Maintenance

**Daily**
- Monitor error logs
- Check uptime status

**Weekly**
- Review analytics
- Test all features
- Backup database (if applicable)

**Monthly**
- Update dependencies
- Review security logs
- Performance optimization

**Quarterly**
- Full security audit
- Backup review
- Documentation update

---

## 📞 Support

For deployment issues:
- Check logs (see Troubleshooting section)
- Review your hosting provider's documentation
- Contact support@sekelela.zm
- Create GitHub issue with details

---

**Last Updated**: September 7, 2026  
**Version**: 1.0.0
