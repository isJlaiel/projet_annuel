import * as xml2js from 'xml2js';
import { promises as fs } from 'fs';
import { Feature } from '../models/Feature.js';
import { Attribute } from '../types/attribute.js';
export async function parseXML(xmlData: string){
    const parser = new xml2js.Parser({ explicitChildren: true, preserveChildrenOrder: true, charsAsChildren: false });

    try {
        const result = await parser.parseStringPromise(xmlData);
        if (result && result.FeatureModel && result.FeatureModel.Feature) {
            return parseFeatures(result.FeatureModel.Feature);
        }
        return [];
    } catch (error) {
        console.error('Error parsing XML:', error);
        return [];
    }
}

function parseFeatures(featureData: any[]) {
    return featureData.map(f => {
        const attributes: Attribute = f.$ || {};
        const subFeatures: Feature[] = f.subFeature ? parseFeatures(f.subFeature[0].Feature) : [];
        return new Feature(f.$.name, attributes, subFeatures);
    });
}


