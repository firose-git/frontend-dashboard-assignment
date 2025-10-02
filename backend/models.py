from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
class Database:
    def __init__(self):
        self.client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/taskflow'))
        self.db = self.client.get_default_database()
        self.users = self.db.users
        self.tasks = self.db.tasks
        
        # Create indexes
        self.users.create_index('email', unique=True)
        self.tasks.create_index([('user_email', 1), ('created_at', -1)])

db = Database()

# User model
class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        
    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'password': self.password
        }

# Task model
class Task:
    def __init__(self, title, description, priority, status, user_email):
        self.title = title
        self.description = description
        self.priority = priority  # 'low', 'medium', 'high'
        self.status = status  # 'not-started', 'in-progress', 'completed'
        self.user_email = user_email
        
    def to_dict(self):
        return {
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'status': self.status,
            'user_email': self.user_email
        }
