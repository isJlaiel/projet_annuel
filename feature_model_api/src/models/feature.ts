import { Attribute } from "../types/attribute.js";
import SubFeature from "./subFeature.js";

export class Feature {
    private attributes: Attribute;
    private subFeatures: SubFeature ;

    constructor(  attributes : Attribute ,  subFeatures: SubFeature ={}){
        this.attributes = attributes ;
        this.subFeatures = subFeatures ;

    }

}