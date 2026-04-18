import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`header ${isHome ? "header-home" : ""}`}>
      <img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt="Köstebek"
        className="header-logo"
      />
    </div>
  );
}