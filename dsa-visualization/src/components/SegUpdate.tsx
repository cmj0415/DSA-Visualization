import { useState } from "react";
import Button from "./Button";
import { isNumber } from "../utils/func.ts";

type Props = {
  onTrigger: (idx: number, val: number) => void;
  onBackClicked: (mode: number) => void;
  isAnimationPlaying: boolean;
};

export default function SegUpdate({
  onTrigger,
  onBackClicked,
  isAnimationPlaying,
}: Props) {
  const [selIndexInput, setSelIndexInput] = useState("");
  const [newValueInput, setNewValueInput] = useState("");

  const handleIdxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelIndexInput(event.target.value);
  };
  const handleValChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValueInput(event.target.value);
  };
  const handleConfirm = () => {
    if (!isNumber(selIndexInput) || !isNumber(newValueInput)) {
      alert("Please enter integers!");
      return;
    }
    const selIndex = Number(selIndexInput);
    const newValue = Number(newValueInput);

    onTrigger(selIndex, newValue);
  };

  return (
    <div>
      <p>
        Enter the index of the element you want to change and the new value:
      </p>
      <div>
        Index:
        <input name="idx" value={selIndexInput} onChange={handleIdxChange} />
        New Value:
        <input name="val" value={newValueInput} onChange={handleValChange} />
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
