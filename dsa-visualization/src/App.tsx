import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Menu from "./components/Menu";
import HomeButton from "./components/HomeButton";
import Home from "./pages/Home";
import SegTree from "./pages/SegTree";

export default function App() {
  return (
    <BrowserRouter>
      <Menu />
      <HomeButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/segtree" element={<SegTree />} />
      </Routes>
    </BrowserRouter>
  );
}
