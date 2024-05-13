import { Feature } from "./Feature";

export interface SubFeature {
     type?: SubFeature;
     features?: Feature[];
     subFeatures?: SubFeature;
}