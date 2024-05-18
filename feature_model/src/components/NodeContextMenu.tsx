import React, { CSSProperties, MouseEventHandler, useState } from "react";
import { useReactFlow } from "reactflow";

interface ContextMenuProps {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  style?: CSSProperties;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps) {
  const [hoveredButtons, setHoveredButtons] = useState<{
    [key: string]: boolean;
  }>({});
  const { getNode } = useReactFlow();

  const handleMouseOver = (buttonId: string) => () => {
    setHoveredButtons((prevState) => ({ ...prevState, [buttonId]: true }));
  };

  const handleMouseOut = (buttonId: string) => () => {
    setHoveredButtons((prevState) => ({ ...prevState, [buttonId]: false }));
  };

  const handleEditParams = () => {
    const node = getNode(id);
    if (node) {
      node.data.showModal = true;
      node.data.onModalClose = () => {
        node.data.showModal = false;
      };
    }
  };

  const menuStyle: React.CSSProperties = {
    top,
    left,
    right,
    bottom,
    background: "#f0f0f0",
    borderStyle: "solid",
    boxShadow: "3px 3px 5px rgba(0,0,0,0.2)",
    border: "1px solid black",
    position: "absolute",
    borderRadius: "5px",
    margin: 0,
    padding: "10px",
    zIndex: 9999,
  };

  const buttonHoverStyle = {
    backgroundColor: "green",
    color: "white",
  };

  const elementStyle = {
    backgroundColor: "#f0f0f0",
    color: "black",
    border: "none",
    borderRadius: "0px",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    margin: 0,
    padding: "10px",
  };

  const node = getNode(id);
  if (node?.type !== "feature") {
    return null;
  }
  const label = node?.data?.label || "Node";
  const editParams =
    !node?.data.isMandatory && node?.data.parameters?.length > 0;
  const disabledButtonStyle = {
    backgroundColor: "grey",
    color: "white",
  };
  return (
    <div style={{ ...menuStyle, top, left, right, bottom }} {...props}>
      <p
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          color: "black",
          textAlign: "center",
          borderBottom: "2px solid black",
          marginBottom: "5px",
          fontSize: "16px",
        }}
      >
        <small>{label}</small>
      </p>
      <button
        style={
          editParams
            ? hoveredButtons["editParams"]
              ? { ...elementStyle, ...buttonHoverStyle }
              : elementStyle
            : { ...elementStyle, ...disabledButtonStyle }
        }
        onMouseOver={handleMouseOver("editParams")}
        onMouseOut={handleMouseOut("editParams")}
        onClick={handleEditParams}
        disabled={!editParams}
      >
        <small>edit parameters</small>
      </button>
    </div>
  );
}
