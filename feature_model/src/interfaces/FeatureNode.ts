export interface IValue {
  key: string;
  type: string;
  value: string | number |boolean | null;
}

export interface IFeatureNode {
  data: {
    label: string;
    isSelected: boolean;
    isMandatory?: boolean;
    children?: number[];
    cardinality?: string;
    isDisabled?: boolean;
    parameters?: IValue[];
  };
  isConnectable: boolean;
}