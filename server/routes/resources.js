import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getResources, getResource, createResource,
  updateResource, deleteResource, downloadResource
} from '../controllers/resourceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpeg|jpg|png|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) cb(null, true);
  else cb(new Error('Only PDF, images, and Word documents are allowed.'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', getResources);
router.get('/:id', getResource);
router.post('/', protect, upload.single('file'), createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);
router.post('/:id/download', downloadResource);

export default router;
