import React from "react";

function ProgressTracker({ progress }) {
  const overall = progress.length
    ? Math.round(progress.reduce((a, p) => a + (p.percentage || 0), 0) / progress.length)
    : 0;

  const barColor = (pct) =>
    pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";

  const badge = (pct) =>
    pct >= 70
      ? { label:"On track",  bg:"#f0fdf4", color:"#15803d" }
      : pct >= 40
      ? { label:"In progress", bg:"#fffbeb", color:"#b45309" }
      : { label:"Needs work",  bg:"#fef2f2", color:"#b91c1c" };

  return (
    <div>
      <div style={s.summaryRow}>
        <div style={s.ringWrap}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="38" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
            <circle cx="45" cy="45" r="38" fill="none"
              stroke={overall >= 70 ? "#22c55e" : overall >= 40 ? "#f59e0b" : "#ef4444"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*38}`}
              strokeDashoffset={`${2*Math.PI*38*(1-overall/100)}`}
              transform="rotate(-90 45 45)"/>
          </svg>
          <div style={s.ringLabel}>
            <span style={s.ringPct}>{overall}%</span>
            <span style={s.ringText}>overall</span>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={s.summaryTitle}>Overall progress</div>
          <div style={s.summarySub}>{progress.length} courses tracked · Adaptive engine active</div>
          <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
            <span style={{...s.pill,background:"#f0fdf4",color:"#15803d"}}>{progress.filter(p=>p.percentage>=70).length} on track</span>
            <span style={{...s.pill,background:"#fffbeb",color:"#b45309"}}>{progress.filter(p=>p.percentage>=40&&p.percentage<70).length} in progress</span>
            <span style={{...s.pill,background:"#fef2f2",color:"#b91c1c"}}>{progress.filter(p=>p.percentage<40).length} needs work</span>
          </div>
        </div>
      </div>

      {progress.length === 0 ? (
        <div style={{padding:32,textAlign:"center",color:"#94a3b8",fontSize:14}}>
          No progress yet. Complete a lesson to see your tracker!
        </div>
      ) : (
        progress.map(p => {
          const pct = Math.round(p.percentage || 0);
          const b   = badge(pct);
          return (
            <div key={p.courseId} style={s.card}>
              <div style={s.cardTop}>
                <div style={s.courseName}>{p.courseName}</div>
                <span style={{...s.pill, background:b.bg, color:b.color}}>{b.label}</span>
              </div>
              <div style={s.barWrap}>
                <div style={{...s.barFill, width:`${pct}%`, background:barColor(pct)}}/>
              </div>
              <div style={s.cardMeta}>
                <span style={{color:barColor(pct),fontWeight:600}}>{pct}%</span>
                <span style={{color:"#94a3b8"}}>{p.completedLessons || 0} of {p.totalLessons || 0} lessons</span>
                <span style={{color:"#94a3b8"}}>Last active: {p.lastActive || "—"}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const s = {
  summaryRow:  { display:"flex", gap:20, alignItems:"center", background:"#fff", border:"1px solid #e9eef6", borderRadius:12, padding:20, marginBottom:16 },
  ringWrap:    { position:"relative", width:90, height:90, flexShrink:0 },
  ringLabel:   { position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" },
  ringPct:     { fontSize:18, fontWeight:700, color:"#1e293b" },
  ringText:    { fontSize:10, color:"#94a3b8" },
  summaryTitle:{ fontSize:16, fontWeight:600, color:"#1e293b", marginBottom:4 },
  summarySub:  { fontSize:13, color:"#94a3b8" },
  pill:        { display:"inline-block", padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:500 },
  card:        { background:"#fff", border:"1px solid #e9eef6", borderRadius:12, padding:18, marginBottom:12 },
  cardTop:     { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 },
  courseName:  { fontSize:14, fontWeight:600, color:"#1e293b" },
  barWrap:     { height:10, background:"#f1f5f9", borderRadius:10, overflow:"hidden", marginBottom:8 },
  barFill:     { height:"100%", borderRadius:10, transition:"width .4s" },
  cardMeta:    { display:"flex", justifyContent:"space-between", fontSize:12 },
};

export default ProgressTracker;