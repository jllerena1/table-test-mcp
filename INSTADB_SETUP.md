# InstaDB Authentication Setup Guide

## Quick Start

### Option 1: Development Mode (Testing without API)

To test the authentication flow without connecting to InstaDB API:

1. Edit `.env` file and set:
   ```env
   VITE_DEV_MODE=true
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Use code `123456` to login (any email works in dev mode)

### Option 2: Connect to InstaDB API

1. **Find your InstaDB API URL**
   - Check your InstaDB dashboard/documentation
   - Common patterns:
     - `https://api.instadb.com`
     - `https://instadb.com/api`
     - `https://your-instance.instadb.com`
     - Custom domain provided by InstaDB

2. **Update `.env` file:**
   ```env
   VITE_INSTADB_PUBLIC_ID=a95cda59-fec3-424a-a98d-a7740a45ddf9
   VITE_INSTADB_API_URL=https://your-instadb-api-url.com
   VITE_DEV_MODE=false
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Troubleshooting

### Error: "Unable to connect to InstaDB"

**Possible causes:**

1. **Wrong API URL**
   - Check InstaDB documentation for correct API endpoint
   - Verify the URL in your InstaDB dashboard
   - Try different URL patterns (see below)

2. **CORS Issues**
   - InstaDB may need to whitelist your domain
   - For development, ensure `localhost` is allowed
   - Check browser console for CORS errors

3. **API Endpoint Structure**
   - The code tries multiple endpoint patterns automatically
   - Check browser console (F12) for which endpoints are being tried
   - Look for: `🔍 Attempting request to: [URL]`

4. **Network/Firewall**
   - Check your internet connection
   - Verify firewall isn't blocking requests
   - Try accessing InstaDB dashboard in browser

### Finding the Correct API URL

1. **Check InstaDB Dashboard**
   - Log into your InstaDB account
   - Look for API settings or documentation section
   - Check for "API Endpoint" or "API URL" settings

2. **Check InstaDB Documentation**
   - Visit: https://instadb.com/en/
   - Look for API documentation or developer guides
   - Contact support: instadb@instadb.com

3. **Common URL Patterns to Try:**
   ```
   https://api.instadb.com
   https://instadb.com/api
   https://api.instadb.io
   https://instadb.com
   https://{publicId}.instadb.com
   https://{publicId}.api.instadb.com
   ```

### Debugging Steps

1. **Open Browser Console** (F12 → Console tab)
2. **Try to login** - you'll see detailed logs:
   - `🔍 Attempting request to: [URL]` - shows which endpoint is being tried
   - `❌ Fetch error` - shows specific error details
   - `📡 Response status` - shows HTTP response codes

3. **Check Network Tab** (F12 → Network tab)
   - See actual HTTP requests being made
   - Check request/response headers
   - Verify if requests are reaching the server

4. **Verify Environment Variables**
   - Make sure `.env` file exists in project root
   - Restart dev server after changing `.env`
   - Variables must start with `VITE_` to be accessible

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_INSTADB_PUBLIC_ID` | Your InstaDB database Public ID | `a95cda59-fec3-424a-a98d-a7740a45ddf9` |
| `VITE_INSTADB_API_URL` | Base URL for InstaDB API | `https://api.instadb.com` |
| `VITE_DEV_MODE` | Enable dev mode (true/false) | `false` |

## Next Steps

1. **If you have InstaDB API documentation:**
   - Update `VITE_INSTADB_API_URL` with the correct base URL
   - Verify endpoint paths match (`/auth/request-code`, `/auth/verify-code`)

2. **If you don't have API documentation:**
   - Contact InstaDB support: instadb@instadb.com
   - Phone: +48 790 747 877
   - Check your InstaDB dashboard for API settings

3. **For testing/development:**
   - Use `VITE_DEV_MODE=true` to test UI without API
   - Use code `123456` to login in dev mode

## Support

- InstaDB Email: instadb@instadb.com
- InstaDB Phone: +48 790 747 877
- InstaDB Website: https://instadb.com/en/
