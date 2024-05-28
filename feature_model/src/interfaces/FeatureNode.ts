export interface IValue {
  key: string;
  value: string | number | boolean | null;
  min?: number;
  max?: number;
  step?: number;
}

export interface IParameter {
  type: string;
  values: IValue[];
  others?: Record<string, unknown>;
}

export interface IFeatureNode {
  data: {
    label: string;
    isSelected: boolean;
    isMandatory?: boolean;
    children?: number[];
    cardinality?: string;
    isDisabled?: boolean;
    parameters?: IParameter[];
    showModal?: boolean;
    onModalClose: () => void;
  };
  isConnectable: boolean;
}