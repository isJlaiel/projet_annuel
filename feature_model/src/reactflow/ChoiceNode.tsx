import { Handle, Position } from "reactflow";
import { IChoiceNode } from "../interfaces/ChoiceNode";


const ChoiceNode: React.FC<IChoiceNode> = ({ data }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "80px",
      }}
    >
      <div
        className="react-flow__node-default"
        style={{
          backgroundColor: "black",
          color: "white",
          width: "20px",
          height: "20px",
        }}
      >
        <Handle type="target" position={Position.Top} isConnectable={true} />

        <div>{data.type}</div>

        <Handle type="source" position={Position.Bottom} isConnectable={true} />
        <div style={{ position: "relative", height: "0", width: "100%" }}></div>
      </div>
    </div>
  );
}

export default ChoiceNode;
