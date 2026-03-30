import React, { useEffect, useState, useCallback } from "react";

function SuggestedLessons({ progress, onQuiz }) {
  const [suggestions, setSuggestions] = useState([]);
  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSuggestions = useCallback(async () => {
    try {
      const res  = await fetch("http://localhost:8080/api/student/suggestions", { headers });
      const data = await res.json();
      if (res.ok) setSuggestions(Array.isArray(data) ? data : []);
    } catch {
        setSuggestions([
        { id: 1, title: "Variables & Data Types",          subject: "Java Fundamentals", difficulty: "BEGINNER",     duration: 20, type: "lesson",   reason: "Good starting point for your level",  url: "https://www.youtube.com/watch?v=eIrMbAQSU34" },
        { id: 2, title: "Adaptive Quiz — Java Basics",     subject: "Java Fundamentals", difficulty: "BEGINNER",     duration: 10, type: "quiz",     reason: "Test your beginner knowledge",         url: "" },
        { id: 3, title: "OOP Concepts",                    subject: "Java Fundamentals", difficulty: "BEGINNER",     duration: 20, type: "lesson",   reason: "Core Java concept to learn next",      url: "https://www.youtube.com/watch?v=pTB0EiLXUC8" },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchSuggestions(); }, [fetchSuggestions]);

  const diffColor = (d="") => {
    const m = { BEGINNER:{ bg:"#f0fdf4",color:"#15803d" }, INTERMEDIATE:{ bg:"#fffbeb",color:"#b45309" }, ADVANCED:{ bg:"#fef2f2",color:"#b91c1c" } };
    return m[d.toUpperCase()] || m.BEGINNER;
  };

  const typeIcon  = (t) => ({ lesson:"🎯", quiz:"📝", revision:"🔁" })[t] || "📖";
  const typeColor = (t) => ({ lesson:"#eff6ff", quiz:"#fffbeb", revision:"#f0fdf4" })[t] || "#f8fafc";

  return (
    <div>
      <div style={s.twoCol}>
        <div style={s.panel}>
          <div style={s.panelTitle}>
            <span style={s.panelIcon}>📊</span> Course progress
          </div>
          {progress.length === 0 ? (
            <p style={{color:"#94a3b8",fontSize:13}}>No progress data yet. Start a lesson!</p>
          ) : (
            progress.map((p) => {
              const pct = Math.round(p.percentage || 0);
              const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";
              return (
                <div key={p.courseId} style={s.progressWrap}>
                  <div style={s.progHeader}>
                    <span style={s.progName}>{p.courseName}</span>
                    <span style={{...s.progPct, color}}>{pct}%</span>
                  </div>
                  <div style={s.progBarBg}>
                    <div style={{...s.progBarFill, width:`${pct}%`, background:color}}/>
                  </div>
                </div>
              );
            })
          )}

          <div style={{marginTop:14,borderTop:"1px solid #f1f5f9",paddingTop:12}}>
            <div style={{fontSize:12,color:"#64748b",marginBottom:8,fontWeight:600}}>ACTIVITY THIS WEEK</div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {Array.from({length:28},(_,i)=>{
                const c=["#dcfce7","#dcfce7","#fef9c3","#dcfce7","#f1f5f9","#dcfce7","#fef3c7"][i%7];
                return <div key={i} style={{width:12,height:12,borderRadius:3,background:c,border:"1px solid #e2e8f0"}}/>;
              })}
            </div>
          </div>
        </div>

        <div>
          {suggestions.map((sug, idx) => (
            <div key={sug.id} style={{...s.sugCard, ...(idx===0?s.sugTop:{})}}>
              {idx === 0 && (
                <div style={{fontSize:10,fontWeight:700,color:"#2563eb",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>
                  Next suggested lesson
                </div>
              )}
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{...s.sugIcon, background:typeColor(sug.type)}}>
                  <span style={{fontSize:20}}>{typeIcon(sug.type)}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={s.sugTitle}>{sug.title}</div>
                  <div style={s.sugSub}>Based on: {sug.reason}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                    <span style={{...s.pill,...diffColor(sug.difficulty)}}>{sug.difficulty}</span>
                    <span style={{fontSize:11,color:"#94a3b8"}}>~{sug.duration} min</span>
                  </div>
                  {sug.type === "quiz"
                    ? <button style={s.btnAmber} onClick={onQuiz}>Take quiz</button>
                    : <button style={s.btnBlue} onClick={() => {
                        if (sug.url && sug.url.trim() !== "") {
                          window.open(sug.url, "_blank", "noopener,noreferrer");
                        }
                      }}>Start lesson</button>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  twoCol:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  panel:      { background:"#fff", border:"1px solid #e9eef6", borderRadius:12, padding:20 },
  panelTitle: { fontSize:14, fontWeight:600, color:"#1e293b", marginBottom:14, display:"flex", alignItems:"center", gap:8 },
  panelIcon:  { fontSize:16 },
  progressWrap:{ marginBottom:14 },
  progHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  progName:   { fontSize:13, fontWeight:500, color:"#1e293b" },
  progPct:    { fontSize:12, fontWeight:600 },
  progBarBg:  { height:8, background:"#f1f5f9", borderRadius:10, overflow:"hidden" },
  progBarFill:{ height:"100%", borderRadius:10, transition:"width .4s" },
  sugCard:    { background:"#fff", border:"1px solid #e9eef6", borderRadius:12, padding:16, marginBottom:12, cursor:"pointer" },
  sugTop:     { borderLeft:"3px solid #2563eb", paddingLeft:13 },
  sugIcon:    { width:40, height:40, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  sugTitle:   { fontSize:14, fontWeight:600, color:"#1e293b", marginBottom:3 },
  sugSub:     { fontSize:12, color:"#94a3b8", marginBottom:8 },
  pill:       { display:"inline-block", padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:500 },
  btnBlue:    { padding:"7px 16px", background:"#2563eb", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" },
  btnAmber:   { padding:"7px 16px", background:"#d97706", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" },
};

export default SuggestedLessons;