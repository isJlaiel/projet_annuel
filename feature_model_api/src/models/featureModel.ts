import { Attribute } from "../types/attribute.js";
import Parameter from "./Parameter.js";
import { Feature } from "./feature.js";

export class FeatureModel {
  private name: string;
  private features: Feature[];
  private parameters?: Parameter[];

  constructor(name: string, features: Feature[], parameters?: Parameter[]) {
    this.name = name;
    this.features = features;
    this.parameters = parameters;
  }
}
