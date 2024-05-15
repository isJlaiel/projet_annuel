import { Router } from 'express';
import FeatureController from '../controllers/featureController.js';

const router = Router();

router.get('/features', FeatureController.getFeatures);
router.put('/features/configure', FeatureController.configureFeatures);

export default router;
