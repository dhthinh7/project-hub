# Deployment Guide

## Deploy to AWS Amplify

### Prerequisites
- AWS Account
- GitHub/GitLab/Bitbucket repository

### Steps

1. **Build Server Package (Important!)**
   ```bash
   npm install
   npm run build:server-package
   ```
   This creates `public/local-server.zip` which users will download.

2. **Push code to repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" > "Host web app"
   - Connect your repository
   - Select branch (usually `main`)

4. **Configure Build Settings**
   - Amplify will auto-detect Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - **Important**: Make sure `public/local-server.zip` is included in the build

5. **Environment Variables** (if needed)
   - No environment variables required for this app

6. **Deploy**
   - Click "Save and deploy"
   - Wait for build to complete
   - Your app will be available at `https://your-app-id.amplifyapp.com`

## Local Server Setup (For End Users)

### For Users:

1. **Download Local Server**
   - Click the "Download & Setup Local Server" button in the web app
   - Or manually download from the repository

2. **Extract and Run**
   - **Windows**: Extract the zip, then double-click `start.bat`
   - **Mac/Linux**: Extract the zip, then run:
     ```bash
     chmod +x start.sh
     ./start.sh
     ```

3. **Automatic Setup**
   - The installer will automatically:
     - Check for Node.js
     - Install dependencies
     - Start the server on `http://localhost:3001`

4. **Keep Server Running**
   - The server must be running for the web app to open projects
   - Consider setting up auto-start (see `local-server/README.md`)

### Security Note

The local server runs on `localhost:3001` and only accepts connections from the same machine. This is safe because:
- It only listens on localhost (not exposed to internet)
- CORS is enabled but only for local connections
- No authentication needed since it's local-only

## Architecture

```
┌─────────────────┐
│  AWS Amplify    │  ← Frontend (Next.js)
│  (Public Web)   │     - Stores data in localStorage
└────────┬────────┘     - Downloads local-server.zip
         │
         │ HTTP Request
         │ (localhost:3001)
         ▼
┌─────────────────┐
│  Local Server   │  ← Backend (Express)
│  (User's PC)    │     - Opens VSCode/Cursor/Terminal
└─────────────────┘     - Runs on localhost only
```

## Building the Server Package

Before deploying, make sure to build the server package:

```bash
npm run build:server-package
```

This creates `public/local-server.zip` containing:
- `server.js` - Express server
- `package.json` - Dependencies
- `install.bat` / `install.sh` - Installer scripts
- `start.bat` / `start.sh` - Starter scripts
- `README.md` - Documentation

## Troubleshooting

### Local Server Not Connecting
- Make sure local server is running: Check `http://localhost:3001/health`
- Check if port 3001 is available
- Check browser console for CORS errors
- Verify firewall isn't blocking localhost connections

### Download Not Working
- Make sure `public/local-server.zip` exists (run `npm run build:server-package`)
- Check that the zip file is included in the build
- Verify the API endpoint `/api/download-server` is accessible

### Projects Not Opening
- Verify local server is running
- Check if VSCode/Cursor is installed and in PATH
- Check local server console for errors
- Verify the project path is correct

### Data Not Persisting
- Data is stored in browser's localStorage
- Clear browser data will delete projects
- Consider exporting/importing projects feature
