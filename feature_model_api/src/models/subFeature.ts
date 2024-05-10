import { SubFeatureType } from "../enums/subFeatureType.js";
import { Feature } from "./feature.js";

export default class SubFeature {
    private type?: SubFeatureType;
    private features?: Feature[];
    private subFeatures?: SubFeature;

    constructor(type?: SubFeatureType, features?: Feature[], subFeatures?: SubFeature) {
        this.type = type;
        this.features = features;
        this.subFeatures = subFeatures;
    }
}