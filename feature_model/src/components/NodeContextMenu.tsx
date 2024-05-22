import { CSSProperties, MouseEventHandler } from "react";
import { useReactFlow } from "reactflow";
import "../styles/NodeContextMenu.css";

interface ContextMenuProps {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  style?: CSSProperties;
  onMouseOver?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps) {
  const { getNode } = useReactFlow();

  const handleEditParams = () => {
    const node = getNode(id);
    if (node) {
      node.data.showModal = true;
      node.data.onModalClose = () => {
        node.data.showModal = false;
      };
    }
  };

  const node = getNode(id);
  if (node?.type !== "feature") {
    return null;
  }
  const label = node?.data?.label || "Node";
  const editParams =
    !node?.data.isMandatory && node?.data.parameters?.length > 0;

  return (
    <div
      className="node-context-menu"
      style={{ top, left, right, bottom }}
      {...props}
    >
      <p>
        <small>{label}</small>
      </p>
      <button onClick={handleEditParams} disabled={!editParams}>
        <small>edit parameters</small>
      </button>
    </div>
  );
}
