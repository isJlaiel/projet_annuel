import { promises as fs } from 'fs';
import { FeatureService } from '../services/featureService.js';
import { Request, Response } from 'express';
import { FeatureModel } from '../models/featureModel.js';
import path from 'path';
import util from 'util';

const readdirPromise = util.promisify(fs.readdir)


 export  class FeatureController{
    featureService: FeatureService;
    constructor({featureService}: {featureService: FeatureService}){
        this.featureService = featureService ;
    }
    public async getFeatures (req: Request, res:Response): Promise<void> {
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

    private async getFilesTree(dir: string){
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map(async (dirent) => {
            const res = path.resolve(dir, dirent.name);
            const relativePath = path.relative('src/storage/', res);
            if (dirent.isDirectory()) {
                return { name: dirent.name, path: relativePath, children: await this.getFilesTree(res) };
            } else {
                return { name: dirent.name, path: relativePath };
            }
        }));
        return files;
    }

    async getFiles(req: Request, res: Response): Promise<void> {
        try {
            const files = await this.getFilesTree('src/storage/');
            await Promise.all(files)
            res.json(files);
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).send('Internal Server Error');
        }
    }

  
}