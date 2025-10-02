# 🚀 TaskFlow Pro - Modern Task Management Application

<p align="center">
  <img src="/public/logo.svg" alt="TaskFlow Pro Logo" width="120" height="120">
</p>

<p align="center">
  <strong>A scalable, secure, and beautifully designed task management application</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#api-docs">API Docs</a> •
  <a href="#screenshots">Screenshots</a>
</p>

---

## 🌟 Features

### ✨ Core Features
- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **📝 Task Management**: Complete CRUD operations for tasks
- **📊 Real-time Analytics**: Beautiful charts and statistics
- **🎨 Modern UI/UX**: Responsive design with smooth animations
- **🔍 Search & Filter**: Advanced search and filtering capabilities
- **👤 User Profile**: Personalized user dashboard

### 🎯 Technical Highlights
- **Frontend**: React 18 with Vite for blazing fast development
- **Backend**: Flask with MongoDB for scalable data storage
- **Security**: JWT tokens, password hashing, input validation
- **Design**: TailwindCSS with custom animations and glassmorphism effects
- **Charts**: Recharts for beautiful data visualization
- **Icons**: Lucide React for consistent iconography

---

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router v6
- Axios
- Recharts
- Lucide React

### Backend
- Python Flask
- MongoDB
- PyMongo
- JWT Authentication
- Bcrypt
- Flask-CORS

---

## 📦 Installation

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/taskflow-pro.git
cd taskflow-pro

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start MongoDB
mongod

# Run backend
python app.py
