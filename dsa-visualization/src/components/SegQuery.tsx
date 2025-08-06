import { useState, useEffect } from "react";
import Button from "./Button";

type Props = {
  arrLen: number;
  onTrigger: () => void;
};

export default function SegQuery({ arrLen, onTrigger }: Props) {
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");

  const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromInput(event.target.value);
  };
  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToInput(event.target.value);
  };
  const handleConfirm = () => {
    const from = parseInt(fromInput);
    const to = parseInt(toInput);

    if (from < 1 || from > arrLen || to < 1 || to > arrLen) {
      alert("Out of range!");
    } else if (from > to) {
      alert("Starting index must be equal to or smaller than ending index");
    } else {
      onTrigger();
    }
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
