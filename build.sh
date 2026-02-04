#!/usr/bin/env bash
# Build script untuk Render

set -o errexit  # exit on error

# Upgrade pip first
pip install --upgrade pip

# Install dependencies
cd backend
pip install -r requirements.txt