import * as xml2js from 'xml2js';
import { Attribute } from "../types/attribute.js";
import { Feature } from '../models/feature.js';
import { FeatureModel } from '../models/featureModel.js';
import SubFeature from '../models/subFeature.js';

export class FeatureService {
    public static async parseFromXMLToFeatures(xmlData: string): Promise<FeatureModel> {
        const parser = new xml2js.Parser({ explicitChildren: true, preserveChildrenOrder: true, charsAsChildren: false });

        try {
            const result = await parser.parseStringPromise(xmlData);
          
            if (result && result.FeatureModel && result.FeatureModel.Features) {
                const name : string = result.FeatureModel.$.name ;
                const features : Feature[] = this.parseFeatures(result.FeatureModel.Features[0].Feature)
                return new FeatureModel(name,features);
            }
            return;
        } catch (error) {
            console.error('Erreur lors de l\'analyse XML :', error);
            return ;
        }
    }
    static parseFeatures(featuresData: any): Feature[] {
        const features: Feature[] = featuresData.map((feature: any) => {
            const attributes: Attribute = feature.$ || {};
            const subFeatures : SubFeature = this.parseSubFeatures(feature.subFeature); 
    
            return new Feature(attributes, subFeatures);
        });
    
    return features;
    }
 
    static parseSubFeatures(subFeaturesData: any): SubFeature {
        if (!subFeaturesData || subFeaturesData.length === 0) {
            return new SubFeature();
        }
        const parsedSubFeatures : SubFeature = subFeaturesData.map(subFeature => {
            const subFeatureType = subFeature.$?.type;
            const features = subFeature.Feature ? this.parseFeatures(subFeature.Feature) : []
            const subFeatures = subFeature.subFeature ? subFeature.subFeature.map(s => {
                const _subFeatures = s.subFeature ? this.parseSubFeatures(s.subFeature) : {};
                const _features = subFeature.Feature ? this.parseFeatures(s.Feature) : []

                return new SubFeature(s.$?.type,_features, _subFeatures);
            }) : [];
            return new SubFeature(subFeatureType, features, subFeatures);
        });
    
        return parsedSubFeatures[0];
    }



}
