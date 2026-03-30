import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const [fullName, setFullName]               = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole]                       = useState("STUDENT");
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState("");
  const [loading, setLoading]                 = useState(false);
  const navigate = useNavigate();

  const roles = [
    {value:"STUDENT",    label:"Student",    icon:"🎓", desc:"Learn from courses"},
    {value:"INSTRUCTOR", label:"Instructor", icon:"👨‍🏫", desc:"Teach & upload content"},
    {value:"ADMIN",      label:"Admin",      icon:"🛡️",  desc:"Manage the platform"},
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await registerUser(email, password, role, fullName);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === "string" ? msg : "Registration failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <header style={s.nav}>
        <span style={s.logo}>Skill<span style={{color:"#7c3aed"}}>Forge</span></span>
        <Link to="/login" style={s.navBtn}>Sign in</Link>
      </header>

      <div style={s.hero}>
        <div style={s.card}>
          <span style={s.badge}>Get started free</span>
          <h2 style={s.cardTitle}>Create your account</h2>
          <p style={s.cardSub}>Join SkillForge in under a minute</p>

          {error   && <div style={s.errBox}>{error}</div>}
          {success && <div style={s.sucBox}>{success}</div>}

          <form onSubmit={handleRegister}>
            <label style={s.label}>I am a...</label>
            <div style={s.roleGrid}>
              {roles.map(r=>(
                <div key={r.value}
                  style={{...s.roleBtn, ...(role===r.value ? s.roleSel : {})}}
                  onClick={()=>setRole(r.value)}>
                  <span style={{fontSize:22,display:"block",marginBottom:6}}>{r.icon}</span>
                  <div style={{fontSize:13,fontWeight:600,color:role===r.value?"#1d4ed8":"#64748b"}}>{r.label}</div>
                  <div style={{fontSize:11,color:"#cbd5e1",marginTop:2}}>{r.desc}</div>
                </div>
              ))}
            </div>

            <label style={s.label}>Full name</label>
            <input style={s.input} type="text" placeholder="e.g. Dhanushya"
              value={fullName} onChange={e=>setFullName(e.target.value)} required/>

            <label style={s.label}>Email address</label>
            <input style={s.input} type="email" placeholder="you@example.com"
              value={email} onChange={e=>setEmail(e.target.value)} required/>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label style={s.label}>Password</label>
                <input style={{...s.input,marginBottom:0}} type="password" placeholder="Min 6 characters"
                  value={password} onChange={e=>setPassword(e.target.value)} required/>
              </div>
              <div>
                <label style={s.label}>Confirm password</label>
                <input style={{...s.input,marginBottom:0}} type="password" placeholder="Repeat password"
                  value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required/>
              </div>
            </div>

            <button type="submit" style={{...s.btn,marginTop:20,opacity:loading?0.7:1}} disabled={loading}>
              {loading ? "Creating account..." : "Create my account"}
            </button>
          </form>

          <p style={s.footerTxt}>Already have an account?{" "}
            <Link to="/login" style={{color:"#2563eb",textDecoration:"none",fontWeight:500}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:     {minHeight:"100vh",background:"#f8faff",display:"flex",flexDirection:"column"},
  nav:      {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 32px",background:"#fff",borderBottom:"1px solid #e9eef6"},
  logo:     {fontSize:20,fontWeight:700,color:"#1d4ed8",letterSpacing:0.5},
  navBtn:   {color:"#64748b",fontSize:13,textDecoration:"none",padding:"6px 16px",border:"1px solid #e2e8f0",borderRadius:20,background:"#fff"},
  hero:     {flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"36px 24px"},
  card:     {background:"#fff",border:"1px solid #e2e8f0",borderRadius:18,padding:"36px 36px",width:"100%",maxWidth:460,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
  badge:    {display:"inline-block",background:"#eff6ff",color:"#1d4ed8",fontSize:11,fontWeight:600,padding:"4px 12px",borderRadius:20,marginBottom:14,letterSpacing:0.5},
  cardTitle:{fontSize:22,fontWeight:700,color:"#0f172a",margin:"0 0 4px"},
  cardSub:  {fontSize:13,color:"#94a3b8",margin:"0 0 22px"},
  errBox:   {background:"#fef2f2",border:"1px solid #fecaca",color:"#b91c1c",padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:14},
  sucBox:   {background:"#f0fdf4",border:"1px solid #bbf7d0",color:"#15803d",padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:14},
  label:    {display:"block",fontSize:11,fontWeight:600,color:"#64748b",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5},
  roleGrid: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18},
  roleBtn:  {padding:"14px 8px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:12,cursor:"pointer",textAlign:"center",transition:"all .15s"},
  roleSel:  {border:"1.5px solid #2563eb",background:"#eff6ff"},
  input:    {width:"100%",padding:"10px 13px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:14,color:"#0f172a",outline:"none",marginBottom:14,boxSizing:"border-box"},
  btn:      {width:"100%",padding:12,background:"#2563eb",color:"#fff",border:"none",borderRadius:9,fontSize:14,fontWeight:600,cursor:"pointer"},
  footerTxt:{textAlign:"center",fontSize:13,color:"#94a3b8",marginTop:16},
};

export default Register;