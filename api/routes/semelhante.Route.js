import express from 'express';
import { getSimilarItems } from '../controllers/semelhante.controller.js';

const router = express.Router();

// GET /api/sem/:type/:id
router.get('/:type/:id', getSimilarItems);

export default router;
