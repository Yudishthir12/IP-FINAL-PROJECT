________________________________________
🎓 Topic: EduConnect — A Smart Tutoring & Study Resource Platform for South African Students
The Problem: Many South African university and college students struggle to find affordable tutoring, access relevant study resources, or get quick academic help outside of class hours. Existing platforms are either too expensive, too generic, or not built for the local context.
The Solution: A full-stack web app where students can post study requests, tutors can offer help, resources (notes, past papers) can be uploaded and searched, and an AI assistant answers common academic questions using NLP. Think of it as a local, smart version of Chegg or Studocu — built by students, for students.
________________________________________
________________________________________
🗂️ Full Project Description
What we are Building
EduConnect is a web-based tutoring and study resource platform. It has three types of users: students (who need help), tutors (who offer help), and an admin. The app allows students to post study requests, tutors to respond and offer sessions, resources like notes and past papers to be uploaded and browsed, and an AI-powered Q&A assistant to answer academic questions instantly.
________________________________________
App Pages & Features
Page	What it does
Landing page	Introduces the platform, shows stats, call to action
Register / Login	User signs up as student or tutor
Dashboard	Personalised home after login
Study Requests	Students post requests; tutors respond
Resource Library	Upload, browse, and download study materials
AI Q&A Assistant	Ask an academic question, get an intelligent answer
Tutor Profiles	Browse tutors by subject/rating
Admin Panel	Manage users and content
________________________________________
________________________________________
👤 Member 1 — Backend & Infrastructure (40 marks)
Your Job in Plain Terms
You are building the engine of the app. Nothing works without you. Every page that saves or loads data depends on your backend.
________________________________________
Part 1: Node.js Server Setup (15 marks)
What to build:
•	Initialise the project: npm init -y, install express, dotenv, cors, nodemon, bcryptjs, jsonwebtoken, mongoose (or mysql2)
•	Create this folder structure:
/server
  /routes
  /controllers
  /models
  /middleware
  server.js
  .env
•	In server.js: configure Express, connect middleware (express.json(), cors()), import all routes, and start the server on a port from .env
•	Write an async error-handling middleware that catches errors and returns a clean JSON response
•	Use nodemon so the server restarts automatically during development
•	All database calls must use async/await — no .then() chains
Deliverable: A running Express server that starts with npm run dev, has clean routing, handles errors gracefully, and is ready to plug database models and routes into.
________________________________________
Part 2: RESTful API Endpoints (15 marks)
What to build — these are all the endpoints the app needs:
AUTH
POST   /api/auth/register       → create new user account
POST   /api/auth/login          → login, return JWT token

USERS
GET    /api/users/:id           → get a user's profile
PUT    /api/users/:id           → update profile

STUDY REQUESTS
GET    /api/requests            → get all study requests
POST   /api/requests            → student posts a new request
PUT    /api/requests/:id        → update a request
DELETE /api/requests/:id        → delete a request

RESOURCES
GET    /api/resources           → browse all uploaded resources
POST   /api/resources           → upload a new resource
DELETE /api/resources/:id       → remove a resource

RESPONSES (tutor replies to a request)
POST   /api/requests/:id/respond   → tutor responds to a request
GET    /api/requests/:id/responses → get all responses to a request

AI ASSISTANT
POST   /api/ai/ask              → send a question, get an answer (Member 3 will implement the logic, you set up the route)
Rules:
•	Every endpoint returns JSON
•	Use correct status codes: 200 (ok), 201 (created), 400 (bad input), 401 (not logged in), 403 (forbidden), 404 (not found), 500 (server error)
•	Test every single endpoint in Postman before telling the team it's done
•	Document all endpoints in the README with example request/response bodies
________________________________________
Part 3: Database (10 marks)
Use MongoDB with Mongoose (recommended) or MySQL.
Create these schemas/models:
User {
  name, email, password (hashed), role (student/tutor/admin),
  subject (for tutors), bio, rating, createdAt
}

StudyRequest {
  title, description, subject, postedBy (ref: User),
  status (open/closed), createdAt
}

Response {
  requestId (ref: StudyRequest), tutorId (ref: User),
  message, createdAt
}

