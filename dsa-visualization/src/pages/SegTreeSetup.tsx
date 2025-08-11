import { useNavigate } from "react-router-dom";
import ArraySetup from "../components/ArraySetup";

export default function SetupPage() {
  const navigate = useNavigate();

  return (
    <ArraySetup
      onSubmit={(arr) => {
        navigate("/segtree", { state: { initialArray: arr } });
      }}
      range={[4, 8]}
    />
  );
}
