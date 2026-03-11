# Local Server Setup

This local server allows the web app to open VSCode, Cursor, and Terminal on your machine.

## Quick Start

### Windows

Double-click `start.bat` or run:

```bash
start.bat
```

### macOS/Linux

Run:

```bash
chmod +x start.sh
./start.sh
```

Or manually:

```bash
npm install
npm start
```

The server will run on `http://localhost:3001`

## Auto-start on Boot (Optional)

### Windows

1. Create a shortcut to `start.bat`
2. Press `Win + R`, type `shell:startup`, press Enter
3. Copy the shortcut to the startup folder

### macOS

Create a Launch Agent:

1. Create `~/Library/LaunchAgents/com.projectmanager.local.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.projectmanager.local</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/path/to/local-server/server.js</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>
```

2. Load it: `launchctl load ~/Library/LaunchAgents/com.projectmanager.local.plist`

### Linux

Add to `~/.bashrc` or `~/.zshrc`:

```bash
cd /path/to/local-server && npm start &
```
