import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { IFeatureNode } from "../interfaces/FeatureNode";
import Modal from 'react-modal';



const FeatureNode: React.FC<IFeatureNode> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNodeClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  Modal.setAppElement('#root');

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
    >
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <h2>Values</h2>
        <ul>
          {data.values?.map(value => (
            <li key={value}>{value}</li>
          ))}
        </ul>
        <button onClick={closeModal}>Close</button>
      </Modal>
      <div
        className="react-flow__node-default"
        style={{
          ...nodeStyle,
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: data.isMandatory ? "4px solid black" : "",
        }}
        onClick={handleNodeClick}
      >
        {data.label !== "ROOT" && (
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={false}
          />
        )}
        {data.label !== "ROOT" && (
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={false}
          />
        )}
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