import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import "./Menu.css";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      <button className="menu-icon-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <AiOutlineMenuUnfold size={32} />
        ) : (
          <AiOutlineMenuFold size={32} />
        )}
      </button>

      {isOpen && (
        <div className="dropdown">
          <Link to="/arr-setup" onClick={() => setIsOpen(false)}>
            Segment Tree
          </Link>
        </div>
      )}
    </div>
  );
}
