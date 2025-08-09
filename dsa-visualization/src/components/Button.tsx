import "./Button.css";

type ButtonProps = {
  text: string;
  disabled: boolean;
  onClickCallback: () => void;
};

export default function Button(props: ButtonProps) {
  return (
    <button
      className="button"
      disabled={props.disabled}
      onClick={() => props.onClickCallback()}
      style={{ cursor: props.disabled ? "not-allowed" : "pointer" }}
    >
      {props.text}
    </button>
  );
}
