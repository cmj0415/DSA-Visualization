type Props = {
  array: number[];
};

export default function ArrayDisplay({ array }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        marginTop: "50px",
        width: "30%",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "5px" }}>Current Array</div>
      <div style={{ display: "inline-flex" }}>
        {[...array]
          .filter((_, i) => i !== 0)
          .map((value, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "60px",
                backgroundColor: "#000000ff",
                border: "2px solid white",
                fontSize: "25px",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {value}
            </div>
          ))}
      </div>
    </div>
  );
}
