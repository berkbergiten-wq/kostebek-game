const { Server } = require("socket.io");

console.log("SERVER DOSYASI YÜKLENDİ");

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

console.log("SERVER ÇALIŞIYOR: 3001");

const rooms = {};

const yesNoQuestions = [
  "Bugüne kadar hiç evcil hayvanın oldu mu?",
  "Ailene hiç yalan söyledin mi?",
  "Hamur işi yemeyi sever misin?",
  "Herhangi bir sanat dalıyla uğraşır mısın?",
  "Köpekleri kedilerden daha çok sever misin?",
  "Bilgisayar oyunlarını sever misin?",
  "Tiktok kullanır mısın?",
  "Korku filmlerini sever misin?",
  "Şarkı söylemeyi sever misin?",
  "Bir müzik aleti çalar mısın?",
  "Kitap okumayı sever misin?",
  "Çizgi film izlemeyi sever misin?",
  "Şu anki hayatından memnun musun?",
  "Daha önce hiç kaza yaptın mı?",
  "Hiç uçağa bindin mi?",
  "Son 1 yıl içinde yurtdışına gittin mi?"
];

const numberQuestions = [
  "Bugüne kadar kaç sevgilin oldu?",
  "Günde kaç saat telefon kullanıyorsun?",
  "Haftada kaç gün spor yapıyorsun?",
  "Ayda kaç film izliyorsun?",
  "Günde kaç kahve içiyorsun?",
  "Bir günde maksimum kaç saat uyudun?",
];

const selectPlayerQuestions = [
  "Aranızdaki en kilolu kişiyi seç!",
  "Aranızdaki en komik kişiyi seç!",
  "Aranızdaki en dağınık kişiyi seç!",
  "Aranızdaki en çok uyuyan kişiyi seç!",
  "Aranızdaki en tembel kişiyi seç!",
  "Aranızdaki en çok konuşan kişiyi seç!",
];

const wordHuntWords = [
  "Afrodizyak",
  "Makarna",
  "Volkan",
  "Dedektif",
  "Korsan",
  "Pusula",
  "Sirk",
  "Kaktüs",
  "Labirent",
  "Fırtına",
  "Kütüphane",
  "Balon",
  "Galaksi",
  "Heykel",
  "Teleskop",
  "Maraton",
];

function getRandomWordHuntWord() {
  const randomIndex = Math.floor(Math.random() * wordHuntWords.length);
  return wordHuntWords[randomIndex];
}

function getRandomYesNoQuestion() {
  const randomIndex = Math.floor(Math.random() * yesNoQuestions.length);
  return yesNoQuestions[randomIndex];
}

function getRandomNumberQuestion() {
  const randomIndex = Math.floor(Math.random() * numberQuestions.length);
  return numberQuestions[randomIndex];
}

function getRandomSelectPlayerQuestion() {
  const randomIndex = Math.floor(Math.random() * selectPlayerQuestions.length);
  return selectPlayerQuestions[randomIndex];
}

function setupRoundQuestion(room) {
  let selectedCategory = room.gameCategory;

  if (selectedCategory === "mixed") {
    const mixedCategories = [
      "yes_no",
      "number_input",
      "select_player",
      "word_hunt",
    ];

    const randomIndex = Math.floor(Math.random() * mixedCategories.length);
    selectedCategory = mixedCategories[randomIndex];
  }

  if (selectedCategory === "yes_no") {
    room.currentQuestion = getRandomYesNoQuestion();
    room.currentQuestionType = "yes_no";
  }

  if (selectedCategory === "number_input") {
    room.currentQuestion = getRandomNumberQuestion();
    room.currentQuestionType = "number_input";
  }

  if (selectedCategory === "select_player") {
    room.currentQuestion = getRandomSelectPlayerQuestion();
    room.currentQuestionType = "select_player";
  }

  if (selectedCategory === "word_hunt") {
    room.currentQuestion = getRandomWordHuntWord();
    room.currentQuestionType = "word_hunt";
  }

  if (room.currentQuestionType === "word_hunt") {
    const shuffled = [...room.players].sort(() => Math.random() - 0.5);

    room.wordHuntTurnOrder = shuffled.map((p) => p.id);
    room.wordHuntCurrentTurnIndex = 0;
    room.wordHuntRoundCycle = 1;
    room.wordHuntActivePlayerId = room.wordHuntTurnOrder[0];

    room.players.forEach((p) => {
      p.wordHuntDraft = "";
      p.wordHuntAnswers = [];
    });
  }
}

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getSafeRoom(room) {
  const {
    countdownTimer,
    questionTimer,
    showTimer,
    votingTimer,
    ...safeRoom
  } = room;

  return {
    ...safeRoom,
    players: room.players.map((player) => ({
      ...player,
    })),
  };
}

