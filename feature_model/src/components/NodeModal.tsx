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
    (index: number, type: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newInputValues = [...inputValues];
      if (type === "boolean") {
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
          {inputValues.map((item, index) => {
            let inputElement;
            switch (item.type) {
              case "string":
                if (item.options && item.options.length > 0) {
                  inputElement = (
                    <select
                      value={String(item.value) || ""}
                      onChange={handleInputChange(index, "string")}
                      className="input-element"
                    >
                      {item.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  );
                } else {
                  inputElement = (
                    <input
                      type="text"
                      value={String(item.value) || ""}
                      onChange={handleInputChange(index, "string")}
                      className="input-element"
                    />
                  );
                }
                break;
              case "number":
                inputElement = (
                  <input
                    type="number"
                    min={Number(item.min)}
                    max={Number(item.max)}
                    step={item.step ? Number(item.step) : 1}
                    value={Number(item.value) || 0}
                    onChange={handleInputChange(index, "number")}
                    className="input-element"
                  />
                );
                break;
              case "boolean":
                inputElement = (
                  <input
                    type="checkbox"
                    checked={Boolean(item.value) || false}
                    onChange={handleInputChange(index, "boolean")}
                    className="input-element"
                  />
                );
                break;
              default:
                inputElement = (
                  <input
                    type="text"
                    value={String(item.value) || ""}
                    onChange={handleInputChange(index, "string")}
                    className="input-element"
                  />
                );
            }

            return (
              <li key={item.key} className="modal-list-item">
                <label className="modal-label">{item.key}</label>
                {inputElement}
              </li>
            );
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
