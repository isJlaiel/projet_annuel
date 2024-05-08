import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  BackgroundVariant,
} from "reactflow";
import FeatureNode from "./FeatureNode";

import "reactflow/dist/style.css";

const nodeTypes = {
  feature: FeatureNode,
};

const initialNodes = [
  {
    id: "0",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "ROOT", isMandatory: true, cardinality: "1" },
  },
  {
    id: "1",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "Timing", isMandatory: false, cardinality: "n" },
  },
  {
    id: "2",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "Scheduling", isMandatory: false, cardinality: "+" },
  },
  {
    id: "3",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "Courses", isMandatory: true, cardinality: "1..n" },
  },
  {
    id: "4",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "Exams", isMandatory: true, cardinality: "1..n" },
  },
];

const initialEdges = [
  { id: "e0-1", source: "0", target: "1" },
  { id: "e0-2", source: "0", target: "2" },
  { id: "e0-3", source: "0", target: "3" },
  { id: "e1-4", source: "1", target: "4" },
];

function buildTree(nodes: any[], edges: any[], xSpacing = 200, ySpacing = 100) {
  const idToNodeMap = new Map();

  nodes.forEach((node) => {
    idToNodeMap.set(node.id, { id: node.id, ...node.data, children: [] });
  });

  edges.forEach((edge) => {
    const parent = idToNodeMap.get(edge.source);
    const child = idToNodeMap.get(edge.target);
    if (parent && child) {
      parent.children.push(child);
    }
  });

  const root = nodes.find(
    (node) => !edges.some((edge) => edge.target === node.id)
  );

  function assignPositions(
    node: { id: any; children: any[] },
    depth = 0,
    index = 0,
    siblingCount = 1
  ) {
    const initialNode = nodes.find((n) => n.id === node.id);
    if (initialNode) {
      initialNode.position = {
        x: index * xSpacing - ((siblingCount - 1) * xSpacing) / 2,
        y: depth * ySpacing,
      };
    }
    node.children.forEach((child: any, i: number | undefined) =>
      assignPositions(child, depth + 1, i, node.children.length)
    );
  }

  const rootNode = root ? idToNodeMap.get(root.id) : null;
  if (rootNode) {
    assignPositions(rootNode);
  }

  return rootNode;
}

export default function FlowDiagram() {
  // Construire l'arbre pour positionner les noeuds
  buildTree(initialNodes, initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
