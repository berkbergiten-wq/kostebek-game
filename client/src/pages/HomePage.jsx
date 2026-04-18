import { useNavigate } from "react-router-dom";
import ThemeMusicPlayer from "../components/ThemeMusicPlayer";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <ThemeMusicPlayer enabled={true} />
      <div className="home-overlay" />

      <div className="home-inner">
        <div className="shared-card">
          <div className="home-main-actions">
            <button className="home-main-btn" onClick={() => navigate("/create")}>
              ODA OLUŞTUR
            </button>

            <button className="home-main-btn" onClick={() => navigate("/join")}>
              ODAYA KATIL
            </button>
          </div>

          <div className="home-links">
            <a
              href="https://skalacraft.com"
              target="_blank"
              rel="noreferrer"
              className="home-link-btn"
            >
              <img src="/skala-logo.png" alt="SkalaCraft" className="home-link-icon" />
              <span>skalacraft.com</span>
            </a>

            <a
              href="https://instagram.com/skalacrafttr"
              target="_blank"
              rel="noreferrer"
              className="home-link-btn"
            >
              <img src="/instagram-logo.png" alt="Instagram" className="home-link-icon" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div> 
    </div>
  );
}