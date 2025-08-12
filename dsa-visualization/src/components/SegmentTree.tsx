import { useLocation } from "react-router-dom";
import ArrayDisplay from "./ArrayDisplay";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Tree, type RawNodeDatum } from "react-d3-tree";

type Props = {
  setPlaying: (isPlaying: boolean) => void;
};

type SegNode = {
  value: number;
  id: number;
  rangeL: number;
  rangeR: number;
  lazy: number;
  left?: SegNode;
  right?: SegNode;
};

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

function segToNode(
  seg: number[],
  l: number,
  r: number,
  idx: number
): SegNode | undefined {
  if (l > r) return undefined;
  if (l === r) {
    return {
      value: seg[idx],
      id: idx,
      rangeL: l,
      rangeR: r,
      lazy: 0,
      left: undefined,
      right: undefined,
    };
  }
  const mid = Math.floor((l + r) / 2);
  return {
    value: seg[idx],
    id: idx,
    rangeL: l,
    rangeR: r,
    lazy: 0,
    left: segToNode(seg, l, mid, idx * 2),
    right: segToNode(seg, mid + 1, r, idx * 2 + 1),
  };
}

function nodeToTree(
  nodes: SegNode | undefined,
  l: number,
  r: number,
  idx: number
): RawNodeDatum | undefined {
  if (!nodes || nodes.value === undefined) return undefined;
  const mid = Math.floor((l + r) / 2);
  return {
    name: nodes.value.toString(),
    attributes: {
      left: l,
      right: r,
      lazy: nodes.lazy,
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

export type HandleAnimation = {
  query: (l: number, r: number) => void;
  update: (idx: number, val: number) => void;
  rangeUpdate: (l: number, r: number, val: number) => void;
};

const SegmentTree = forwardRef<HandleAnimation, Props>(
  ({ setPlaying }: Props, ref) => {
    const [highlightedChild, setHighlightedChild] = useState(0);
    const [highlightedParent, setHighlightedParent] = useState(0);
    const [textBox, setTextBox] = useState("");
    const [displayText, setDisplayText] = useState(false);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const delayTime: number = 1000;

    const { state } = useLocation();
    const initialArray = state?.initialArray || [0];
    const [arr, setArr] = useState([0, ...initialArray]);
    const seg = new Array(4 * arr.length);

    arrToSeg(arr, seg, 1, arr.length - 1, 1);
    const nodes = segToNode(seg, 1, arr.length - 1, 1);
    const segNodeRef = useRef<SegNode>(nodes);
    const [treeData, setTreeData] = useState([
      nodeToTree(segNodeRef.current, 1, arr.length - 1, 1)!,
    ]);

    const depth = (node: SegNode): number => {
      let d = 0;
      let len = arr.length - 1;
      const range = node.rangeR - node.rangeL + 1;
      while (len > range) {
        len = Math.floor(len / 2);
        d++;
      }
      return d;
    };
    const sz = 30; // node size
    const df = 80; // depth factor
    const sib = 4; // sibling separation factor
    const nsib = 7; // non-sibling separation factor

    const pushDown = async (node: SegNode | undefined): Promise<void> => {
      if (node === undefined || node.lazy === 0) return;
      setTextBox("Pushing down lazy tag...");
      const mid = Math.floor((node.rangeL + node.rangeR) / 2);
      if (node.left) {
        node.left.lazy += node.lazy;
        node.left.value += (mid - node.rangeL + 1) * node.lazy;
      }
      if (node.right) {
        node.right.lazy += node.lazy;
        node.right.value += (node.rangeR - mid) * node.lazy;
      }
      node.lazy = 0;
      await delay(delayTime);
    };

    useImperativeHandle(ref, () => ({
      query: async (l: number, r: number) => {
        if (l < 1 || l >= arr.length || r < 1 || r >= arr.length) {
          alert("Out of range!");
          return;
        } else if (l > r) {
          alert("Starting index must be smaller than or equal to ending index");
          return;
        }
        setPlaying(true);
        setDisplayText(true);
        const visitNode = async (
          node: SegNode | undefined,
          parNode: SegNode | undefined
        ): Promise<number> => {
          if (!node || !parNode) return 0;
          const index = node.id;
          const parIndex = parNode.id;
          if (index !== undefined) {
            setHighlightedChild(index);
          }
          if (parIndex !== undefined) {
            setHighlightedParent(parIndex);
          }

          const start = node.rangeL;
          const end = node.rangeR;
          await pushDown(node);
          const newtree = nodeToTree(segNodeRef.current, 1, arr.length - 1, 1);
          if (newtree) setTreeData([newtree]);
          await delay(delayTime);

          if (start > r || end < l) {
            setTextBox(`[${start}..${end}] out of range. Returns 0.`);
            await delay(delayTime);
            return 0;
          }
          if (start >= l && end <= r) {
            setTextBox(
              `[${start}..${end}] within range. Returns ${node.value}.`
            );
            await delay(delayTime);
            return node.value;
          }

          const leftChild = node.left;
          const rightChild = node.right;
          let leftsum = 0;
          let rightsum = 0;
          if (leftChild) {
            setTextBox("Searching left child...");
            await delay(delayTime);
            leftsum = await visitNode(leftChild, node);
          }
          setHighlightedChild(0);
          if (rightChild) {
            setTextBox("Searching right child...");
            await delay(delayTime);
            rightsum = await visitNode(rightChild, node);
          }
          setHighlightedChild(index);
          setHighlightedParent(parIndex);
          await delay(delayTime);
          return leftsum + rightsum;
        };

        const result = await visitNode(segNodeRef.current, segNodeRef.current);
        setHighlightedChild(0);
        setHighlightedParent(0);
        setDisplayText(false);
        setPlaying(false);
        alert(result);
      },

      update: async (idx: number, val: number) => {
        if (idx < 1 || idx >= arr.length) {
          alert("Out of range!");
          return;
        } else if (val < -100 || val > 100) {
          alert("Please enter a number between -100 and 100");
          return;
        }
        const newarr = [...arr];
        newarr[idx] = val;
        setArr(newarr);
        setPlaying(true);
        setDisplayText(true);
        const visitNode = async (
          node: SegNode | undefined,
          parNode: SegNode | undefined
        ): Promise<void> => {
          if (!node || !parNode) return;

          const index = Number(node.id);
          const parIndex = Number(parNode.id);
          if (index !== undefined && parIndex !== undefined) {
            setHighlightedChild(index);
            setHighlightedParent(parIndex);
          }

          const start = Number(node.rangeL);
          const end = Number(node.rangeR);
          if (idx < start || idx > end) {
            setTextBox(
              `Index ${idx} out of range [${start}..${end}]. Directly returns.`
            );
            await delay(delayTime);
            return;
          }
          if (start === end) {
            setTextBox(`Leaf reached. Update the value to ${val}.`);
            node.value = val;
            const newtree = nodeToTree(
              segNodeRef.current,
              1,
              arr.length - 1,
              1
            );
            if (newtree) setTreeData([newtree]);
            await delay(delayTime);
            return;
          }

          const leftChild = node.left;
          const rightChild = node.right;
          let leftValue = 0;
          let rightValue = 0;
          if (leftChild) {
            setTextBox("Updating left child...");
            await delay(delayTime);
            await visitNode(leftChild, node);
            leftValue = leftChild.value;
          }
          setHighlightedChild(0);
          if (rightChild) {
            setTextBox("Updating right child...");
            await delay(delayTime);
            await visitNode(rightChild, node);
            rightValue = rightChild.value;
          }
          node.value = leftValue + rightValue;
          setTextBox(
            `Update the value to ${leftValue} + ${rightValue} = ${node.value}`
          );
          setHighlightedChild(index);
          setHighlightedParent(parIndex);
          await delay(delayTime);
          const newtree = nodeToTree(segNodeRef.current, 1, arr.length - 1, 1);
          if (newtree) setTreeData([newtree]);
        };

        await visitNode(segNodeRef.current, segNodeRef.current);
        setHighlightedChild(0);
        setHighlightedParent(0);
        setDisplayText(false);
        setTextBox("");
        setPlaying(false);
      },

      rangeUpdate: async (l: number, r: number, val: number) => {
        if (l < 1 || l >= arr.length || r < 1 || r >= arr.length) {
          alert("Out of range!");
          return;
        } else if (l > r) {
          alert("Starting index must be smaller than or equal to ending index");
          return;
        }
        if (val < -10 || val > 10) {
          alert("Increment must be between -10 and 10");
          return;
        }
        const newarr = [...arr];
        for (let i = l; i <= r; i++) newarr[i] += val;
        setArr(newarr);
        setPlaying(true);
        setDisplayText(true);
        printNode(segNodeRef.current, 1);

        const visitNode = async (
          node: SegNode | undefined,
          parNode: SegNode | undefined
        ): Promise<void> => {
          if (node === undefined || parNode === undefined) return;

          const index = Number(node.id);
          const parIndex = Number(parNode.id);
          if (index !== undefined && parIndex !== undefined) {
            setHighlightedChild(index);
            setHighlightedParent(parIndex);
          }

          const start = node.rangeL;
          const end = node.rangeR;
          if (start > r || end < l) {
            setTextBox(`[${start}..${end}] out of range. Directly returns.`);
            await delay(delayTime);
            return;
          }

          if (l <= start && end <= r) {
            setTextBox(
              `[${start}..${end}] within range. Update the value and the lazy tag.`
            );
            node.value += (end - start + 1) * val;
            node.lazy += val;
            const newtree = nodeToTree(
              segNodeRef.current,
              1,
              arr.length - 1,
              1
            );
            if (newtree) setTreeData([newtree]);
            await delay(delayTime);
            return;
          }

          await pushDown(node);
          let newtree = nodeToTree(segNodeRef.current, 1, arr.length - 1, 1);
          if (newtree) setTreeData([newtree]);
          await delay(delayTime);

          const leftChild = node.left;
          const rightChild = node.right;
          let leftsum = 0;
          let rightsum = 0;
          if (leftChild) {
            setTextBox("Updating left child...");
            await delay(delayTime);
            await visitNode(leftChild, node);
            leftsum = leftChild.value;
          }
          setHighlightedChild(0);
          if (rightChild) {
            setTextBox("Updating right child...");
            await delay(delayTime);
            await visitNode(rightChild, node);
            rightsum = rightChild.value;
          }
          setHighlightedChild(index);
          setHighlightedParent(parIndex);
          node.value = leftsum + rightsum;
          setTextBox(
            `Update the value to ${leftsum} + ${rightsum} = ${node.value}`
          );

          newtree = nodeToTree(segNodeRef.current, 1, arr.length - 1, 1);
          if (newtree) setTreeData([newtree]);
          await delay(delayTime);
        };
        await visitNode(segNodeRef.current, segNodeRef.current);
        printNode(segNodeRef.current, 1);
        setHighlightedChild(0);
        setHighlightedParent(0);
        setDisplayText(false);
        setTextBox("");
        setPlaying(false);
      },
    }));

    const containerRef = useRef<HTMLDivElement>(null);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const centerTree = () => {
      if (containerRef.current) {
        const dimensions = containerRef.current.getBoundingClientRect();
        setTranslate({
          x: dimensions.width / 2,
          y: 50,
        });
      }
    };

    useEffect(() => {
      centerTree();
      window.addEventListener("resize", centerTree);
      return () => window.removeEventListener("resize", centerTree);
    }, []);

    return (
      <div
        ref={containerRef}
        style={{ position: "relative", width: "80vw", height: "50%" }}
      >
        <Tree
          data={treeData}
          orientation="vertical"
          draggable={false}
          zoomable={false}
          translate={translate}
          pathFunc="straight"
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          nodeSize={{ x: sz, y: sz }}
          depthFactor={df}
          separation={{ nonSiblings: nsib, siblings: sib }}
          renderCustomNodeElement={({ nodeDatum }) => (
            <g>
              <rect
                width={sz}
                height={sz / 2}
                fill="#d898e6ff"
                x={0.6 * sz}
                y={0.6 * sz}
              />
              <text
                x={1.1 * sz}
                y={0.85 * sz}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="8"
                fill="black"
              >
                {nodeDatum.attributes?.lazy ?? "0"}
              </text>
              <circle
                r={sz}
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
                fontSize={0.6 * sz}
                fontWeight="normal"
              >
                {nodeDatum.name}
              </text>

              <text
                x={1.2 * sz}
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
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "30px",
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>{textBox}</p>
          </div>
        )}
        <ArrayDisplay array={arr} />
      </div>
    );
  }
);

export default SegmentTree;
