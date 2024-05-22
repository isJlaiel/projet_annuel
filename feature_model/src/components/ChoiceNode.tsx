import { Handle, Position } from "reactflow";
import { IChoiceNode } from "../interfaces/ChoiceNode";
import "../styles/ChoiceNode.css";

const ChoiceNode: React.FC<IChoiceNode> = ({ data }) => {
  return (
    <div className="choice-node-wrapper">
      <div className="react-flow__node-default choice-node">
        <Handle
          className="handle-target"
          type="target"
          position={Position.Top}
          isConnectable={true}
        />

        <div>{data.type}</div>

        <Handle
          className="handle-source"
          type="source"
          position={Position.Bottom}
          isConnectable={true}
        />
      </div>
    </div>
  );
};

export default ChoiceNode;
