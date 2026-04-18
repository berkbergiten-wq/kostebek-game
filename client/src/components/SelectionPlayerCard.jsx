export default function SelectionPlayerCard({
  player,
  answerText,
  answerClassName = "",
}) {
  return (
    <div className="selection-player-card">
      <div className="selection-player-avatar-wrap">
        <img
          src={player.avatar}
          alt={player.name}
          className="selection-player-avatar"
        />
      </div>

      <div
        className="selection-player-name-tag"
        style={{ backgroundColor: player.color || "#3b82f6" }}
      >
        {player.name}
      </div>

      <div
        className={`selection-player-answer-tag ${answerClassName}`}
        style={{ whiteSpace: "pre-line" }}
      >
        {answerText}
      </div>
    </div>
  );
}