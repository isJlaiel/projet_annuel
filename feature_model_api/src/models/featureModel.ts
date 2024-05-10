import { Attribute } from "../types/attribute.js";
import { Feature } from "./feature.js";

export class FeatureModel {
    private name: string;
    private  features: Feature[];

    constructor(name: string , features: Feature[]){
        this.name=name;
        this.features=features;
    }


    public getName(): string{
        return this.name ;
    }

    public addFeature(feature: Feature): void {
        this.features.push(feature);
    }

    public getFeatures(): Feature[] {
        return this.features;
    }


}