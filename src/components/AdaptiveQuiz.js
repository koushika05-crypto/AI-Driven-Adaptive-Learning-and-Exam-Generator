import React, { useState, useEffect, useCallback } from "react";

function AdaptiveQuiz({ stats, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(true);

  const token   = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:8080/api/quiz/questions", { headers });
      const data = await res.json();
      if (res.ok) setQuestions(Array.isArray(data) ? data : fallbackQuestions);
      else        setQuestions(fallbackQuestions);
    } catch {
      setQuestions(fallbackQuestions);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleAnswer = (qId, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    const total   = questions.length;
    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const score   = Math.round((correct / total) * 100);
    const newLevel = score >= 80 ? "Advanced" : score >= 50 ? "Intermediate" : "Beginner";
    const resultData = { score, correct, total, newLevel, improved: score > (stats.score || 0) };
    setResult(resultData);
    setSubmitted(true);
    try {
      await fetch("http://localhost:8080/api/quiz/submit", {
        method: "POST", headers,
        body: JSON.stringify({ score, level: newLevel }),
      });
      if (onComplete) onComplete();
    } catch { }
  };

  const handleRetry = () => {
    setAnswers({}); setSubmitted(false); setResult(null);
    fetchQuestions();
  };

  const diffColor = (d="") => {
    const m = { BEGINNER:{bg:"#f0fdf4",color:"#15803d"}, INTERMEDIATE:{bg:"#fffbeb",color:"#b45309"}, ADVANCED:{bg:"#fef2f2",color:"#b91c1c"} };
    return m[d.toUpperCase()] || m.BEGINNER;
  };

  if (loading) return <div style={{padding:40,textAlign:"center",color:"#94a3b8",fontSize:14}}>Loading adaptive questions...</div>;

  return (
    <div>
      {!submitted ? (
        <div style={s.panel}>
          <div style={s.header}>
            <div style={s.title}>Adaptive Quiz</div>
            <span style={{...s.pill,...diffColor(stats.level||"BEGINNER")}}>{stats.level || "Beginner"}</span>
          </div>
          <p style={s.subtext}>Questions are adjusted to your current level ({stats.level || "Beginner"}).</p>

          {questions.map((q, qi) => (
            <div key={q.id} style={s.qCard}>
              <div style={s.qText}>Q{qi+1}. {q.question}</div>
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === opt;
                return (
                  <div key={oi} style={{...s.opt, ...(selected ? s.optSel : {})}}
                    onClick={() => handleAnswer(q.id, opt)}>
                    {opt}
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
            <button style={{...s.btn, opacity: Object.keys(answers).length < questions.length ? 0.5 : 1}}
              disabled={Object.keys(answers).length < questions.length}
              onClick={handleSubmit}>
              Submit answers ({Object.keys(answers).length}/{questions.length})
            </button>
          </div>
        </div>
      ) : (
        <div style={s.panel}>
          <div style={s.title}>Quiz result</div>
          <div style={s.resultRow}>
            <div style={{...s.ring, borderColor: result.score >= 70 ? "#22c55e" : result.score >= 50 ? "#f59e0b" : "#ef4444"}}>
              <span style={{fontSize:20,fontWeight:700,color:result.score>=70?"#16a34a":result.score>=50?"#d97706":"#dc2626"}}>{result.score}%</span>
              <span style={{fontSize:10,color:"#94a3b8"}}>score</span>
            </div>
            <div>
              <div style={s.resultTitle}>
                {result.score >= 80 ? "Excellent! Level upgraded 🎉" : result.score >= 50 ? "Good job! Keep going 💪" : "Keep practising! 📚"}
              </div>
              <div style={s.resultSub}>You got {result.correct} of {result.total} correct. Level: {result.newLevel}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
                <span style={{...s.pill,background:"#f0fdf4",color:"#15803d"}}>+{result.score} score points</span>
                <span style={{...s.pill,background:"#eff6ff",color:"#1d4ed8"}}>Level: {result.newLevel}</span>
                {result.improved && <span style={{...s.pill,background:"#fdf4ff",color:"#7c3aed"}}>Improved!</span>}
              </div>
            </div>
          </div>

          <div style={{marginTop:20,borderTop:"1px solid #f1f5f9",paddingTop:16}}>
            <div style={{fontSize:13,fontWeight:600,color:"#1e293b",marginBottom:10}}>Answer review</div>
            {questions.map((q, qi) => {
              const chosen  = answers[q.id];
              const correct = chosen === q.correctAnswer;
              return (
                <div key={q.id} style={{marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#1e293b",marginBottom:4}}>Q{qi+1}. {q.question}</div>
                  <div style={{fontSize:12,color:correct?"#15803d":"#b91c1c",background:correct?"#f0fdf4":"#fef2f2",border:`1px solid ${correct?"#bbf7d0":"#fecaca"}`,padding:"6px 12px",borderRadius:7}}>
                    Your answer: {chosen || "Not answered"} {correct ? "✓ Correct" : `✗ Correct: ${q.correctAnswer}`}
                  </div>
                </div>
              );
            })}
          </div>

          <button style={{...s.btn,marginTop:12}} onClick={handleRetry}>Try another quiz</button>
        </div>
      )}
    </div>
  );
}

const fallbackQuestions = [
  { id:1, question:"What is the time complexity of binary search?",     options:["O(n)","O(log n)","O(n²)","O(1)"],           correctAnswer:"O(log n)",    difficulty:"INTERMEDIATE" },
  { id:2, question:"Which data structure uses LIFO order?",             options:["Queue","Linked List","Stack","Tree"],         correctAnswer:"Stack",       difficulty:"BEGINNER"     },
  { id:3, question:"What does JVM stand for?",                          options:["Java Virtual Machine","Java Variable Method","Java Verified Module","None"], correctAnswer:"Java Virtual Machine", difficulty:"BEGINNER" },
  { id:4, question:"Which sorting algorithm has O(n log n) average?",   options:["Bubble Sort","Insertion Sort","Merge Sort","Selection Sort"], correctAnswer:"Merge Sort", difficulty:"INTERMEDIATE" },
  { id:5, question:"What is a binary tree node with no children called?",options:["Root","Branch","Leaf","Edge"],               correctAnswer:"Leaf",        difficulty:"BEGINNER"     },
];

const s = {
  panel:      { background:"#fff", border:"1px solid #e9eef6", borderRadius:12, padding:24 },
  header:     { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 },
  title:      { fontSize:16, fontWeight:600, color:"#1e293b" },
  subtext:    { fontSize:13, color:"#94a3b8", marginBottom:20 },
  pill:       { display:"inline-block", padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:500 },
  qCard:      { background:"#f8fafc", border:"1px solid #e9eef6", borderRadius:10, padding:16, marginBottom:14 },
  qText:      { fontSize:14, fontWeight:500, color:"#1e293b", marginBottom:12 },
  opt:        { padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, color:"#475569", cursor:"pointer", marginBottom:6, transition:"all .15s" },
  optSel:     { borderColor:"#bfdbfe", background:"#eff6ff", color:"#1d4ed8" },
  btn:        { padding:"9px 22px", background:"#2563eb", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" },
  resultRow:  { display:"flex", gap:24, alignItems:"center", marginTop:16 },
  ring:       { width:80, height:80, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", border:"6px solid", flexShrink:0 },
  resultTitle:{ fontSize:15, fontWeight:600, color:"#1e293b", marginBottom:6 },
  resultSub:  { fontSize:13, color:"#64748b" },
};

export default AdaptiveQuiz;
