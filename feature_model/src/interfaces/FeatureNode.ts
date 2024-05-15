export interface IValue {
  key: string;
  value: string | null;
}

export interface IFeatureNode {
  data: {
    label: string;
    isSelected: boolean;
    isMandatory?: boolean;
    children?: number[];
    cardinality?: string;
    isDisabled?: boolean;
    values?: IValue[];
  };
  isConnectable: boolean;
}