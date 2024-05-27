import { promises as fsPromises } from "fs";
import fs from "fs";
import { FeatureService } from "../services/featureService.js";
import { Request, Response } from "express";
import { FeatureModel } from "../models/featureModel.js";
import path from "path";
import archiver from 'archiver';

import { fileURLToPath } from "url";
import mime from "mime";
import stream from "stream";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basicPath = path.join(__dirname, "../..", "src", "storage");

export class FeatureController {
  featureService: FeatureService;
  constructor({ featureService }: { featureService: FeatureService }) {
    this.featureService = featureService;
  }
  public async getFeatures(req: Request, res: Response): Promise<void> {
    try {
      const featureModel: FeatureModel =
        await this.featureService.parseFromXMLToFeatures();
      res.json(featureModel);
    } catch (error) {
      console.error("Failed to process features:", error);
      res.status(500).send(error);
    }
  }

  async configureFeatures(req: Request, res: Response): Promise<void> {
    try {
      console.log('heeeeeeeeeeeeeeeeeeeeee')
      const featureData = req.body;
      await this.featureService.configureFeatures(featureData);
      res.status(200).json({
        message: "Features configured successfully",
        featureData: featureData,
      });
      return;
    } catch (error) {
      console.error("Error configuring features:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  private async getFilesTree(dir: string) {
    const dirents = await fsPromises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(async (dirent) => {
        const res = path.resolve(dir, dirent.name);
        const relativePath = path.relative("src/storage/", res);
        if (dirent.isDirectory()) {
          return {
            name: dirent.name,
            path: relativePath,
            children: await this.getFilesTree(res),
          };
        } else {
          return { name: dirent.name, path: relativePath };
        }
      })
    );
    return files;
  }

  async getFiles(req: Request, res: Response): Promise<void> {
    try {
      const files = await this.getFilesTree("src/storage/");
      await Promise.all(files);
      res.json(files);
    } catch (error) {
      console.error("Error reading files:", error);
      res.status(500).send("Internal Server Error");
    }
  }


  async downloadFile(req, res) {
    const fullPath = path.join(basicPath, req.params.filePath);
    try {
      const zipPath = path.join(__dirname, 'download.zip');

      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
          zlib: { level: 9 } // Sets the compression level.
      });
  
      output.on('close', () => {
          res.download(zipPath, 'download.zip', (err) => {
              if (err) {
                  console.error('Error downloading the file:', err);
              }
              fs.unlinkSync(zipPath); // Delete the zip file after download
          });
      });
  
      archive.on('error', (err) => {
          throw err;
      });
  
      archive.pipe(output);
      archive.directory(fullPath, false);
      archive.finalize();
    
      // } else if (stats.isFile()) {
      //   res.download(fullPath,(err)=>{
      //     if(err){
      //         res.status(500).send({
      //             message : "erreur download : "+ err
      //         })
      //     }
      // } )
      // }
  } catch (err) {
      console.error('Error accessing the file path:', err);
      res.status(404).send('File not found');
  }
}

  
}
