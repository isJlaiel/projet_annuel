import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import Node from './FlowDiagram';
import Edge from './FlowDiagram';


const TogglePanel = ({nodes, edges}: {nodes: typeof Node[], edges: typeof Edge[]}) => {
  const [pannelOpen, setPannelOpen] = useState(false);

  function handleClick() {
    const buildJson = (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return null;
  
      const childrenEdges = edges.filter(e => e.source === nodeId);
      const childrenNodes = childrenEdges.map(e => buildJson(e.target));
  
      return {
        id: node.id,
        type: node.type,
        data: node.data,
        children: childrenNodes
      };
    };
  
    const root = nodes.find(n => n.type === 'root');
    if (!root) return;
  
    const json = buildJson(root.id);
    console.log(json);
  }
  

  return (
    <>
      <button
        className="toggle"
        onClick={() => setPannelOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 2,
          background: "white",
          color: "black",
          border: "none",
          cursor: "pointer",
        }}
      >
        {pannelOpen ? (
          <MdClose style={{ width: "32px", height: "32px" }} />
        ) : (
          <FiMenu style={{ width: "32px", height: "32px" }} />
        )}
      </button>
      {pannelOpen && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "white",
            height: "95vh",
            width: "30vw",
            zIndex: 1,
            borderRadius: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button onClick={handleClick}>Soumettre le modèle</button>
        </div>
      )}
    </>
  );
};

export default TogglePanel;
