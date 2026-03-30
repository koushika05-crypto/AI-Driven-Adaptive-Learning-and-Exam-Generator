import React, { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8080/api";

function AIQuizGenerator() {
  const [topic,      setTopic]      = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [qcount,     setQcount]     = useState(5);
  const [qtype,      setQtype]      = useState("MCQ + Short Answer");
  const [courseId,   setCourseId]   = useState("");
  const [courses,    setCourses]    = useState([]);
  const [questions,  setQuestions]  = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generated,  setGenerated]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [message,    setMessage]    = useState({ text: "", success: true });
  const [page,       setPage]       = useState("generate");

  const token   = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchCourses = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/courses`, { headers });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCourses(data);
        if (data.length > 0) setCourseId(data[0].id);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const showMessage = (text, success = true) => {
    setMessage({ text, success });
    setTimeout(() => setMessage({ text: "", success: true }), 4000);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) { showMessage("Please enter a topic.", false); return; }
    setGenerating(true);
    setGenerated(false);
    setQuestions([]);
    setSaved(false);
    try {
      const res  = await fetch(`${API}/quiz/generate`, {
        method: "POST", headers,
        body: JSON.stringify({ topic, difficulty, count: qcount, type: qtype }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setQuestions(data);
        setGenerated(true);
        setPage("review");
        showMessage(`${data.length} questions generated successfully!`);
      } else {
        showMessage("Generation failed. Check your OpenAI API key.", false);
      }
    } catch {
      showMessage("Network error. Is the backend running?", false);
    }
    setGenerating(false);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIndex, option) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = option;
    setQuestions(updated);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!courseId) { showMessage("Please select a course.", false); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/quiz/save`, {
        method: "POST", headers,
        body: JSON.stringify({
          title:      `${topic} Quiz`,
          topic,
          difficulty,
          courseId,
          questions,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setPage("manage");
        showMessage("Quiz saved and assigned to students!");
      } else {
        showMessage("Save failed. Try again.", false);
      }
    } catch {
      showMessage("Network error.", false);
    }
    setSaving(false);
  };

  return (
    <div>
      {/* Tab nav */}
      <div style={s.tabRow}>
        {["generate","review","manage"].map(p => (
          <button key={p} style={{...s.tab, ...(page===p?s.tabActive:{})}}
            onClick={() => setPage(p)}>
            {p === "generate" ? "Generate" : p === "review" ? `Review ${questions.length > 0 ? `(${questions.length})` : ""}` : "Manage quizzes"}
          </button>
        ))}
      </div>

      {message.text && (
        <div style={{...s.msgBox, background: message.success?"#f0fdf4":"#fef2f2",
          border:`1px solid ${message.success?"#bbf7d0":"#fecaca"}`,
          color: message.success?"#15803d":"#b91c1c", marginBottom:16}}>
          {message.text}
        </div>
      )}

      {/* ── GENERATE PAGE ── */}
      {page === "generate" && (
        <div style={s.panel}>
          <div style={s.panelTitle}>
            <span style={s.aiBadge}>GPT-4 powered</span>
            <span style={{fontSize:15,fontWeight:600,color:"#1e293b"}}>Generate quiz with AI</span>
          </div>
          <form onSubmit={handleGenerate}>
            <div style={s.threeCol}>
              <div>
                <label style={s.label}>Topic *</label>
                <input style={s.input} value={topic}
                  onChange={e=>setTopic(e.target.value)}
                  placeholder="e.g. Binary Trees"/>
              </div>
              <div>
                <label style={s.label}>Difficulty</label>
                <select style={s.input} value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label style={s.label}>No. of questions</label>
                <select style={s.input} value={qcount} onChange={e=>setQcount(parseInt(e.target.value))}>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>
            <div style={s.twoCol}>
              <div>
                <label style={s.label}>Question type</label>
                <select style={s.input} value={qtype} onChange={e=>setQtype(e.target.value)}>
                  <option>MCQ only</option>
                  <option>MCQ + Short Answer</option>
                  <option>Short Answer only</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Assign to course</label>
                <select style={s.input} value={courseId} onChange={e=>setCourseId(e.target.value)}>
                  {courses.map(c=>(
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" style={{...s.btnPrimary, opacity:generating?0.7:1}} disabled={generating}>
              {generating ? "Generating..." : "Generate with AI"}
            </button>
            <span style={{fontSize:12,color:"#94a3b8",marginLeft:14}}>
              Questions will be auto-filled and editable before saving
            </span>
          </form>

          {generating && (
            <div style={s.genStatus}>
              <div style={s.spinner}/>
              <div>
                <div style={{fontSize:14,color:"#b45309",fontWeight:500}}>GPT is generating your questions...</div>
                <div style={{fontSize:12,color:"#92400e",marginTop:4}}>This usually takes 3–5 seconds</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REVIEW PAGE ── */}
      {page === "review" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontSize:12,color:"#94a3b8",marginBottom:2}}>Auto-generated · {topic} · {difficulty}</div>
              <h2 style={{fontSize:18,fontWeight:700,color:"#0f172a"}}>Review & edit questions</h2>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={s.btnOutline} onClick={()=>setPage("generate")}>Regenerate</button>
              <button style={s.btnGreen} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save & assign to students"}
              </button>
            </div>
          </div>

          {questions.length === 0 ? (
            <div style={{padding:40,textAlign:"center",color:"#94a3b8",fontSize:14}}>
              No questions yet. Go to Generate tab first.
            </div>
          ) : (
            questions.map((q, qi) => (
              <div key={qi} style={s.qCard}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                  <div style={{flex:1}}>
                    <label style={s.label}>Q{qi+1}. Question</label>
                    <input style={s.input} value={q.question}
                      onChange={e=>handleQuestionChange(qi,"question",e.target.value)}/>
                  </div>
                  <span style={{...s.typePill,...(q.type==="MCQ"?s.mcqPill:s.shortPill)}}>
                    {q.type}
                  </span>
                  <button style={s.delBtn} onClick={()=>handleDeleteQuestion(qi)}>✕</button>
                </div>

                {q.type === "MCQ" && q.options && (
                  <div>
                    <label style={s.label}>Options — click dot to mark correct answer</label>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={s.optRow}>
                        <div
                          style={{...s.optDot, ...(q.correctAnswer===opt?s.optDotCorrect:{})}}
                          onClick={()=>handleCorrectAnswer(qi, opt)}
                        />
                        <input style={s.optInput} value={opt}
                          onChange={e=>handleOptionChange(qi,oi,e.target.value)}/>
                        {q.correctAnswer===opt && (
                          <span style={{fontSize:11,color:"#16a34a",fontWeight:500}}>✓ correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {q.type === "SHORT_ANSWER" && (
                  <div>
                    <label style={s.label}>Model answer</label>
                    <textarea style={{...s.input,minHeight:70}} value={q.modelAnswer||""}
                      onChange={e=>handleQuestionChange(qi,"modelAnswer",e.target.value)}/>
                  </div>
                )}
              </div>
            ))
          )}

          {questions.length > 0 && (
            <div style={s.saveBar}>
              <span style={{fontSize:13,color:"#1d4ed8"}}>{questions.length} questions ready</span>
              <button style={s.btnGreen} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save & assign to students"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── MANAGE PAGE ── */}
      {page === "manage" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h2 style={{fontSize:18,fontWeight:700,color:"#0f172a"}}>Saved quizzes</h2>
            <button style={s.btnPrimary} onClick={()=>{setPage("generate");setGenerated(false);setQuestions([]);}}>
              + Generate new quiz
            </button>
          </div>
          {saved ? (
            <div style={{...s.panel}}>
              <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#15803d",fontWeight:500}}>
                Quiz "{topic}" saved and assigned to all students in the course!
              </div>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Title","Course","Questions","Difficulty","Status"].map(h=>(
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{...s.td,fontWeight:500,color:"#1e293b"}}>{topic} Quiz</td>
                    <td style={s.td}>{courses.find(c=>String(c.id)===String(courseId))?.title||"—"}</td>
                    <td style={s.td}>{questions.length}</td>
                    <td style={s.td}><span style={s.pill}>{difficulty}</span></td>
                    <td style={s.td}><span style={{...s.pill,background:"#f0fdf4",color:"#15803d"}}>Assigned</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{padding:40,textAlign:"center",color:"#94a3b8",fontSize:14}}>
              No quizzes saved yet. Generate and save one first.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  tabRow:      {display:"flex",gap:8,marginBottom:20},
  tab:         {padding:"7px 18px",borderRadius:20,border:"1.5px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:13,cursor:"pointer"},
  tabActive:   {background:"#2563eb",color:"#fff",borderColor:"#2563eb"},
  msgBox:      {padding:"10px 14px",borderRadius:8,fontSize:13},
  panel:       {background:"#fff",border:"1px solid #e9eef6",borderRadius:12,padding:22},
  panelTitle:  {display:"flex",alignItems:"center",gap:10,marginBottom:18},
  aiBadge:     {display:"inline-block",background:"#eff6ff",color:"#1d4ed8",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20},
  threeCol:    {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14},
  twoCol:      {display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18},
  label:       {display:"block",fontSize:11,fontWeight:600,color:"#64748b",marginBottom:5,textTransform:"uppercase",letterSpacing:0.4},
  input:       {width:"100%",padding:"10px 13px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:14,color:"#0f172a",outline:"none",marginBottom:0,boxSizing:"border-box"},
  btnPrimary:  {padding:"10px 22px",background:"#2563eb",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"},
  btnOutline:  {padding:"8px 16px",background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:12,color:"#64748b",cursor:"pointer"},
  btnGreen:    {padding:"9px 18px",background:"#16a34a",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"},
  genStatus:   {display:"flex",alignItems:"center",gap:14,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:16,marginTop:16},
  spinner:     {width:20,height:20,border:"3px solid #fde68a",borderTopColor:"#d97706",borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0},
  qCard:       {background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:10,padding:18,marginBottom:12},
  typePill:    {fontSize:11,padding:"3px 8px",borderRadius:20,fontWeight:500,flexShrink:0,marginTop:2},
  mcqPill:     {background:"#eff6ff",color:"#1d4ed8"},
  shortPill:   {background:"#f0fdf4",color:"#15803d"},
  delBtn:      {padding:"4px 8px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,color:"#ef4444",cursor:"pointer",fontSize:12,flexShrink:0},
  optRow:      {display:"flex",alignItems:"center",gap:8,marginBottom:8},
  optDot:      {width:16,height:16,borderRadius:"50%",border:"1.5px solid #e2e8f0",cursor:"pointer",flexShrink:0,transition:"all .15s"},
  optDotCorrect:{background:"#16a34a",borderColor:"#16a34a"},
  optInput:    {flex:1,padding:"6px 10px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,fontSize:13,color:"#0f172a",outline:"none"},
  saveBar:     {display:"flex",justifyContent:"space-between",alignItems:"center",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"12px 18px",marginTop:8},
  table:       {width:"100%",borderCollapse:"collapse",fontSize:13,marginTop:8},
  th:          {background:"#f8fafc",color:"#94a3b8",fontSize:10,textTransform:"uppercase",letterSpacing:0.5,padding:"9px 14px",textAlign:"left",borderBottom:"1px solid #f1f5f9"},
  td:          {padding:"11px 14px",borderBottom:"1px solid #f8fafc",color:"#334155"},
  pill:        {display:"inline-block",padding:"3px 8px",borderRadius:20,fontSize:11,fontWeight:500,background:"#fffbeb",color:"#b45309"},
};

export default AIQuizGenerator;