# 🚀 ProjectHub

A modern project manager for developers to quickly access and open their development projects. Built with Next.js, Shadcn UI, and supports dark/light themes.

## 📖 About

ProjectHub is a modern development project management tool that helps you:

- **Manage projects**: Easily add, edit, and delete your development projects
- **Quick access**: Open projects in VSCode, Cursor, or Terminal with a single click
- **Search**: Quickly find projects by name
- **Local storage**: All data is stored on your computer, no login required
- **Privacy-focused**: Data stays on your computer, never sent to any server

## Features

- ✨ Modern UI with Shadcn UI components
- 🌓 Dark/Light theme support
- 💾 File-based storage - data stored locally on your computer
- 🔍 Search projects
- 🚀 Quick open in VSCode, Cursor, or Terminal
- 📱 Responsive design
- 🎯 Welcome banner for first-time users

## Architecture

This app uses a hybrid architecture:

- **Frontend**: Deployed on AWS Amplify (public web app)
- **Backend**: Local server running on user's machine (for opening projects and storing data)

Data is stored in a local file on your computer via the local server, ensuring privacy and security. No cloud storage or authentication is needed.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Setup Local Server (Required for Opening Projects)

The local server is needed to open projects in VSCode, Cursor, or Terminal, and to store project data.

**Option 1: Download Executable (Recommended)**

1. Click "Download Local Server" button in the web app
2. Run the downloaded `local-server.exe` file
3. The server will start automatically on `http://localhost:1234`

**Option 2: Run from Source**

```bash
cd local-server
npm install
npm start
```

The local server will run on `http://localhost:1234`.

## Deployment

### Deploy to AWS Amplify

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to AWS Amplify
3. Amplify will auto-detect Next.js and build
4. Your app will be live!

See [DEPLOY.md](./DEPLOY.md) for detailed instructions.

### For End Users

Users need to:

1. Access the web app (deployed on Amplify)
2. Download and run the local server on their machine
3. Add projects and start managing!

## Project Structure

```
projecthub/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/               # API routes
│       └── download-server/ # Download server endpoint
├── components/             # React components
│   ├── ui/                # Shadcn UI components
│   ├── welcome-banner.tsx # Welcome banner for first-time users
│   ├── server-status-card.tsx # Server connection status
│   ├── search-bar.tsx     # Search input component
│   ├── add-project-form.tsx # Add project form
│   ├── project-card.tsx   # Individual project card
│   ├── project-list.tsx   # Projects list component
│   ├── theme-provider.tsx # Theme provider
│   └── theme-toggle.tsx   # Theme switcher
├── lib/                    # Utilities
│   ├── storage.ts         # Storage utilities (delegates to local-api)
│   ├── local-api.ts       # Local server API client
│   └── download-server.ts # Download server utility
├── local-server/           # Local server (runs on user's PC)
│   ├── server.js          # Express server
│   └── package.json
└── package.json
```

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **next-themes** - Theme management
- **lucide-react** - Icons

## License

ISC
