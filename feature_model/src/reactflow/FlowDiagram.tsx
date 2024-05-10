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
  ReactFlowProvider,
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
    data: { label: "ROOT", isMandatory: true, cardinality: "" },
  },
  {
    id: "1",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "Timing", isMandatory: false, cardinality: "1..n" },
  },
  {
    id: "2",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "Scheduling", isMandatory: false, cardinality: "" },
  },
  {
    id: "3",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "Courses", isMandatory: true, cardinality: "" },
  },
  {
    id: "4",
    type: "feature",
    position: { x: 0, y: 0 },
    data: { label: "Exams", isMandatory: true, cardinality: "" },
  },
];

const initialEdges = [
  { id: "e0-1", source: "0", target: "1" },
  { id: "e0-2", source: "0", target: "2" },
  { id: "e0-3", source: "0", target: "3" },
  { id: "e1-4", source: "1", target: "4" },
];

function buildTree(nodes: any[], edges: any[], xSpacing = 150, ySpacing = 150) {
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
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 5;
      initialNode.position = {
        x: centerX + (index * xSpacing - ((siblingCount - 1) * xSpacing) / 2),
        y: centerY + depth * ySpacing,
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

export default function FlowDiagram() {
  // Construire l'arbre pour positionner les noeuds
  const tree = buildTree(initialNodes, initialEdges);
  console.log(tree);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  const applyFadeStyle = (nodeId: string) => {
    const node = findNode(tree, nodeId);
    const descendantIds = node ? getDescendantIds(node) : [];

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId || descendantIds.includes(node.id)
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
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
