import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateRoomPage from "./pages/CreateRoomPage";
import JoinRoomPage from "./pages/JoinRoomPage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import Header from "./components/Header";
import { socket } from "./socket";
import { useEffect } from "react";

export default function App() {
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("CLIENT BAĞLANDI:", socket.id);
      alert("SOCKET BAĞLANDI");
    });

    socket.on("connect_error", (err) => {
      console.log("SOCKET HATASI:", err.message);
      alert("SOCKET HATASI: " + err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/join" element={<JoinRoomPage />} />
        <Route path="/lobby/:roomCode" element={<LobbyPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}