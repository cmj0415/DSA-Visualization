import { useState } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="menu-container">
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div />
        <div />
        <div />
      </div>

      {isOpen && (
        <div className="dropdown">
          <Link to="/segtree" onClick={() => setIsOpen(false)}>
            Segment Tree
          </Link>
        </div>
      )}
    </div>
  );
}
