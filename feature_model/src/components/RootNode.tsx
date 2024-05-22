import { Handle, Position } from "reactflow";
import { IRootNode } from "../interfaces/RootNode";
import "../styles/RootNode.css";

const RootNode: React.FC<IRootNode> = ({ data, isConnectable }) => {
  return (
    <div className="react-flow__node-default root-node">
      <div>{data.label}</div>
      <Handle
        className="handle"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default RootNode;
