import { useState, useEffect } from "react";
type Props = {
  nodeDatum: any;
  highlightedChild: number;
  highlightedParent: number;
  sz: number;
  sib: number;
  nsib: number;
  df: number;
  delayTime: string;
};

export default function NodeRenderer({
  nodeDatum,
  highlightedChild,
  highlightedParent,
  sz,
  sib,
  nsib,
  df,
  delayTime,
}: Props) {
  const [playAnimation, setPlayAnimation] = useState(false);

  useEffect(() => {
    if (nodeDatum.attributes?.processing) {
      setPlayAnimation(false);
      requestAnimationFrame(() =>
        setPlayAnimation(
          nodeDatum.attributes?.left !== nodeDatum.attributes?.right
        )
      );
    } else {
      setPlayAnimation(false);
    }
  }, [nodeDatum.attributes?.processing]);

  const dx =
    Number(nodeDatum.attributes?.sibDisp ?? 0) * sib * sz +
    Number(nodeDatum.attributes?.nsibDisp ?? 0) * nsib * sz;
  const dy = df;

  return (
    <g>
      {nodeDatum.attributes?.processing && (
        <rect
          width={sz}
          height={sz / 2}
          fill="none"
          x={0.6 * sz}
          y={0.6 * sz}
          stroke="#ff0000ff"
          strokeWidth="4px"
        >
          {playAnimation && (
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to={`${dx} ${dy}`}
              begin="0s"
              dur={delayTime}
              fill="freeze"
            />
          )}
        </rect>
      )}

      {nodeDatum.attributes?.processing && (
        <rect
          width={sz}
          height={sz / 2}
          fill="none"
          x={0.6 * sz}
          y={0.6 * sz}
          stroke="#ff0000ff"
          strokeWidth="4px"
        >
          {playAnimation && (
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to={`-${dx} ${dy}`}
              begin="0s"
              dur={delayTime}
              fill="freeze"
            />
          )}
        </rect>
      )}

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
      <text
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="black"
        fontSize={0.6 * sz}
      >
        {nodeDatum.name}
      </text>
    </g>
  );
}
