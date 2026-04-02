import { useState } from "react";
import Logo from "../logo/Logo";
import "./Header.css";
import { NavLink } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  let menuClass = "header-links";
  let burgerClass = "burger";
  if (menuOpen) {
    menuClass = menuClass + " open";
    burgerClass = burgerClass + " open";
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-top">
          <Logo />
          <button
            className={burgerClass}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <nav className={menuClass}>
          <NavLink
            to="/leagues"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
          >
            Лиги
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
          >
            Команды
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
