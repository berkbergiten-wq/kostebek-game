import { useEffect, useState } from "react";

export default function SelectPlayerQuestionCard({
  isMole,
  question,
  players,
  selectedPlayerId,
  onSelectPlayer,
}) {
  const [selectedId, setSelectedId] = useState(selectedPlayerId || null);

  useEffect(() => {
    setSelectedId(selectedPlayerId || null);
  }, [selectedPlayerId]);

  return (
    <div className="shared-card yesno-question-card">
      {!isMole ? (
        <>
          <div className="yesno-question-title">SORU</div>

          <div className="yesno-question-box">
            {question || "-"}
          </div>
        </>
      ) : (
        <>
          <div className="yesno-mole-title">SEN KÖSTEBEKSİN</div>

          <div className="yesno-question-box yesno-question-box--mole">
            Rastgele bir seçim yap ve diğerlerini kandırmaya çalış!
          </div>
        </>
      )}

      <div className="select-player-grid">
        {players.map((player) => {
          const isSelected = selectedId === player.id;

          return (
            <button
              key={player.id}
              type="button"
              className={`select-player-option ${isSelected ? "is-selected" : ""}`}
              onClick={() => {
                setSelectedId(player.id);
                onSelectPlayer?.(player.id);
              }}
            >
              <img
                src={player.avatar}
                alt={player.name}
                className="select-player-option-avatar"
              />

              <div
                className="select-player-option-name"
                style={{ backgroundColor: player.color || "#3b82f6" }}
              >
                {player.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}