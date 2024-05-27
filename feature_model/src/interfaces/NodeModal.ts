import { IParameter } from "./FeatureNode";


export interface INodeModal {
  closeModal: () => void;
  parameters: IParameter[];
  nodeLabel: string;
  saveNodeValues: (newValues: IParameter[]) => void;
}