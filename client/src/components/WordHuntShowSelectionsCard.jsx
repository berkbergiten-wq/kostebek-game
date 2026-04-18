import SelectionPlayerCard from "./SelectionPlayerCard";

export default function WordHuntShowSelectionsCard({
  question,
  players,
}) {
  return (
    <div className="shared-card yesno-show-card">
      <div className="yesno-show-title">KELİME</div>

      <div className="yesno-show-question-box">
        {question || "-"}
      </div>

      <div className="yesno-show-grid">
        {players.map((player) => {
          const answer =
            player.wordHuntAnswers?.length
              ? player.wordHuntAnswers.join("\n")
              : "-";

          return (
            <SelectionPlayerCard
              key={player.id}
              player={player}
              answerText={answer}
              answerClassName={
                answer !== "-"
                  ? "selection-answer-number"
                  : "selection-answer-empty"
              }
            />
          );
        })}
      </div>
    </div>
  );
}