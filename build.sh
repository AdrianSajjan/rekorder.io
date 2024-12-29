#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Step 1: Run the build command for all apps/libs
echo "Running nx build..."
nx run-many -t=build

# Step 2: Define paths
DIST_PATH="./dist/apps"
EXTENSION_PATH="./extension/build"
BACKGROUND_FILE="$DIST_PATH/background/background.js"
RECORDER_FILE="$DIST_PATH/recorder/content-script.js"

# Step 3: Create the extension folder if it doesn't exist
mkdir -p "$EXTENSION_PATH"

# Step 4: Copy files to the extension folder
echo "Copying files to extension directory..."
cp "$BACKGROUND_FILE" "$EXTENSION_PATH/background.js"
cp "$RECORDER_FILE" "$EXTENSION_PATH/content-script.js"

# Build and copy process completed successfully
echo "Build and copy process completed successfully!"
