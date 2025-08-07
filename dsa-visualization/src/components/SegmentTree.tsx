import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Tree, type RawNodeDatum } from "react-d3-tree";

type Props = {
  onArrLenUpdate: (val: number) => void;
};

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
  r: number,
  idx: number
): RawNodeDatum | undefined {
  if (!nodes) return undefined;
  const mid = Math.floor((l + r) / 2);
  return {
    name: nodes.value.toString(),
    attributes: {
      left: l,
      right: r,
      id: idx,
    },
    children: [
      nodeToTree(nodes.left, l, mid, idx * 2),
      nodeToTree(nodes.right, mid + 1, r, idx * 2 + 1),
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
const treeData = [nodeToTree(nodes, 1, arr.length - 1, 1)!];

export type HandleAnimation = {
  query: (l: number, r: number) => void;
  update: (idx: number, val: number) => void;
};

const SegmentTree = forwardRef<HandleAnimation, Props>(
  ({ onArrLenUpdate }: Props, ref) => {
    const [highlightedChild, setHighlightedChild] = useState(0);
    const [highlightedParent, setHighlightedParent] = useState(0);
    const [textBox, setTextBox] = useState("");
    const [displayText, setDisplayText] = useState(false);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    useImperativeHandle(ref, () => ({
      query: async (l: number, r: number) => {
        setDisplayText(true);
        const visitNode = async (
          node: RawNodeDatum,
          parNode: RawNodeDatum = treeData[0]
        ): Promise<number> => {
          if (!node) return 0;
          const index = Number(node.attributes?.id);
          const parIndex = Number(parNode.attributes?.id);
          if (index !== undefined) {
            setHighlightedChild(index);
          }
          if (parIndex !== undefined) {
            setHighlightedParent(parIndex);
          }

          const start = Number(node.attributes?.left);
          const end = Number(node.attributes?.right);
          if (start > r || end < l) {
            setTextBox(`[${start}..${end}] out of range. Returns 0.`);
            await delay(1000);
            return 0;
          }
          if (start >= l && end <= r) {
            setTextBox(
              `[${start}..${end}] within range. Returns the value the node holds.`
            );
            await delay(1000);
            return parseInt(node.name.toString() ?? "0");
          }

          const leftChild = node.children?.[0];
          const rightChild = node.children?.[1];
          let leftsum = 0;
          let rightsum = 0;
          if (leftChild) {
            setTextBox("Searching left child...");
            await delay(1000);
            leftsum = await visitNode(leftChild, node);
          }
          if (rightChild) {
            setTextBox("Searching right child...");
            await delay(1000);
            rightsum = await visitNode(rightChild, node);
          }
          return leftsum + rightsum;
        };

        const result = await visitNode(treeData[0]);
        setHighlightedChild(0);
        setHighlightedParent(0);
        setDisplayText(false);
        alert(result);
      },

      update: (idx: number, val: number) => {
        console.log("updating...");
      },
    }));

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
              <circle
                r={20}
                fill={
                  Number(nodeDatum.attributes?.id) === highlightedChild
                    ? "#eb9720ff"
                    : Number(nodeDatum.attributes?.id) === highlightedParent
                    ? "#f633b8ff"
                    : "#00ffffff"
                }
              />
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
                {`[${nodeDatum.attributes?.left}..${nodeDatum.attributes?.right}]`}
              </text>
            </g>
          )}
        />
        {displayText && (
          <div style={{ backgroundColor: "black" }}>
            <p>{textBox}</p>
          </div>
        )}
      </div>
    );
  }
);

export default SegmentTree;