function advanceWordHuntTurn(room, roomCode) {


  // sıradaki index
  room.wordHuntCurrentTurnIndex += 1;

  // sıra bitti mi?
  if (room.wordHuntCurrentTurnIndex >= room.wordHuntTurnOrder.length) {
    room.wordHuntCurrentTurnIndex = 0;
    room.wordHuntRoundCycle += 1;
  }

  // 2 tur tamamlandıysa → SHOW_SELECTIONS
  if (room.wordHuntRoundCycle > 2) {
    room.phase = "SHOW_SELECTIONS";
    room.timeLeft = 10;

    io.to(roomCode).emit("room_update", getSafeRoom(room));
    return;
  }

  // yeni aktif oyuncu
  const nextPlayerId =
    room.wordHuntTurnOrder[room.wordHuntCurrentTurnIndex];

  room.wordHuntActivePlayerId = nextPlayerId;

  // süre reset
  room.timeLeft = 30;

  io.to(roomCode).emit("room_update", getSafeRoom(room));
}

io.on("connection", (socket) => {
  console.log("bağlandı:", socket.id);

  // CREATE ROOM
  socket.on("create_room", (data) => {
    const roomCode = generateRoomCode();

    rooms[roomCode] = {
      players: [
        {
          id: socket.id,
          name: data.name,
          avatar: data.avatar,
          color: data.color,
          isHost: true,
          ready: false,
          connected: true,
          score: 0,
          roundPoints: 0,
          moleVote: null,
          vote: null,
          yesNoAnswer: "",
          numberAnswer: null,
          wordHuntDraft: "",
          wordHuntAnswers: [],
        }
      ],

      phase: "LOBBY",
      round: 0,
      maxRounds: data.maxRounds,
      maxPlayers: data.maxPlayers,
      gameCategory: data.gameCategory,

      moleId: null,
      currentQuestion: null,
      currentQuestionType: null,
      timeLeft: 0,

      wordHuntTurnOrder: [],
      wordHuntCurrentTurnIndex: 0,
      wordHuntRoundCycle: 1,
      wordHuntActivePlayerId: null,

      countdownTimer: null,
      questionTimer: null,
      showTimer: null,
      votingTimer: null,
    };

    socket.join(roomCode);

    socket.emit("room_created", { roomCode });
    io.to(roomCode).emit("room_update", getSafeRoom(rooms[roomCode]));

    console.log("oda oluşturuldu:", roomCode);
  });

  // CHECK ROOM
  socket.on("check_room", ({ roomCode }) => {
    const normalizedRoomCode = (roomCode || "").trim().toUpperCase();
    const room = rooms[normalizedRoomCode];

    if (!room) {
      socket.emit("join_error", "Oda bulunamadı");
      return;
    }

    const usedAvatars = room.players.map((player) => player.avatar);

    const allAvatars = [
      "/avatars/avatar1.png",
      "/avatars/avatar2.png",
      "/avatars/avatar3.png",
      "/avatars/avatar4.png",
      "/avatars/avatar5.png",
      "/avatars/avatar6.png",
      "/avatars/avatar7.png",
      "/avatars/avatar8.png",
    ];

    const availableAvatars = allAvatars.filter(
      (avatar) => !usedAvatars.includes(avatar)
    );

    socket.emit("check_room_success", { availableAvatars });
  });

  // JOIN ROOM
  socket.on("join_room", (data) => {
    const room = rooms[data.roomCode];

    if (!room) {
      socket.emit("join_error", { message: "Oda bulunamadı" });
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      socket.emit("join_error", { message: "Oda dolu" });
      return;
    }

    const alreadyInRoom = room.players.some((player) => player.id === socket.id);
    if (alreadyInRoom) {
      socket.emit("join_success", { roomCode: data.roomCode });
      io.to(data.roomCode).emit("room_update", getSafeRoom(room));
      return;
    }

    room.players.push({
      id: socket.id,
      name: data.name,
      avatar: data.avatar,
      color: data.color,
      isHost: false,
      ready: false,
      connected: true,
      score: 0,
      roundPoints: 0,
      moleVote: null,
      vote: null,
      yesNoAnswer: "",
      numberAnswer: null,
      wordHuntDraft: "",
      wordHuntAnswers: [],
    });

    socket.join(data.roomCode);

    socket.emit("join_success", { roomCode: data.roomCode });
    io.to(data.roomCode).emit("room_update", getSafeRoom(room));

    console.log("oyuncu katıldı:", data.roomCode);
  });

  // GET ROOM STATE
  socket.on("get_room_state", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    socket.emit("room_update", getSafeRoom(room));
  });

  // TOGGLE READY
  socket.on("toggle_ready", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    player.ready = !player.ready;

    io.to(roomCode).emit("room_update", getSafeRoom(room));
  });

  

  // START GAME
  socket.on("start_game", ({ roomCode }) => {
    console.log("START_GAME GELDİ:", roomCode, socket.id);

    const room = rooms[roomCode];
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;

    const allReady =
      room.players.length > 0 &&
      room.players.every((p) => p.ready && p.connected);

    if (!allReady) return;

    room.phase = "START_COUNTDOWN";
    room.round = 1;
    room.timeLeft = 3;

    io.to(roomCode).emit("room_update", getSafeRoom(room));

     room.countdownTimer = setInterval(() => {
      room.timeLeft -= 1;

      if (room.timeLeft <= 0) {
        clearInterval(room.countdownTimer);
        room.countdownTimer = null;

        // 1) KÖSTEBEK SEÇ
        const randomIndex = Math.floor(Math.random() * room.players.length);
        const molePlayer = room.players[randomIndex];
        room.moleId = molePlayer.id;

                setupRoundQuestion(room);

        room.phase = "QUESTION";
        room.timeLeft = room.currentQuestionType === "word_hunt" ? 30 : 10;

          io.to(roomCode).emit("room_update", getSafeRoom(room));
          if (room.questionTimer) {
  clearInterval(room.questionTimer);
  room.questionTimer = null;
}
        room.questionTimer = setInterval(() => {
            room.timeLeft -= 1;

            if (room.timeLeft <= 0) {
            if (room.currentQuestionType === "word_hunt") {
                const activePlayer = room.players.find(
                  (p) => p.id === room.wordHuntActivePlayerId
                );

                if (activePlayer) {
                  const draft = (activePlayer.wordHuntDraft || "").trim();

                  if (draft !== "") {
                    activePlayer.wordHuntAnswers.push(draft);
                  }

                  activePlayer.wordHuntDraft = "";
                }

                advanceWordHuntTurn(room, roomCode);

                if (room.phase === "SHOW_SELECTIONS") {
                  if (room.questionTimer) {
                    clearInterval(room.questionTimer);
                    room.questionTimer = null;
                  }
                  if (room.showTimer) {
                    clearInterval(room.showTimer);
                    room.showTimer = null;
                  }

                  if (room.votingTimer) {
                    clearInterval(room.votingTimer);
                    room.votingTimer = null;
                  }
                  clearInterval(room.questionTimer);
                  room.questionTimer = null;

                  room.showTimer = setInterval(() => {
                    room.timeLeft -= 1;

                    if (room.timeLeft <= 0) {
                      clearInterval(room.showTimer);
                      room.showTimer = null;

                      room.phase = "MOLE_VOTING";
                      room.timeLeft = 15;

                      io.to(roomCode).emit("room_update", getSafeRoom(room));

                      room.votingTimer = setInterval(() => {
                        room.timeLeft -= 1;

                        if (room.timeLeft <= 0) {
                          clearInterval(room.votingTimer);
                          room.votingTimer = null;

                          const moleId = room.moleId;

                          room.players.forEach((player) => {
                            player.roundPoints = 0;
                            player.ready = false;
                          });

                          const molePlayer = room.players.find((p) => p.id === moleId);

                          if (molePlayer) {
                            const wrongVotesCount = room.players.filter(
                              (p) => p.id !== moleId && p.moleVote !== moleId
                            ).length;

                            molePlayer.roundPoints = wrongVotesCount;
                            molePlayer.score += wrongVotesCount;
                          }

                          room.players.forEach((player) => {
                            if (player.id !== moleId && player.moleVote === moleId) {
                              player.roundPoints = 1;
                              player.score += 1;
                            }
                          });

                          room.phase = "RESULT";
                          room.timeLeft = 0;

                          io.to(roomCode).emit("room_update", getSafeRoom(room));
                          return;
                        }

                        io.to(roomCode).emit("room_update", getSafeRoom(room));
                      }, 1000);

                      return;
                    }

                    io.to(roomCode).emit("room_update", getSafeRoom(room));
                  }, 1000);
                }

                return;
              }

              clearInterval(room.questionTimer);
              room.questionTimer = null;

              room.phase = "SHOW_SELECTIONS";
              room.timeLeft = 10;

              const showTimer = setInterval(() => {
                room.timeLeft -= 1;

                if (room.timeLeft <= 0) {
                  clearInterval(showTimer);

                  room.phase = "MOLE_VOTING";
                  room.timeLeft = 15;

                  io.to(roomCode).emit("room_update", getSafeRoom(room));

                  const votingTimer = setInterval(() => {
                    room.timeLeft -= 1;

                    if (room.timeLeft <= 0) {
                      clearInterval(votingTimer);

                      const moleId = room.moleId;

                      room.players.forEach((player) => {
                        player.roundPoints = 0;
                        player.ready = false;
                      });

                      const molePlayer = room.players.find((p) => p.id === moleId);

                      if (molePlayer) {
                        const wrongVotesCount = room.players.filter(
                          (p) => p.id !== moleId && p.moleVote !== moleId
                        ).length;

                        molePlayer.roundPoints = wrongVotesCount;
                        molePlayer.score += wrongVotesCount;
                      }

                      room.players.forEach((player) => {
                        if (player.id !== moleId && player.moleVote === moleId) {
                          player.roundPoints = 1;
                          player.score += 1;
                        }
                      });

                      room.phase = "RESULT";
                      room.timeLeft = 0;

                      io.to(roomCode).emit("room_update", getSafeRoom(room));
                      return;
                    }

                    io.to(roomCode).emit("room_update", getSafeRoom(room));
                  }, 1000);

                  return;
                }

                io.to(roomCode).emit("room_update", getSafeRoom(room));
              }, 1000);

              io.to(roomCode).emit("room_update", getSafeRoom(room));
              return;
            }

            io.to(roomCode).emit("room_update", getSafeRoom(room));
          }, 1000);

          return;
        room.timeLeft = 0;

        io.to(roomCode).emit("room_update", getSafeRoom(room));
        return;
      }

      io.to(roomCode).emit("room_update", getSafeRoom(room));
    }, 1000);
  });

  // YES / NO ANSWER
      socket.on("submit_yes_no", ({ roomCode, answer }) => {
          console.log("CEVAP GELDİ:", roomCode, answer);
        const room = rooms[roomCode];
        if (!room) return;

        const player = room.players.find((p) => p.id === socket.id);
        if (!player) return;

        player.yesNoAnswer = answer;

        io.to(roomCode).emit("room_update", getSafeRoom(room));
      });

  // MOLE VOTE
  socket.on("vote_mole", ({ roomCode, targetId }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    player.moleVote = targetId;

    io.to(roomCode).emit("room_update", getSafeRoom(room));
  });

  // NUMBER ANSWER
