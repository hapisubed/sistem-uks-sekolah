#!/usr/bin/env bash
# Build script untuk Render

set -o errexit  # exit on error

# Install system dependencies for PostgreSQL
apt-get update
apt-get install -y libpq-dev gcc

# Upgrade pip first
pip install --upgrade pip

# Install dependencies
cd backend
pip install -r requirements.txt