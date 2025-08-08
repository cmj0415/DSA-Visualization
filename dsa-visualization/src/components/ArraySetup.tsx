import { useState } from "react";
type Props = {
  onSubmit: (arr: number[]) => void;
};
export default function ArraySetup({ onSubmit }: Props) {
  const [arrayLength, setArrayLength] = useState<number>(4);
  const [arrayValues, setArrayValues] = useState<number[]>(Array(4).fill(0));

  const handleLengthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const length = Number(event.target.value);
    setArrayLength(length);
    setArrayValues(Array(length).fill(0));
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...arrayValues];
    newValues[index] = Number(value) || 0;
    setArrayValues(newValues);
  };

  const handleSubmit = () => {
    onSubmit(arrayValues);
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>設定陣列</h2>

      {/* 下拉選單 */}
      <label>
        陣列長度：
        <select value={arrayLength} onChange={handleLengthChange}>
          {[...Array(5)].map((_, i) => (
            <option key={i} value={i + 4}>
              {i + 4}
            </option>
          ))}
        </select>
      </label>

      {/* 動態生成輸入框 */}
      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
        {arrayValues.map((value, i) => (
          <input
            key={i}
            type="number"
            value={value}
            onChange={(e) => handleValueChange(i, e.target.value)}
            style={{ width: "50px", textAlign: "center" }}
          />
        ))}
      </div>

      {/* 提交按鈕 */}
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        開始視覺化
      </button>
    </div>
  );
}
