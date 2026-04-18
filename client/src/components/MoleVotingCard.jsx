export default function MoleVotingCard({
  players,
  onVotePlayer,
  selectedPlayerId,
}) {
  const getVotesForPlayer = (targetPlayerId) => {
    return players.filter((player) => player.moleVote === targetPlayerId);
  };

  return (
    <div className="shared-card mole-voting-card">
      <div className="mole-voting-title">KÖSTEBEĞİ SEÇ</div>

      <div className="mole-voting-panel">
        {players.map((targetPlayer, index) => {
          const receivedVotes = getVotesForPlayer(targetPlayer.id);
          const isSelected = selectedPlayerId === targetPlayer.id;

          return (
            <div
              key={targetPlayer.id}
              className={`mole-voting-row ${
                isSelected ? "is-selected" : ""
              }`}
            >
              <button
                type="button"
                className="mole-voting-name-button"
                onClick={() => onVotePlayer(targetPlayer.id)}
              >
                <div
                  className="mole-voting-name-tag"
                  style={{ backgroundColor: targetPlayer.color || "#3b82f6" }}
                >
                  {targetPlayer.name}
                </div>
              </button>

              <div className="mole-voting-votes-area">
                {receivedVotes.map((voter) => (
                  <div
                    key={voter.id}
                    className="mole-voting-mini-voter"
                    title={voter.name}
                  >
                    <img
                      src={voter.avatar}
                      alt={voter.name}
                      className="mole-voting-mini-avatar"
                    />
                    <div
                      className="mole-voting-mini-name"
                      style={{ backgroundColor: voter.color || "#3b82f6" }}
                    >
                      {voter.name}
                    </div>
                  </div>
                ))}
              </div>

              {index !== players.length - 1 && (
                <div className="mole-voting-divider" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}