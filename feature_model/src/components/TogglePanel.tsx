import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { Node } from "reactflow";
import CircularProgress from "@mui/material/CircularProgress";
import APIService from "../services/apiService";
import FileExplorer from "./FilesTree";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { ExtendedTreeItemProps } from "./FilesTree";

const TogglePanel: React.FC<{ nodes: Node[] }> = ({ nodes }) => {
  const [pannelOpen, setPannelOpen] = useState(false);
  const [items, setItems] = useState<TreeViewBaseItem<ExtendedTreeItemProps>[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  interface ServerResponseItem {
    path: string;
    name: string;
    children?: ServerResponseItem[];
  }

  interface NodeData {
    label: string;
    selected: boolean;
    parameters: { key: string; value: string | null; type: string }[];
    parent: string;
  }

  function processServerFilesTree(
    response: ServerResponseItem[]
  ): TreeViewBaseItem<ExtendedTreeItemProps>[] {
    return response.map((item: ServerResponseItem) => {
      if (item.children !== undefined) {
        return {
          id: item.path,
          label: item.name,
          fileType: "folder",
          children: processServerFilesTree(item.children),
        };
      } else {
        return {
          id: item.path,
          label: item.name,
          fileType: "doc",
        };
      }
    });
  }

  function jsonifyNodes(nodes: Node[]): NodeData[] {
    return nodes
      .filter((node) => node.type === "feature")
      .map((node) => ({
        label: node.data.label,
        selected: node.data.isMandatory
          ? true
          : node.data.isSelected
          ? true
          : false,
        parameters: node.data.parameters
          ? node.data.parameters.map(
              (param: { key: string; value: string | null; type: string }) => ({
                key: param.key,
                value: param.value || null,
                type: param.type,
              })
            )
          : [],
        parent: node.id.split("/").slice(-2, -1)[0],
      }));
  }

  function handleDownloadClick(ItemId: string) {
    console.log("Download clicked", ItemId);
    APIService.downloadFile(ItemId).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", ItemId.split("/").slice(-1)[0]);
      document.body.appendChild(link);
      link.click();
    });
  }

  function handleSubmitClick() {
    setIsLoading(true);
    // convert nodes to JSON
    const nodesData = jsonifyNodes(nodes);
    const json = JSON.stringify(nodesData, null, 2);

    // ask the API to run generator
    APIService.configureFeatureModel(json)
      .then(() => {
        // get the updated files tree
        APIService.getFilesTree().then((response) => {
          // format server response and update state
          setItems(processServerFilesTree(response.data));
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        setErrorMessage("Error while submitting the model. Please try again.");
      });
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
            height: "90vh",
            width: "20vw",
            minWidth: "250px",
            zIndex: 1,
            borderRadius: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleSubmitClick}
            style={{ marginBottom: "15px", marginTop: "25px" }}
          >
            Submit Model
          </button>
          <div
            className="list-container"
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid black",
              borderRadius: "10px",
              width: "90%",
              height: "70%",
              overflow: "auto",
            }}
          >
            {items.length > 0 ? (
              <FileExplorer items={items} onDownloadClick={handleDownloadClick} />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {isLoading ? (
                  <CircularProgress />
                ) : errorMessage ? (
                  <div>{errorMessage}</div>
                ) : (
                  "No files to display."
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TogglePanel;
