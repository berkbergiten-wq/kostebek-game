import { useNavigate } from "react-router-dom";

function getResultAvatarSrc(avatarSrc, mood) {
  if (!avatarSrc) return "";

  if (avatarSrc.endsWith(".png")) {
    return avatarSrc.replace(".png", `-${mood}.png`);
  }

  return avatarSrc;
}

export default function GameOverCard({ players }) {
  const navigate = useNavigate();

  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const winner = sorted[0] || null;
  const others = sorted.slice(1);

  return (
    <div className="shared-card result-card game-over-card">
      <div className="result-title">KAZANAN</div>

      {winner && (
        <>
          <div className="game-over-winner-wrap">
            <img
              src={getResultAvatarSrc(winner.avatar, "happy")}
              alt={winner.name}
              className="game-over-winner-avatar"
            />

            <div
              className="game-over-winner-name-tag"
              style={{ backgroundColor: winner.color || "#3b82f6" }}
            >
              {winner.name}
            </div>

            <div className="game-over-winner-score-tag">
              {winner.score || 0}
            </div>
          </div>

          <div className="result-divider" />
        </>
      )}

      <div className="game-over-grid">
        {others.map((player) => (
          <div key={player.id} className="game-over-player-card">
            <img
              src={getResultAvatarSrc(player.avatar, "sad")}
              alt={player.name}
              className="game-over-player-avatar"
            />

            <div
              className="game-over-player-name-tag"
              style={{ backgroundColor: player.color || "#3b82f6" }}
            >
              {player.name}
            </div>

            <div className="game-over-player-score-tag">
              {player.score || 0}
            </div>
          </div>
        ))}
      </div>

      <div className="result-bottom-action">
        <button
          type="button"
          className="result-ready-btn game-over-home-btn"
          onClick={() => navigate("/")}
        >
          ANA SAYFA
        </button>
      </div>
    </div>
  );
}