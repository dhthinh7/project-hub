# Quick Start Guide

## For Developers (Setup)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build server package**
   ```bash
   npm run build:server-package
   ```
   This creates `public/local-server.zip` for users to download.

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Deploy to Amplify**
   - Push to GitHub
   - Connect to AWS Amplify
   - Deploy!

## For End Users

### Step 1: Access the Web App
- Open the deployed web app URL (e.g., `https://your-app.amplifyapp.com`)

### Step 2: Download Local Server
- Click the **"Download & Setup Local Server"** button
- The `local-server.zip` file will download automatically

### Step 3: Extract and Run
- **Windows**: 
  - Extract the zip file to a folder
  - Double-click `start.bat`
  - The server will install dependencies and start automatically

- **Mac/Linux**:
  - Extract the zip file to a folder
  - Open terminal in that folder
  - Run: `chmod +x start.sh && ./start.sh`
  - The server will install dependencies and start automatically

### Step 4: Verify Connection
- The web app will automatically detect when the local server is running
- You'll see a green "Local server connected" message

### Step 5: Start Managing Projects!
- Add your projects
- Click VSCode, Cursor, or Terminal buttons to open them

## Troubleshooting

**Server not connecting?**
- Make sure the local server is running (check terminal/command prompt)
- Verify it's running on `http://localhost:3001`
- Click "Check Again" button in the web app

**Can't open projects?**
- Make sure VSCode/Cursor is installed
- Verify the project path is correct
- Check local server console for errors

**Download not working?**
- Make sure you're using a modern browser
- Check browser console for errors
- Try downloading manually from the repository
