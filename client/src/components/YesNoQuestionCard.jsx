import { useState } from "react";

export default function YesNoQuestionCard({
  isMole,
  question,
  onYes,
  onNo,
}) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="shared-card yesno-question-card">
      {!isMole ? (
        <>
          <div className="yesno-question-title">SORU</div>

          <div className="yesno-question-box">
            {question || "-"}
          </div>
        </>
      ) : (
        <>
          <div className="yesno-mole-title">SEN KÖSTEBEKSİN</div>

          <div className="yesno-question-box yesno-question-box--mole">
            Rastgele bir seçim yap ve diğerlerini kandırmaya çalış!
          </div>
        </>
      )}

      <div className="yesno-answer-row">
        <button
          className={`yesno-btn yesno-btn--yes ${
            selected === "YES" ? "selected" : ""
          }`}
          onClick={() => {
            setSelected("YES");
            onYes();
          }}
        >
          EVET
        </button>

        <button
          className={`yesno-btn yesno-btn--no ${
            selected === "NO" ? "selected" : ""
          }`}
          onClick={() => {
            setSelected("NO");
            onNo();
          }}
        >
          HAYIR
        </button>
      </div>
    </div>
  );
}