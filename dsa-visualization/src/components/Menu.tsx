import { useState } from "react";
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
          <a href="#">Segment Tree</a>
        </div>
      )}
    </div>
  );
}
