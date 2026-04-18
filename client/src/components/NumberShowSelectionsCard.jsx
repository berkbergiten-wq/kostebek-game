import SelectionPlayerCard from "./SelectionPlayerCard";

export default function NumberShowSelectionsCard({
  question,
  players,
}) {
  return (
    <div className="shared-card yesno-show-card">
      <div className="yesno-show-title">SORU</div>

      <div className="yesno-show-question-box">
        {question || "-"}
      </div>

      <div className="yesno-show-grid">
        {players.map((player) => {
          const answer =
            player.numberAnswer !== null && player.numberAnswer !== undefined
              ? String(player.numberAnswer)
              : "-";

          return (
            <SelectionPlayerCard
              key={player.id}
              player={player}
              answerText={answer}
              answerClassName={
                answer !== "-" ? "selection-answer-number" : "selection-answer-empty"
              }
            />
          );
        })}
      </div>
    </div>
  );
}