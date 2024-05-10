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

  if (data.label === "ROOT") {
    return (
      <div
        className="react-flow__node-default"
        style={{ ...nodeStyle, width: "60px", borderRadius: "20%" }}
      >
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
            style={data.cardinality ? { width: "16px", height: "16px" } : {}}
          />
          <div style={{ position: "relative", height: "0", width: "100%" }}>
            {data.cardinality && (
              <span
                style={{
                  position: "absolute",
                  top: "-1px",
                  left: "0",
                  right: "0",
                  fontSize: "8px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {data.cardinality}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "80px"
      }}
    >
      <div
        className="react-flow__node-default"
        style={{ ...nodeStyle, width: "20px", height: "20px", borderRadius: "50%" }}
      >
        {data.label !== "ROOT" && (
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
          />
        )}
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={data.cardinality ? { width: "16px", height: "16px", bottom: "-14px" } : {}}
        />
        <div style={{ position: "relative", height: "0", width: "100%" }}>
          {data.cardinality && (
            <span
              style={{
                position: "absolute",
                bottom: "-61px",
                left: "0",
                right: "0",
                fontSize: "8px",
                textAlign: "center",
                color: "white",
              }}
            >
              {data.cardinality}
            </span>
          )}
        </div>
      </div>
      <div style={{ marginTop: "-5px", marginBottom: "2px", fontSize: "15px" }}>{data.label}</div>
    </div>
  );
}

export default FeatureNode;