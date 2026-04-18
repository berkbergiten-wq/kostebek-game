import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../socket";
import GameTopStatusCard from "../components/GameTopStatusCard";
import YesNoQuestionCard from "../components/YesNoQuestionCard";
import YesNoShowSelectionsCard from "../components/YesNoShowSelectionsCard";
import NumberInputQuestionCard from "../components/NumberInputQuestionCard";
import NumberShowSelectionsCard from "../components/NumberShowSelectionsCard";
import SelectPlayerQuestionCard from "../components/SelectPlayerQuestionCard";
import SelectPlayerShowSelectionsCard from "../components/SelectPlayerShowSelectionsCard";
import WordHuntQuestionCard from "../components/WordHuntQuestionCard";
import WordHuntShowSelectionsCard from "../components/WordHuntShowSelectionsCard";
import MoleVotingCard from "../components/MoleVotingCard";
import ResultCard from "../components/ResultCard";
import GameOverCard from "../components/GameOverCard";
import ThemeMusicPlayer from "../components/ThemeMusicPlayer";



export default function GamePage() {
  const location = useLocation();
  const roomCode = location.state?.roomCode || "";

  const [room, setRoom] = useState(null);
  const [mySocketId, setMySocketId] = useState(socket.id || "");
  const [lastResultSnapshot, setLastResultSnapshot] = useState(null);

  const countdownAudioRef = useRef(null);
  const countdownAudioUnlockedRef = useRef(false);

  useEffect(() => {
    const handleConnect = () => {
      setMySocketId(socket.id || "");
    };

    const handleRoomUpdate = (updatedRoom) => {
      setRoom(updatedRoom);

      if (updatedRoom.phase === "RESULT") {
        setLastResultSnapshot(updatedRoom);
      }

      console.log("GAME ROOM UPDATE:", updatedRoom);
    };

    socket.on("connect", handleConnect);
    socket.on("room_update", handleRoomUpdate);

    if (roomCode) {
      socket.emit("get_room_state", { roomCode });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room_update", handleRoomUpdate);
    };
  }, [roomCode]);

  useEffect(() => {
  if (!room) return;

  if (!countdownAudioRef.current) {
    countdownAudioRef.current = new Audio("/countdown.mp3");
    countdownAudioRef.current.volume = 0.6;
  }

  const audio = countdownAudioRef.current;

  const validPhases = [
    "START_COUNTDOWN",
    "QUESTION",
    "SHOW_SELECTIONS",
    "MOLE_VOTING",
  ];

  const shouldPlay =
    validPhases.includes(room.phase) &&
    room.timeLeft > 0 &&
    room.timeLeft <= 5;

  if (shouldPlay) {
    if (audio.paused) {
      audio.currentTime = 0;
      audio.play().catch(() => {
      const retryOnce = () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        window.removeEventListener("countdown-audio-unlocked", retryOnce);
      };

      window.addEventListener("countdown-audio-unlocked", retryOnce);
    });
    }
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}, [room?.timeLeft, room?.phase]);

useEffect(() => {
  const unlockAudio = () => {
    if (countdownAudioUnlockedRef.current) return;

    if (!countdownAudioRef.current) {
      countdownAudioRef.current = new Audio("/countdown.mp3");
      countdownAudioRef.current.volume = 0.6;
    }

    const audio = countdownAudioRef.current;
    audio.muted = true;

    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        countdownAudioUnlockedRef.current = true;
        window.dispatchEvent(new Event("countdown-audio-unlocked"));
      })
      .catch(() => {});
  };

  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });

  return () => {
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
}, []);

