import React, { useState } from "react";
import ReactDOM from "react-dom";
import { INodeModal } from "../interfaces/NodeModal";
import "../styles/NodeModal.css";

const NodeModal: React.FC<INodeModal> = ({
  closeModal,
  parameters,
  nodeLabel,
  saveNodeValues,
}) => {
  const [inputValues, setInputValues] = useState(parameters);

  // Handle input change
 const handleInputChange =
  (typeIndex: number, valueIndex: number) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const newInputValues = [...inputValues];
      newInputValues[typeIndex].values[valueIndex].value = event.target.value;
      setInputValues(newInputValues);
    };

  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleOkClick = (event: React.MouseEvent) => {
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
      <div className="modal-background" onClick={handleBackgroundClick}></div>
      <div className="modal-content" onClick={handleModalClick}>
        <h2 className="modal-title">{nodeLabel}</h2>
        <ul className="modal-list">
          {inputValues.map((parameter, typeIndex) => {
            console.log("t", parameter);
            switch (parameter.type) {
              case "number":
                return (
                  <li key={typeIndex} className="modal-list-item">
                    <label className="modal-label">
                      {parameter.values[0].key}
                    </label>
                    <input
                      className="input-element"
                      type="number"
                      onChange={handleInputChange(typeIndex, 0)}
                      value={parameter.values[0].value.toString()}
                    />
                  </li>
                );
              case "string":
                return (
                  <li key={typeIndex} className="modal-list-item">
                    <label className="modal-label">
                      {parameter.values[0].key}
                    </label>
                    <input
                      className="input-element"
                      type="text"
                      onChange={handleInputChange(typeIndex, 0)}
                      value={parameter.values[0].value.toString()}
                    />
                  </li>
                );
              case "boolean":
                return (
                  <li key={typeIndex} className="modal-list-item">
                    <label className="modal-label">
                      {parameter.values[0].key}
                    </label>
                    <input
                      type="checkbox"
                      className="input-element"
                      checked={Boolean(parameter.values[0].value)}
                      onChange={handleInputChange(typeIndex, 0)}
                    />
                  </li>
                );
              case "probabilityForm":
                return (
                  <div
                  key={`${typeIndex}`}>
                    {parameter.values.map((value, valueIndex) => (
                      <li
                        key={`${typeIndex}-${valueIndex}`}
                        className="modal-list-item"
                      >
                        <label className="modal-label">{value.key}</label>
                        <input
                          className="input-element"
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          onChange={handleInputChange(typeIndex, valueIndex)}
                          value={Number(value.value)}
                        />
                      </li>
                    ))}
                  </div>
                );
              default:
                return null;
            }
          })}
        </ul>
        <button className="modal-button" onClick={handleOkClick}>
          ok
        </button>
      </div>
    </>,
    document.body
  );
};

export default NodeModal;
