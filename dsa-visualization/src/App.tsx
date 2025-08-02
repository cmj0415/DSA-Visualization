import { useState } from "react";
import "./App.css";
import Menu from "./components/Menu";

export default function App() {
  return (
    <div>
      <Menu></Menu>
      <h1>Welcome to DSA Visualizer</h1>
      <p>Choose a DSA from the menu</p>
    </div>
  );
}
