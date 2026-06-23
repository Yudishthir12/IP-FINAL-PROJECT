import express from 'express';
import { askQuestion, getPopularTopics } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// AI assistant is accessible without login but logs user if logged in
router.post('/ask', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth) {
    import('../middleware/auth.js').then(({ protect }) => protect(req, res, next)).catch(() => next());
  } else {
    next();
  }
}, askQuestion);

router.get('/popular', getPopularTopics);

export default router;
