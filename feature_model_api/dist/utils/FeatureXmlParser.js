import * as xml2js from 'xml2js';
import { Feature } from '../models/feature.js';
export async function parseXML(xmlData) {
    const parser = new xml2js.Parser({ explicitChildren: true, preserveChildrenOrder: true, charsAsChildren: false });
    try {
        const result = await parser.parseStringPromise(xmlData);
        if (result && result.FeatureModel && result.FeatureModel.Feature) {
            return parseFeatures(result.FeatureModel.Feature);
        }
        return [];
    }
    catch (error) {
        console.error('Error parsing XML:', error);
        return [];
    }
}
function parseFeatures(featureData) {
    return featureData.map(f => {
        const attributes = f.$ || {};
        const subFeatures = f.subFeature ? parseFeatures(f.subFeature[0].Feature) : [];
        return new Feature(f.$.name, attributes, subFeatures);
    });
}
//# sourceMappingURL=FeatureXmlParser.js.map