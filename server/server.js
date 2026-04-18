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
  "Günde ortalama kaç saat uyuyorsun?",
  "Günde kaç saat telefon kullanıyorsun?",
  "Haftada kaç gün spor yapıyorsun?",
  "Günde kaç kahve içiyorsun?",
  "Günde kaç öğün yemek yiyorsun?",
  "Haftada kaç gün dışarı çıkıyorsun?",
  "Günde kaç kez sosyal medyaya giriyorsun?",
  "Günde kaç saat müzik dinliyorsun?",
  "Haftada kaç film izliyorsun?",
  "Haftada kaç gün duş alıyorsun?",

  "Günde kaç bardak su içiyorsun?",
  "Günde kaç kez aynaya bakıyorsun?",
  "Haftada kaç gün erken kalkıyorsun?",
  "Günde kaç saat ders çalışıyorsun?",
  "Haftada kaç gün geç yatıyorsun?",
  "Günde kaç saat bilgisayar başındasın?",
  "Haftada kaç kez dışarıdan yemek söylüyorsun?",
  "Günde kaç kez mesaj atıyorsun?",
  "Haftada kaç gün arkadaşlarınla buluşuyorsun?",
  "Günde kaç kez kahkaha atıyorsun?",

  "Günde kaç saat yalnız kalıyorsun?",
  "Haftada kaç gün yürüyüş yapıyorsun?",
  "Günde kaç saat dizi izliyorsun?",
  "Haftada kaç gün oyun oynuyorsun?",
  "Günde kaç kez telefonunu kontrol ediyorsun?",
  "Haftada kaç gün erken yatıyorsun?",
  "Günde kaç kez atıştırmalık yiyorsun?",
  "Haftada kaç gün işe/okula gidiyorsun?",
  "Günde kaç saat konuşuyorsun?",
  "Haftada kaç gün kitap okuyorsun?",

  "Günde kaç kez selfie çekiyorsun?",
  "Haftada kaç gün yeni insanlarla tanışıyorsun?",
  "Günde kaç saat hayal kuruyorsun?",
  "Haftada kaç gün kahve içiyorsun?",
  "Günde kaç saat müzikle vakit geçiriyorsun?",
  "Haftada kaç gün stres yaşıyorsun?",
  "Günde kaç kez güldüğünü fark ediyorsun?",
  "Haftada kaç gün evde vakit geçiriyorsun?",
  "Günde kaç saat ekran karşısındasın?",
  "Haftada kaç gün sosyal etkinliğe katılıyorsun?",

  "Günde kaç kez bildirim kontrol ediyorsun?",
  "Haftada kaç gün dışarıda yemek yiyorsun?",
  "Günde kaç saat YouTube izliyorsun?",
  "Haftada kaç gün kendine zaman ayırıyorsun?",
  "Günde kaç kez aynaya gülüyorsun?",
  "Haftada kaç gün spor yapmayı düşünüyorsun?",
  "Günde kaç saat oturuyorsun?",
  "Haftada kaç gün enerjik hissediyorsun?",
  "Günde kaç kez şarkı söylüyorsun?",
  "Haftada kaç gün kahvaltı yapıyorsun?",

  "Günde kaç saat kulaklık kullanıyorsun?",
  "Haftada kaç gün geç kalkıyorsun?",
  "Günde kaç kez sosyal medya paylaşımı yapıyorsun?",
  "Haftada kaç gün motivasyonun yüksek oluyor?",
  "Günde kaç saat boş boş takılıyorsun?",
  "Haftada kaç gün plan yapıyorsun?",
  "Günde kaç kez telefonunu şarja takıyorsun?",
  "Haftada kaç gün alışveriş yapıyorsun?",
  "Günde kaç saat evde kalıyorsun?",
  "Haftada kaç gün arkadaşlarınla konuşuyorsun?",

  "Günde kaç kez bir şeyleri erteliyorsun?",
  "Haftada kaç gün kendini yorgun hissediyorsun?",
  "Günde kaç saat TikTok/Instagram reels izliyorsun?",
  "Haftada kaç gün sağlıklı besleniyorsun?",
  "Günde kaç kez mesajlara geç cevap veriyorsun?",
  "Haftada kaç gün ders çalışmayı erteliyorsun?",
  "Günde kaç saat oyun oynuyorsun?",
  "Haftada kaç gün mutlu hissediyorsun?",
  "Günde kaç kez kahve içmeyi düşünüyorsun?",
  "Haftada kaç gün yeni şeyler öğreniyorsun?",

  "Günde kaç saat yatakta vakit geçiriyorsun?",
  "Haftada kaç gün telefonunu sessize alıyorsun?",
  "Günde kaç kez sosyal medya story bakıyorsun?",
  "Haftada kaç gün yoğun hissediyorsun?",
  "Günde kaç saat aktif oluyorsun?",
  "Haftada kaç gün planlarına uyuyorsun?",
  "Günde kaç kez bir şeylere sinirleniyorsun?",
  "Haftada kaç gün dinlenmiş hissediyorsun?",
  "Günde kaç saat arkadaşlarınla konuşuyorsun?",
  "Haftada kaç gün kendini üretken hissediyorsun?",

  "Günde kaç kez şarjın bitiyor?",
  "Haftada kaç gün dışarı çıkmak istiyorsun?",
  "Günde kaç saat ders/iş dışında vakit geçiriyorsun?",
  "Haftada kaç gün sosyal oluyorsun?",
  "Günde kaç kez bir şey unutuyorsun?",
  "Haftada kaç gün geç kalıyorsun?",
  "Günde kaç saat müzik eşliğinde çalışıyorsun?",
  "Haftada kaç gün telefonunu bırakabiliyorsun?",
  "Günde kaç kez kendini motive ediyorsun?",
  "Haftada kaç gün kendine hedef koyuyorsun?"
];

