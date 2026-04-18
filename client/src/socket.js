import { io } from "socket.io-client";

const SERVER_URL = "http://127.0.0.1:3001";

export const socket = io(SERVER_URL, {
  autoConnect: true,
  reconnection: false,
  timeout: 10000,
});