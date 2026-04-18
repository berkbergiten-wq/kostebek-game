import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarPicker from "../components/AvatarPicker";
import { avatars } from "../data/avatars";
import { socket } from "../socket";
import ThemeMusicPlayer from "../components/ThemeMusicPlayer";

const roundOptions = [3, 4, 5, 6, 7, 8, 9, 10];

const categoryOptions = [
  {
    key: "mixed",
    label: "Karışık",
    image: "/category-karisik.png",
  },
  {
    key: "yes_no",
    label: "Eller Yukarı",
    image: "/category-eller-yukari.png",
  },
  {
    key: "number_input",
    label: "Parmak Say",
    image: "/category-parmak-say.png",
  },
  {
    key: "select_player",
    label: "Gösteri Zamanı",
    image: "/category-gosteri-zamani.png",
  },
  {
    key: "word_hunt",
    label: "Kelime Avı",
    image: "/category-kelime-avi.png",
  },
];

export default function CreateRoomPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [roundCount, setRoundCount] = useState(5);
  const [error, setError] = useState("");

  const selectedCategory = categoryOptions[selectedCategoryIndex];

  const goPrevCategory = () => {
    setSelectedCategoryIndex((prev) =>
      prev <= 0 ? categoryOptions.length - 1 : prev - 1
    );
  };

  const goNextCategory = () => {
    setSelectedCategoryIndex((prev) =>
      prev >= categoryOptions.length - 1 ? 0 : prev + 1
    );
  };

  const handleCreateRoom = () => {
    if (!name.trim() || !selectedAvatar) return;

    setError("");

    socket.emit("create_room", {
      name: name.trim(),
      avatar: selectedAvatar.neutral,
      color: selectedAvatar.color,
      gameCategory: selectedCategory.key,
      maxRounds: roundCount,
      maxPlayers: 6,
    });
  };

  useEffect(() => {
    const handleRoomCreated = ({ roomCode }) => {
      navigate(`/lobby/${roomCode}`);
    };

    const handleCreateRoomError = (message) => {
      setError(message);
    };

    socket.on("room_created", handleRoomCreated);
    socket.on("create_room_error", handleCreateRoomError);

    return () => {
      socket.off("room_created", handleRoomCreated);
      socket.off("create_room_error", handleCreateRoomError);
    };
  }, [navigate]);

  return (
    <div className="create-room-page">
      <ThemeMusicPlayer enabled={true} />
      <div className="create-room-overlay" />
      <div className="create-room-inner">
        <div className="create-room-card">
          <div className="create-room-stack">
            <h1 className="create-room-title">ODA OLUŞTUR</h1>

            <div className="create-room-label">KULLANICI ADI</div>

            <input
              type="text"
              placeholder="İsmini Gir"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="game-input"
              maxLength={20}
            />

            <div className="create-room-label">KATEGORİ</div>

            <div className="image-carousel-card">
              <button
                type="button"
                className="image-carousel-btn"
                onClick={goPrevCategory}
              >
                ‹
              </button>

              <div className="image-carousel-center">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.label}
                  className="image-carousel-image"
                />
              </div>

              <button
                type="button"
                className="image-carousel-btn"
                onClick={goNextCategory}
              >
                ›
              </button>
            </div>

            

            <div className="create-room-label">KÖSTEBEĞİNİ SEÇ</div>

            <AvatarPicker
              selected={selectedAvatar}
              onSelect={setSelectedAvatar}
            />

            <div className="create-room-label">TUR SAYISI</div>

            <div className="round-slider-card">
              <input
                type="range"
                min="3"
                max="10"
                step="1"
                value={roundCount}
                onChange={(e) => setRoundCount(Number(e.target.value))}
                className="round-slider"
              />

              <div className="round-options-row">
                {roundOptions.map((round) => (
                  <span
                    key={round}
                    className={`round-option ${
                      round === roundCount ? "active" : ""
                    }`}
                  >
                    {round}
                  </span>
                ))}
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginTop: 4,
                  marginBottom: 2,
                  textAlign: "center",
                  fontWeight: 800,
                  color: "#ffb3b3",
                }}
              >
                {error}
              </div>
            )}

            <button
              className="home-main-btn"
              disabled={!name.trim()}
              onClick={handleCreateRoom}
            >
              ODAYI OLUŞTUR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}