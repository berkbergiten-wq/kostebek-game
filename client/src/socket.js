import { io } from "socket.io-client";

const SERVER_URL = "https://kostebek-game-production.up.railway.app";

export const socket = io(SERVER_URL, {
  autoConnect: true,
  reconnection: false,
  timeout: 10000,
});