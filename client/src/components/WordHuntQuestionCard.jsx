import { useEffect, useMemo, useState } from "react";
import SelectionPlayerCard from "./SelectionPlayerCard";

export default function WordHuntQuestionCard({
  isMole,
  question,
  players,
  activePlayerId,
  meId,
  onSubmitValue,
}) {
  const [value, setValue] = useState("");

  const isMyTurn = activePlayerId === meId;

  const orderedPlayers = useMemo(() => {
    return players || [];
  }, [players]);

  useEffect(() => {
    if (!isMyTurn) {
      setValue("");
    }
  }, [activePlayerId, isMyTurn]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    if (!isMyTurn) return;
    onSubmitValue?.(value);
    setValue("");
  };

  return (
    <div className="shared-card yesno-question-card wordhunt-question-card wordhunt-scale-wrap">
      {!isMole ? (
        <>
          <div className="wordhunt-question-title">KELİME</div>

          <div className="wordhunt-question-box">
            {question || "-"}
          </div>
        </>
      ) : (
        <>
          <div className="yesno-mole-title">SEN KÖSTEBEKSİN</div>

          <div className="wordhunt-question-box wordhunt-mole-box">
            Rastgele bir kelime yaz ve diğerlerini kandırmaya çalış!
          </div>
        </>
      )}

      <div className="wordhunt-input-row">
        <input
          type="text"
          placeholder={isMyTurn ? "Kelime Gir" : "Sıra sende değil"}
          value={value}
          onChange={handleChange}
          disabled={!isMyTurn}
          className={`number-input-field wordhunt-input-field ${
            !isMyTurn ? "wordhunt-input-field--disabled" : ""
          }`}
        />

        <button
          className={`number-submit-btn wordhunt-submit-btn ${
            !isMyTurn ? "wordhunt-submit-btn--disabled" : ""
          }`}
          onClick={handleSubmit}
          disabled={!isMyTurn}
        >
          GÖNDER
        </button>
      </div>

      <div className="wordhunt-players-grid">
        {orderedPlayers.map((p) => (
          <SelectionPlayerCard
            key={p.id}
            player={p}
            answerText={
              p.wordHuntAnswers?.length ? p.wordHuntAnswers.join("\n") : "-"
            }
            answerClassName={p.id === activePlayerId ? "wordhunt-active-player" : ""}
          />
        ))}
      </div>
    </div>
  );
}