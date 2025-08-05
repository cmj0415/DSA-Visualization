import { useState, useRef } from "react";
import Button from "./Button";

export default function SegQuery() {
  const [fromInput, setFromInput] = useState(0);
  const [toInput, setToInput] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromInput(parseInt(event.target.value));
  };
  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToInput(parseInt(event.target.value));
  };
  const handleConfirm = () => {
    setFrom(fromInput);
    setTo(toInput);
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
