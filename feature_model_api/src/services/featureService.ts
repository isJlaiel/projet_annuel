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
 
    static parseSubFeatures(subFeaturesData) {
        // Return an empty SubFeature if no data is available
        if (!subFeaturesData || subFeaturesData.length === 0) {
            return new SubFeature();
        }
        const parsedSubFeatures = subFeaturesData.map(subFeature => {
            const subFeatureType = subFeature.$?.type;
            const features = subFeature.Feature ? this.parseFeatures(subFeature.Feature) : []
            const subFeatures = subFeature.subFeature ? subFeature.subFeature.map(s => {
                console.log(s)
                const nestedSubFeatures = s.subFeature ? this.parseSubFeatures(s.subFeature) : [];
                const nestedFeatures = subFeature.Feature ? this.parseFeatures(s.Feature) : []

                return new SubFeature(s.$?.type, nestedFeatures, nestedSubFeatures);
            }) : [];
            return new SubFeature(subFeatureType, features, subFeatures);
        });
    
        // Assuming the desired behavior is to return the first parsed subFeature
        return parsedSubFeatures;
    }



}
