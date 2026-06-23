# EduConnect 🎓
### Smart Tutoring & Study Resource Platform for Grade 8–12 South African Pupils

-> the link for accessing the file: https://drive.google.com/file/d/1IjbjvtiGB7bYTeal3EOe6M-DvM9wgofz/view?usp=sharing
    - the reason is because the file was above 25mb. so i put it in my google drive

> **Module:** Internet Programming 2 (ITNP300 / ITPR300)
> **Qualification:** Diploma in Information Technology: Applications Development
> **Submitted to:** Mr X Piyose
> **GitHub Collaborator:** xpiyose / xpiyose@gmail.com
> **Due Date:** 2 June 2026

---

## 📌 Table of Contents

1. [Problem Definition](#problem-definition)
2. [Project Overview](#project-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [API Endpoints](#api-endpoints)
7. [Database Design](#database-design)
8. [AI Feature](#ai-feature)
9. [Security](#security)
10. [Setup & Installation](#setup--installation)
11. [Demo Accounts](#demo-accounts)
12. [Group Member Responsibilities](#group-member-responsibilities)
13. [Entrepreneurship & Reflection](#entrepreneurship--reflection)

---

## 📌 Problem Definition

Many Grade 8–12 pupils in South Africa struggle to access affordable, on-demand academic support outside of school hours. Private tutoring is expensive, school office hours are limited, and generic platforms like YouTube are not tailored to the South African CAPS curriculum. Pupils in rural and township areas are particularly affected, as they have little to no access to supplementary academic resources.

Existing solutions fall short in the following ways:

- **Private tutors** cost between R150–R400 per hour — unaffordable for most families
- **Generic YouTube videos** are not aligned to the SA curriculum or specific grade requirements
- **WhatsApp study groups** are unstructured and unreliable
- **International platforms** like Chegg are US-focused and irrelevant to South African content

**EduConnect** solves this by providing a free, community-driven web platform where:
- Pupils post specific study requests by subject and grade
- Peer tutors respond with clear, step-by-step explanations
- Study resources (notes, past papers, study guides) are shared in one central library
- An AI-powered assistant answers academic questions instantly, 24/7
- All content is aligned to the South African Grade 8–12 CAPS curriculum

---

## 🖥️ Project Overview

EduConnect is a **full-stack web application** built on a **client-server architecture**:

```
Browser (Frontend) ←→ Node.js + Express (Backend) ←→ MongoDB (Database)
```

The system supports three types of users:

| Role | What They Can Do |
|---|---|
| **Pupil** | Post study requests, browse resources, use AI assistant, rate tutors |
| **Tutor** | Respond to study requests, upload resources, build a rating profile |
| **Admin** | Manage all users, requests, and resources across the platform |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | **Node.js v18+** | Runs JavaScript on the server |
| Backend Framework | **Express.js** | Handles routing, middleware, HTTP requests |
| Database | **MongoDB** | Stores all application data as documents |
| ODM | **Mongoose** | Connects Node.js to MongoDB, defines schemas |
| Authentication | **JWT (jsonwebtoken)** | Secure token-based login sessions |
| Password Security | **bcryptjs** | Hashes passwords before storing |
| AI / NLP | **natural** | NLP library for the AI study assistant |
| File Uploads | **Multer** | Handles resource file uploads |
| Input Validation | **express-validator** | Validates and sanitises API inputs |
| Environment Config | **dotenv** | Manages environment variables securely |
| Dev Tool | **nodemon** | Auto-restarts server on file changes |
| Frontend | **Vanilla HTML/CSS/JS** | Single-page application served by Express |

---

## 📁 Project Structure

```
educonnect/
│
├── server/
│   ├── server.js                  # Main Express server — entry point
│   ├── seed.js                    # Database seeding script
│   │
│   ├── models/
│   │   ├── User.js                # User schema (pupil, tutor, admin)
│   │   ├── StudyRequest.js        # Study request + responses schema
│   │   ├── Resource.js            # Study resource schema
│   │   └── AILog.js               # AI Q&A interaction log schema
│   │
│   ├── controllers/
│   │   ├── authController.js      # Register & login logic
│   │   ├── userController.js      # Profile & dashboard stats
│   │   ├── requestController.js   # CRUD for study requests & responses
│   │   ├── resourceController.js  # CRUD for study resources
│   │   └── aiController.js        # NLP AI assistant logic
│   │
│   ├── routes/
│   │   ├── auth.js                # POST /api/auth/register, /login, /me
│   │   ├── users.js               # GET/PUT /api/users, /tutors, /dashboard
│   │   ├── requests.js            # CRUD /api/requests + respond & rate
│   │   ├── resources.js           # CRUD /api/resources + file upload
│   │   └── ai.js                  # POST /api/ai/ask, GET /api/ai/popular
│   │
│   └── middleware/
│       └── auth.js                # JWT protect & role-based authorize
│
├── public/
│   └── index.html                 # Complete frontend single-page app
│
├── uploads/                       # Uploaded resource files (auto-created)
│   └── .gitkeep
│
├── .env.example                   # Environment variable template
├── .gitignore                     # Excludes node_modules, .env, uploads
├── package.json                   # Project metadata and scripts
└── README.md                      # This file
```

---

## ✨ Features

### For Pupils
- Register and log in securely with a hashed password and JWT session
- Post study requests specifying subject, grade, and description
- View all open requests and filter by subject or grade
- Rate tutor responses (1–5 stars) to mark a request as resolved
- Browse and download study resources from the library
- Use the AI assistant to get instant answers to academic questions
- View personal dashboard showing request history and stats

### For Tutors
- Register with subject specialisations and a bio
- Browse open study requests filtered to their subjects
- Submit detailed responses to help pupils
- Build a reputation through pupil ratings
- Upload study resources (notes, past papers, study guides, exercises)
- View dashboard showing pupils helped and average rating

### For Admins
- View platform-wide statistics (total users, requests, resolved count)
- Delete any request or resource
- Full access to all platform features

### Platform Features
- Fully responsive design — works on mobile and desktop
- Real-time filter and search for resources and requests
- AI assistant with subject detection, knowledge base lookup, and related resource suggestions
- All AI interactions logged to the database for analytics
- File upload support (PDF, Word, images) for resources
- Download counter on every resource

---

## 🔌 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a new user account |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| GET | `/api/auth/me` | Protected | Get currently logged-in user |

### Users — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users/tutors` | Public | List all tutors (filter by subject) |
| GET | `/api/users/dashboard` | Protected | Get dashboard stats for logged-in user |
| GET | `/api/users/:id` | Public | Get a user's profile |
| PUT | `/api/users/:id` | Protected | Update own profile |

### Study Requests — `/api/requests`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/requests` | Public | Get all requests (filter by subject/grade) |
| GET | `/api/requests/:id` | Public | Get single request with all responses |
| POST | `/api/requests` | Pupil only | Post a new study request |
| PUT | `/api/requests/:id` | Owner/Admin | Update a request |
| DELETE | `/api/requests/:id` | Owner/Admin | Delete a request |
| POST | `/api/requests/:id/respond` | Tutor only | Submit a response to a request |
| POST | `/api/requests/:id/rate/:responseId` | Pupil only | Rate a tutor's response |

### Resources — `/api/resources`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/resources` | Public | Browse all resources (filter by subject/grade/type) |
| GET | `/api/resources/:id` | Public | Get a single resource |
| POST | `/api/resources` | Protected | Upload a new resource with file |
| PUT | `/api/resources/:id` | Owner/Admin | Update resource details |
| DELETE | `/api/resources/:id` | Owner/Admin | Delete a resource |
| POST | `/api/resources/:id/download` | Public | Increment download counter |

### AI Assistant — `/api/ai`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/ai/ask` | Public | Ask an academic question |
| GET | `/api/ai/popular` | Public | Get most asked subjects |

---

## 🍃 Database Design

This project uses **MongoDB** (NoSQL) with **Mongoose** schemas. The database name is `educonnect` and contains four collections:

### `users` Collection
```json
{
  "_id": "ObjectId",
  "name": "Lerato Sithole",
  "email": "lerato@student.co.za",
  "password": "$2a$10$hashedvalue...",
  "role": "pupil",
  "grade": "Grade 11",
  "subjects": [],
  "bio": "",
  "rating": 0,
  "totalRatings": 0,
  "helpedCount": 0,
  "createdAt": "2026-01-26T11:08:03.000Z"
}
```

### `studyrequests` Collection
```json
{
  "_id": "ObjectId",
  "title": "Help with quadratic equations",
  "description": "I keep getting confused when using the quadratic formula...",
  "subject": "Mathematics",
  "grade": "Grade 11",
  "postedBy": "ObjectId → users",
  "status": "open",
  "responses": [
    {
      "_id": "ObjectId",
      "tutor": "ObjectId → users",
      "message": "The quadratic formula is...",
      "rating": 5,
      "createdAt": "2026-01-26T12:00:00.000Z"
    }
  ],
  "createdAt": "2026-01-26T11:08:03.000Z"
}
```

### `resources` Collection
```json
{
  "_id": "ObjectId",
  "title": "Grade 12 Mathematics — Quadratic Functions Summary",
  "subject": "Mathematics",
  "grade": "Grade 12",
  "type": "Notes",
  "description": "Comprehensive notes covering parabolas...",
  "fileUrl": "/uploads/1706266083000-notes.pdf",
  "uploadedBy": "ObjectId → users",
  "downloads": 34,
  "createdAt": "2026-01-26T11:08:03.000Z"
}
```

### `ailogs` Collection
```json
{
  "_id": "ObjectId",
  "question": "What is the quadratic formula?",
  "answer": "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a...",
  "subject": "Mathematics",
  "askedBy": "ObjectId → users",
  "relatedResources": ["ObjectId → resources"],
  "createdAt": "2026-01-26T11:08:03.000Z"
}
```

---

## 🤖 AI Feature — NLP Study Assistant

The AI assistant is built using the `natural` Node.js NLP library — no external API key required. It works through four steps:

**Step 1 — Tokenize** the user's question into individual words using `natural.WordTokenizer`

**Step 2 — Detect the subject** by matching tokens against a keyword map covering 8 subjects (Mathematics, Physical Sciences, Life Sciences, English, Geography, History, Accounting, CAT)

**Step 3 — Search the knowledge base** for a direct answer using key phrase matching across common Grade 8–12 curriculum topics including quadratic formula, Newton's Laws, Pythagoras, mitosis vs meiosis, essay structure, Ohm's Law, and more

**Step 4 — Find related resources** from the MongoDB database by matching question keywords against resource titles and subjects

**Step 5 — Log the interaction** to the `ailogs` collection for platform analytics

If no direct answer is found, the assistant returns subject-specific study tips and encourages the pupil to post a study request for human tutor help.

---

## 🔒 Security

| Security Measure | Implementation |
|---|---|
| Password hashing | bcryptjs with 10 salt rounds |
| Authentication | JWT tokens with 7-day expiry |
| Route protection | `protect` middleware checks token on every protected route |
| Role-based access | `authorize()` middleware restricts routes by role |
| File upload validation | Multer restricts to PDF, Word, and image files only |
| File size limit | Maximum 10MB per upload |
| Environment variables | All secrets stored in `.env`, never committed to GitHub |
| Input validation | express-validator on all API inputs |

---

## ⚙️ Setup & Installation

### Requirements
- Node.js v18 or higher — [nodejs.org](https://nodejs.org)
- MongoDB Community Edition — [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- MongoDB Compass (optional GUI) — [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)

> ⚠️ **XAMPP is NOT required.** This project uses Node.js and MongoDB — not PHP, Apache, or MySQL.

### Step 1 — Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/educonnect.git
cd educonnect
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Configure Environment Variables
```bash
cp .env.example .env
```

Open `.env` and confirm the following values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/educonnect
JWT_SECRET=educonnect_secret_2026
NODE_ENV=development
```

### Step 4 — Start MongoDB
Make sure MongoDB is running. On Windows:
```bash
net start MongoDB
```

### Step 5 — Seed the Database (run once)
```bash
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
✅ Users created
✅ Study requests created
✅ Resources created
🎉 Database seeded successfully!
```

### Step 6 — Start the Server
```bash
npm start
```

Expected output:
```
✅ Connected to MongoDB
🚀 EduConnect server running on http://localhost:5000
```

### Step 7 — Open in Browser
```
http://localhost:5000
```

For development with auto-restart on file save:
```bash
npm run dev
```

---

## 👤 Demo Accounts

All demo accounts use the password: **`password123`**

| Role | Name | Email |
|---|---|---|
| Pupil | Lerato Sithole (Grade 11) | lerato@student.co.za |
| Pupil | Mbuso Khumalo (Grade 10) | mbuso@student.co.za |
| Pupil | Zanele Mthembu (Grade 12) | zanele@student.co.za |
| Tutor | Thabo Nkosi (Maths & Science) | thabo@educonnect.co.za |
| Tutor | Ayanda Dlamini (English & Humanities) | ayanda@educonnect.co.za |
| Tutor | Sipho Mokoena (Accounting & CAT) | sipho@educonnect.co.za |
| Admin | Admin User | admin@educonnect.co.za |

---

## 👥 Group Member Responsibilities

### Member 1 — Backend & Infrastructure (40 marks)
Responsible for the Node.js server setup, all RESTful API endpoints, and the MongoDB database design and implementation.

- `server/server.js` — Express server, middleware, routing configuration
- `server/routes/` — All five route files
- `server/controllers/authController.js` — Register and login logic
- `server/controllers/requestController.js` — Study request CRUD and responses
- `server/controllers/resourceController.js` — Resource CRUD and file uploads
- `server/models/` — All four Mongoose schemas
- `server/seed.js` — Database seeding script

### Member 2 — Frontend & Integration (30 marks)
Responsible for the user interface, connecting the frontend to the backend API, and security and deployment.

- `public/index.html` — Complete single-page application (all pages and views)
- All fetch/API calls connecting the frontend to the backend
- JWT token management on the client side
- Responsive design (mobile and desktop)
- Input validation on all forms
- Deployment configuration and README setup instructions

### Member 3 — Intelligence, Innovation & Documentation (35 marks)
Responsible for the AI feature, creative direction of the platform, and all written documentation.

- `server/controllers/aiController.js` — NLP subject detection, knowledge base, resource matching
- `server/models/AILog.js` — AI interaction logging schema
- `server/routes/ai.js` — AI assistant API route
- Innovation features: rating system, subject filtering, grade-specific content
- Problem Definition section of this README
- Entrepreneurship & Reflection section of this README

---

## 💡 Entrepreneurship & Reflection

### Challenges Faced
One of the main technical challenges was implementing the NLP AI assistant without relying on an external paid API. The team solved this by using the `natural` library to build a subject detection engine and a curriculum-aligned knowledge base entirely in Node.js. Another challenge was managing JWT authentication across the single-page frontend, which required careful handling of token storage and protected route redirection.

### What We Learned
The project gave the team hands-on experience with the full MERN-adjacent stack (MongoDB, Express, Node.js). Key lessons included how async/await works in Node.js, how Mongoose schemas model real-world relationships, how JWT authentication works end-to-end, and how to structure a production-ready REST API with proper error handling and role-based access control.

### Scaling the Product
- **Phase 1 (Current):** Free platform for pupils at one institution — proof of concept
- **Phase 2:** Expand to multiple schools and colleges across South Africa, add user verification for tutors
- **Phase 3:** Introduce video tutoring sessions, AI-generated study plans, and gamification (badges, leaderboards)
- **Phase 4:** Partner with the Department of Basic Education to provide the platform nationally as a free public resource

### Sustainability as a Product
EduConnect could be sustained through a freemium model where the core platform remains free and a premium tier offers verified tutor sessions, personalised AI study plans, and exam preparation packages. Revenue could also come from institutional licensing to schools and TVET colleges, sponsorships from SA education brands (Sanlam, FNB, Vodacom), and grant funding from organisations like the Zenex Foundation or Allan Gray Orbis Foundation which actively fund SA education technology. The platform could also be entered into competitions such as the SAB Foundation Social Innovation Awards or the Allan Gray Fellowship entrepreneurship programme.

---

## 📋 Pre-Submission Checklist

- [ ] GitHub repository is public
- [ ] Lecturer (`xpiyose`) has been invited as a collaborator
- [ ] `.env` is in `.gitignore` — never committed
- [ ] `.env.example` is committed with placeholder values
- [ ] App runs with `npm install` then `npm start` — no extra steps
- [ ] Database seeds successfully with `npm run seed`
- [ ] All API endpoints tested and working
- [ ] App is fully responsive on mobile (375px) and desktop
- [ ] AI assistant returns meaningful answers
- [ ] All code files have comments explaining key logic
- [ ] All 9 rubric criteria have visible evidence in the codebase
- [ ] Live deployment URL added below (if deployed)

---

## 🌐 Live URL

```
http://localhost:5000   (local)
https://              (deployment URL — add when deployed to Render/Railway)
```

---

*EduConnect — Built by students, for students. 🇿🇦*