socket.on("submit_number_answer", ({ roomCode, answer }) => {
  const room = rooms[roomCode];
  if (!room) return;

  const player = room.players.find((p) => p.id === socket.id);
  if (!player) return;

  player.numberAnswer =
    answer === "" || answer === null || answer === undefined
      ? null
      : Number(answer);

  io.to(roomCode).emit("room_update", getSafeRoom(room));
});

// SELECT PLAYER ANSWER
socket.on("submit_select_player", ({ roomCode, targetId }) => {
  const room = rooms[roomCode];
  if (!room) return;

  const player = room.players.find((p) => p.id === socket.id);
  if (!player) return;

  player.vote = targetId;

  io.to(roomCode).emit("room_update", getSafeRoom(room));
});

socket.on("submit_word_hunt", ({ roomCode, word }) => {
  const room = rooms[roomCode];
  if (!room || room.currentQuestionType !== "word_hunt") return;

  const player = room.players.find((p) => p.id === socket.id);
  if (!player) return;

  // sadece aktif oyuncu yazabilir
  if (room.wordHuntActivePlayerId !== socket.id) return;

  const cleanWord = (word || "").trim();

  // draft kaydet
  player.wordHuntDraft = cleanWord;

  // answers listesine ekle (boş değilse)
  if (cleanWord !== "") {
    player.wordHuntAnswers.push(cleanWord);
  }

      player.wordHuntDraft = "";
  advanceWordHuntTurn(room, roomCode);
  if (room.phase === "SHOW_SELECTIONS") {
  if (room.questionTimer) {
    clearInterval(room.questionTimer);
    room.questionTimer = null;
  }

  if (room.showTimer) {
    clearInterval(room.showTimer);
    room.showTimer = null;
  }

  if (room.votingTimer) {
    clearInterval(room.votingTimer);
    room.votingTimer = null;
  }

  room.showTimer = setInterval(() => {
    room.timeLeft -= 1;

    if (room.timeLeft <= 0) {
      clearInterval(room.showTimer);
      room.showTimer = null;

      room.phase = "MOLE_VOTING";
      room.timeLeft = 15;

      io.to(roomCode).emit("room_update", getSafeRoom(room));

      room.votingTimer = setInterval(() => {
        room.timeLeft -= 1;

        if (room.timeLeft <= 0) {
          clearInterval(room.votingTimer);
          room.votingTimer = null;

          const moleId = room.moleId;

          room.players.forEach((player) => {
            player.roundPoints = 0;
            player.ready = false;
          });

          const molePlayer = room.players.find((p) => p.id === moleId);

          if (molePlayer) {
            const wrongVotesCount = room.players.filter(
              (p) => p.id !== moleId && p.moleVote !== moleId
            ).length;

            molePlayer.roundPoints = wrongVotesCount;
            molePlayer.score += wrongVotesCount;
          }

          room.players.forEach((player) => {
            if (player.id !== moleId && player.moleVote === moleId) {
              player.roundPoints = 1;
              player.score += 1;
            }
          });

          room.phase = "RESULT";
          room.timeLeft = 0;

          io.to(roomCode).emit("room_update", getSafeRoom(room));
          return;
        }

        io.to(roomCode).emit("room_update", getSafeRoom(room));
      }, 1000);

      return;
    }

    io.to(roomCode).emit("room_update", getSafeRoom(room));
  }, 1000);
}

  
  });

  // RESULT READY
