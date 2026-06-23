import express from 'express';
import { getTutors, getUser, updateUser, getDashboardStats } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/tutors', getTutors);
router.get('/dashboard', protect, getDashboardStats);
router.get('/:id', getUser);
router.put('/:id', protect, updateUser);

export default router;
