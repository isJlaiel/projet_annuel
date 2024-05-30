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
  const [openKey, setOpenKey] = useState<string | null>(null);

  const handleInputChange =
    (typeKey: string, key: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setInputValues((prevValues) => {
        const newValues = { ...prevValues };
        newValues[typeKey].values = newValues[typeKey].values.map((value) => {
          if (value.key === key) {
            return { ...value, value: newValue };
          }
          return value;
        });
        return newValues;
      });
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
          {Object.entries(inputValues).map(
            ([typeKey, parameter], typeIndex) => {
              if (parameter.type === "probabilityForm") {
                const groupedValues = parameter.values.reduce(
                  (groups, value) => {
                    const category = value.key.split("_").pop();
                    if (!groups[category]) {
                      groups[category] = [];
                    }
                    groups[category].push(value);
                    return groups;
                  },
                  {} as { [key: string]: typeof parameter.values }
                );

                return Object.entries(groupedValues).map(
                  ([category, values]) => (
                    <div key={category} className="probability-form">
                      <button
                        className="probability-form-button"
                        onClick={() =>
                          setOpenKey(openKey === category ? null : category)
                        }
                      >
                        {category.toUpperCase()}
                      </button>

                      {openKey === category &&
                        values.map((value, valueIndex) => (
                          <li
                            className="input-container"
                            key={`${typeKey}-${valueIndex}`}
                          >
                            <label className="modal-label">
                            {value.key.substring(0, value.key.lastIndexOf('_'))}
                            </label>
                            <input
                              className="input-number"
                              type="number"
                              onChange={handleInputChange(typeKey, value.key)}
                              value={value.value ? value.value.toString() : ""}
                              min={0}
                              max={1}
                              step={0.01}
                            />
                          </li>
                        ))}
                    </div>
                  )
                );
              } else {
                return parameter.values.map((value, valueIndex) => {
                  switch (parameter.type) {
                    case "number":
                      return (
                        <li
                          key={`${typeIndex}-${valueIndex}`}
                          className="modal-list-item"
                        >
                          <label className="modal-label">{value.key}</label>
                          <input
                            className="input-element"
                            type="number"
                            onChange={handleInputChange(typeKey, value.key)}
                            value={value.value ? value.value.toString() : ""}
                          />
                        </li>
                      );
                    case "string":
                      return (
                        <li
                          key={`${typeIndex}-${valueIndex}`}
                          className="modal-list-item"
                        >
                          <label className="modal-label">{value.key}</label>
                          <input
                            className="input-element"
                            type="text"
                            onChange={handleInputChange(typeKey, value.key)}
                            value={value.value ? value.value.toString() : ""}
                          />
                        </li>
                      );
                    case "boolean":
                      return (
                        <li
                          key={`${typeIndex}-${valueIndex}`}
                          className="modal-list-item"
                        >
                          <label className="modal-label">{value.key}</label>
                          <input
                            type="checkbox"
                            className="input-element"
                            checked={Boolean(value.value)}
                            onChange={handleInputChange(typeKey, value.key)}
                          />
                        </li>
                      );
                    case "probabilityForm":
                      return (
                        <li
                          key={`${typeKey}-${valueIndex}`}
                          className="modal-list-item"
                        >
                          <label className="modal-label">{value.key}</label>
                          <input
                            className="input-element"
                            type="number"
                            onChange={handleInputChange(typeKey, value.key)}
                            value={value.value ? value.value.toString() : ""}
                          />
                        </li>
                      );
                    default:
                      return null;
                  }
                });
              }
            }
          )}
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
