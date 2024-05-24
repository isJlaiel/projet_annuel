import React, { useState, useEffect, useCallback } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { Node } from "reactflow";
import CircularProgress from "@mui/material/CircularProgress";
import APIService from "../services/apiService";
import FileExplorer from "./FilesTree";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { ExtendedTreeItemProps } from "./FilesTree";
import { Resizable } from "re-resizable";
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
    async function fetchData() {
        setIsLoading(true);
        try {
            const filesTree = await APIService.getFilesTree();
            setItems(processServerFilesTree(filesTree.data));
        } catch (error) {
            console.error("Error fetching files tree: ", error);
        }
        setIsLoading(false);
    }

    fetchData();
}, [processServerFilesTree]); // Ensuring dependency is listed if it's used


  function jsonifyNodes(nodes: Node[]): NodeData[] {
    return nodes
      .filter((node) => node.type === "feature" || node.type === "root")
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

  async function handleDeleteClick(itemId: string) {
    setIsLoading(true);
    try {
      await APIService.deleteFile(itemId);
      const result = await APIService.getFilesTree();
      setItems(processServerFilesTree(result.data));
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression du fichier :", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitClick() {
    setIsLoading(true);
    // convert nodes to JSON
    const nodesData = jsonifyNodes(nodes);
    console.log("Nodes data:", nodesData);
    const json = JSON.stringify(nodesData, null, 2);
    try {
      // ask the API to run generator
      await APIService.configureFeatureModel(json);

      await new Promise(resolve => setTimeout(resolve, 1000));      
      console.log("Model configured successfully.");
      const result = await APIService.getFilesTree();

      setItems(processServerFilesTree(result.data));
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setErrorMessage("Error while submitting the model. Please try again.");
    }
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
        <Resizable
          defaultSize={{
            width: "350px",
            height: "90vh",
          }}
          minWidth={250}
          maxWidth={800}
          minHeight={350}
          maxHeight={"90vh"}
          className="panel"
        >
          <button
            onClick={handleSubmitClick}
            className={`submit-button ${isLoading ? "disabled" : ""}`}
            disabled={isLoading}
          >
            Submit Model
          </button>
          <div
            className="list-container"
            style={{
              position: "relative",
              overflow: isLoading ? "hidden" : "auto",
            }}
          >
            <FileExplorer items={items} onDownloadClick={handleDownloadClick} onDeleteClick={handleDeleteClick} />
            {isLoading && (
              <div className="loading">
                <CircularProgress color="inherit" style={{ color: "green" }} />{" "}
              </div>
            )}
          </div>
          {errorMessage && <div>{errorMessage}</div>}
          {items.length === 0 && !isLoading && "No files to display."}
        </Resizable>
      )}
    </>
  );
};

export default TogglePanel;