socket.on("toggle_result_ready", ({ roomCode }) => {
  const room = rooms[roomCode];
  if (!room || room.phase !== "RESULT") return;

  const player = room.players.find((p) => p.id === socket.id);
  if (!player) return;

  player.ready = !player.ready;

  io.to(roomCode).emit("room_update", getSafeRoom(room));

  const allReady =
    room.players.length > 0 &&
    room.players.every((p) => p.ready);

  if (!allReady) return;

  const isLastRound = room.round >= room.maxRounds;

  if (isLastRound) {
    room.phase = "GAME_OVER";
    io.to(roomCode).emit("room_update", getSafeRoom(room));
    return;
  }

  room.players.forEach((p) => {
    p.ready = false;
    p.moleVote = null;
    p.vote = null;
    p.yesNoAnswer = "";
    p.numberAnswer = null;
    p.roundPoints = 0;
  });

  room.round += 1;
  room.moleId = null;
  room.currentQuestion = null;
  room.currentQuestionType = null;
  room.phase = "START_COUNTDOWN";
  room.timeLeft = 3;

  io.to(roomCode).emit("room_update", getSafeRoom(room));

  room.countdownTimer = setInterval(() => {
    room.timeLeft -= 1;

    if (room.timeLeft <= 0) {
      clearInterval(room.countdownTimer);
      room.countdownTimer = null;

      const randomIndex = Math.floor(Math.random() * room.players.length);
      const molePlayer = room.players[randomIndex];
      room.moleId = molePlayer.id;

      setupRoundQuestion(room);

      room.phase = "QUESTION";
      room.timeLeft = room.currentQuestionType === "word_hunt" ? 30 : 10;

      io.to(roomCode).emit("room_update", getSafeRoom(room));
      if (room.questionTimer) {
  clearInterval(room.questionTimer);
  room.questionTimer = null;
}
      room.questionTimer = setInterval(() => {
        room.timeLeft -= 1;

        if (room.timeLeft <= 0) {
                  if (room.currentQuestionType === "word_hunt") {
            const activePlayer = room.players.find(
              (p) => p.id === room.wordHuntActivePlayerId
            );

            if (activePlayer) {
              const draft = (activePlayer.wordHuntDraft || "").trim();

              if (draft !== "") {
                activePlayer.wordHuntAnswers.push(draft);
              }

              activePlayer.wordHuntDraft = "";
            }

            advanceWordHuntTurn(room, roomCode);

            if (room.phase === "SHOW_SELECTIONS") {
              clearInterval(room.questionTimer);
              room.questionTimer = null;

              if (room.showTimer) {
                clearInterval(room.showTimer);
                room.showTimer = null;
              }

              room.showTimer = setInterval(() => {
                room.timeLeft -= 1;

                if (room.timeLeft <= 0) {
                  clearInterval(room.showTimer);
                  room.showTimer = null;

                  room.phase = "MOLE_VOTING";
                  room.timeLeft = 15;

                  io.to(roomCode).emit("room_update", getSafeRoom(room));

                  if (room.votingTimer) {
                    clearInterval(room.votingTimer);
                    room.votingTimer = null;
                  }

                  room.votingTimer = setInterval(() => {
                    room.timeLeft -= 1;

                    if (room.timeLeft <= 0) {
                      clearInterval(room.votingTimer);
                      room.votingTimer = null;

                      const moleId = room.moleId;

                      room.players.forEach((player) => {
                        player.roundPoints = 0;
                        player.ready = false;
                      });

                      const molePlayer = room.players.find((p) => p.id === moleId);

                      if (molePlayer) {
                        const wrongVotesCount = room.players.filter(
                          (p) => p.id !== moleId && p.moleVote !== moleId
                        ).length;

                        molePlayer.roundPoints = wrongVotesCount;
                        molePlayer.score += wrongVotesCount;
                      }

                      room.players.forEach((player) => {
                        if (player.id !== moleId && player.moleVote === moleId) {
                          player.roundPoints = 1;
                          player.score += 1;
                        }
                      });

                      room.phase = "RESULT";
                      room.timeLeft = 0;

                      io.to(roomCode).emit("room_update", getSafeRoom(room));
                      return;
                    }

                    io.to(roomCode).emit("room_update", getSafeRoom(room));
                  }, 1000);

                  return;
                }

                io.to(roomCode).emit("room_update", getSafeRoom(room));
              }, 1000);
            }

            return;
          }

          clearInterval(room.questionTimer);
          room.questionTimer = null;

          room.phase = "SHOW_SELECTIONS";
          room.timeLeft = 10;

          io.to(roomCode).emit("room_update", getSafeRoom(room));

          room.showTimer = setInterval(() => {
            room.timeLeft -= 1;

            if (room.timeLeft <= 0) {
              clearInterval(room.showTimer);
              room.showTimer = null;

              room.phase = "MOLE_VOTING";
              room.timeLeft = 15;

              io.to(roomCode).emit("room_update", getSafeRoom(room));

              room.votingTimer = setInterval(() => {
                room.timeLeft -= 1;

                if (room.timeLeft <= 0) {
                  clearInterval(room.votingTimer);
                  room.votingTimer = null;

                  const moleId = room.moleId;

                  room.players.forEach((player) => {
                    player.roundPoints = 0;
                    player.ready = false;
                  });

                  const molePlayer = room.players.find((p) => p.id === moleId);

                  if (molePlayer) {
                    const wrongVotesCount = room.players.filter(
                      (p) => p.id !== moleId && p.moleVote !== moleId
                    ).length;

                    molePlayer.roundPoints = wrongVotesCount;
                    molePlayer.score += wrongVotesCount;
                  }

                  room.players.forEach((player) => {
                    if (player.id !== moleId && player.moleVote === moleId) {
                      player.roundPoints = 1;
                      player.score += 1;
                    }
                  });

                  room.phase = "RESULT";
                  room.timeLeft = 0;

                  io.to(roomCode).emit("room_update", getSafeRoom(room));
                  return;
                }

                io.to(roomCode).emit("room_update", getSafeRoom(room));
              }, 1000);

              return;
            }

            io.to(roomCode).emit("room_update", getSafeRoom(room));
          }, 1000);

          return;
        }

        io.to(roomCode).emit("room_update", getSafeRoom(room));
      }, 1000);

      return;
    }

    io.to(roomCode).emit("room_update", getSafeRoom(room));
  }, 1000);
});

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("ayrıldı:", socket.id);

    Object.keys(rooms).forEach((roomCode) => {
      const room = rooms[roomCode];
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;

      player.connected = false;

      io.to(roomCode).emit("room_update", getSafeRoom(room));
    });
  });
});