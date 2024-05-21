import { promises as fs } from 'fs';
import { Feature } from '../models/feature.js';
import { FeatureService } from '../services/featureService.js';
import { Request, Response } from 'express';
import { FeatureModel } from '../models/featureModel.js';


 export  class FeatureController{
     featureService: FeatureService;
    constructor({featureService}: {featureService: FeatureService}){
        this.featureService = featureService ;
    }
    public  async getFeatures (req: Request, res:Response): Promise<void> {
        try{
            const featureModel: FeatureModel  = await this.featureService.parseFromXMLToFeatures()
            res.json(featureModel);
        } catch (error) {
            console.error("Failed to process features:", error);
            res.status(500).send(error);
        }
    }

     async configureFeatures(req: Request, res:Response):Promise<void> {
        try {
            const featureData = req.body;  
            await this.featureService.configureFeatures(featureData)
            // console.log('Received feature configuration:', featureData);
            res.status(200).json({
                message: "Features configured successfully",
                featureData: featureData
            });
            return;
        } catch (error) {
            console.error('Error configuring features:', error);
            res.status(500).send('Internal Server Error');
        }
    }
  
}