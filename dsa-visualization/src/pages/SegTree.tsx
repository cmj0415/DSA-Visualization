import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import SegmentTree, { type HandleAnimation } from "../components/SegmentTree";
import SegUpdate from "../components/SegUpdate";
import SegQuery from "../components/SegQuery";

export default function SegTree() {
  const [mode, setMode] = useState(0);

  const segmentTreeRef = useRef<HandleAnimation>(null);

  const triggerQuery = (l: number, r: number) => {
    if (segmentTreeRef.current) {
      segmentTreeRef.current.query(l, r);
    }
  };

  const triggerUpdate = (idx: number, val: number) => {
    if (segmentTreeRef.current) {
      segmentTreeRef.current.update(idx, val);
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ margin: 0 }}>Segment Tree Visualization</h1>
      </div>
      <SegmentTree ref={segmentTreeRef} />
      <br></br>
      {mode === 0 && (
        <div>
          <Button text="Update" onClickCallback={() => setMode(1)} />
          <Button text="Query" onClickCallback={() => setMode(2)} />
        </div>
      )}
      {mode === 1 && (
        <div>
          <SegUpdate onTrigger={triggerUpdate} />
          <Button text="Back" onClickCallback={() => setMode(0)} />
        </div>
      )}
      {mode === 2 && (
        <div>
          <SegQuery onTrigger={triggerQuery} />
          <Button text="Back" onClickCallback={() => setMode(0)} />
        </div>
      )}
    </div>
  );
}
