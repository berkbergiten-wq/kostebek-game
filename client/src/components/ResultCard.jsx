function getResultAvatarSrc(avatarSrc, mood) {
  if (!avatarSrc) return "";

  if (avatarSrc.endsWith(".png")) {
    return avatarSrc.replace(".png", `-${mood}.png`);
  }

  return avatarSrc;
}

function formatRoundPoints(points) {
  const safePoints = Number(points || 0);
  return safePoints > 0 ? `+${safePoints}` : "0";
}

export default function ResultCard({
  players,
  moleId,
  me,
  onToggleReady,
  disableReadyButton = false,
}) {
  const molePlayer = players.find((player) => player.id === moleId) || null;
  const otherPlayers = players.filter((player) => player.id !== moleId);

  return (
    <div className="shared-card result-card">
      <div className="result-title">KÖSTEBEK</div>

      {molePlayer && (
        <>
          <div className="result-mole-hero">
            <img
              src={getResultAvatarSrc(molePlayer.avatar, "happy")}
              alt={molePlayer.name}
              className="result-mole-hero-avatar"
            />

            <div className="result-mole-hero-right">
              <div
                className="result-mole-name-tag"
                style={{ backgroundColor: molePlayer.color || "#3b82f6" }}
              >
                {molePlayer.name}
              </div>

              <div className="result-mole-points-tag">
                {formatRoundPoints(molePlayer.roundPoints)}
              </div>
              <div
                className={`result-player-ready-tag ${
                  molePlayer.ready ? "is-ready" : "is-not-ready"
                }`}
              >
                {molePlayer.ready ? "HAZIR" : "BEKLİYOR"}
              </div>
            </div>
          </div>

          <div className="result-divider" />
        </>
      )}

      <div className="result-grid">
        {otherPlayers.map((player) => (
          <div key={player.id} className="result-player-card">
            <img
              src={getResultAvatarSrc(player.avatar, "sad")}
              alt={player.name}
              className="result-player-avatar"
            />

            <div
              className="result-player-name-tag"
              style={{ backgroundColor: player.color || "#3b82f6" }}
            >
              {player.name}
            </div>

            <div
              className={`result-player-ready-tag ${
                player.ready ? "is-ready" : "is-not-ready"
              }`}
            >
              {player.ready ? "HAZIR" : "BEKLİYOR"}
            </div>

            <div className="result-player-points-tag">
              {formatRoundPoints(player.roundPoints)}
            </div>
          </div>
        ))}
      </div>

      <div className="result-bottom-action">
        <button
          type="button"
          className={`result-ready-btn ${me?.ready ? "is-selected" : ""}`}
          onClick={onToggleReady}
          disabled={disableReadyButton}
        >
          {me?.ready ? "HAZIR" : "HAZIR"}
        </button>
      </div>
    </div>
  );
}