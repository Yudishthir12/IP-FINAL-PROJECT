// =============================================
// seed.js — Populate database with sample data
// Run with: npm run seed
// =============================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import StudyRequest from './models/StudyRequest.js';
import Resource from './models/Resource.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/educonnect';

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await StudyRequest.deleteMany();
    await Resource.deleteMany();
    console.log('Cleared existing data');

    // Create users
    // Create users — plain text passwords, User model's pre-save hook hashes them automatically
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@educonnect.co.za',
      password: 'password123',
      role: 'admin',
      grade: 'N/A'
    });

    const tutor1 = await User.create({
      name: 'Thabo Nkosi',
      email: 'thabo@educonnect.co.za',
      password: 'password123',
      role: 'tutor',
      grade: 'N/A',
      subjects: ['Mathematics', 'Physical Sciences'],
      bio: 'Matric student with distinctions in Maths and Science. I love breaking down complex problems.',
      rating: 4.8,
      totalRatings: 12,
      helpedCount: 15
    });

    const tutor2 = await User.create({
      name: 'Ayanda Dlamini',
      email: 'ayanda@educonnect.co.za',
      password: 'password123',
      role: 'tutor',
      grade: 'N/A',
      subjects: ['English', 'History', 'Geography'],
      bio: 'Passionate about languages and humanities. I can help you ace your essays and exams.',
      rating: 4.5,
      totalRatings: 8,
      helpedCount: 10
    });

    const tutor3 = await User.create({
      name: 'Sipho Mokoena',
      email: 'sipho@educonnect.co.za',
      password: 'password123',
      role: 'tutor',
      grade: 'N/A',
      subjects: ['Accounting', 'Mathematics', 'Computer Applications Technology'],
      bio: 'Commerce stream tutor. Accounting and Maths Lit specialist.',
      rating: 4.2,
      totalRatings: 5,
      helpedCount: 7
    });

    const pupil1 = await User.create({
      name: 'Lerato Sithole',
      email: 'lerato@student.co.za',
      password: 'password123',
      role: 'pupil',
      grade: 'Grade 11'
    });

    const pupil2 = await User.create({
      name: 'Mbuso Khumalo',
      email: 'mbuso@student.co.za',
      password: 'password123',
      role: 'pupil',
      grade: 'Grade 10'
    });

    const pupil3 = await User.create({
      name: 'Zanele Mthembu',
      email: 'zanele@student.co.za',
      password: 'password123',
      role: 'pupil',
      grade: 'Grade 12'
    });

    console.log('✅ Users created');

    // Create study requests
    const req1 = await StudyRequest.create({
      title: 'Help with quadratic equations — Grade 11 Maths',
      description: 'I keep getting confused when using the quadratic formula, especially when the discriminant is negative. Can someone explain with examples?',
      subject: 'Mathematics',
      grade: 'Grade 11',
      postedBy: pupil1._id,
      status: 'open'
    });

    const req2 = await StudyRequest.create({
      title: 'Essay writing tips for English Paper 2',
      description: 'My essays always lose marks on structure. I need help planning and writing a proper discursive essay.',
      subject: 'English',
      grade: 'Grade 11',
      postedBy: pupil1._id,
      status: 'in-progress',
      responses: [{
        tutor: tutor2._id,
        message: "Great question! For a discursive essay: Start with a hook, state your thesis, then dedicate one paragraph per point. Use PEEL: Point, Evidence, Explanation, Link back. I can share a template if you'd like!",
        rating: null
      }]
    });

    const req3 = await StudyRequest.create({
      title: 'Newton\'s Laws of Motion — Grade 10 Science',
      description: 'Can someone explain the difference between Newton\'s first, second and third laws with real-life examples? My exam is on Friday.',
      subject: 'Physical Sciences',
      grade: 'Grade 10',
      postedBy: pupil2._id,
      status: 'open'
    });

    const req4 = await StudyRequest.create({
      title: 'Trial Balance and how to identify errors',
      description: 'I don\'t understand how to use a trial balance to find bookkeeping errors. Grade 12 Accounting.',
      subject: 'Accounting',
      grade: 'Grade 12',
      postedBy: pupil3._id,
      status: 'open'
    });

    const req5 = await StudyRequest.create({
      title: 'Cell division — Mitosis vs Meiosis difference',
      description: 'I always mix up mitosis and meiosis in Life Sciences. What is the easy way to remember the differences?',
      subject: 'Life Sciences',
      grade: 'Grade 12',
      postedBy: pupil3._id,
      status: 'resolved',
      responses: [{
        tutor: tutor1._id,
        message: 'Memory trick: Mitosis = "More" cells (2 identical), Meiosis = "Mix" cells (4 unique). Mitosis is for growth/repair; Meiosis is for reproduction. Meiosis has 2 divisions; Mitosis has 1.',
        rating: 5
      }]
    });

    console.log('✅ Study requests created');

    // Create resources
    await Resource.create({
      title: 'Grade 12 Mathematics — Quadratic Functions Summary',
      subject: 'Mathematics',
      grade: 'Grade 12',
      type: 'Notes',
      description: 'Comprehensive notes covering parabolas, turning points, intercepts, and exam-style questions.',
      uploadedBy: tutor1._id,
      downloads: 34
    });

    await Resource.create({
      title: 'Grade 11 Physical Sciences — Newton\'s Laws Worksheet',
      subject: 'Physical Sciences',
      grade: 'Grade 11',
      type: 'Exercise',
      description: 'Practice problems on all three Newton\'s Laws with memorandum included.',
      uploadedBy: tutor1._id,
      downloads: 27
    });

    await Resource.create({
      title: 'English Essay Writing Guide — All Grades',
      subject: 'English',
      grade: 'Grade 10',
      type: 'Study Guide',
      description: 'Step-by-step guide to writing discursive, argumentative, and narrative essays.',
      uploadedBy: tutor2._id,
      downloads: 58
    });

    await Resource.create({
      title: 'Grade 12 Life Sciences — Cell Division Past Paper Questions',
      subject: 'Life Sciences',
      grade: 'Grade 12',
      type: 'Past Paper',
      description: 'Collected NSC exam questions on mitosis and meiosis from 2018-2023.',
      uploadedBy: tutor2._id,
      downloads: 41
    });

    await Resource.create({
      title: 'Grade 10 Accounting — Basic Bookkeeping Notes',
      subject: 'Accounting',
      grade: 'Grade 10',
      type: 'Notes',
      description: 'Introduction to debits, credits, journals and ledger accounts.',
      uploadedBy: tutor3._id,
      downloads: 19
    });

    console.log('✅ Resources created');
    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Test accounts (password: password123):');
    console.log('  Admin:  admin@educonnect.co.za');
    console.log('  Tutor:  thabo@educonnect.co.za');
    console.log('  Pupil:  lerato@student.co.za');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
