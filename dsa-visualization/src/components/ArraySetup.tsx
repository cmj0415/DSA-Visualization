import { useState } from "react";
import Button from "./Button";
import { isNumber } from "../utils/func.ts";
type Props = {
  onSubmit: (arr: number[]) => void;
  range: [number, number];
};
export default function ArraySetup({ onSubmit, range }: Props) {
  const [arrayLength, setArrayLength] = useState<number>(4);
  const [inputValues, setInputValues] = useState<string[]>(Array(4).fill(""));

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
        alert("Please enter integers!");
        return;
      } else if (Number(i) < -100 || Number(i) > 100) {
        alert("Please enter integers between -100 and 100");
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
          {[...Array(range[1] - range[0] + 1)].map((_, i) => (
            <option key={i} value={i + range[0]}>
              {i + range[0]}
            </option>
          ))}
        </select>
      </label>

      <div
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {[...Array(arrayLength)].map((_, i) => (
          <input
            key={i}
            type="text"
            value={inputValues[i]}
            onChange={(e) => handleInputChange(i, e.target.value)}
            style={{ width: "50px", textAlign: "center" }}
          />
        ))}
      </div>

      <Button
        text="Start!"
        disabled={false}
        onClickCallback={handleValueChange}
      />
    </div>
  );
}
