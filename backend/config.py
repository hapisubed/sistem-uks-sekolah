# Configuration file untuk Sistem UKS Sekolah
# Placeholder - akan diimplementasi di task selanjutnya

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-uks-sekolah'
    
    # Database configuration for deployment
    database_url = os.environ.get('DATABASE_URL')
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = database_url or 'sqlite:///instance/uks_sekolah.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False