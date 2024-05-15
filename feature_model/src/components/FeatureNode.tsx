import { useState } from 'react';
import { Handle, Position } from "reactflow";
import { IFeatureNode } from "../interfaces/FeatureNode";
import Modal from './NodeModal';



const FeatureNode: React.FC<IFeatureNode> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveNodeValues = (newValues: { key: string, value: string | null }[]) => {
    data.values = newValues;
  };


  let nodeStyle: React.CSSProperties;
  nodeStyle = {
    backgroundColor: "white",
    color: "black",
  };

  if (data.isSelected || data.isMandatory) {
    nodeStyle = {
      backgroundColor: "green",
      color: "black",
    };
  }

  if (data.isDisabled) {
    nodeStyle = {
      backgroundColor: "white",
      color: "black",
      opacity: 0.5,
    };
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "80px"
      }}
      onClick={() => {
        if (data.values && data.values.length > 0 && !data.isSelected) {
          setIsModalOpen(true);
        }
      }}
    >
{isModalOpen && <Modal closeModal={() => setIsModalOpen(false)} values={data.values || []} nodeLabel={data.label} saveNodeValues={saveNodeValues}/>}      <div
        className="react-flow__node-default"
        style={{
          ...nodeStyle,
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: data.isMandatory ? "4px solid black" : "",
        }}
      >
        
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={false}
          />
       
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={false}
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