import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../socket";
import ThemeMusicPlayer from "../components/ThemeMusicPlayer";

export default function LobbyPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [category, setCategory] = useState("Karışık");
  const [mySocketId, setMySocketId] = useState("");
  const [phase, setPhase] = useState("LOBBY");
  const [timeLeft, setTimeLeft] = useState(0);
  const startCountdownAudioRef = useRef(null);
  

  useEffect(() => {
    setMySocketId(socket.id || "");

    const handleConnect = () => {
      setMySocketId(socket.id || "");
    };

    const handleRoomUpdate = (room) => {
      setPlayers(room.players || []);
      setCategory(room.gameCategory || "Karışık");
      setPhase(room.phase || "LOBBY");
      setTimeLeft(room.timeLeft ?? 0);

      if (room.phase === "QUESTION") {
        if (startCountdownAudioRef.current) {
          startCountdownAudioRef.current.pause();
          startCountdownAudioRef.current.currentTime = 0;
          startCountdownAudioRef.current = null;
        }

        navigate("/game", {
          state: { roomCode },
        });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("room_update", handleRoomUpdate);

    socket.emit("get_room_state", { roomCode });

    return () => {
  if (startCountdownAudioRef.current) {
    startCountdownAudioRef.current.pause();
    startCountdownAudioRef.current.currentTime = 0;
    startCountdownAudioRef.current = null;
  }

  socket.off("connect", handleConnect);
  socket.off("room_update", handleRoomUpdate);
};
  }, [roomCode, navigate]);

  const me = useMemo(
    () => players.find((player) => player.id === mySocketId),
    [players, mySocketId]
  );

  const handleReadyToggle = () => {
    socket.emit("toggle_ready", { roomCode });
  };

  const isHost = players.find((p) => p.id === mySocketId)?.isHost;

  const allReady =
    players.length > 0 &&
    players.every((p) => p.ready && p.connected);

  return (
    <div className="create-room-page lobby-page">
      <ThemeMusicPlayer enabled={phase === "LOBBY"} />
      <div className="create-room-overlay" />

      <div className="create-room-inner lobby-inner">
        <div className="create-room-card lobby-card">
          <div className="create-room-stack lobby-stack">
            <h1 className="create-room-title lobby-title">LOBI</h1>

            <div className="lobby-info-row">
              <div className="lobby-info-box">
                <span className="lobby-info-label">ODA</span>
                <span className="lobby-info-value">{roomCode}</span>
              </div>

              <div className="lobby-info-box">
                <span className="lobby-info-label">KATEGORİ</span>
                <span className="lobby-info-value">{category}</span>
              </div>
            </div>

            <div className="lobby-players-panel">
              <div className="lobby-panel-title">OYUNCULAR</div>

              <div className="lobby-players-grid">
                {players.map((player) => (
                  <div key={player.id} className="lobby-player-card">
                    <div className="lobby-player-avatar-wrap">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="lobby-player-avatar"
                      />
                    </div>

                    <div
                      className="lobby-player-name-tag"
                      style={{ backgroundColor: player.color || "#333" }}
                    >
                      {player.name}
                    </div>

                    <div
                      className={
                        player.ready
                          ? "lobby-player-status-tag is-ready"
                          : "lobby-player-status-tag is-not-ready"
                      }
                    >
                      {player.ready ? "Hazır" : "Hazır Değil"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lobby-bottom-action">
              <div className="lobby-bottom-action lobby-bottom-action--stack">
                <button className="lobby-ready-btn" onClick={handleReadyToggle}>
                  {me?.ready ? "HAZIR" : "HAZIR"}
                </button>

                {isHost && (
                  <button
                    className="lobby-start-btn"
                    onClick={() => {
                      console.log("START_GAME GİDİYOR:", roomCode);

                      startCountdownAudioRef.current = new Audio("/countdown.mp3");
                      startCountdownAudioRef.current.volume = 0.8;
                      startCountdownAudioRef.current.play().catch(() => {});

                      socket.emit("start_game", { roomCode });
                    }}
                    disabled={!allReady}
                    style={{
                      opacity: allReady ? 1 : 0.5,
                    }}
                  >
                    BAŞLAT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {phase === "START_COUNTDOWN" && (
        <div className="countdown-overlay">
          <div className="countdown-box">
            <div className="countdown-title">TUR BAŞLIYOR</div>
            <div className="countdown-number">{timeLeft}</div>
          </div>
        </div>
      )}
    </div>
  );
}