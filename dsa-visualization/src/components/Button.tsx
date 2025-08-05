import "./Button.css";

type ButtonProps = {
  text: string;
  onClickCallback: () => void;
};

export default function Button(props: ButtonProps) {
  return (
    <button className="button" onClick={() => props.onClickCallback}>
      {props.text}
    </button>
  );
}
