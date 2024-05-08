import { Handle, Position } from "reactflow";

interface FeatureNodeProps {
  data: {
    label: string;
    isMandatory?: boolean;
    children?: number[];
    cardinality?: string;
  };
  isConnectable: boolean;
}

function FeatureNode({ data, isConnectable }: FeatureNodeProps) {
  const nodeStyle = data.isMandatory
    ? { backgroundColor: "black", color: "white" }
    : { backgroundColor: "white", color: "black" };
  return (
    <div className="react-flow__node-default" style={nodeStyle}>
      {data.label !== "ROOT" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
      )}
      <div>{data.label}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ width: "16px", height: "16px" }}
        />
        <div style={{ position: "relative", height: "0", width: "100%" }}>
          <span
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              fontSize: "8px",
              textAlign: "center",
              color: "white",
            }}
          >
            {data.cardinality}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FeatureNode;
