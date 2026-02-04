#!/usr/bin/env bash
# Build script untuk Render

set -o errexit  # exit on error

cd backend
pip install -r requirements.txt