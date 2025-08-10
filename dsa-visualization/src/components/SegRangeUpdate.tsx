import { useState } from "react";
import Button from "./Button";
import { isNumber } from "../utils/func.ts";

type Props = {
  onTrigger: (l: number, r: number, val: number) => void;
  onBackClicked: (mode: number) => void;
  isAnimationPlaying: boolean;
};

export default function SegUpdate({
  onTrigger,
  onBackClicked,
  isAnimationPlaying,
}: Props) {
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [incrementInput, setIncrementInput] = useState("");

  const handleFromInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFromInput(event.target.value);
  };
  const handleToInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToInput(event.target.value);
  };
  const handleIncInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncrementInput(event.target.value);
  };
  const handleConfirm = () => {
    if (
      !isNumber(fromInput) ||
      !isNumber(toInput) ||
      !isNumber(incrementInput)
    ) {
      alert("Please enter integers!");
      return;
    }
    const from = Number(fromInput);
    const to = Number(toInput);
    const inc = Number(incrementInput);

    onTrigger(from, to, inc);
  };

  return (
    <div>
      <p>Increase the elements in a range by the same value:</p>
      <div>
        From:
        <input name="idx" value={fromInput} onChange={handleFromInputChange} />
        To:
        <input name="val" value={toInput} onChange={handleToInputChange} />
        Increment:
        <input
          name="inc"
          value={incrementInput}
          onChange={handleIncInputChange}
        />
        <Button
          text="Confirm"
          disabled={isAnimationPlaying}
          onClickCallback={handleConfirm}
        />
        <Button
          text="Back"
          disabled={isAnimationPlaying}
          onClickCallback={() => onBackClicked(0)}
        />
      </div>
    </div>
  );
}
