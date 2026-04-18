import { useEffect, useState } from "react";
import { themeMusicAudio, themeMusicState } from "../audio/themeMusic";

export default function ThemeMusicPlayer({ enabled }) {
  
  const [volume, setVolume] = useState(themeMusicState.volume);
const [isMuted, setIsMuted] = useState(themeMusicState.isMuted);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
  const audio = themeMusicAudio;
  audio.volume = isMuted ? 0 : volume;

  if (enabled) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}, [enabled, volume, isMuted]);

  const handleVolumeChange = (e) => {
  const nextVolume = Number(e.target.value);
  themeMusicState.volume = nextVolume;
  setVolume(nextVolume);

  if (nextVolume > 0 && isMuted) {
    themeMusicState.isMuted = false;
    setIsMuted(false);
  }
};

const toggleMute = () => {
  const nextMuted = !isMuted;
  themeMusicState.isMuted = nextMuted;
  setIsMuted(nextMuted);
};

  if (!enabled) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {isHovered && (
        <div
          style={{
            width: 52,
            height: 150,
            padding: "12px 0",
            borderRadius: 16,
            background: "rgba(10, 20, 40, 0.88)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.28)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{
              width: 110,
              transform: "rotate(-90deg)",
              cursor: "pointer",
            }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={toggleMute}
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          fontWeight: 900,
          background: "rgba(10, 20, 40, 0.92)",
          color: "#ffffff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.28)",
          borderColor: "rgba(255,255,255,0.18)",
        }}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}