import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { IFeatureNode, IParameter } from "../interfaces/FeatureNode";
import Modal from "./NodeModal";
import "../styles/FeatureNode.css";
import classNames from "classnames";

const FeatureNode: React.FC<IFeatureNode> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setIsModalOpen(data.showModal || false);
  }, [data.showModal]);

  const saveNodeValues = (newValues: IParameter[]) => {
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
        if (data.parameters && Object.keys(data.parameters).length && !data.isSelected) {
          setIsModalOpen(true);
        }
      }}
    >
      {isModalOpen && (
        <Modal
          closeModal={() => setIsModalOpen(false)}
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
          className="handle-source"
          isConnectable={false}
        />
      </div>
      <div className="label-container">{data.label}</div>
    </div>
  );
};

export default FeatureNode;