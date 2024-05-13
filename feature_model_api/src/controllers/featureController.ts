import { promises as fs } from 'fs';
import { Feature } from '../models/feature.js';
import { FeatureService } from '../services/featureService.js';
import { Request, Response } from 'express';
import { FeatureModel } from '../models/featureModel.js';


 export default class FeatureController{

    public static async getFeatures (req: Request, res:Response): Promise<void> {
        try{
            const xmlData = await fs.readFile('src/storage/model.xml', 'utf-8');
            const featureModel: FeatureModel  = await FeatureService.parseFromXMLToFeatures(xmlData)
            res.json(featureModel);

        } catch (error) {
            console.error("Failed to process features:", error);
            res.status(500).send(error);
        }
        
    }

    static configureFeatures():Promise<void> {
        throw new Error('Method not implemented.');
    }
  
}