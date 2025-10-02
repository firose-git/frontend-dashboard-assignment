# 🚀 Frontend Dashboard Assignment - Modern Task Management Application

<p align="center">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m9 11 3 3L22 4"></path>
  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
</svg>

</p>

<p align="center">
  <strong>A scalable, secure, and beautifully designed dashboard web application</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#api-docs">API Docs</a> •
  <a href="#scaling-security">Scaling & Security</a>
</p>

---

## 🌟 Features

| Feature | Description | Badge |
|---------|-------------|-------|
| 🔐 **Secure Authentication** | JWT-based auth with bcrypt password hashing | ![security](https://img.shields.io/badge/Secure-JWT-blue) |
| 📝 **Task Management** | Full CRUD operations on tasks | ![crud](https://img.shields.io/badge/CRUD-Tasks-green) |
| 📊 **Real-time Analytics** | Dashboard charts using Recharts | ![charts](https://img.shields.io/badge/Charts-Recharts-orange) |
| 🎨 **Modern UI/UX** | TailwindCSS + glassmorphism + animations | ![ui](https://img.shields.io/badge/UIUX-Tailwind-purple) |
| 🔍 **Search & Filter** | Advanced search & filtering | ![search](https://img.shields.io/badge/Search-Filter-yellow) |
| 👤 **User Profile** | View & update profile | ![profile](https://img.shields.io/badge/Profile-Management-blueviolet) |
| ⚡ **Interactive Carousel** | Auto-scrolling screenshots with manual `< >` | ![carousel](https://img.shields.io/badge/Carousel-ReactJS-red) |
| 🚀 **Scalable Architecture** | Modular code ready for production | ![scalable](https://img.shields.io/badge/Scalable-Yes-brightgreen) |

---

## 🛠 Tech Stack

### Frontend
- **React 18 + Vite**
- **TailwindCSS**
- **React Router v6**
- **Axios**
- **Recharts**
- **Lucide React**

### Backend
- **Python Flask**
- **MongoDB**
- **PyMongo**
- **Flask-CORS**
- **JWT Authentication**
- **bcrypt**
- **python-dotenv**

---

## 📦 Installation

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB installed locally or cloud

### Backend Setup

<details>
<summary>Click to expand backend setup (copyable)</summary>

```bash
# Clone the repository
git clone https://github.com/firose-git/frontend-dashboard-assignment.git
cd frontend-dashboard-assignment/backend

# Create virtual environment
python -m venv venv

# Activate venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start MongoDB (if using local)
mongod

# Run backend server
python app.py


```
### Frontend Setup
<details> <summary>Click to expand frontend setup (copyable)</summary>
```bash
cd frontend-dashboard-assignment/frontend

# Install dependencies
npm install

# Run frontend server
npm run dev

🖼 Screenshots Carousel

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper";
import "./carousel.css"; // optional CSS for lightning effect

const ScreenshotCarousel = () => {
  const screenshots = [
    "/img/land.png",
    "/img/register.png",
    "/img/login.png",
    "/img/dash1.png",
    "/img/edit_task.png",
    "/img/search.png",
    "/img/Full_dash.png",
    "/img/forgot_pwd.png",
    "/img/email_pwd.png",
    "/img/set_pwd.png",
  ];

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation
      autoplay={{ delay: 3000 }}
      loop={true}
      speed={800}
      spaceBetween={20}
      slidesPerView={1}
    >
      {screenshots.map((src, index) => (
        <SwiperSlide key={index}>
          <img
            src={src}
            alt={`Screenshot ${index + 1}`}
            className="rounded-xl shadow-lg border border-gray-200 w-full"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ScreenshotCarousel;


### 🔗 API Documentation

# Authentication:

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Register new user            |
| POST   | `/api/auth/login`    | Login user and return JWT    |
| GET    | `/api/profile`       | Fetch profile (JWT required) |
| PUT    | `/api/profile`       | Update user profile          |


# Tasks CRUD:
| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/api/tasks`     | Create task   |
| GET    | `/api/tasks`     | Get all tasks |
| PUT    | `/api/tasks/:id` | Update task   |
| DELETE | `/api/tasks/:id` | Delete task   |

### 🚀 Scaling & Security Notes

Frontend: Modular React components, protected routes, responsive design

Backend: Flask blueprints, JWT middleware, MongoDB indexing

Security: Password hashing, input validation, JWT expiration

Future Scalability: Next.js SSR, caching, Docker deployment, cloud hosting