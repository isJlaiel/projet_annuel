import { useCallback, useState, useEffect, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
  Connection,
  BackgroundVariant,
  ReactFlowProvider,
} from "reactflow";
import FeatureNode from "./FeatureNode";
import * as d3 from 'd3';
import "reactflow/dist/style.css";
import RootNode from "./RootNode";
import ChoiceNode from "./ChoiceNode";
import TogglePanel from "./TogglePanel";
import APIService from "../services/apiService";
import { Feature } from "../interfaces/Feature";

const nodeWidth = 100;
const nodeHeight = 80;

const nodeTypes = {
  feature: FeatureNode,
  root: RootNode,
  choice: ChoiceNode,
};

function processFeatures(
  parentId: string,
  features?: Feature[]
): { nodes: Node[]; edges: Edge[] } {
  if (!features) {
    return { nodes: [], edges: [] };
  }
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  for (const feature of features) {
    const nodeId = parentId + "-" + feature.attributes.name;

    nodes.push({
      id: nodeId,
      type: "feature",
      position: { x: 0, y: 0 },
      data: {
        label: feature.attributes.name,
        isMandatory: feature.attributes.mandatory === "true",
        values: feature.attributes.values
          ? feature.attributes.values
              .replace(/[[\]]/g, "")
              .split(",")
              .map((value) => ({ key: value, value: null }))
          : [],
      },
    });

    edges.push({
      id: "edge-" + parentId + "-" + feature.attributes.name,
      source: parentId,
      target: nodeId,
    });

    if (feature.subFeatures) {
      const subFeatures = feature.subFeatures.subFeatures;
      if (subFeatures) {
        for (const subFeature of subFeatures) {
          nodes.push({
            id: nodeId + "-choice-" + subFeature.type,
            type: "choice",
            position: { x: 0, y: 0 },
            data: {
              type: subFeature.type,
            },
          });

          edges.push({
            id: "edge-" + nodeId + "-choice-" + subFeature.type,
            source: nodeId,
            target: nodeId + "-choice-" + subFeature.type,
          });

          for (const sFeatures of subFeature.features) {
            nodes.push({
              id: nodeId + "-" + sFeatures.attributes.name,
              type: "feature",
              position: { x: 0, y: 0 },
              data: {
                label: sFeatures.attributes.name,
                isMandatory:
                  sFeatures.attributes.optional === "true" ? true : false,
              },
            });

            edges.push({
              id:
                "edge-" +
                nodeId +
                "-choice-" +
                subFeature.type +
                "-" +
                sFeatures.attributes.name,
              source: nodeId + "-choice-" + subFeature.type,
              target: nodeId + "-" + sFeatures.attributes.name,
            });
          }
        }
      }
      const subResults = processFeatures(nodeId, feature.subFeatures.features);
      nodes.push(...subResults.nodes);
      edges.push(...subResults.edges);
    }
  }

  return { nodes, edges };
}

const FlowDiagram: React.FC<object> = () => {
  const buildTree = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      const width = 1200;
      const height = width;
      const radius = Math.min(width, height) / 2 - 30;
      const nodesWithChildren = nodes.map(node => ({ ...node, children: [] as Node[] }));
      
      edges.forEach(edge => {
        const sourceNode = nodesWithChildren.find(node => node.id === edge.source);
        const targetNode = nodesWithChildren.find(node => node.id === edge.target);
        if (sourceNode && targetNode) {
          sourceNode.children.push(targetNode);
        }
      });
  
      const root = d3.hierarchy(nodesWithChildren[0])
  
      const tree = d3.tree()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
  
      tree(root);
  
      root.each(node => {
        if (node.x && node.y) {
          node.data.position = {
            x: node.y * Math.cos(node.x),
            y: node.y * Math.sin(node.x),
          };
        }
      });
  
      return { nodes: nodesWithChildren, edges };
    },
    []
  );

  const [, setGraphData] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    APIService.fetchFeatureModel()
      .then((response) => {
        const root = {
          id: "root",
          type: "root",
          position: { x: 0, y: 0 },
          data: {
            label: response.data.name,
            isMandatory: true,
          },
        };
        const results = processFeatures("root", response.data.features);
        const newNodes = [root, ...results.nodes];
        const newEdges = results.edges;

        setGraphData({ nodes: newNodes, edges: newEdges });

        const tree = buildTree(newNodes, newEdges);
        setNodes(tree.nodes);
        setEdges(tree.edges);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = (_event: unknown, clickedNode: { id: string }) => {
    const node = nodes.find((n) => n.id === clickedNode.id);
    if (node && (node.data.isDisabled || node.data.isMandatory || node.type==="choice")) {
      return; // Si le noeud est désactivé, on ne fait rien
    }
    let updatedNodes = [...nodes];

    const updateNodeAndParents = (nodeId: string, isSelected: boolean) => {
      updatedNodes = updatedNodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, isSelected } } : n
      );
      if (isSelected) {
        const edge = edges.find((edge) => edge.target === nodeId);
        if (edge) {
          updateNodeAndParents(edge.source, isSelected);
        }
      }
    };

    const updateNodeAndChildren = (nodeId: string, isSelected: boolean) => {
      updatedNodes = updatedNodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, isSelected, isDisabled: false } }
          : n
      );
      if (!isSelected) {
        const childEdges = edges.filter((edge) => edge.source === nodeId);
        childEdges.forEach((edge) =>
          updateNodeAndChildren(edge.target, isSelected)
        );
      }
    };

    if (node) {
      const isSelected = !node.data.isSelected;
      updateNodeAndParents(node.id, isSelected);
      updateNodeAndChildren(node.id, isSelected);

      // Check if parent is a "Choice Node" of type "XOR"
      const parentEdge = edges.find((edge) => edge.target === node.id);
      if (parentEdge) {
        const parentNode = updatedNodes.find((n) => n.id === parentEdge.source);
        if (
          parentNode &&
          parentNode.type === "choice" &&
          parentNode.data.type === "XOR"
        ) {
          // Fade and disable nodes that have the same parent
          updatedNodes = updatedNodes.map((n) => {
            const edge = edges.find((edge) => edge.target === n.id);
            if (edge && edge.source === parentNode.id && n.id !== node.id) {
              return {
                ...n,
                data: { ...n.data, isSelected: false, isDisabled: isSelected },
              };
            }
            return n;
          });
        }
      }
    }

    setNodes(updatedNodes);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <ReactFlowProvider>
        <div
          style={{
            zIndex: 1,
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
          >
            <Background
              color="black"
              style={{ backgroundColor: " #3f3f3f" }}
              variant={BackgroundVariant.Dots}
              gap={12}
              size={1}
            />
          </ReactFlow>
        </div>
        <div style={{ zIndex: 2, position: "absolute", right: "0", top: "0" }}>
          <TogglePanel nodes={nodes} />
        </div>
        <Controls position="top-left" showInteractive={false} />
        <MiniMap nodeColor="black" position="bottom-left" />
      </ReactFlowProvider>
    </div>
  );
};
export default FlowDiagram;
