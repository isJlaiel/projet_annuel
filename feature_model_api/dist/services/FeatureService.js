import * as xml2js from 'xml2js';
import { Feature } from '../models/Feature.js';
export class FeatureService {
    async parseFromXMLToFeatures(xmlData) {
        const parser = new xml2js.Parser({ explicitChildren: true, preserveChildrenOrder: true, charsAsChildren: false });
        try {
            const result = await parser.parseStringPromise(xmlData);
            if (result && result.FeatureModel && result.FeatureModel.Feature) {
                return this.parse(result.FeatureModel.Feature);
            }
            return [];
        }
        catch (error) {
            console.error('Erreur lors de l\'analyse XML :', error);
            return [];
        }
    }
    parse(featureData) {
        return featureData.map(f => {
            const attributes = f.$ || {};
            /**       console.log(featureData[0].subFeature[0].Feature)
                [
                 { '$': { name: 'course-hierarchy', optional: 'true' } },
                 { '$': { name: 'event', optional: 'true' } }
                ]
            */
            const subFeatures = f.subFeature ? this.parse(f.subFeature[0].Feature) : [];
            return new Feature(f.$.name, attributes, subFeatures);
        });
    }
}
//# sourceMappingURL=FeatureService.js.map