useEffect(() => {
  return () => {
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
      countdownAudioRef.current = null;
    }
  };
}, []);

  const me = useMemo(() => {
    return room?.players?.find((player) => player.id === mySocketId) || null;
  }, [room, mySocketId]);

  if (!roomCode) {
    return (
      <div className="game-page">
        <div className="game-overlay" />
        <div className="game-inner">
          <p className="game-loading-text">Room code bulunamadı.</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="game-page">
        <div className="game-overlay" />
        <div className="game-inner">
          <p className="game-loading-text">Oda verisi yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <ThemeMusicPlayer enabled={room.phase === "RESULT" || room.phase === "GAME_OVER"} />
      <div className="game-overlay" />

      <div className="game-inner">

        {/* ÜST KART */}
        {room.phase !== "RESULT" &&
          room.phase !== "START_COUNTDOWN" &&
          room.phase !== "GAME_OVER" && (
          <GameTopStatusCard
            me={me}
            roomCode={roomCode}
            round={room.round}
            maxRounds={room.maxRounds}
            timeLeft={room.timeLeft}
          />
        )}
        

        {/* QUESTION */}
        {/* YES_NO */}
        {room.phase === "QUESTION" &&
          room.currentQuestionType === "yes_no" && (
          <YesNoQuestionCard
            isMole={room.moleId === mySocketId}
            question={room.currentQuestion}
            onYes={() =>
              socket.emit("submit_yes_no", {
                roomCode,
                answer: "YES",
              })
            }
            onNo={() =>
              socket.emit("submit_yes_no", {
                roomCode,
                answer: "NO",
              })
            }
          />
          
        )}
        {/* NUMBER INPUT */}
        {room.phase === "QUESTION" &&
            room.currentQuestionType === "number_input" && (
            <NumberInputQuestionCard
                isMole={room.moleId === mySocketId}
                question={room.currentQuestion}
                initialValue={
                me?.numberAnswer === null || me?.numberAnswer === undefined
                    ? ""
                    : String(me.numberAnswer)
                }
                onChangeValue={(value) =>
                socket.emit("submit_number_answer", {
                    roomCode,
                    answer: value,
                })
                }
                onSubmitValue={(value) =>
                socket.emit("submit_number_answer", {
                    roomCode,
                    answer: value,
                })
                }
            />
            )}

            {/* SELECT PLAYER */}
          {room.phase === "QUESTION" &&
            room.currentQuestionType === "select_player" && (
              <SelectPlayerQuestionCard
                isMole={room.moleId === mySocketId}
                question={room.currentQuestion}
                players={room.players || []}
                selectedPlayerId={me?.vote || null}
                onSelectPlayer={(targetId) =>
                  socket.emit("submit_select_player", {
                    roomCode,
                    targetId,
                  })
                }
              />
          )}
           {/* WORD HUNT */}
          {room.phase === "QUESTION" &&
            room.currentQuestionType === "word_hunt" && (
              <WordHuntQuestionCard
                isMole={room.moleId === mySocketId}
                question={room.currentQuestion}
                players={room.players || []}
                activePlayerId={room.wordHuntActivePlayerId}
                meId={mySocketId}
                onSubmitValue={(value) =>
                  socket.emit("submit_word_hunt", {
                    roomCode,
                    word: value,
                  })
                }
              />
          )}

        {/* SHOW SELECTIONS */}
        {room.phase === "SHOW_SELECTIONS" &&
            room.currentQuestionType === "yes_no" && (
            <YesNoShowSelectionsCard
                question={room.currentQuestion}
                players={room.players || []}
            />
            )}

        {room.phase === "SHOW_SELECTIONS" &&
            room.currentQuestionType === "number_input" && (
                <NumberShowSelectionsCard
                question={room.currentQuestion}
                players={room.players || []}
                />
            )}
        {room.phase === "SHOW_SELECTIONS" &&
          room.currentQuestionType === "select_player" && (
            <SelectPlayerShowSelectionsCard
              question={room.currentQuestion}
              players={room.players || []}
            />
        )}
        {room.phase === "SHOW_SELECTIONS" &&
          room.currentQuestionType === "word_hunt" && (
            <WordHuntShowSelectionsCard
              question={room.currentQuestion}
              players={room.players || []}
            />
        )}
        {room.phase === "MOLE_VOTING" && (
          <MoleVotingCard
            players={room.players || []}
            selectedPlayerId={me?.moleVote || null}
            onVotePlayer={(targetId) =>
              socket.emit("vote_mole", {
                roomCode,
                targetId,
              })
            }
          />
        )}
       {room.phase === "RESULT" && (
          <ResultCard
            players={room.players || []}
            moleId={room.moleId}
            me={me}
            onToggleReady={() =>
              socket.emit("toggle_result_ready", {
                roomCode,
              })
            }
          />
        )}
        {room.phase === "GAME_OVER" && (
          <GameOverCard
            players={room.players || []}
          />
        )}

        {room.phase === "START_COUNTDOWN" && lastResultSnapshot && (
          <ResultCard
            players={lastResultSnapshot.players || []}
            moleId={lastResultSnapshot.moleId}
            me={
              lastResultSnapshot.players?.find(
                (player) => player.id === mySocketId
              ) || null
            }
            onToggleReady={() => {}}
            disableReadyButton={true}
          />
        )}
        {room.phase === "START_COUNTDOWN" && (
          <div className="countdown-overlay">
            <div className="countdown-box">
              <div className="countdown-title">TUR BAŞLIYOR</div>
              <div className="countdown-number">{room.timeLeft}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}