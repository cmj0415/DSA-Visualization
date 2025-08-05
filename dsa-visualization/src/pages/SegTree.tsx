import { useState, useEffect, useRef } from "react";
import { Tree, type RawNodeDatum } from "react-d3-tree";
import "./SegTree.css";

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

function nodeToTree(nodes: SegNode | undefined): RawNodeDatum | undefined {
  if (!nodes) return undefined;
  return {
    name: nodes.value.toString(),
    children: [nodeToTree(nodes.left), nodeToTree(nodes.right)].filter(
      (child): child is RawNodeDatum => child !== undefined
    ),
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
const treeData = [nodeToTree(nodes)!];

export default function SegTree() {
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
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ margin: 0 }}>Segment Tree Visualization</h1>
      </div>

      <div ref={containerRef} style={{ width: "100%", height: "80vh" }}>
        <Tree
          data={treeData}
          orientation="vertical"
          draggable={false}
          translate={translate}
        />
      </div>
    </div>
  );
}
