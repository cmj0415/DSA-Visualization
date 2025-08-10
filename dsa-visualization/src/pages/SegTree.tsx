import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import SegmentTree, { type HandleAnimation } from "../components/SegmentTree";
import SegUpdate from "../components/SegUpdate";
import SegQuery from "../components/SegQuery";

export default function SegTree() {
  const [mode, setMode] = useState(0);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);

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
      <SegmentTree ref={segmentTreeRef} setPlaying={setIsAnimationPlaying} />
      <br></br>
      {mode === 0 && (
        <div
          style={{
            marginTop: "50px",
            position: "absolute",
            right: 0,
            width: "70%",
          }}
        >
          <Button
            text="Update"
            disabled={false}
            onClickCallback={() => setMode(1)}
          />
          <Button
            text="Query"
            disabled={false}
            onClickCallback={() => setMode(2)}
          />
        </div>
      )}
      {mode === 1 && (
        <div
          style={{
            marginTop: "10px",
            position: "absolute",
            right: 0,
            width: "70%",
          }}
        >
          <SegUpdate
            onTrigger={triggerUpdate}
            onBackClicked={setMode}
            isAnimationPlaying={isAnimationPlaying}
          />
        </div>
      )}
      {mode === 2 && (
        <div
          style={{
            marginTop: "10px",
            position: "absolute",
            right: 0,
            width: "70%",
          }}
        >
          <SegQuery
            onTrigger={triggerQuery}
            onBackClicked={setMode}
            isAnimationPlaying={isAnimationPlaying}
          />
        </div>
      )}
    </div>
  );
}
