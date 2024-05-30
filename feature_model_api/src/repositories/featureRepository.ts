import * as xml2js from 'xml2js';
import { promises as fs } from 'fs';
import { getFolderName, runJar } from '../utils/versionManager.js';
import path from 'path';

const basicPath = path.join(process.cwd(), "src", "storage");
export class FeatureRepository {
 
    private parser: xml2js.Parser;
    private builder: xml2js.Builder;

    constructor() {
        this.parser =  new xml2js.Parser();
        this.builder = new xml2js.Builder();
    }
    async loadXML(path: string): Promise<any> {
        const xmlData  =  (await fs.readFile(path, 'utf-8')).replace(/^\s+</, '<');
        return  await this.parser.parseStringPromise(xmlData);
    }

    async generateInstance(xmlObject: any): Promise<void> {
        const jarPath = `${basicPath}/configurationFiles/ExprimentGenerator_new2024Bis.jar`
        const xml: string = this.builder.buildObject(xmlObject);
        const folderName : string = getFolderName() 
        const options = `${basicPath}/${folderName}/config.xml ${basicPath}/configurationFiles/configurationVolume.xml ${basicPath}/configurationFiles/configuration_rule.xml ${basicPath}/configurationFiles/teacherCalculationByEtape.xml ${basicPath}/configurationFiles/effectifFormationsData.xml experimentGeneratorName "1" `
        const dirPath = `${basicPath}/${folderName}`

    try {
        await fs.mkdir(dirPath, { recursive: true });
        const filePath = path.join(dirPath, 'config.xml');
        await fs.writeFile(filePath, xml);

        console.log('File written successfully');
    } catch (err) {
        console.error('Error writing file:', err);
    } 
   await runJar(jarPath,options,dirPath)

    }


}


