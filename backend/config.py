import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/taskflow')

# JWT Configuration
SECRET_KEY = os.getenv('SECRET_KEY')
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))

# API Configuration
API_PREFIX = '/api'
