import React, { useState, useEffect, useCallback } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { Node } from "reactflow";
import CircularProgress from "@mui/material/CircularProgress";
import APIService from "../services/apiService";
import FileExplorer from "./FilesTree";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { ExtendedTreeItemProps } from "./FilesTree";
import "../styles/TogglePanel.css";

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

  const processServerFilesTree = useCallback(
    (
      response: ServerResponseItem[]
    ): TreeViewBaseItem<ExtendedTreeItemProps>[] => {
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
    },
    []
  );

  useEffect(() => {
    APIService.getFilesTree()
      .then((response) => {
        setItems(processServerFilesTree(response.data));
      })
      .catch((error) => {
        console.error("Error fetching files tree: ", error);
      });
  }, [processServerFilesTree]);

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
        console.log("Model configured successfully.");
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
      <button className="toggle" onClick={() => setPannelOpen((prev) => !prev)}>
        {pannelOpen ? (
          <MdClose className="icon" />
        ) : (
          <FiMenu className="icon" />
        )}
      </button>
      {pannelOpen && (
        <div className="panel">
          <button onClick={handleSubmitClick} className="submit-button">
            Submit Model
          </button>
          <div className="list-container">
            {items.length > 0 ? (
              <FileExplorer
                items={items}
                onDownloadClick={handleDownloadClick}
              />
            ) : (
              <div className="content">
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
