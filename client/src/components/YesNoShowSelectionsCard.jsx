import SelectionPlayerCard from "./SelectionPlayerCard";

export default function YesNoShowSelectionsCard({
  question,
  players,
  me,
  onToggleReady,
}) {
  return (
    <div className="shared-card yesno-show-card">
      <div className="yesno-show-title">SORU</div>

      <div className="yesno-show-question-box">
        {question || "-"}
      </div>

      <div className="yesno-show-grid">
        {players.map((player) => {
          const answer = player.yesNoAnswer || "-";

          return (
            <SelectionPlayerCard
              key={player.id}
              player={player}
              answerText={answer === "YES" ? "EVET" : answer === "NO" ? "HAYIR" : "-"}
              answerClassName={
                answer === "YES"
                  ? "selection-answer-yes"
                  : answer === "NO"
                  ? "selection-answer-no"
                  : "selection-answer-empty"
              }
            />
          );
        })}
      </div>
      <div className="result-bottom-action">
        <button
          type="button"
          className={`result-ready-btn ${me?.showReady ? "is-selected" : ""}`}
          onClick={onToggleReady}
        >
          {me?.showReady ? "HAZIR" : "HAZIR"}
        </button>
      </div>
    </div>
  );
}