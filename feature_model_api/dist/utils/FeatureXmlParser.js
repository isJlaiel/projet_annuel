import * as xml2js from 'xml2js';
import { Feature } from '../models/feature.js';
import SubFeature from '../models/subFeature.js';
import { FeatureModel } from '../models/featureModel.js';
export async function parseXML(xmlData) {
    const parser = new xml2js.Parser({ explicitChildren: true, preserveChildrenOrder: true, charsAsChildren: false });
    const result = await parser.parseStringPromise(xmlData);
    const name = result.FeatureModel.$.name;
    // console.log(name);//good
    // console.log( result.FeatureModel.Features[0].Feature);
    const features = parseFeatures(result.FeatureModel.Features[0].Feature);
    console.log(new FeatureModel(name, features));
    // try {
    //     const result = await parser.parseStringPromise(xmlData);
    //     if (result && result.FeatureModel && result.FeatureModel.Feature) {
    //         return parseFeatures(result.FeatureModel.Feature);
    //     }
    //     return [];
    // } catch (error) {
    //     console.error('Error parsing XML:', error);
    //     return [];
    // }
}
function parseFeatures(featuresData) {
    const features = featuresData.map((feature) => {
        const attributes = feature.$ || {};
        const subFeatures = parseSubFeatures(feature.subFeature); // You would need to write this function based on your XML structure
        return new Feature(attributes, subFeatures);
    });
    return features;
}
function parseSubFeatures(subFeaturesData) {
    // Base case: if there are no sub-features, return an empty SubFeature
    if (!subFeaturesData || subFeaturesData.length === 0) {
        return new SubFeature(undefined, []);
    }
    const parsedSubFeatures = subFeaturesData.map((subFeature) => {
        const subFeatureType = subFeature.$?.type;
        const features = subFeature.Feature ? subFeature.Feature.map((f) => {
            const attributes = f.$ || {};
            // Recursively parse further nested sub-features
            const nestedSubFeatures = f.subFeature ? parseSubFeatures(f.subFeature) : undefined;
            return new Feature(attributes, nestedSubFeatures);
        }) : [];
        return new SubFeature(subFeatureType, features);
    });
    const type = parsedSubFeatures[0]?.type;
    let combinedFeatures = parsedSubFeatures.flatMap(sub => sub.features);
    return new SubFeature(type, combinedFeatures);
}
//# sourceMappingURL=FeatureXmlParser.js.map