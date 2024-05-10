import { SubFeatureType } from "../enums/subFeatureType.js";
import { Feature } from "./feature.js";

export default class SubFeature {
    type?: SubFeatureType;
    features?: Feature[];
    subFeatures?: SubFeature[];

    constructor(type?: SubFeatureType, features?: Feature[], subFeatures?: SubFeature[]) {
        this.type = type;
        this.features = features;
        this.subFeatures = subFeatures;
    }
}