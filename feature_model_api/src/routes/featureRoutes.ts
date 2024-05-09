import { Router } from 'express';
import FeatureController from '../controllers/featureController.js';

const router = Router();

router.get('/', FeatureController.getFeatures);

export default router;
