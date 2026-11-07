import { useEffect, useState } from "react";

const Header = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("invoice-theme") || "light");

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("invoice-theme", theme);
  }, [theme]);

  return (
    <header className="app-header">
      <a href="/" className="brand-mark" aria-label="Invoice home">
        <img src="/logo.svg" alt="" />
      </a>
      <div className="header-actions">
        <button
          className="theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <span className={`fa-regular ${theme === "light" ? "fa-moon" : "fa-sun"}`} aria-hidden="true" />
        </button>
        <div className="avatar-wrap"><img src="/avatar.jpg" alt="" /></div>
      </div>
    </header>
  );
};

export default Header;
