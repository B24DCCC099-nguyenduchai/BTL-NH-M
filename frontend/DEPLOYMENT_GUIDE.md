# Netlify Deployment Guide

This guide explains how to deploy the Diễn đàn Hỏi Đáp frontend to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://netlify.com))
2. Git repository with this code
3. Node.js 14+ installed locally

## Deployment Methods

### Option 1: Deploy via Netlify CLI (Fastest)

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Follow the prompts**:
   - Link to existing Netlify site or create new one
   - Confirm deployment directory is `dist`

### Option 2: Deploy via GitHub Integration (Recommended)

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Connect GitHub to Netlify**:
   - Log in to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose repository `dien-dan-hoi-dap`
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Base directory**: `frontend`

3. **Environment Variables** (if needed):
   - Go to Site Settings → Environment
   - Add `REACT_APP_API_URL` = `http://localhost:5000/api/v1` (or your production API URL)

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy on every push to `main`

### Option 3: Manual Drag & Drop

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify Dashboard**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Drag and drop the `dist` folder into the deployment area
   - Your site is live!

## Configuration

### netlify.toml

The project includes a `netlify.toml` configuration file:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This config:
- Runs `npm run build` on deploy
- Publishes from `dist` directory
- Redirects all routes to `/index.html` for SPA routing

### Production API URL

Before deploying, set your production API URL:

1. In `netlify.toml`, add environment variables:
   ```toml
   [build.environment]
     REACT_APP_API_URL = "https://your-api.example.com/api/v1"
   ```

2. Or set in Netlify Dashboard:
   - Site Settings → Build & Deploy → Environment
   - Add variable: `REACT_APP_API_URL`

## Post-Deployment

1. **Test your site**:
   - Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
   - Test homepage, login, and API calls
   - Check console for errors

2. **Custom Domain** (optional):
   - Go to Site Settings → Domain Management
   - Add custom domain and follow CNAME instructions

3. **Enable Netlify Functions** (optional, for serverless):
   - Create `netlify/functions/` directory
   - Add serverless functions as needed

## Troubleshooting

- **Build fails**: Check `npm run build` works locally
- **Routes not working**: Verify `netlify.toml` redirect rules
- **API calls failing**: Check `REACT_APP_API_URL` environment variable
- **Styles missing**: Clear Netlify cache: Site Settings → Build & Deploy → Clear cache and redeploy

## Production Checklist

- [ ] API URL set correctly in environment
- [ ] All pages tested (homepage, login, forum, etc.)
- [ ] Auth flow works (login redirects to homepage)
- [ ] API calls working (posts, tags loading)
- [ ] Mobile responsive (tested on mobile/tablet)
- [ ] No console errors
- [ ] Custom domain set (if applicable)
- [ ] SSL/HTTPS enabled (automatic on Netlify)

## Support

For issues with Netlify deployment, visit:
- [Netlify Docs](https://docs.netlify.com)
- [Netlify Community](https://community.netlify.com)
