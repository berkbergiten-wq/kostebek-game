import { useEffect, useState } from "react";

export default function NumberInputQuestionCard({
  isMole,
  question,
  initialValue = "",
  onChangeValue,
  onSubmitValue,
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const handleChange = (e) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
    setValue(onlyNumbers);
    onChangeValue?.(onlyNumbers);
  };

  const handleSubmit = () => {
    onSubmitValue?.(value);
  };

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
            Rastgele bir sayı gir ve diğerlerini kandırmaya çalış!
          </div>
        </>
      )}

      <div className="number-input-wrap">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Sayı Gir"
          value={value}
          onChange={handleChange}
          className="number-input-field"
        />

        <button
          className="number-submit-btn"
          onClick={handleSubmit}
        >
          GÖNDER
        </button>
      </div>
    </div>
  );
}