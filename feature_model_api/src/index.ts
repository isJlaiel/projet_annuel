import express from "express";
import { createContainer, asClass, asValue } from 'awilix';
import cors from 'cors';

import {FeatureController} from './controllers/featureController.js';
import { FeatureService } from './services/featureService.js';
import { FeatureRepository } from './repositories/featureRepository.js';
import featureRoutes from "./routes/featureRoutes.js";
// Création de l'application Express
export const app = express();
const PORT = 3002;

// Configuration de middleware
app.use(cors());
app.use(express.json());

// Création et configuration du conteneur Awilix
export const container = createContainer();
container.register({
    featureController: asClass(FeatureController).singleton(),
    featureService: asClass(FeatureService).singleton(),
    featureRepository: asClass(FeatureRepository).singleton(),
    app: asValue(app) // Permet d'injecter 'app' si nécessaire dans d'autres parties de l'application
});

// Configuration des routes
app.use('/', featureRoutes(container));
// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
