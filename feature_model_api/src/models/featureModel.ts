import { Attribute } from "../types/attribute.js";
import { Feature } from "./feature.js";

export class FeatureModel {
  private name: string;
  private features: Feature[];
  private parameters?: string;

  constructor(name: string, features: Feature[], parameters?: string) {
    this.name = name;
    this.features = features;
    this.parameters = parameters;
  }
}