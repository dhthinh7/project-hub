#!/bin/bash

echo "Starting Project Manager Local Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Running installer..."
    chmod +x install.sh
    ./install.sh
    exit $?
fi

echo "Starting server..."
npm start
