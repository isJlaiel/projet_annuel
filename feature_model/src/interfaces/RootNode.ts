import { IParameter } from "./FeatureNode";

export interface IRootNode {
  data: {
    label: string;
    parameters: IParameter[];
    showModal: boolean;
  };
  isConnectable: boolean;
}
