export default function GameTopStatusCard({
  me,
  roomCode,
  round,
  maxRounds,
  timeLeft,
}) {
  const accentColor = me?.color || "#f59e0b";

  return (
    <div className="shared-card game-top-card">
      <div className="game-top-card-grid">
        <div className="game-top-left">
          <div className="game-top-avatar-box">
            {me?.avatar ? (
              <img
                src={me.avatar}
                alt={me.name || "avatar"}
                className="game-top-avatar-image"
              />
            ) : null}
          </div>

          <div
            className="game-top-name-tag"
            style={{ background: accentColor }}
          >
            {me?.name || "-"}
          </div>
        </div>

        <div className="game-top-right">
          <div className="game-top-mini-row">
            <div
              className="game-top-mini-box"
              style={{ background: accentColor }}
            >
              <div className="game-top-mini-label">Oda Kodu</div>
              <div className="game-top-mini-value">{roomCode || "-"}</div>
            </div>

            <div
              className="game-top-mini-box"
              style={{ background: accentColor }}
            >
              <div className="game-top-mini-label">Tur</div>
              <div className="game-top-mini-value">
                {round || 1}/{maxRounds || 1}
              </div>
            </div>
          </div>

          <div className="game-top-timer-box">
            <div className="game-top-timer-label">Kalan Süre</div>
            <div className="game-top-timer-value">{timeLeft ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}