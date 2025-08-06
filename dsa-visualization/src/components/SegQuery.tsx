import { useState, useEffect } from "react";
import Button from "./Button";

type Props = {
  arrLen: number;
};

export default function SegQuery({ arrLen }: Props) {
  const [fromInput, setFromInput] = useState(0);
  const [toInput, setToInput] = useState(0);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);

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

  useEffect(() => {
    if (from < 1 || from >= arrLen || to < 1 || to >= arrLen) {
      alert("Out of range!");
    } else if (from > to) {
      alert("Starting index must be equal to or smaller than ending index");
    }
  }, [from, to]);

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
