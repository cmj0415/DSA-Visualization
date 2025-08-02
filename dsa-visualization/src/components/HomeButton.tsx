import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./HomeButton.css";

export default function HomeButton() {
  return (
    <Link to="/" className="home-button">
      <FaHome size={32} color="white" />
    </Link>
  );
}
