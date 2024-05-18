import { Router } from 'express';
const featureRoutes = (container) => {
const router = Router();
const featureController = container.resolve('featureController');

router.get('/features', (req, res) => featureController.getFeatures(req, res));
router.put('/features/configure',(req, res) => featureController.configureFeatures(req, res));

return router;
};

export default featureRoutes;