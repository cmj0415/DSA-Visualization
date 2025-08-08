import { useState } from "react";
import Button from "./Button";
type Props = {
  onSubmit: (arr: number[]) => void;
};
export default function ArraySetup({ onSubmit }: Props) {
  const [arrayLength, setArrayLength] = useState<number>(4);
  const [inputValues, setInputValues] = useState<string[]>(Array(4).fill(""));

  const isNumber = (input: string): boolean => {
    for (let ch of input) {
      if (ch < "0" || ch > "9") return false;
    }
    return true;
  };
  const handleLengthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const length = Number(event.target.value);
    setArrayLength(length);
    setInputValues(Array(length).fill(""));
  };

  const handleInputChange = (index: number, value: string) => {
    const newInput = [...inputValues];
    newInput[index] = value;
    setInputValues(newInput);
  };

  const handleValueChange = () => {
    for (let i of inputValues) {
      if (!isNumber(i)) {
        alert("Please enter numbers!");
        return;
      } else if (Number(i) < -100 || Number(i) > 100) {
        alert("Please enter numbers between -100 and 100");
        return;
      }
    }
    const parsedValues = inputValues.map((value) => Number(value));
    onSubmit(parsedValues);
  };

  return (
    <div style={{ padding: "20px" }}>
      <label>
        Select array length and then enter the values：
        <select value={arrayLength} onChange={handleLengthChange}>
          {[...Array(5)].map((_, i) => (
            <option key={i} value={i + 4}>
              {i + 4}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
        {[...Array(arrayLength)].map((value, i) => (
          <input
            key={i}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(i, e.target.value)}
            style={{ width: "50px", textAlign: "center" }}
          />
        ))}
      </div>

      <Button text="Start!" onClickCallback={handleValueChange} />
    </div>
  );
}
