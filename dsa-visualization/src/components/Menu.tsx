import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import "./Menu.css";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="menu-container">
      <button className="menu-icon-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <AiOutlineMenuUnfold size={32} />
        ) : (
          <AiOutlineMenuFold size={32} />
        )}
      </button>

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
