export interface IValue {
    key: string;
    type: string;
    value: string | number |boolean | null;
  }

export interface INodeModal {
  closeModal: () => void;
  parameters: IValue[];
  nodeLabel: string;
  saveNodeValues: (newValues: IValue[]) => void;
}
