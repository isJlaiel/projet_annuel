import { Attribute } from "../types/attribute.js";
import { Feature } from "./feature.js";

export class FeatureModel {
    private name: string;
    private  features: Feature[];

    constructor(name: string , features: Feature[]){
        this.name=name;
        this.features=features;
    }

}