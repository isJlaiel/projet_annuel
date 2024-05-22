import React from "react";
import RootNode from "./RootNode";
import ChoiceNode from "./ChoiceNode";
import FeatureNode from "./FeatureNode";
import "../styles/LegendPanel.css";

const LegendPanel: React.FC = () => {
  return (
    <div className="legend-panel">
      <div className="legend-item">
        <div className="legend-icon">
          <RootNode data={{ label: "..." }} isConnectable={true} />
        </div>
        <p>Root node</p>
      </div>
      <div className="legend-item">
        <div className="legend-icon">
          <ChoiceNode data={{ type: "..." }} />
        </div>
        <p>Choice Node</p>
      </div>
      <div className="legend-item">
        <div className="legend-icon">
          <FeatureNode
            data={{
              label: "...",
              isMandatory: false,
              isDisabled: false,
              isSelected: false,
              parameters: [],
              onModalClose: () => {},
            }}
            isConnectable={false}
          />
        </div>
        <p>Non-selected node</p>
      </div>
      <div className="legend-item">
        <div className="legend-icon">
          <FeatureNode
            data={{
              label: "...",
              isMandatory: false,
              isDisabled: true,
              isSelected: false,
              parameters: [],
              onModalClose: () => {}
            }}
            isConnectable={false}
          />
        </div>
        <p>Disabled node</p>
      </div>
      <div className="legend-item">
        <div className="legend-icon">
          <FeatureNode
            data={{
              label: "...",
              isMandatory: false,
              isDisabled: false,
              isSelected: true,
              parameters: [],
              onModalClose: () => {},
            }}
            isConnectable={false}
          />
        </div>
        <p>Selected node</p>
      </div>
      <div className="legend-item">
        <div className="legend-icon">
          <FeatureNode
            data={{
              label: "...",
              isMandatory: true,
              isDisabled: false,
              isSelected: false,
              parameters: [],
              onModalClose: () => {},
            }}
            isConnectable={false}
          />
        </div>
        <p>Mandatory node</p>
      </div>
    </div>
  );
};

export default LegendPanel;
