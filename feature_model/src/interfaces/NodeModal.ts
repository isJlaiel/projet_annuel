export interface IValue {
    key: string;
    value: string | null;
  }

export interface INodeModal {
  closeModal: () => void;
  values: IValue[];
  nodeLabel: string;
  saveNodeValues: (newValues: IValue[]) => void;
}
