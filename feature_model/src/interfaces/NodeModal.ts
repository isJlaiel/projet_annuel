export interface IValue {
  key: string;
  type: string;
  value: string | number | boolean | null;
  options?: string[] | null;
  min?: number | null;
  max?: number | null;
  step?: number | null;
}

export interface INodeModal {
  closeModal: () => void;
  parameters: IValue[];
  nodeLabel: string;
  saveNodeValues: (newValues: IValue[]) => void;
}
