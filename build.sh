#!/bin/bash

# Step 1: Run the build command for all apps/libs
echo "Running nx build..."
nx run-many -t=build

# Step 2: Define paths
TEMP_PATH="./tmp"
DIST_PATH="./dist/apps"
EXTENSION_PATH="./extension/build"

# Step 3: Delete the extension build folder if it exists
echo "Deleting extension build folder..."
if [ -d "$EXTENSION_PATH" ]; then
  rm -rf "$EXTENSION_PATH"
fi

# Step 4: Create the extension folder 
echo "Creating extension build folder..."
mkdir -p "$EXTENSION_PATH"

# Step 5: Copy all files from dist subfolders to extension build directory
echo "Copying files to extension build directory..."
for dir in "$DIST_PATH"/*/ ; do
    if [ -d "$dir" ]; then
        # Copy all files from each subfolder
        cp -r "$dir"* "$EXTENSION_PATH/"
    fi
done

# Step 6: check if temporary folders exists and remove its folder and its content
echo "Cleaning up files and folders..."
if [ -d "$TEMP_PATH" ]; then
  rm -rf "$TEMP_PATH"
fi

# Build and copy process completed successfully
echo "Build and copy process completed successfully!"

