#!/usr/bin/env python3
"""
Quick start script untuk Sistem UKS Sekolah
Menjalankan backend dan frontend secara bersamaan untuk development
"""

import os
import sys
import subprocess
import threading
import time
import webbrowser
from pathlib import Path

def run_backend():
    """Run Flask backend server"""
    print("🐍 Starting Flask backend server...")
    try:
        os.chdir('backend')
        
        # Install requirements if needed
        if not os.path.exists('../venv') and not os.path.exists('venv'):
            print("📦 Installing Python dependencies...")
            subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        
        # Run Flask app
        subprocess.run([sys.executable, 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Backend error: {e}")

def run_frontend():
    """Run frontend development server"""
    print("🌐 Starting frontend development server...")
    try:
        os.chdir('frontend')
        
        # Start simple HTTP server
        subprocess.run([sys.executable, '-m', 'http.server', '8000'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except Exception as e:
        print(f"❌ Frontend error: {e}")

def check_requirements():
    """Check if all required files exist"""
    required_files = [
        'backend/app.py',
        'backend/requirements.txt',
        'frontend/index.html'
    ]
    
    for file_path in required_files:
        if not os.path.exists(file_path):
            print(f"❌ Required file not found: {file_path}")
            return False
    
    return True

def main():
    """Main function to start both servers"""
    print("🚀 Sistem UKS Sekolah - Development Server")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        print("❌ Missing required files. Please check your project structure.")
        sys.exit(1)
    
    print("✅ All required files found")
    
    # Create threads for backend and frontend
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    frontend_thread = threading.Thread(target=run_frontend, daemon=True)
    
    try:
        # Start backend
        backend_thread.start()
        print("⏳ Waiting for backend to start...")
        time.sleep(3)
        
        # Start frontend
        frontend_thread.start()
        print("⏳ Waiting for frontend to start...")
        time.sleep(2)
        
        print("\n🎉 Servers started successfully!")
        print("📍 Backend API: http://localhost:5000")
        print("📍 Frontend: http://localhost:8000")
        print("📍 Health Check: http://localhost:5000/api/health")
        
        # Open browser
        try:
            print("\n🌐 Opening browser...")
            webbrowser.open('http://localhost:8000')
        except:
            print("❌ Could not open browser automatically")
        
        print("\n⌨️  Press Ctrl+C to stop both servers")
        
        # Keep main thread alive
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down servers...")
        print("👋 Goodbye!")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()