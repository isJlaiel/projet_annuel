import React, { useState } from "react";
import ReactDOM from "react-dom";
import { INodeModal } from "../interfaces/NodeModal";

const NodeModal: React.FC<INodeModal> = ({
  closeModal,
  parameters,
  nodeLabel,
  saveNodeValues,
}) => {
  const [inputValues, setInputValues] = useState(parameters);

  // Handle input change
  const handleInputChange =
  (index: number, type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValues = [...inputValues];
    if (type === 'bool') {
      newInputValues[index].value = event.target.checked;
    } else {
      newInputValues[index].value = event.target.value;
    }
    setInputValues(newInputValues);
  };

  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleOkClick = (event: React.MouseEvent) => {
    // Call a callback function here with the new values to save them in the node
    saveNodeValues(inputValues);
    event.stopPropagation();
    closeModal();
  };

  const handleBackgroundClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    closeModal();
  };

  return ReactDOM.createPortal(
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
        onClick={handleBackgroundClick}
      ></div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "1em",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "10px",
        }}
        onClick={handleModalClick}
      >
        <h2 style={{ color: "black" }}>{nodeLabel}</h2>
        <ul style={{ width: "100%" }}>
        {inputValues.map((item, index) => {
  let inputElement;
  switch (item.type) {
    case 'string':
      inputElement = <input type="text" value={String(item.value) || ""} onChange={handleInputChange(index, "string")} style={{ marginRight: "3em" }} />;
      break;
    case 'number':
      inputElement = <input type="number" value={Number(item.value) || 0} onChange={handleInputChange(index, "number")} style={{ marginRight: "3em" }} />;      break;
    case 'bool':
      inputElement = <input type="checkbox" checked={Boolean(item.value) || false} onChange={handleInputChange(index, "bool")} style={{ marginRight: "3em" }} />;
      break;
    default:
      inputElement = <input type="text" value={String(item.value) || ""} onChange={handleInputChange(index, "string")} style={{ marginRight: "3em" }} />;
  }

  return (
    <li key={item.key} style={{ display: "flex", justifyContent: "space-between" }}>
      <label style={{ color: "black" }}>{item.key}</label>
      {inputElement}
    </li>
  );
})}
        </ul>
        <button
          style={{
            backgroundColor: "green",
            color: "white",
            alignSelf: "flex-end",
            marginTop: "auto",
          }}
          onClick={handleOkClick}
        >
          ok
        </button>
      </div>
    </>,
    document.body
  );
};

export default NodeModal;