const selectPlayerQuestions = [
  "Aranızdaki en komik kişiyi göster!",
  "Aranızdaki en sessiz kişiyi göster!",
  "Aranızdaki en çok konuşan kişiyi göster!",
  "Aranızdaki en tembel kişiyi göster!",
  "Aranızdaki en çalışkan kişiyi göster!",
  "Aranızdaki en dağınık kişiyi göster!",
  "Aranızdaki en düzenli kişiyi göster!",
  "Aranızdaki en geç kalan kişiyi göster!",
  "Aranızdaki en erken gelen kişiyi göster!",
  "Aranızdaki en çok uyuyan kişiyi göster!",

  "Aranızdaki en az uyuyan kişiyi göster!",
  "Aranızdaki en sosyal kişiyi göster!",
  "Aranızdaki en asosyal kişiyi göster!",
  "Aranızdaki en eğlenceli kişiyi göster!",
  "Aranızdaki en sıkıcı kişiyi göster!",
  "Aranızdaki en unutkan kişiyi göster!",
  "Aranızdaki en dikkatli kişiyi göster!",
  "Aranızdaki en sabırsız kişiyi göster!",
  "Aranızdaki en sabırlı kişiyi göster!",
  "Aranızdaki en inatçı kişiyi göster!",

  "Aranızdaki en kolay ikna olan kişiyi göster!",
  "Aranızdaki en lider ruhlu kişiyi göster!",
  "Aranızdaki en pasif kişiyi göster!",
  "Aranızdaki en çok gülen kişiyi göster!",
  "Aranızdaki en az gülen kişiyi göster!",
  "Aranızdaki en dramatik kişiyi göster!",
  "Aranızdaki en rahat kişiyi göster!",
  "Aranızdaki en stresli kişiyi göster!",
  "Aranızdaki en cool kişiyi göster!",
  "Aranızdaki en utangaç kişiyi göster!",

  "Aranızdaki en özgüvenli kişiyi göster!",
  "Aranızdaki en çok telefon kullanan kişiyi göster!",
  "Aranızdaki telefonsuz duramayan kişiyi göster!",
  "Aranızdaki en çok para harcayan kişiyi göster!",
  "Aranızdaki en tutumlu kişiyi göster!",
  "Aranızdaki en iyi giyinen kişiyi göster!",
  "Aranızdaki en kötü giyinen kişiyi göster!",
  "Aranızdaki en çok yemek yiyen kişiyi göster!",
  "Aranızdaki en az yemek yiyen kişiyi göster!",
  "Aranızdaki en çok kahve içen kişiyi göster!",

  "Aranızdaki en sağlıklı yaşayan kişiyi göster!",
  "Aranızdaki en düzensiz yaşayan kişiyi göster!",
  "Aranızdaki en çok spor yapan kişiyi göster!",
  "Aranızdaki en az hareket eden kişiyi göster!",
  "Aranızdaki en çok gezen kişiyi göster!",
  "Aranızdaki en evcimen kişiyi göster!",
  "Aranızdaki en maceracı kişiyi göster!",
  "Aranızdaki en risk alan kişiyi göster!",
  "Aranızdaki en garanti oynayan kişiyi göster!",
  "Aranızdaki en çok plan yapan kişiyi göster!",

  "Aranızdaki plansız yaşayan kişiyi göster!",
  "Aranızdaki en çok geç cevap veren kişiyi göster!",
  "Aranızdaki en hızlı cevap veren kişiyi göster!",
  "Aranızdaki en çok mesaj atan kişiyi göster!",
  "Aranızdaki en az mesaj atan kişiyi göster!",
  "Aranızdaki en çok story atan kişiyi göster!",
  "Aranızdaki en az paylaşım yapan kişiyi göster!",
  "Aranızdaki en çok dedikodu yapan kişiyi göster!",
  "Aranızdaki en az konuşan kişiyi göster!",
  "Aranızdaki en çok laf sokan kişiyi göster!",

  "Aranızdaki en kırılgan kişiyi göster!",
  "Aranızdaki en sert kişiyi göster!",
  "Aranızdaki en iyi sır tutan kişiyi göster!",
  "Aranızdaki sırrını en hızlı yayan kişiyi göster!",
  "Aranızdaki en güvenilir kişiyi göster!",
  "Aranızdaki en güvensiz kişiyi göster!",
  "Aranızdaki en çok yalan söyleyen kişiyi göster!",
  "Aranızdaki en dürüst kişiyi göster!",
  "Aranızdaki en komik hikaye anlatan kişiyi göster!",
  "Aranızdaki en kötü şaka yapan kişiyi göster!",

  "Aranızdaki en çok hata yapan kişiyi göster!",
  "Aranızdaki en dikkatli hareket eden kişiyi göster!",
  "Aranızdaki en çok risk alan kişiyi göster!",
  "Aranızdaki en çok korkan kişiyi göster!",
  "Aranızdaki en cesur kişiyi göster!",
  "Aranızdaki en çok sinirlenen kişiyi göster!",
  "Aranızdaki en sakin kişiyi göster!",
  "Aranızdaki en çok uyum sağlayan kişiyi göster!",
  "Aranızdaki en zor anlaşan kişiyi göster!",
  "Aranızdaki en yaratıcı kişiyi göster!",

  "Aranızdaki en sıradan kişiyi göster!",
  "Aranızdaki en farklı kişiyi göster!",
  "Aranızdaki en çok hayal kuran kişiyi göster!",
  "Aranızdaki en gerçekçi kişiyi göster!",
  "Aranızdaki en çok eğlenen kişiyi göster!",
  "Aranızdaki en çabuk sıkılan kişiyi göster!",
  "Aranızdaki en çok güldüren kişiyi göster!",
  "Aranızdaki en çok moral bozan kişiyi göster!",
  "Aranızdaki en pozitif kişiyi göster!",
  "Aranızdaki en negatif kişiyi göster!"
];

