import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

const TogglePanel = () => {
  const [pannelOpen, setPannelOpen] = useState(false);

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
          <button>Soumettre le modèle</button>
        </div>
      )}
    </>
  );
};

export default TogglePanel;
