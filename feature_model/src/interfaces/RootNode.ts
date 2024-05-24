export interface IRootNode {
  data: {
    label: string;
    parameters: {
      key: string;
      value: string | number | boolean | null;
      type: string;
    }[];
    showModal: boolean;
  };
  isConnectable: boolean;
}
