import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:wght@400;600;700&display=swap');

  .juicy-wrap {
    min-height: 100vh;
    background: #0d0a14;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: 'Nunito', sans-serif;
  }

  .juicy-title {
    font-family: 'Pacifico', cursive;
    font-size: 3rem;
    color: #c084fc;
    margin-bottom: 0.3rem;
    text-align: center;
  }

  .juicy-sub {
    color: #6b5a85;
    font-size: 1rem;
    margin-bottom: 2.5rem;
    text-align: center;
  }

  .juicy-input {
    width: 320px;
    max-width: 100%;
    padding: 14px 22px;
    border: 2px solid #3d2060;
    border-radius: 50px;
    font-size: 1rem;
    font-family: 'Nunito', sans-serif;
    outline: none;
    text-align: center;
    background: #1a1228;
    color: #e8d5ff;
    transition: border-color 0.2s;
  }

  .juicy-input:focus { border-color: #9333ea; }
  .juicy-input::placeholder { color: #4a3665; }

  .juicy-btn {
    margin-top: 1rem;
    padding: 14px 36px;
    background: #7e22ce;
    color: #f3e8ff;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    display: block;
  }

  .juicy-btn:hover { background: #9333ea; }
  .juicy-btn:active { transform: scale(0.97); }
  .juicy-btn:disabled { background: #3d2060; color: #7a5a99; cursor: not-allowed; }

  .juicy-loader {
    margin-top: 2rem;
    font-size: 2rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .juicy-result {
    margin-top: 2.5rem;
    background: #130d1f;
    border-radius: 24px;
    padding: 2rem;
    max-width: 480px;
    width: 100%;
    border: 2px solid #3d2060;
    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes popIn {
    from { transform: scale(0.85); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .juice-name {
    font-family: 'Pacifico', cursive;
    font-size: 1.6rem;
    color: #c084fc;
    margin-bottom: 0.5rem;
  }

  .juice-desc {
    font-size: 0.95rem;
    color: #7a5a99;
    margin-bottom: 1.2rem;
    line-height: 1.5;
  }

  .ingredients-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 1.4rem;
  }

  .ingredient-pill {
    background: #2a1245;
    color: #c084fc;
    border-radius: 50px;
    padding: 6px 14px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .quote-box {
    border-left: 3px solid #7e22ce;
    padding-left: 1rem;
    font-style: italic;
    color: #9775b8;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .error-text {
    margin-top: 2rem;
    color: #c084fc;
    font-size: 1rem;
  }
`;

export default function MoodyJuice() {
  const [mood, setMood] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeJuice = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/juice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood })
      });

      const data = await response.json();
      const text = data.content[0].text.trim();
      console.log("got this:", text);
      const clean = text.replace(/```json|```|`/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("juice machine broke 😭 try again?");
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") makeJuice();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="juicy-wrap">
        <h1 className="juicy-title">moodydoody 🍇</h1>
        <p className="juicy-sub">tell me how you feel and i'll make you a juice</p>

        <input
          className="juicy-input"
          type="text"
          placeholder="i'm feeling..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          onKeyDown={handleKey}
        />

        <button
          className="juicy-btn"
          onClick={makeJuice}
          disabled={loading || !mood.trim()}
        >
          {loading ? "blending... 🍇" : "make my juice"}
        </button>

        {loading && <div className="juicy-loader">🍇</div>}

        {error && <p className="error-text">{error}</p>}

        {result && !error && (
          <div className="juicy-result">
            <div className="juice-name">🍇 {result.juiceName}</div>
            <p className="juice-desc">{result.description}</p>
            <div className="ingredients-wrap">
              {result.ingredients?.map((ing, i) => (
                <span key={i} className="ingredient-pill">{ing}</span>
              ))}
            </div>
            <div className="quote-box">"{result.quote}"</div>
          </div>
        )}
      </div>
    </>
  );
}