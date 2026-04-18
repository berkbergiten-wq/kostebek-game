export default function SelectPlayerShowSelectionsCard({
  question,
  players,
}) {
  const getPlayerById = (id) => players.find((p) => p.id === id);

  return (
    <div className="shared-card yesno-show-card">
      <div className="yesno-show-title">SORU</div>

      <div className="yesno-show-question-box">
        {question || "-"}
      </div>

      <div className="select-show-list">
        {players.map((player) => {
          const selectedPlayer = getPlayerById(player.vote);

          return (
            <div key={player.id} className="select-show-row">
              <div
                className="select-show-name-tag"
                style={{ backgroundColor: player.color || "#3b82f6" }}
              >
                {player.name}
              </div>

              <div className="select-show-arrow">➜</div>

              <div
                className="select-show-name-tag"
                style={{
                  backgroundColor: selectedPlayer?.color || "#666",
                }}
              >
                {selectedPlayer?.name || "-"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}