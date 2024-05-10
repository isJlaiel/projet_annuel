import { Handle, Position } from "reactflow";

interface RootNodeProps {
  data: {
    label: string;
  };
  isConnectable: boolean;
}

function RootNode({ data, isConnectable }: RootNodeProps) {

    return (
      <div
        className="react-flow__node-default"
        style={{ backgroundColor: 'white', width: "60px", borderRadius: "20%" }}
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
          />
          <div style={{ position: "relative", height: "0", width: "100%" }}>
          </div>
        </div>
      </div>
    );
  }


export default RootNode;