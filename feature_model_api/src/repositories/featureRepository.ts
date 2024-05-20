import * as xml2js from 'xml2js';
import { promises as fs } from 'fs';

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

    async saveXML(filePath: string, xmlObject: any): Promise<void> {
        const xml: string = this.builder.buildObject(xmlObject);
        // await fs.promises.writeFile(filePath, xml);
    }

}