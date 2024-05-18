import React from "react";
import RootNode from "./RootNode";
import ChoiceNode from "./ChoiceNode";
import FeatureNode from "./FeatureNode";

const LegendPanel: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "8em",
        left: "10px",
        background: "rgba(0, 0, 0, 0.5)",
        color: "white",
        maxHeight: "53vh",
        maxWidth: "13em",
        zIndex: 9999,
        borderRadius: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", marginLeft: "15px"}}>
      <div style={{ marginRight: "10px" }}>
          <RootNode data={{ label: "..." }} isConnectable={true} />
        </div>
            <p>Root node</p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", marginLeft: "15px" }}>
      <div style={{ marginRight: "10px" }}>
          <ChoiceNode data={{ type: "..." }} />
        </div>
        <p>Choice Node</p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", marginLeft: "15px" }}>
      <div style={{ marginRight: "10px" }}>
          <FeatureNode data={{
            label: "...",
            isMandatory: false,
            isDisabled: false,
            isSelected: false,
            parameters: [],
            onModalClose: () => { },
            }}
            isConnectable={false} />
        </div>
        <p>Feature Node (not selected)</p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", marginLeft: "15px" }}>
      <div style={{ marginRight: "10px" }}>
          <FeatureNode data={{
            label: "...",
            isMandatory: true,
            isDisabled: false,
            isSelected: false,
            parameters: [],
            onModalClose: () => { },
            }}
            isConnectable={false} />
        </div>
        <p>Feature Node (mandatory)</p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", marginLeft: "15px" }}>
      <div style={{ marginRight: "10px" }}>
          <FeatureNode data={{
            label: "...",
            isMandatory: false,
            isDisabled: false,
            isSelected: true,
            parameters: [],
            onModalClose: () => { },
            }}
            isConnectable={false} />
        </div>
        <p>Feature Node (selected)</p>
      </div>
    </div>
  );
};

export default LegendPanel;