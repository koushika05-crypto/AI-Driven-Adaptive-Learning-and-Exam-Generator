import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      const r = role.toUpperCase();
      if (r === "INSTRUCTOR") navigate("/instructor-dashboard");
      else if (r === "STUDENT") navigate("/student-dashboard");
      else if (r === "ADMIN")   navigate("/admin-dashboard");
      else navigate("/");
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === "string" ? msg : "Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <header style={s.nav}>
        <span style={s.logo}>Skill<span style={{color:"#7c3aed"}}>Forge</span></span>
        <div style={{display:"flex",gap:8}}>
          <Link to="/register" style={s.navBtn}>Register</Link>
        </div>
      </header>

      <div style={s.hero}>
        <div style={s.twoCol}>

          <div>
            <div style={s.eyebrow}>Learning Platform</div>
            <h1 style={s.heroTitle}>Level up your<br/><span style={{color:"#2563eb"}}>skills today</span></h1>
            <p style={s.heroSub}>Join thousands of learners and instructors on SkillForge — your modern learning management platform.</p>
            <div style={s.featGrid}>
              {[
                {title:"Expert courses",   desc:"Curated by top instructors"},
                {title:"Learn at your pace",desc:"Flexible scheduling"},
                {title:"Role-based access", desc:"Student, Instructor, Admin"},
                {title:"Rich materials",    desc:"Videos, PDFs & links"},
              ].map(f=>(
                <div key={f.title} style={s.feat}>
                  <div style={s.featDot}/>
                  <div>
                    <div style={s.featTitle}>{f.title}</div>
                    <div style={s.featDesc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <span style={s.badge}>Welcome back</span>
            <h2 style={s.cardTitle}>Sign in</h2>
            <p style={s.cardSub}>Access your dashboard</p>

            {error && <div style={s.errBox}>{error}</div>}

            <form onSubmit={handleLogin}>
              <label style={s.label}>Email address</label>
              <input style={s.input} type="email" placeholder="you@example.com"
                value={email} onChange={e=>setEmail(e.target.value)} required/>

              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="••••••••"
                value={password} onChange={e=>setPassword(e.target.value)} required/>

              <div style={{textAlign:"right",marginTop:-8,marginBottom:14}}>
                <span style={{fontSize:12,color:"#2563eb",cursor:"pointer"}}>Forgot password?</span>
              </div>

              <button type="submit" style={{...s.btn,opacity:loading?0.7:1}} disabled={loading}>
                {loading ? "Signing in..." : "Sign in to SkillForge"}
              </button>
            </form>

            <div style={s.divider}>
              <span style={{background:"#fff",padding:"0 10px",color:"#cbd5e1",fontSize:12}}>or sign in as</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {["Student","Instructor","Admin"].map(r=>(
                <button key={r} style={s.outlineBtn}
                  onClick={()=>{setEmail(`${r.toLowerCase()}@demo.com`);setPassword("demo123");}}>
                  {r}
                </button>
              ))}
            </div>

            <p style={s.footerTxt}>No account?{" "}
              <Link to="/register" style={{color:"#2563eb",textDecoration:"none",fontWeight:500}}>Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:      {minHeight:"100vh",background:"#f8faff",display:"flex",flexDirection:"column"},
  nav:       {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 32px",background:"#fff",borderBottom:"1px solid #e9eef6"},
  logo:      {fontSize:20,fontWeight:700,color:"#1d4ed8",letterSpacing:0.5},
  navBtn:    {color:"#64748b",fontSize:13,textDecoration:"none",padding:"6px 16px",border:"1px solid #e2e8f0",borderRadius:20,background:"#fff"},
  hero:      {flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"},
  twoCol:    {display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,width:"100%",maxWidth:860,alignItems:"center"},
  eyebrow:   {fontSize:11,fontWeight:700,color:"#2563eb",textTransform:"uppercase",letterSpacing:1,marginBottom:12},
  heroTitle: {fontSize:32,fontWeight:700,color:"#0f172a",lineHeight:1.25,marginBottom:12},
  heroSub:   {fontSize:14,color:"#64748b",lineHeight:1.7,marginBottom:24},
  featGrid:  {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},
  feat:      {background:"#fff",border:"1px solid #e9eef6",borderRadius:10,padding:13,display:"flex",gap:10,alignItems:"flex-start"},
  featDot:   {width:8,height:8,borderRadius:"50%",background:"#2563eb",flexShrink:0,marginTop:4},
  featTitle: {fontSize:12,fontWeight:600,color:"#1e293b",marginBottom:2},
  featDesc:  {fontSize:11,color:"#94a3b8"},
  card:      {background:"#fff",border:"1px solid #e2e8f0",borderRadius:18,padding:"32px 28px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
  badge:     {display:"inline-block",background:"#eff6ff",color:"#1d4ed8",fontSize:11,fontWeight:600,padding:"4px 12px",borderRadius:20,marginBottom:14,letterSpacing:0.5},
  cardTitle: {fontSize:22,fontWeight:700,color:"#0f172a",margin:"0 0 4px"},
  cardSub:   {fontSize:13,color:"#94a3b8",margin:"0 0 22px"},
  errBox:    {background:"#fef2f2",border:"1px solid #fecaca",color:"#b91c1c",padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:14},
  label:     {display:"block",fontSize:11,fontWeight:600,color:"#64748b",marginBottom:5,textTransform:"uppercase",letterSpacing:0.5},
  input:     {width:"100%",padding:"10px 13px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:14,color:"#0f172a",outline:"none",marginBottom:14,boxSizing:"border-box"},
  btn:       {width:"100%",padding:12,background:"#2563eb",color:"#fff",border:"none",borderRadius:9,fontSize:14,fontWeight:600,cursor:"pointer"},
  divider:   {textAlign:"center",position:"relative",margin:"16px 0",borderTop:"1px solid #f1f5f9"},
  outlineBtn:{padding:"8px 0",background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:8,color:"#64748b",fontSize:12,cursor:"pointer"},
  footerTxt: {textAlign:"center",fontSize:13,color:"#94a3b8",marginTop:16},
};

export default Login;