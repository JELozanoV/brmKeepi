#!/bin/bash

# Script to fix directories and files with trailing spaces in App BRM project
echo "Starting to fix directories and files with trailing spaces..."

# Create new directories without trailing spaces
mkdir -p "/Users/noistation2/proyectos/App BRM/src/Procesos/Soporte Hogar"
mkdir -p "/Users/noistation2/proyectos/App BRM/src/assets/images/Validaciones/Titularidad"

# Copy files from directories with trailing spaces to new directories
echo "Copying files from directories with trailing spaces to new directories..."
cp -r "/Users/noistation2/proyectos/App BRM/src/Procesos /Soporte Hogar"/* "/Users/noistation2/proyectos/App BRM/src/Procesos/Soporte Hogar/" 2>/dev/null || echo "No files to copy from Soporte Hogar"
cp -r "/Users/noistation2/proyectos/App BRM/src/assets/images/Validaciones/Titularidad "/* "/Users/noistation2/proyectos/App BRM/src/assets/images/Validaciones/Titularidad/" 2>/dev/null || echo "No files to copy from Titularidad"

# Update import references in the code
echo "Updating import references in the code..."
sed -i '' 's|Validaciones/Titularidad /|Validaciones/Titularidad/|g' "/Users/noistation2/proyectos/App BRM/src/components/solutions/sections/ValidationStepsSection.tsx"

# Remove old directories with trailing spaces
echo "Removing old directories with trailing spaces..."
rm -rf "/Users/noistation2/proyectos/App BRM/src/Procesos /Soporte Hogar" 2>/dev/null || echo "Could not remove Soporte Hogar directory"
rm -rf "/Users/noistation2/proyectos/App BRM/src/Procesos " 2>/dev/null || echo "Could not remove Procesos directory"
rm -rf "/Users/noistation2/proyectos/App BRM/src/assets/images/Validaciones/Titularidad " 2>/dev/null || echo "Could not remove Titularidad directory"

echo "Finished fixing directories and files with trailing spaces."
