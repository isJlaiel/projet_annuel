import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { IFeatureNode } from "../interfaces/FeatureNode";
import Modal from "./NodeModal";
import "../styles/FeatureNode.css";
import classNames from "classnames";

const FeatureNode: React.FC<IFeatureNode> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setIsModalOpen(data.showModal || false);
  }, [data.showModal]);

  const saveNodeValues = (
    newValues: {
      key: string;
      value: string | number | boolean | null;
      type: string;
    }[]
  ) => {
    data.parameters = newValues;
  };

  const nodeClass = classNames({
    "node-default": true,
    "node-selected": data.isSelected || data.isMandatory,
    "node-disabled": data.isDisabled,
    "node-mandatory": data.isMandatory,
  });

  return (
    <div
      className="node-container"
      onClick={() => {
        console.log(data);
        if (data.parameters && data.parameters.length > 0 && !data.isSelected) {
          setIsModalOpen(true);
        }
      }}
    >
      {isModalOpen && (
        <Modal
          closeModal={() => {
            setIsModalOpen(false);
            data.onModalClose();
          }}
          parameters={data.parameters || []}
          nodeLabel={data.label}
          saveNodeValues={saveNodeValues}
        />
      )}
      <div className={`${nodeClass}`}>
        <Handle
          type="target"
          position={Position.Top}
          className="handle-target"
          isConnectable={false}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={false}
          className={
            data.cardinality ? "handle-source-cardinality" : "handle-source"
          }
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
      <div className="label-container">{data.label}</div>
    </div>
  );
};

export default FeatureNode;
