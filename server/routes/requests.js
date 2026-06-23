import express from 'express';
import {
  getRequests, getRequest, createRequest,
  updateRequest, deleteRequest, respondToRequest, rateResponse
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getRequests);
router.get('/:id', getRequest);
router.post('/', protect, authorize('pupil', 'admin'), createRequest);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);
router.post('/:id/respond', protect, authorize('tutor', 'admin'), respondToRequest);
router.post('/:id/rate/:responseId', protect, authorize('pupil', 'admin'), rateResponse);

export default router;
