export interface IFeatureNode{
    data: {
      label: string;
      isSelected: boolean;
      isMandatory?: boolean;
      children?: number[];
      cardinality?: string;
      isDisabled?: boolean;
    };
    isConnectable: boolean;
  }
  