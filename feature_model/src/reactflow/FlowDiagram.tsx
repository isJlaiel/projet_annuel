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

import "reactflow/dist/style.css";
import RootNode from "./RootNode";
import dagre from "dagre";
import ChoiceNode from "./ChoiceNode";

const nodeWidth = 100;
const nodeHeight = 80;

const nodeTypes = {
  feature: FeatureNode,
  root: RootNode,
  choice: ChoiceNode
};

function processFeatures(features: any, parentId: string): any {
  if (!features) {
    return { nodes: [], edges: [] };
  }
  const nodes = [];
  const edges = [];

  for (let feature of features) {
    const nodeId = parentId + "-" + feature.attributes.name;

    nodes.push({
      id: nodeId,
      type: "feature",
      position: { x: 0, y: 0 },
      data: {
        label: feature.attributes.name,
        isMandatory: feature.attributes.mandatory === 'true' ? true : false,
      },
    });

    edges.push({
      id: "edge-" + feature.attributes.name,
      source: parentId,
      target: nodeId,
    });

    if (feature.subFeatures) {
      let subFeature = feature.subFeatures.subFeature
      if(subFeature){
        nodes.push({
          id: nodeId + "-choice-" + subFeature.type,
          type: "choice",
          position: { x: 0, y: 0 },
          data: {
            type: subFeature.type
          },
        });

        edges.push({
          id: "edge-" + subFeature.type,
          source: nodeId,
          target: nodeId + "-choice-" + subFeature.type,
        });

        for(let sFeatures of subFeature.features){
          nodes.push({
            id: nodeId + "-" + sFeatures.attributes.name,
            type: "feature",
            position: { x: 0, y: 0 },
            data: {
              label: sFeatures.attributes.name,
              isMandatory: sFeatures.attributes.optional === "true" ? true : false,
            },
          });

          edges.push({
            id: "edge-" + sFeatures.attributes.name,
            source: nodeId + "-choice-" + subFeature.type,
            target: nodeId + "-" + sFeatures.attributes.name,
          })

        }
      }
      const subResults = processFeatures(feature.subFeatures.features, nodeId);
      nodes.push(...subResults.nodes);
      edges.push(...subResults.edges);
    }
  }

  return { nodes, edges };
}

export default function FlowDiagram() {
  const dagreGraph = useRef(new dagre.graphlib.Graph()).current;

  const buildTree = useCallback((nodes: any[], edges: any[], direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction });
  
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
  
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
  
    dagre.layout(dagreGraph);
  
    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? "left" : "top";
      node.sourcePosition = isHorizontal ? "right" : "bottom";
  
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    });
  
    return { nodes, edges };
  }, []);

  const [graphData, setGraphData] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    fetch("/src/data.json")
      .then((response) => response.json())
      .then((content) => {
        const root = {
          id: "root",
          type: "root",
          position: { x: 0, y: 0 },
          data: {
            label: content.name,
            isMandatory: true,
          },
        };

        const results = processFeatures(content.features, "root");

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

  const handleNodeClick = (_event: any, node: { id: string; }) => {
    const edge = edges.find(edge => edge.target === node.id);
    if(edge){
      let parentId = edge.source;
      let updatedNodes = nodes.map(n => n.id === parentId ? { ...n, nodeStyle: { backgroundColor: 'green' } } : n);
      setNodes(updatedNodes);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
