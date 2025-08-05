import { useState, useEffect, useRef } from "react";
import { Tree, type RawNodeDatum } from "react-d3-tree";

type SegNode = {
  value: number;
  left?: SegNode;
  right?: SegNode;
};

const arr = [0, 1, 2, 3, 4];
const seg = new Array(8);

function arrToSeg(
  arr: number[],
  seg: number[],
  l: number,
  r: number,
  idx: number
): void {
  if (l === r) {
    seg[idx] = arr[l];
    return;
  }
  const mid = Math.floor((l + r) / 2);
  arrToSeg(arr, seg, l, mid, idx * 2);
  arrToSeg(arr, seg, mid + 1, r, idx * 2 + 1);
  seg[idx] = seg[idx * 2] + seg[idx * 2 + 1];
}

function segToNode(seg: number[], idx: number): SegNode | undefined {
  if (idx >= seg.length) return undefined;
  return {
    value: seg[idx],
    left: segToNode(seg, idx * 2),
    right: segToNode(seg, idx * 2 + 1),
  };
}

function nodeToTree(
  nodes: SegNode | undefined,
  l: number,
  r: number
): RawNodeDatum | undefined {
  if (!nodes) return undefined;
  const mid = Math.floor((l + r) / 2);
  return {
    name: nodes.value.toString(),
    attributes: {
      range: `[${l}..${r}]`,
    },
    children: [
      nodeToTree(nodes.left, l, mid),
      nodeToTree(nodes.right, mid + 1, r),
    ].filter((child): child is RawNodeDatum => child !== undefined),
  };
}

function printSeg(seg: number[]) {
  for (let i = 1; i < seg.length; i++) {
    console.log(`Index ${i}: ${seg[i]}`);
  }
}

function printNode(nodes: SegNode | undefined, idx: number) {
  if (!nodes) return;
  console.log(`Index ${idx}: ${nodes.value}`);
  printNode(nodes.left, idx * 2);
  printNode(nodes.right, idx * 2 + 1);
}

arrToSeg(arr, seg, 1, arr.length - 1, 1);
const nodes = segToNode(seg, 1);
const treeData = [nodeToTree(nodes, 1, arr.length - 1)!];

export default function SegmentTree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 50 });
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "60vh" }}>
      <Tree
        data={treeData}
        orientation="vertical"
        draggable={false}
        translate={translate}
        pathFunc="straight"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        renderCustomNodeElement={({ nodeDatum }) => (
          <g>
            <circle r={20} fill="#00ffffff" />
            <text
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="black"
              fontSize="14"
              fontWeight="normal"
            >
              {nodeDatum.name}
            </text>

            <text
              x={30}
              y={0}
              textAnchor="start"
              alignmentBaseline="middle"
              fill="white"
              fontFamily="sans-serif"
              fontSize="16"
              fontWeight="bold"
              strokeWidth="1"
            >
              {nodeDatum.attributes?.range}
            </text>
          </g>
        )}
      />
    </div>
  );
}