const wordHuntWords = [
  // Normal kelimeler
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
  "Mehtap",
  "Bilgisayar",
  "Telefon",
  "Kalem",
  "Defter",
  "Çanta",
  "Masa",
  "Sandalye",
  "Kapı",
  "Pencere",
  "Anahtar",
  "Ayakkabı",
  "Gözlük",
  "Şemsiye",
  "Battaniye",
  "Yastık",
  "Ayna",
  "Dolap",
  "Televizyon",
  "Kulaklık",
  "Deniz",
  "Toprak",
  "Rüzgar",
  "Yağmur",
  "Kar",
  "Güneş",
  "Ay",
  "Yıldız",
  "Gece",
  "Sabah",
  "Akşam",
  "Zaman",

  // Soyut kelimeler
  "Yalnızlık",
  "Hüzün",
  "Mutluluk",
  "Kıskançlık",
  "Özgürlük",
  "Umutsuzluk",
  "Cesaret",
  "Korku",
  "Sevgi",
  "Nefret",
  "Gurur",
  "Utanç",
  "Sabır",
  "Heyecan",
  "Merak",
  "İhanet",
  "Sadakat",
  "Rüya",
  "Hayal",
  "Gerçeklik",
  "Adalet",
  "Vicdan",
  "İnanç",
  "Şüphe",
  "Tutku",
  "Özlem",
  "Yorgunluk",
  "Hırs",
  "Disiplin",
  "Sorumluluk",

  // Zor / karışık kelimeler
  "Afrodizyak",
  "Beynelmilel",
  "Muvaffakiyet",
  "Mütevazı",
  "Müteahhit",
  "Münakaşa",
  "Müşahade",
  "Müstesna",
  "Mürekkep",
  "İrtibat",
  "İhtimal",
  "Teşebbüs",
  "Mukavemet",
  "İntibak",
  "Tahammül",
  "Tecrübe",
  "Makul",
  "İzah",
  "Tasavvur",
  "Tedbir",

  // Ünlüler (az sayıda)
  "Tarkan",
  "Sezen Aksu",
  "Hadise",
  "Cem Yılmaz",
  "Arda Turan",
  "Kenan Doğulu",

  // Karışık ekstra
  "Efsane",
  "Masal",
  "Destan",
  "Mitoloji",
  "Simge",
  "Anlam",
  "Düşünce",
  "Fikir",
  "İlham",
  "Yaratıcılık",
  "Zeka",
  "Mantık",
  "Algı",
  "Bilinç",
  "Sezgi"
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
  room.timeLeft = 20;

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

    const normalizeAvatarPath = (path) => {
    const clean = (path || "").split("?")[0];
    return clean.split("/").pop()?.toLowerCase();
  };

  const usedAvatarNames = room.players.map((player) =>
    normalizeAvatarPath(player.avatar)
  );

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
    (avatar) => !usedAvatarNames.includes(normalizeAvatarPath(avatar))
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
        room.timeLeft = room.currentQuestionType === "word_hunt" ? 20 : 20;

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
                      room.timeLeft = 30;

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
              room.timeLeft = 30;

              const showTimer = setInterval(() => {
                room.timeLeft -= 1;

                if (room.timeLeft <= 0) {
                  clearInterval(showTimer);

                  room.phase = "MOLE_VOTING";
                  room.timeLeft = 30;

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
      room.timeLeft = 30;

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
                  room.timeLeft = 30;

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
          room.timeLeft = 30;

          io.to(roomCode).emit("room_update", getSafeRoom(room));

          room.showTimer = setInterval(() => {
            room.timeLeft -= 1;

            if (room.timeLeft <= 0) {
              clearInterval(room.showTimer);
              room.showTimer = null;

              room.phase = "MOLE_VOTING";
              room.timeLeft = 30;

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