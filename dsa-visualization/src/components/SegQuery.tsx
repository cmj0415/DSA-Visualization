import { useState, useEffect } from "react";
import Button from "./Button";
import { isNumber } from "../utils/func.ts";
type Props = {
  onTrigger: (l: number, r: number) => void;
};

export default function SegQuery({ onTrigger }: Props) {
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");

  const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromInput(event.target.value);
  };
  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToInput(event.target.value);
  };
  const handleConfirm = () => {
    if (!isNumber(fromInput) || !isNumber(toInput)) {
      alert("Please enter integers!");
      return;
    }
    const from = Number(fromInput);
    const to = Number(toInput);

    onTrigger(from, to);
  };

  return (
    <div>
      <p>Enter the range you want to query:</p>
      <div>
        From:
        <input name="from" value={fromInput} onChange={handleFromChange} />
        To:
        <input name="to" value={toInput} onChange={handleToChange} />
        <Button text="Confirm" onClickCallback={handleConfirm} />
      </div>
    </div>
  );
}