Resource {
  title, subject, fileUrl, uploadedBy (ref: User),
  downloads, createdAt
}
•	Connect MongoDB via mongoose.connect() using a URI stored in .env
•	Each model must support full CRUD through the API endpoints
•	Seed the database with at least: 3 users (1 student, 1 tutor, 1 admin), 3 study requests, 2 resources
•	Handle connection errors — if DB fails to connect, log the error clearly and exit the process
________________________________________
________________________________________
👤 Member 2 — Frontend & Integration (30 marks)
Your Job in Plain Terms
You are building everything the user sees and making sure it talks correctly to Member 1's backend. You are the bridge between the user and the system.
________________________________________
Part 1: UI & Responsive Design (10 marks)
What to build — these are all the pages:
Landing Page (index.html or /)
•	Hero section: app name, tagline, "Get Started" and "Browse Resources" buttons
•	Stats section: e.g. "200+ students helped, 50+ tutors, 300+ resources"
•	How it works: 3-step visual (Post Request → Get Matched → Study Better)
•	Footer with links
Auth Pages (/register, /login)
•	Register: name, email, password, role selector (Student / Tutor), subject field (appears only if Tutor is selected)
•	Login: email, password, "Forgot password?" link
•	Show validation errors inline (e.g. "Email is required", "Password must be 6+ characters")
Dashboard (/dashboard)
•	Greeting with user's name
•	If student: show their open requests, suggested tutors, quick "Post a Request" button
•	If tutor: show requests in their subject area, their response history
Study Requests Page (/requests)
•	List all open study requests with subject tag, title, date posted, and a "Respond" button for tutors
•	"Post a Request" form for students (title, subject dropdown, description)
•	Filter requests by subject
Resource Library (/resources)
•	Grid of resource cards (title, subject, uploaded by, download count)
•	Upload form: title, subject, file upload
•	Search bar to filter by subject or keyword
AI Assistant Page (/assistant)
•	Clean chat-style interface
•	Input box: "Ask any academic question..."
•	Display the question and AI response in a conversation format
•	Loading spinner while waiting for the response
Tutor Profiles Page (/tutors)
•	Cards showing tutor name, subject, rating, short bio, "View Profile" button
Design rules:
•	Use Bootstrap 5 or Tailwind CSS — no unstyled plain HTML
•	Must work on mobile (test at 375px width) and desktop
•	Use a consistent colour scheme throughout (pick 2–3 colours and stick to them)
•	Every form must show success and error feedback to the user
________________________________________
Part 2: Full-Stack Integration (10 marks)
What to build — connecting every page to Member 1's API:
// Example: posting a study request
async function postRequest(title, subject, description) {
  const res = await fetch('/api/requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ title, subject, description })
  });
  const data = await res.json();
  if (!res.ok) showError(data.message);
  else showSuccess('Request posted!');
}
Every page must be wired up:
•	Register/Login → calls auth API → saves JWT token to localStorage → redirects to dashboard
•	Dashboard → fetches user-specific data on load
•	Study Requests → loads all requests from API; POST form sends to API; tutors can submit responses
•	Resource Library → loads all resources from API; upload form sends file and metadata
•	AI Assistant → sends question to /api/ai/ask and displays the response
•	Tutor Profiles → loads tutor users from API
Error handling on every call:
•	If the server returns an error, show the user a readable message — never show raw JSON or a blank screen
•	If the user is not logged in and tries to access a protected page, redirect them to /login
________________________________________
Part 3: Security & Deployment (10 marks)
Authentication:
•	After login, store the JWT token in localStorage
•	On every protected API call, send the token in the Authorization: Bearer <token> header
•	Write a function isLoggedIn() that checks for the token and redirects to login if missing
•	Show/hide nav items based on login state and role (e.g. tutors see "Respond", students see "Post Request")
Input validation (frontend side):
•	No form should submit with empty required fields
•	Email fields must match email format
•	Password must be at least 6 characters
•	File uploads must only accept PDF or image files
Deployment:
•	Deploy the full app on Render (free tier) — both frontend and backend
•	The live URL must be in the README
•	If deployment isn't possible, the app must run locally with a single npm install && npm start — no missing steps, no broken imports
•	Write a clear README.md: 
o	What the app does
o	How to install and run it
o	All environment variables needed (.env.example file)
o	Live URL or local setup instructions
o	GitHub repo must be public and lecturer invited
________________________________________
________________________________________
👤 Member 3 — Intelligence, Innovation & Documentation (35 marks)
Your Job in Plain Terms
You are making the app smart, making sure it's original, and telling the story of what the group built and why it matters.
________________________________________
Part 1: AI / Intelligent Feature (10 marks)
What to build: An NLP-powered Academic Q&A Assistant
This is the /api/ai/ask endpoint that Member 1 has scaffolded for you. You own the logic inside it.
Option A — Use OpenAI API (recommended, most impressive):
// Install: npm install openai
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const askAssistant = async (req, res) => {
  const { question } = req.body;
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful academic tutor for South African IT students. Answer clearly and concisely.' },
      { role: 'user', content: question }
    ]
  });
  res.json({ answer: completion.choices[0].message.content });
};
Option B — Use the natural NLP library (no API key needed):
•	Install: npm install natural
•	Build a keyword classifier: if the question contains words related to a subject (e.g. "loop", "array", "function" → Programming; "network", "IP", "protocol" → Networking), return a relevant pre-written explanation
•	Add a TF-IDF matcher that finds the most relevant resource from the database based on the question
Whichever option you choose:
•	The feature must actually work and return a meaningful response
•	It must be integrated into the frontend AI Assistant page (Member 2 handles the UI, you handle the logic)
•	Store questions and answers in the database so the app learns what students commonly ask
•	Add a "related resources" feature: after answering, query the database for resources matching keywords in the question and return them alongside the answer
________________________________________
Part 2: Innovation & Creativity (10 marks)
What to drive for the group:
EduConnect is already a solid idea, but push these angles to score high on innovation:
•	Smart tutor matching: When a student posts a request, automatically suggest the top 3 tutors whose subjects match, ranked by rating — don't make students scroll through everyone
•	Subject tagging system: Resources and requests are tagged by subject; filtering is instant and smart
•	Session rating system: After a tutor responds and helps, the student can rate the interaction — tutors build a reputation score over time
•	South African context: Include local universities/subjects in the subject dropdown (e.g. Computer Networks, Internet Programming, Data Structures — things ITNP students actually study)
•	Dashboard analytics: Show the student how many requests they've posted and resolved; show tutors how many students they've helped
Document every creative decision: in the README or a DESIGN.md file, write a short paragraph explaining why each feature was designed the way it was.
________________________________________
Part 3: Problem Definition & Entrepreneurship/Reflection (15 marks)
Write this as a proper document — either in the README under clear headings, or as a separate REPORT.md file in the repo.
________________________________________
Problem Definition (5 marks) — write ~400 words covering:
•	The problem: Many students at South African institutions lack access to affordable, on-demand academic support. Tutoring is expensive, office hours are limited, and generic platforms like YouTube or Google don't offer subject-specific, contextual help.
•	Who is affected: First and second-year IT diploma students who are learning to code and often fall behind without timely help.
•	Why existing solutions fall short: Platforms like Chegg are expensive and US-focused; WhatsApp groups are unstructured; asking the lecturer takes days.
•	How EduConnect solves it: A free, community-driven platform where peers help peers, resources are centralised, and an AI assistant provides instant answers — all tailored to the SA IT curriculum.
(Expand each point in your own words — don't copy this verbatim)
________________________________________
Entrepreneurship & Reflection (10 marks) — write ~600 words covering:
•	Challenges faced: What went wrong technically? What was hard to integrate? How did the group resolve disagreements or blockers?
•	Lessons learned: What did each member learn about full-stack development, collaboration, or the tools used?
•	Scaling the product: 
o	Phase 1 (now): Free platform for students at one institution
o	Phase 2: Expand to multiple colleges/universities across SA
o	Phase 3: Introduce paid premium features — verified tutors, video sessions, AI-powered study plans
•	Sustainability as a product: 
o	Revenue model: freemium (basic free, premium paid), institutional licensing to colleges, advertising from SA education brands
o	Could partner with NSFAS or bursary providers to subsidise tutor payments
•	Positioning: EduConnect could be pitched to student affairs departments, EdTech investors, or entered into competitions like the SAB Foundation Social Innovation Awards
(Again — write this in your own words, using this as a guide)
________________________________________
✅ Group Checklist Before Submission
•	[ ] GitHub repo is public and lecturer (xpiyose) is invited
•	[ ] Code runs with npm install && npm start — no broken setup
•	[ ] .env.example file is in the repo (never commit the real .env)
•	[ ] Every file has comments explaining what it does
•	[ ] All 9 marking criteria have visible evidence in the code
•	[ ] README covers: what the app is, how to run it, live URL, team members
•	[ ] Database is seeded with sample data
•	[ ] All API endpoints tested and working
•	[ ] App is responsive on mobile
•	[ ] AI feature is functional and integrated
•	[ ] Due: 26 June 2026

