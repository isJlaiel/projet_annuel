import { Router } from 'express';
const featureRoutes = (container) => {
const router = Router();
const featureController = container.resolve('featureController');

router.get('/features', (req, res) => featureController.getFeatures(req, res));
router.put('/features/configure',(req, res) => featureController.configureFeatures(req, res));
router.get('/features/files', (req, res) => featureController.getFiles(req, res));
router.get('/download/:filePath', (req, res) => featureController.downloadFile(req, res));
router.delete('/features/files/:filePath', (req, res) => featureController.deleteFile(req, res));

return router;
};

export default featureRoutes;