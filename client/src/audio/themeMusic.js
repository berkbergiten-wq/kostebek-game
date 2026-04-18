export const themeMusicAudio = new Audio(
  `${import.meta.env.BASE_URL}theme-music.mp3`
);
themeMusicAudio.loop = true;

export const themeMusicState = {
  volume: 0.5,
  isMuted: false,
};