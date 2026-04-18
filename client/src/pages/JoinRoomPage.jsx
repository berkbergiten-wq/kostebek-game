import { useEffect, useState } from "react";
import AvatarPicker from "../components/AvatarPicker";
import { avatars } from "../data/avatars";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import ThemeMusicPlayer from "../components/ThemeMusicPlayer";

export default function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [error, setError] = useState("");

  const [availableAvatars, setAvailableAvatars] = useState([]);
  

 const handleStep1Continue = () => {
    if (!roomCode.trim()) return;

    socket.emit("check_room", { roomCode });
    };

  const handleJoin = () => {
    if (!name.trim() || !selectedAvatar) return;

        setError("");

            console.log("SELECTED AVATAR =", selectedAvatar);
            console.log("KEYS =", Object.keys(selectedAvatar || {}));

            socket.emit("join_room", {
                roomCode: roomCode.trim().toUpperCase(),
                 name: name.trim(),
                avatar: selectedAvatar.neutral,
                color: selectedAvatar.color,
     });
    };

  const handleBackToStep1 = () => {
    setStep(1);
  };

 useEffect(() => {
    const handleCheckRoomSuccess = ({ availableAvatars }) => {
        console.log("SERVERDAN GELEN AVAILABLE AVATARS =", availableAvatars);
        setError("");
        setStep(2);

        // server’dan gelen avatarları kullan
        if (availableAvatars?.length > 0) {
            const mappedAvailableAvatars = avatars.filter((avatar) =>
                availableAvatars.includes(avatar.neutral)
            );

            setAvailableAvatars(mappedAvailableAvatars);
            setSelectedAvatar(mappedAvailableAvatars[0] || null);
            }
        };

    const handleJoinError = (message) => {
        setError(message);
    };

    const handleJoinSuccess = ({ roomCode }) => {
        console.log("JOIN SUCCESS:", roomCode);
        navigate(`/lobby/${roomCode}`);
    };

    socket.on("check_room_success", handleCheckRoomSuccess);
    socket.on("join_error", handleJoinError);
    socket.on("join_success", handleJoinSuccess);

    return () => {
        socket.off("check_room_success", handleCheckRoomSuccess);
        socket.off("join_error", handleJoinError);
        socket.off("join_success", handleJoinSuccess);
    };
    }, []);

  return (
    <div className="create-room-page join-room-page">
      <ThemeMusicPlayer enabled={true} />
        <div className="create-room-overlay" />

      <div className="create-room-inner join-room-inner">
        <div className="create-room-card join-room-card">
          <div className="create-room-stack">
            <h1 className="create-room-title">ODAYA KATIL</h1>

            {step === 1 && (
              <>
                <div className="create-room-label">ODA KODU</div>

                <input
                  type="text"
                  className="game-input join-room-code-input"
                  placeholder="ODA KODU"
                  value={roomCode}
                  onChange={(e) =>
                    setRoomCode(
                      e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                    )
                  }
                  maxLength={6}
                />
                {error && (
                    <div
                        style={{
                        marginBottom: "10px",
                        textAlign: "center",
                        fontWeight: 800,
                        color: "#ffb3b3",
                        }}
                    >
                        {error}
                    </div>
                    )}
                <button
                  className="home-main-btn join-room-main-btn"
                  onClick={handleStep1Continue}
                  disabled={!roomCode.trim()}
                >
                  DEVAM ET
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="create-room-label">Kullanıcı Adı</div>

                <input
                  type="text"
                  className="game-input"
                  placeholder="İsmini Gir"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                />

                <h2 className="section-title join-room-section-title">
                  KÖSTEBEĞİNİ SEÇ
                </h2>

                <AvatarPicker
                    selected={selectedAvatar}
                    onSelect={setSelectedAvatar}
                    avatarsOverride={availableAvatars}
                    />

                <div className="join-room-actions">
                  
                    {error && (
                        <div
                            style={{
                            marginBottom: 10,
                            textAlign: "center",
                            fontWeight: 800,
                            color: "#ffb3b3",
                            }}
                        >
                            {error}
                        </div>
                        )}
                  <button
                    className="home-main-btn join-room-main-btn"
                    onClick={handleJoin}
                    disabled={!name.trim() || !selectedAvatar}
                  >
                    KATIL
                  </button>
                  <button
                    className="join-room-secondary-btn"
                    onClick={handleBackToStep1}
                  >
                    GERİ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}