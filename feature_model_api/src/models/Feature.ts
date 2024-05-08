import { Attribute } from "../interfaces/attribute.js";

class Feature {
    private name: string;
    private attributes: Attribute[];
    private subFeatures: Feature[];

    constructor( name: string , attributes : Attribute[] ,  subFeatures: Feature[] =[] ){
        this.name =  name ;
        this.attributes = attributes ;
        this.subFeatures = subFeatures ;

    }

}