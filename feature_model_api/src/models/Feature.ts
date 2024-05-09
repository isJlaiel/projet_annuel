import { Attribute } from "../types/attribute.js";

export class Feature {
    private name: string;
    private attributes: Attribute;
    public subFeatures: Feature[];

    constructor( name: string , attributes : Attribute ,  subFeatures: Feature[] =[] ){
        this.name =  name ;
        this.attributes = attributes ;
        this.subFeatures = subFeatures ;

    }

}