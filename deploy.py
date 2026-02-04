#!/usr/bin/env python3
"""
Deployment helper script untuk Sistem UKS Sekolah
Membantu setup dan deploy aplikasi ke berbagai platform
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def run_command(command, cwd=None):
    """Run shell command and return result"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd,
            capture_output=True, 
            text=True, 
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e.stderr}")
        return None

def check_requirements():
    """Check if all requirements are met"""
    print("🔍 Checking requirements...")
    
    # Check if git is initialized
    if not os.path.exists('.git'):
        print("❌ Git repository not initialized")
        print("Run: git init && git add . && git commit -m 'Initial commit'")
        return False
    
    # Check if requirements.txt exists
    if not os.path.exists('requirements.txt'):
        print("❌ requirements.txt not found in root directory")
        return False
    
    # Check if backend files exist
    if not os.path.exists('backend/app.py'):
        print("❌ backend/app.py not found")
        return False
    
    # Check if frontend files exist
    if not os.path.exists('frontend/index.html'):
        print("❌ frontend/index.html not found")
        return False
    
    print("✅ All requirements met!")
    return True

def setup_railway():
    """Setup Railway deployment"""
    print("\n🚂 Setting up Railway deployment...")
    
    # Check if Railway CLI is installed
    railway_check = run_command("railway --version")
    if not railway_check:
        print("❌ Railway CLI not installed")
        print("Install from: https://docs.railway.app/develop/cli")
        return False
    
    print("✅ Railway CLI found")
    
    # Login to Railway
    print("Please login to Railway...")
    login_result = run_command("railway login")
    if not login_result:
        print("❌ Railway login failed")
        return False
    
    # Create new project
    print("Creating new Railway project...")
    create_result = run_command("railway new")
    if not create_result:
        print("❌ Failed to create Railway project")
        return False
    
    # Deploy
    print("Deploying to Railway...")
    deploy_result = run_command("railway up")
    if deploy_result:
        print("✅ Successfully deployed to Railway!")
        print("Check your Railway dashboard for the live URL")
        return True
    else:
        print("❌ Railway deployment failed")
        return False

def setup_vercel():
    """Setup Vercel deployment"""
    print("\n▲ Setting up Vercel deployment...")
    
    # Check if Vercel CLI is installed
    vercel_check = run_command("vercel --version")
    if not vercel_check:
        print("Installing Vercel CLI...")
        install_result = run_command("npm install -g vercel")
        if not install_result:
            print("❌ Failed to install Vercel CLI")
            print("Please install Node.js first: https://nodejs.org/")
            return False
    
    print("✅ Vercel CLI found")
    
    # Deploy
    print("Deploying to Vercel...")
    deploy_result = run_command("vercel --prod")
    if deploy_result:
        print("✅ Successfully deployed to Vercel!")
        return True
    else:
        print("❌ Vercel deployment failed")
        return False

def setup_render():
    """Setup Render deployment instructions"""
    print("\n🎨 Render Deployment Instructions:")
    print("1. Go to https://render.com and sign up/login")
    print("2. Click 'New' → 'Web Service'")
    print("3. Connect your GitHub repository")
    print("4. Use these settings:")
    print("   - Build Command: cd backend && pip install -r requirements.txt")
    print("   - Start Command: cd backend && python app.py")
    print("   - Environment: Python 3")
    print("5. Add environment variables:")
    print("   - SECRET_KEY: (generate a random secret key)")
    print("   - FLASK_ENV: production")
    print("6. Create PostgreSQL database and add DATABASE_URL")
    print("7. Deploy!")

def generate_secret_key():
    """Generate a secure secret key"""
    import secrets
    return secrets.token_urlsafe(32)

def create_env_template():
    """Create .env template file"""
    env_content = f"""# Environment variables untuk Sistem UKS Sekolah
# Copy file ini ke .env dan isi dengan nilai yang sesuai

# Flask Configuration
SECRET_KEY={generate_secret_key()}
FLASK_ENV=production

# Database Configuration
# Untuk development (SQLite):
# DATABASE_URL=sqlite:///instance/uks_sekolah.db

# Untuk production (PostgreSQL):
# DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Server Configuration
PORT=5000
"""
    
    with open('.env.template', 'w') as f:
        f.write(env_content)
    
    print("✅ Created .env.template file")
    print("Copy this to .env and fill in your values")

def main():
    """Main deployment script"""
    print("🚀 Sistem UKS Sekolah - Deployment Helper")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Create environment template
    create_env_template()
    
    # Show deployment options
    print("\n📋 Available deployment options:")
    print("1. Railway (Recommended - Easiest)")
    print("2. Vercel (Good for static + serverless)")
    print("3. Render (Manual setup required)")
    print("4. Show all deployment instructions")
    print("5. Exit")
    
    while True:
        choice = input("\nSelect option (1-5): ").strip()
        
        if choice == '1':
            setup_railway()
            break
        elif choice == '2':
            setup_vercel()
            break
        elif choice == '3':
            setup_render()
            break
        elif choice == '4':
            print("\n📖 Opening DEPLOYMENT.md for full instructions...")
            if os.path.exists('DEPLOYMENT.md'):
                if sys.platform.startswith('win'):
                    os.startfile('DEPLOYMENT.md')
                elif sys.platform.startswith('darwin'):
                    os.system('open DEPLOYMENT.md')
                else:
                    os.system('xdg-open DEPLOYMENT.md')
            else:
                print("DEPLOYMENT.md not found")
            break
        elif choice == '5':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please select 1-5.")
    
    print("\n🎉 Deployment setup complete!")
    print("Check DEPLOYMENT.md for detailed instructions and troubleshooting.")

if __name__ == "__main__":
    main()