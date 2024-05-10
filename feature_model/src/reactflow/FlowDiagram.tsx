import { useCallback, useState, useEffect } from "react";
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

function buildTree(nodes: any[], edges: any[], direction = "TB") {
  const isHorizontal = direction === "LR";
  const dagreGraph = new dagre.graphlib.Graph();
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
}

const findNode = (node: any, nodeId: string): any => {
  if (node.id === nodeId) {
    return node;
  }
  for (let child of node.children) {
    const found = findNode(child, nodeId);
    if (found) {
      return found;
    }
  }
  return null;
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
      });
  }, []);

  const tree = buildTree(graphData.nodes, graphData.edges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getDescendantIds = (node: any): string[] => {
    let ids: any[] = [];
    node.children.forEach((child: any) => {
      ids.push(child.id);
      ids = ids.concat(getDescendantIds(child));
    });
    return ids;
  };

  const findParentNode = (node: any, nodeId: string): any => {
    for (let child of node.children) {
      if (child.id === nodeId) {
        return node;
      }
      const found = findParentNode(child, nodeId);
      if (found) {
        return found;
      }
    }
    return null;
  };

  const getAllDescendantIds = (node: any): string[] => {
    let ids = [];
    for (let child of node.children) {
      ids.push(child.id);
      ids = ids.concat(getAllDescendantIds(child));
    }
    return ids;
  };

  const applyFadeStyle = (nodeId: string) => {
    const parentNode = findParentNode(tree, nodeId);
    const siblingIds = parentNode
      ? parentNode.children
          .map((child: any) => child.id)
          .filter((id: string) => id !== nodeId)
      : [];
    const descendantIds = siblingIds.flatMap((id: any) =>
      getAllDescendantIds(findNode(tree, id))
    );

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        siblingIds.includes(node.id) || descendantIds.includes(node.id)
          ? node.style && node.style.opacity === 0.2
            ? { ...node, style: { ...node.style, opacity: 1 } }
            : { ...node, style: { ...node.style, opacity: 0.2 } }
          : node
      )
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodeClick={(_, node) => applyFadeStyle(node.id)}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
