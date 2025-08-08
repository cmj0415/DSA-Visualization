import { useState } from "react";
import Button from "./Button";

type Props = {
  arrLen: number;
  onTrigger: (idx: number, val: number) => void;
};

export default function SegUpdate({ arrLen, onTrigger }: Props) {
  const [selIndexInput, setSelIndexInput] = useState("");
  const [newValueInput, setNewValueInput] = useState("");

  const handleIdxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelIndexInput(event.target.value);
  };
  const handleValChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValueInput(event.target.value);
  };
  const handleConfirm = () => {
    const selIndex = parseInt(selIndexInput);
    const newValue = parseInt(newValueInput);

    if (selIndex < 1 || selIndex > arrLen) {
      alert("Out of range!");
    } else if (newValue < -100 || newValue > 100) {
      alert("Please enter a value between -100 and 100");
    } else {
      onTrigger(selIndex, newValue);
    }
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
        <Button text="Confirm" onClickCallback={handleConfirm} />
      </div>
    </div>
  );
}
