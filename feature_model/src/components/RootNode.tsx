import { Handle, Position } from "reactflow";
import { IRootNode } from "../interfaces/RootNode";
import "../styles/RootNode.css";
import { useState, useEffect } from "react";
import NodeModal from "./NodeModal";

const RootNode: React.FC<IRootNode> = ({ data, isConnectable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(data.showModal || false);
  }, [data.showModal]);

  const saveNodeValues = (
    newValues: {
      key: string;
      value: string | number | boolean | null;
      type: string;
    }[]
  ) => {
    data.parameters = newValues;
  };

  return (
    <div
      className="react-flow__node-default root-node"
      onClick={() =>
        data.parameters && data.parameters.length && setIsModalOpen(true)
      }
    >
      <div>{data.label}</div>
      <Handle
        className="handle"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      {isModalOpen && (
        <NodeModal
          closeModal={() => setIsModalOpen(false)}
          parameters={data.parameters || []}
          nodeLabel={data.label}
          saveNodeValues={saveNodeValues}
        />
      )}
    </div>
  );
};

export default RootNode;
