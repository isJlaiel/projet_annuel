import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import Node from "./FlowDiagram";
import Edge from "./FlowDiagram";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import DescriptionIcon from "@mui/icons-material/Description";
import ListItemButton from "@mui/material/ListItemButton";

const TogglePanel = ({
  nodes,
  edges,
}: {
  nodes: (typeof Node)[];
  edges: (typeof Edge)[];
}) => {
  const [pannelOpen, setPannelOpen] = useState(false);
  const [items, setItems] = useState<React.ReactElement[]>([]); // Ajouter un état pour les éléments

  function generate(element: React.ReactElement) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }

  function handleClick() {
    console.log(nodes, edges);
    const newItems = generate(
      <ListItem>
        <ListItemButton
          style={{ borderRadius: "10px" }}
          onClick={() => console.log("Item clicked!")}
        >
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: "black" }}>
              <DescriptionIcon style={{ backgroundColor: "black" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Model" />
        </ListItemButton>
      </ListItem>
    );
    setItems(newItems);
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
            zIndex: 1,
            borderRadius: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button onClick={handleClick} style={{ marginBottom: "15px", marginTop: "25px" }}>
            Soumettre le modèle
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
              <List>{items}</List>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Aucun élément
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TogglePanel;
