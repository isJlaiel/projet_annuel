export interface NodeContextMenuProps {
  x: number;
  y: number;
  nodeLabel: string;
  editParamsButton: boolean;
  onEditParams: () => void;
}
