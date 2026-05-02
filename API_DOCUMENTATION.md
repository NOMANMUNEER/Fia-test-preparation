# FIA Quiz API Documentation

## 📋 Project Overview

**FIA** is an Islamic MCQ Quiz Application with user authentication, quiz management, and progress tracking. The application has a Node.js/Express backend with MongoDB database.

### Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs for password hashing

---

## 🚀 Getting Started

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd fia-backend
   npm install
   ```

2. **Environment Variables** (Create `.env` file in fia-backend)
   ```
   MONGO_URI=mongodb://localhost:27017/fia
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

3. **Start Server**
   ```bash
   npm run dev     # Development mode (with nodemon)
   npm run start   # Production mode
   ```

The backend will run on `http://localhost:5000`

---

## 📊 Database Models

### 1. **User Model**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date
}
```

### 2. **Quiz Model**
```javascript
{
  title: String (required),
  description: String (required),
  category: String (default: 'General'),
  totalQuestions: Number (default: 0),
  createdAt: Date
}
```

### 3. **Question Model**
```javascript
{
  quiz: ObjectId (ref: 'Quiz', required),
  questionText: String (required),
  options: [String] (required, array of options),
  correctAnswer: String (required)
}
```

### 4. **Attempt Model**
```javascript
{
  user: ObjectId (ref: 'User', required),
  quiz: ObjectId (ref: 'Quiz', required),
  score: Number (required),
  totalQuestions: Number (required),
  correctAnswersCount: Number (required),
  createdAt: Date
}
```

---

## 🔑 Authentication

All protected endpoints require a JWT token in the request header:

```
Authorization: Bearer <token>
```

Tokens are returned on signup/login and expire in 30 days.

---

## 📡 API Endpoints

### **1. Authentication Routes** (`/api/auth`)

#### **Signup**
- **Method**: `POST`
- **Endpoint**: `/api/auth/signup`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"  // optional, defaults to 'user'
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "token": "eyJhbGc...",
    "data": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

#### **Login**
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "token": "eyJhbGc...",
    "data": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

#### **Get User Quiz History**
- **Method**: `GET`
- **Endpoint**: `/api/auth/history`
- **Auth Required**: ✅ Yes
- **Response** (200):
  ```json
  {
    "success": true,
    "count": 5,
    "data": [
      {
        "_id": "attempt_id",
        "user": "user_id",
        "quiz": {
          "_id": "quiz_id",
          "title": "Islamic MCQ Quiz 1",
          "category": "Islamic"
        },
        "score": 85,
        "totalQuestions": 20,
        "correctAnswersCount": 17,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

---

### **2. Quiz Routes** (`/api/quizzes`)

#### **Get All Quizzes (With Filtering)**
- **Method**: `GET`
- **Endpoint**: `/api/quizzes`
- **Query Parameters** (optional):
  - `category`: Filter by category (case-insensitive)
  - `search`: Search by quiz title (case-insensitive)
- **Examples**:
  ```
  /api/quizzes
  /api/quizzes?category=Islamic
  /api/quizzes?search=prophet
  /api/quizzes?category=Islamic&search=prophet
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "_id": "quiz_id",
        "title": "Islamic MCQ Quiz",
        "description": "Test your Islamic knowledge",
        "category": "Islamic",
        "totalQuestions": 20,
        "createdAt": "2024-01-10T08:00:00.000Z"
      }
    ]
  }
  ```

#### **Get Quiz Questions**
- **Method**: `GET`
- **Endpoint**: `/api/quizzes/:id/questions`
- **Query Parameters** (optional):
  - `limit`: Number of questions to fetch (default: 20)
- **Examples**:
  ```
  /api/quizzes/123abc/questions
  /api/quizzes/123abc/questions?limit=10
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "question_id",
        "quiz": "quiz_id",
        "questionText": "What is the first pillar of Islam?",
        "options": ["Hajj", "Zakat", "Shahada", "Salah"],
        "correctAnswer": "Shahada"
      }
    ]
  }
  ```

#### **Submit Quiz**
- **Method**: `POST`
- **Endpoint**: `/api/quizzes/submit`
- **Auth Required**: ✅ Yes
- **Body**:
  ```json
  {
    "quizId": "quiz_id",
    "score": 85,
    "correctCount": 17,
    "totalQuestions": 20
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "Result saved successfully",
    "attemptId": "attempt_id"
  }
  ```

---

### **3. Admin Routes** (`/api/admin`)

⚠️ **All admin routes require authentication AND admin role**

#### **Create Quiz**
- **Method**: `POST`
- **Endpoint**: `/api/admin/quiz`
- **Auth Required**: ✅ Yes (Admin only)
- **Body**:
  ```json
  {
    "title": "Islamic MCQ Quiz",
    "description": "Test your Islamic knowledge",
    "category": "Islamic"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "data": {
      "_id": "quiz_id",
      "title": "Islamic MCQ Quiz",
      "description": "Test your Islamic knowledge",
      "category": "Islamic",
      "totalQuestions": 0,
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  }
  ```

#### **Add Question to Quiz**
- **Method**: `POST`
- **Endpoint**: `/api/admin/question`
- **Auth Required**: ✅ Yes (Admin only)
- **Body**:
  ```json
  {
    "quizId": "quiz_id",
    "questionText": "What is the first pillar of Islam?",
    "options": ["Hajj", "Zakat", "Shahada", "Salah"],
    "correctAnswer": "Shahada"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "data": {
      "_id": "question_id",
      "quiz": "quiz_id",
      "questionText": "What is the first pillar of Islam?",
      "options": ["Hajj", "Zakat", "Shahada", "Salah"],
      "correctAnswer": "Shahada"
    }
  }
  ```

#### **Delete Question**
- **Method**: `DELETE`
- **Endpoint**: `/api/admin/question/:id`
- **Auth Required**: ✅ Yes (Admin only)
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Question deleted"
  }
  ```

---

## 🛡️ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (Missing/Invalid data)
- **401**: Unauthorized (Invalid credentials or missing token)
- **403**: Forbidden (Not admin for admin routes)
- **404**: Not Found
- **500**: Server Error

---

## 📱 Frontend Integration Guide

### 1. **Store JWT Token**
After login/signup, store the token in localStorage or cookies:
```javascript
localStorage.setItem('token', response.token);
```

### 2. **Send Token in Requests**
Include the token in all protected endpoints:
```javascript
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
};
```

### 3. **Example Flow**

```javascript
// Signup/Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.token);

// Get Quizzes with Filter
const quizzes = await fetch(
  'http://localhost:5000/api/quizzes?category=Islamic',
  { headers }
);

// Get Quiz Questions
const questions = await fetch(
  'http://localhost:5000/api/quizzes/quiz_id/questions?limit=20',
  { headers }
);

// Submit Quiz
await fetch('http://localhost:5000/api/quizzes/submit', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    quizId: 'quiz_id',
    score: 85,
    correctCount: 17,
    totalQuestions: 20
  })
});

// Get User History
const history = await fetch(
  'http://localhost:5000/api/auth/history',
  { headers }
);
```

---

## 🔒 Security Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 30 days
- Admin routes are protected with role-based authorization
- CORS is enabled for frontend communication
- Helmet provides HTTP security headers

---

## 📝 Important Notes for Frontend

1. **JWT Token Management**: Handle token expiration and refresh logic on the frontend
2. **CORS**: Backend allows requests from frontend (configured in Express)
3. **Quiz Flow**: 
   - Display questions WITHOUT correct answers initially
   - Calculate score on frontend
   - Submit result to backend
4. **Error Handling**: Always check `success` field in responses
5. **Pagination**: For large quiz lists, implement pagination in frontend

---

## 🔗 API Base URL
```
http://localhost:5000
```

---

## 📞 Support

For backend-related issues, check:
- MongoDB connection status
- Environment variables (.env file)
- JWT_SECRET is set correctly
- All npm dependencies are installed

---

**Last Updated**: January 2024
**Version**: 1.0.0
