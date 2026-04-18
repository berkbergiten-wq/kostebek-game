import { avatars } from "../data/avatars";

export default function AvatarPicker({ selected, onSelect, avatarsOverride }) {
  const list =
    Array.isArray(avatarsOverride) && avatarsOverride.length > 0
      ? avatarsOverride
      : avatars;

  const currentIndex = selected
    ? list.findIndex((avatar) => avatar.id === selected.id)
    : 0;

  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentAvatar = list[safeIndex] || avatars[0];

  const goPrev = () => {
    if (!list.length) return;
    const newIndex = safeIndex <= 0 ? list.length - 1 : safeIndex - 1;
    onSelect(list[newIndex]);
  };

  const goNext = () => {
    if (!list.length) return;
    const newIndex = safeIndex >= list.length - 1 ? 0 : safeIndex + 1;
    onSelect(list[newIndex]);
  };

  if (!currentAvatar) return null;

  return (
    <div className="avatar-picker-single">
      <div
        className="avatar-single-card"
        style={{
          border: `4px solid ${currentAvatar.color || "#3B82F6"}`,
        }}
      >
        <button type="button" className="avatar-nav-btn" onClick={goPrev}>
          ‹
        </button>

        <div className="avatar-single-center">
          <img
            src={currentAvatar.neutral}
            alt={`Avatar ${currentAvatar.id}`}
            className="avatar-single-image"
          />
        </div>

        <button type="button" className="avatar-nav-btn" onClick={goNext}>
          ›
        </button>
      </div>
    </div>
  );
}