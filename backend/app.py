from flask import Flask, jsonify, request
from flask_cors import CORS
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from models import User, Task, db
import config
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
from email.message import EmailMessage
# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Secret key for JWT
SECRET_KEY = os.getenv('SECRET_KEY')
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))

# Authentication middleware
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = db.users.find_one({'email': data['email']})
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated
@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get("email")
    
    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = db.users.find_one({'email': email})
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Generate reset token (here just a dummy link for demo)
    reset_token = jwt.encode({'email': email}, SECRET_KEY, algorithm='HS256')
    reset_link = f"http://localhost:5173/reset-password/{reset_token}"

    # Send email via SMTP
    try:
        msg = EmailMessage()
        msg['Subject'] = 'TaskFlow Pro Password Reset'
        msg['From'] = os.getenv('SMTP_EMAIL')
        msg['To'] = email
        msg.set_content(f"Click this link to reset your password: {reset_link}")

        with smtplib.SMTP(os.getenv('SMTP_SERVER'), int(os.getenv('SMTP_PORT'))) as server:
            server.starttls()
            server.login(os.getenv('SMTP_EMAIL'), os.getenv('SMTP_PASSWORD'))
            server.send_message(msg)

        return jsonify({"message": "Password reset link sent to your email"}), 200

    except Exception as e:
        print("Email sending error:", e)
        return jsonify({"message": "Failed to send email"}), 500



@app.route('/api/auth/reset-password/<token>', methods=['POST'])
def update_password(token):
    data = request.json
    new_password = data.get('password')

    if not new_password or len(new_password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters'}), 400

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        email = payload.get('email')

        user = db.users.find_one({'email': email})
        if not user:
            return jsonify({'message': 'User not found'}), 404

        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        db.users.update_one({'email': email}, {'$set': {'password': hashed_password.decode('utf-8')}})

        return jsonify({'message': 'Password updated successfully!'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Reset token expired'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 400
# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists!'}), 400
    
    # Hash password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user = {
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password.decode('utf-8'),
        'created_at': datetime.now()
    }
    
    db.users.insert_one(user)
    
    return jsonify({'message': 'User created successfully!'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = db.users.find_one({'email': data['email']})
    
    if not user:
        return jsonify({'message': 'User not found!'}), 401
    
    if bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        # Generate JWT token
        token = jwt.encode({
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
        }, SECRET_KEY)
        
        return jsonify({
            'token': token,
            'user': {
                'name': user['name'],
                'email': user['email']
            }
        })
    
    return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'name': current_user['name'],
        'email': current_user['email'],
        'created_at': current_user['created_at']
    })

@app.route('/api/auth/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    updates = {}
    if 'name' in data:
        updates['name'] = data['name']
    
    if updates:
        db.users.update_one(
            {'email': current_user['email']},
            {'$set': updates}
        )
    
    updated_user = db.users.find_one({'email': current_user['email']})
    
    return jsonify({
        'name': updated_user['name'],
        'email': updated_user['email']
    })

# Task routes
@app.route('/api/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = list(db.tasks.find({'user_email': current_user['email']}))
    
    # Convert ObjectId to string for JSON serialization
    for task in tasks:
        task['_id'] = str(task['_id'])
    
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    data = request.get_json()
    
    task = {
        'title': data['title'],
        'description': data['description'],
        'priority': data['priority'],
        'status': data['status'],
        'user_email': current_user['email'],
        'created_at': datetime.now()
    }
    
    result = db.tasks.insert_one(task)
    
    created_task = db.tasks.find_one({'_id': result.inserted_id})
    created_task['_id'] = str(created_task['_id'])
    
    return jsonify(created_task), 201

@app.route('/api/tasks/<task_id>', methods=['PUT'])
@token_required
def update_task(current_user, task_id):
    from bson.objectid import ObjectId
    
    data = request.get_json()
    
    # Check if task exists and belongs to user
    task = db.tasks.find_one({
        '_id': ObjectId(task_id),
        'user_email': current_user['email']
    })
    
    if not task:
        return jsonify({'message': 'Task not found!'}), 404
    
    updates = {}
    for field in ['title', 'description', 'priority', 'status']:
        if field in data:
            updates[field] = data[field]
    
    db.tasks.update_one(
        {'_id': ObjectId(task_id)},
        {'$set': updates}
    )
    
    updated_task = db.tasks.find_one({'_id': ObjectId(task_id)})
    updated_task['_id'] = str(updated_task['_id'])
    
    return jsonify(updated_task)

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    from bson.objectid import ObjectId
    
    # Check if task exists and belongs to user
    task = db.tasks.find_one({
        '_id': ObjectId(task_id),
        'user_email': current_user['email']
    })
    
    if not task:
        return jsonify({'message': 'Task not found!'}), 404
    
    db.tasks.delete_one({'_id': ObjectId(task_id)})
    
    return jsonify({'message': 'Task deleted successfully!'})

@app.route('/api/tasks/stats', methods=['GET'])
@token_required
def get_task_stats(current_user):
    # Get total tasks
    total_tasks = db.tasks.count_documents({'user_email': current_user['email']})
    
    # Get tasks by status
    tasks_by_status = {}
    for status in ['not-started', 'in-progress', 'completed']:
        tasks_by_status[status] = db.tasks.count_documents({
            'user_email': current_user['email'],
            'status': status
        })
    
    # Get tasks by priority
    tasks_by_priority = {}
    for priority in ['low', 'medium', 'high']:
        tasks_by_priority[priority] = db.tasks.count_documents({
            'user_email': current_user['email'],
            'priority': priority
        })
    
    # Get completion rate
    completion_rate = 0
    if total_tasks > 0:
        completion_rate = (tasks_by_status['completed'] / total_tasks) * 100
    
    return jsonify({
        'total_tasks': total_tasks,
        'tasks_by_status': tasks_by_status,
        'tasks_by_priority': tasks_by_priority,
        'completion_rate': completion_rate
    })

if __name__ == '__main__':
    app.run(debug=True)
