import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

/* ═══════════════════════════════════════════════════════
   GLOBAL CSS — GLASSMORPHISM PREMIUM
═══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(139,92,246,.3);border-radius:4px}
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
input,select,button{font-family:'DM Sans',sans-serif}

/* Glassmorphism base */
.glass{
  background:rgba(255,255,255,0.06);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border:1px solid rgba(255,255,255,0.12);
}
.glass-light{
  background:rgba(255,255,255,0.72);
  backdrop-filter:blur(24px) saturate(200%);
  -webkit-backdrop-filter:blur(24px) saturate(200%);
  border:1px solid rgba(255,255,255,0.9);
}
.glass-card-dark{
  background:rgba(15,12,40,0.55);
  backdrop-filter:blur(28px) saturate(160%);
  -webkit-backdrop-filter:blur(28px) saturate(160%);
  border:1px solid rgba(139,92,246,0.18);
}
.glass-card-light{
  background:rgba(255,255,255,0.65);
  backdrop-filter:blur(28px) saturate(200%);
  -webkit-backdrop-filter:blur(28px) saturate(200%);
  border:1px solid rgba(255,255,255,0.88);
}

@keyframes floatA{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}33%{transform:translate(40px,-30px) scale(1.08) rotate(3deg)}66%{transform:translate(-20px,20px) scale(.96) rotate(-2deg)}}
@keyframes floatB{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-35px,38px) scale(.92)}}
@keyframes floatC{0%,100%{transform:translate(0,0) rotate(0deg)}40%{transform:translate(28px,30px) rotate(5deg)}75%{transform:translate(-22px,-24px) rotate(-3deg)}}
@keyframes floatD{0%,100%{transform:translate(0,0) scale(1)}60%{transform:translate(20px,-25px) scale(1.1)}}
@keyframes ripple{0%{transform:scale(1);opacity:.6}100%{transform:scale(3);opacity:0}}
@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spinIn{from{opacity:0;transform:scale(0) rotate(-220deg)}60%{transform:scale(1.16) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes dotBounce{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(-12px);opacity:1}}
@keyframes pulseRing{0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,.6)}55%{box-shadow:0 0 0 16px rgba(139,92,246,0)}}
@keyframes waveBar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1.3)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes breathe{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.9;transform:scale(1.02)}}
@keyframes glowPulse{0%,100%{filter:blur(40px) brightness(1)}50%{filter:blur(50px) brightness(1.3)}}

.su{animation:slideUp .42s cubic-bezier(.22,1,.36,1) both}
.su1{animation:slideUp .42s .07s cubic-bezier(.22,1,.36,1) both}
.su2{animation:slideUp .42s .14s cubic-bezier(.22,1,.36,1) both}
.su3{animation:slideUp .42s .21s cubic-bezier(.22,1,.36,1) both}
.su4{animation:slideUp .42s .28s cubic-bezier(.22,1,.36,1) both}
.su5{animation:slideUp .42s .35s cubic-bezier(.22,1,.36,1) both}
.press{transition:transform .12s ease;cursor:pointer}
.press:active{transform:scale(.93)!important}
.nav-item{transition:background .18s,color .18s,border-color .18s}
.hover-lift{transition:transform .2s ease,box-shadow .2s ease}
.hover-lift:hover{transform:translateY(-3px)}
`;

function injectCSS(){
  if(!document.getElementById("mlg")){
    const s=document.createElement("style");s.id="mlg";s.textContent=CSS;document.head.appendChild(s);
  }
}

/* ═══════════════════════════════════════════════════════
   THEMES — GLASSMORPHISM DARK / LIGHT
═══════════════════════════════════════════════════════ */
const TH={
  dark:{
    mode:"dark",
    bg:"#07061a",
    bgGrad:"linear-gradient(135deg,#07061a 0%,#0e0c2a 50%,#120e35 100%)",
    card:"rgba(18,14,44,0.6)",
    cardSolid:"#120e35",
    border:"rgba(139,92,246,0.2)",
    borderStrong:"rgba(139,92,246,0.4)",
    text:"#f0edff",
    sub:"#9b8fc0",
    muted:"#6b5f8a",
    primary:"#8b5cf6",
    primaryGrad:"linear-gradient(135deg,#8b5cf6,#a78bfa)",
    pFg:"#fff",
    accent:"#06d6a0",
    accentGrad:"linear-gradient(135deg,#06d6a0,#00b894)",
    aFg:"#fff",
    secondary:"rgba(139,92,246,0.1)",
    sFg:"#c4b5fd",
    danger:"#f87171",
    warn:"#fbbf24",
    input:"rgba(139,92,246,0.08)",
    sidebar:"rgba(7,6,26,0.85)",
    glass:"rgba(18,14,44,0.5)",
    glassStrong:"rgba(18,14,44,0.8)",
    o1:"rgba(139,92,246,0.25)",
    o2:"rgba(6,214,160,0.2)",
    o3:"rgba(239,68,68,0.15)",
    o4:"rgba(251,191,36,0.15)",
    grid:"rgba(139,92,246,0.06)",
    shadow:"0 8px 32px rgba(139,92,246,0.25)",
    shadowStrong:"0 20px 60px rgba(139,92,246,0.35)",
    glow:"rgba(139,92,246,0.4)",
  },
  light:{
    mode:"light",
    bg:"#f0ebff",
    bgGrad:"linear-gradient(135deg,#f0ebff 0%,#e8f4ff 50%,#fdf0ff 100%)",
    card:"rgba(255,255,255,0.7)",
    cardSolid:"#ffffff",
    border:"rgba(139,92,246,0.15)",
    borderStrong:"rgba(139,92,246,0.35)",
    text:"#1a1035",
    sub:"#5a4a80",
    muted:"#9080b8",
    primary:"#7c3aed",
    primaryGrad:"linear-gradient(135deg,#7c3aed,#9c5cf6)",
    pFg:"#fff",
    accent:"#059669",
    accentGrad:"linear-gradient(135deg,#059669,#06b680)",
    aFg:"#fff",
    secondary:"rgba(124,58,237,0.08)",
    sFg:"#5b21b6",
    danger:"#dc2626",
    warn:"#d97706",
    input:"rgba(255,255,255,0.8)",
    sidebar:"rgba(240,235,255,0.9)",
    glass:"rgba(255,255,255,0.6)",
    glassStrong:"rgba(255,255,255,0.9)",
    o1:"rgba(124,58,237,0.2)",
    o2:"rgba(5,150,105,0.15)",
    o3:"rgba(239,68,68,0.12)",
    o4:"rgba(217,119,6,0.12)",
    grid:"rgba(124,58,237,0.04)",
    shadow:"0 8px 32px rgba(124,58,237,0.15)",
    shadowStrong:"0 20px 60px rgba(124,58,237,0.2)",
    glow:"rgba(124,58,237,0.3)",
  },
};

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
const IC={
  home:["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  compass:["M12 2a10 10 0 100 20A10 10 0 0012 2z","M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"],
  tag:["M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z","M7 7h.01"],
  msg:["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"],
  user:["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 7a4 4 0 100 8 4 4 0 000-8z"],
  zap:["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  sparkles:["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z","M5 3l.8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8z","M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"],
  brief:["M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z","M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"],
  wrench:["M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"],
  arL:["M19 12H5","M12 19l-7-7 7-7"],
  arR:["M5 12h14","M12 5l7 7-7 7"],
  check:["M20 6L9 17l-5-5"],
  checkC:["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"],
  eye:["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  eyeO:["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24","M1 1l22 22"],
  sun:["M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42","M12 5a7 7 0 100 14A7 7 0 0012 5z"],
  moon:["M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"],
  pin:["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z","M12 7a3 3 0 100 6 3 3 0 000-6z"],
  cal:["M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z","M16 2v4M8 2v4M3 10h18"],
  shield:["M12 2l9 4-1 9.5c-.5 4-4 7-8 8-4-1-7.5-4-8-8L3 6l9-4z"],
  star:["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  heart:["M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"],
  mail:["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  phone:["M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-4.67-6.93 19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 1.27h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8.78a16 16 0 006 6l.62-.62a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"],
  send:["M22 2L11 13","M22 2l-7 20-4-9-9-4 20-7z"],
  clip:["M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"],
  search:["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"],
  clock:["M12 2a10 10 0 100 20A10 10 0 0012 2z","M12 6v6l4 2"],
  tUp:["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"],
  award:["M12 15a7 7 0 100-14 7 7 0 000 14z","M8.21 13.89L7 23l5-3 5 3-1.21-9.12"],
  mic:["M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z","M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"],
  chD:["M6 9l6 6 6-6"],
  chU:["M18 15l-6-6-6 6"],
  info:["M12 2a10 10 0 100 20A10 10 0 0012 2z","M12 16v-4M12 8h.01"],
  trending:["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"],
  bell:["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  settings:["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"],
  edit:["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  plus:["M12 5v14M5 12h14"],
  x:["M18 6L6 18","M6 6l12 12"],
};
function I({n,s=16,c="currentColor",sw=1.8}:any){
  const d=IC[n];if(!d)return null;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>{d.map((p,i)=><path key={i} d={p}/>)}</svg>;
}

/* ═══════════════════════════════════════════════════════
   ANIMATED GLASSMORPHISM BACKGROUND
═══════════════════════════════════════════════════════ */
function Bg({t}:any){
  const isDark=t.mode==="dark";
  return(
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none",background:t.bgGrad}}>
      {/* Floating orbs */}
      <div style={{position:"absolute",top:"-15%",left:"-8%",width:700,height:700,borderRadius:"50%",background:isDark?"radial-gradient(circle,rgba(139,92,246,0.3),transparent 70%)":"radial-gradient(circle,rgba(124,58,237,0.2),transparent 70%)",filter:"blur(1px)",animation:"floatA 14s ease-in-out infinite, glowPulse 7s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:"-15%",right:"-10%",width:600,height:600,borderRadius:"50%",background:isDark?"radial-gradient(circle,rgba(6,214,160,0.25),transparent 70%)":"radial-gradient(circle,rgba(5,150,105,0.18),transparent 70%)",filter:"blur(1px)",animation:"floatB 11s ease-in-out infinite, glowPulse 9s ease-in-out 3s infinite"}}/>
      <div style={{position:"absolute",top:"35%",left:"30%",width:400,height:400,borderRadius:"50%",background:isDark?"radial-gradient(circle,rgba(239,68,68,0.18),transparent 70%)":"radial-gradient(circle,rgba(239,68,68,0.12),transparent 70%)",filter:"blur(1px)",animation:"floatC 17s ease-in-out infinite"}}/>
      <div style={{position:"absolute",top:"60%",right:"20%",width:350,height:350,borderRadius:"50%",background:isDark?"radial-gradient(circle,rgba(251,191,36,0.2),transparent 70%)":"radial-gradient(circle,rgba(217,119,6,0.15),transparent 70%)",filter:"blur(1px)",animation:"floatD 12s ease-in-out 2s infinite"}}/>
      {/* Grid */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:isDark?1:0.6}}>
        <defs>
          <pattern id="gg" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke={t.grid} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gg)"/>
      </svg>
      {/* Noise texture */}
      <div style={{position:"absolute",inset:0,opacity:isDark?.04:.025,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",backgroundSize:"200px 200px"}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INTERESTS
═══════════════════════════════════════════════════════ */
const INTS=[
  {id:"cleaning",label:"Cleaning",ic:"sparkles",color:"#8b5cf6"},
  {id:"delivery",label:"Delivery",ic:"zap",color:"#06d6a0"},
  {id:"repair",label:"Repair",ic:"wrench",color:"#f59e0b"},
  {id:"tutoring",label:"Tutoring",ic:"star",color:"#3b82f6"},
  {id:"petcare",label:"Pet Care",ic:"heart",color:"#f87171"},
  {id:"gardening",label:"Gardening",ic:"sparkles",color:"#22c55e"},
  {id:"cooking",label:"Cooking",ic:"star",color:"#f97316"},
  {id:"moving",label:"Moving",ic:"zap",color:"#a78bfa"},
];

/* ═══════════════════════════════════════════════════════
   GLASS INPUT
═══════════════════════════════════════════════════════ */
function GlassInp({label,ic,type="text",value,onChange,placeholder,t,suffix,err}:any){
  const [f,setF]=useState(false);
  const isDark=t.mode==="dark";
  return(
    <div>
      {label&&<label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:700,color:t.sub,marginBottom:7,letterSpacing:"0.5px",textTransform:"uppercase"}}>
        {ic&&<I n={ic} s={11} c={t.muted}/>}{label}
      </label>}
      <div style={{position:"relative",display:"flex",alignItems:"center"}}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={()=>setF(true)} onBlur={()=>setF(false)}
          style={{
            width:"100%",
            padding:suffix?"12px 44px 12px 16px":"12px 16px",
            borderRadius:12,
            background:f?(isDark?"rgba(139,92,246,0.15)":"rgba(124,58,237,0.08)"):(isDark?"rgba(139,92,246,0.06)":"rgba(255,255,255,0.75)"),
            border:`1.5px solid ${err?t.danger:f?t.primary:t.border}`,
            color:t.text,
            fontSize:14,
            outline:"none",
            transition:"all .2s",
            backdropFilter:"blur(8px)",
            boxShadow:f?`0 0 0 3px ${t.primary}20`:"none",
          }}/>
        {suffix&&<div style={{position:"absolute",right:13}}>{suffix}</div>}
      </div>
      {err&&<p style={{fontSize:11,color:t.danger,marginTop:5,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>⚠ {err}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GLASS CARD
═══════════════════════════════════════════════════════ */
function GCard({children,t,style={},className="",onClick}:any){
  const isDark=t.mode==="dark";
  return(
    <div className={`${isDark?"glass-card-dark":"glass-card-light"} ${className}`}
      onClick={onClick}
      style={{borderRadius:20,boxShadow:t.shadow,...style}}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════ */
function LoginPage({onLogin,t,isDark,toggleTheme}:any){
  const { user, signUp, signIn, signInWithGoogle, signInWithApple, configError } = useAuth();
  const [step,setStep]=useState(1);
  const [mode,setMode]=useState<"register"|"signin">("register");
  const [role,setRole]=useState(null);
  const [showPw,setShowPw]=useState(false);
  const [authLoading,setAuthLoading]=useState(false);
  const [authError,setAuthError]=useState("");
  const [err,setErr]=useState<any>({});
  const [form,setForm]=useState<any>({name:"",age:"",gender:"",address:"",email:"",phone:"",password:"",bio:"",interests:[]});

  const upd=(k,v)=>{setForm(p=>({...p,[k]:v}));setErr(p=>({...p,[k]:""}));};
  const togInt=(id)=>setForm(p=>({...p,interests:p.interests.includes(id)?p.interests.filter(x=>x!==id):[...p.interests,id]}));

  const pwStr=useMemo(()=>{
    const p=form.password;if(!p)return{s:0,l:"",c:""};
    let sc=0;
    if(p.length>=6)sc++;if(p.length>=10)sc++;
    if(/[A-Z]/.test(p))sc++;if(/[0-9]/.test(p))sc++;if(/[^A-Za-z0-9]/.test(p))sc++;
    if(sc<=1)return{s:1,l:"Weak",c:t.danger};
    if(sc<=2)return{s:2,l:"Fair",c:t.warn};
    if(sc<=3)return{s:3,l:"Good",c:t.primary};
    return{s:4,l:"Strong",c:t.accent};
  },[form.password,t]);

  const pct=useMemo(()=>{
    const f=[form.name,form.age,form.gender,form.address,form.email,form.phone,form.password];
    return Math.round(((f.filter(x=>x.length>0).length+(form.interests.length>0?1:0))/8)*100);
  },[form]);

  const validate=()=>{
    const e:any={};
    if(!form.name.trim())e.name="Full name is required";
    if(!form.email.trim()||!/\S+@\S+\.\S+/.test(form.email))e.email="Valid email required";
    if(!form.phone.trim()||form.phone.replace(/\D/g,"").length<10)e.phone="Valid phone (10+ digits)";
    if(!form.password||form.password.length<6)e.password="Min 6 characters";
    if(!form.age||parseInt(form.age)<16||parseInt(form.age)>100)e.age="Age must be 16–100";
    if(!form.gender)e.gender="Please select gender";
    if(!form.address.trim())e.address="Address is required";
    setErr(e);return Object.keys(e).length===0;
  };

  const submit=async()=>{
    if(!validate())return;
    setAuthLoading(true);
    setAuthError("");
    try {
      const { error } = await signUp(form.email.trim().toLowerCase(), form.password, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        age: form.age,
        gender: form.gender,
        address: form.address.trim(),
        bio: form.bio.trim(),
        interests: form.interests,
        role: role || "user",
      });
      if (error) {
        setAuthError(error.message || "Registration failed");
        setAuthLoading(false);
        return;
      }
      setStep(3);
      setTimeout(()=>onLogin(), 1200);
    } catch(e:any) {
      setAuthError(e.message || "Registration failed");
    }
    setAuthLoading(false);
  };

  const signInSubmit=async()=>{
    if(!form.email||!form.password){setAuthError("Email and password required");return;}
    setAuthLoading(true);
    setAuthError("");
    const { error } = await signIn(form.email.trim().toLowerCase(), form.password);
    if (error) {
      setAuthError(error.message || "Sign in failed");
      setAuthLoading(false);
      return;
    }
    setStep(3);
    setTimeout(()=>onLogin(), 1200);
    setAuthLoading(false);
  };

  const socialLogin=async(provider:"google"|"apple")=>{
    setAuthLoading(true);
    setAuthError("");
    const result = provider === "google" ? await signInWithGoogle() : await signInWithApple();
    if (result.error) {
      setAuthError(result.error.message || "OAuth failed");
      setAuthLoading(false);
      return;
    }
    if (result.redirected) {
      return;
    }
    setStep(3);
    setTimeout(()=>onLogin(), 1200);
    setAuthLoading(false);
  };

  /* Step 3 */
  const welcomeName = (form.name?.trim() || user?.displayName || user?.email?.split("@")[0] || "User").split(" ")[0];

  if(step===3) return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}}>
      <div style={{width:88,height:88,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary},${t.accent})`,display:"flex",alignItems:"center",justifyContent:"center",animation:"spinIn .75s cubic-bezier(.22,1,.36,1) both",boxShadow:`0 0 60px ${t.glow}`}}>
        <I n="check" s={40} c="#fff" sw={2.5}/>
      </div>
      <div style={{textAlign:"center"}}>
        <h2 className="su1" style={{fontFamily:"Syne",fontSize:34,fontWeight:800,color:t.text,marginBottom:10}}>Welcome, {welcomeName}!</h2>
        <p className="su2" style={{color:t.sub,fontSize:16}}>Preparing your {role==="helper"?"helper":"user"} dashboard…</p>
      </div>
      <div className="su3" style={{display:"flex",gap:8}}>
        {[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:t.primary,animation:`dotBounce 1s ease-in-out ${i*.2}s infinite`}}/>)}
      </div>
    </div>
  );

  /* Step 2 - Sign In mode */
  if(step===2 && mode==="signin") return(
    <div className="su" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 16px 80px"}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:56,height:56,borderRadius:18,background:`linear-gradient(135deg,${t.primary},${t.accent})`,marginBottom:20,boxShadow:`0 0 40px ${t.glow}`}}>
            <I n="zap" s={24} c="#fff" sw={2}/>
          </div>
          <h2 style={{fontFamily:"Syne",fontSize:28,fontWeight:800,color:t.text}}>Welcome back</h2>
          <p style={{color:t.sub,fontSize:14,marginTop:6}}>Sign in to your MicroLink account</p>
        </div>
        <GCard t={t} style={{padding:"26px 24px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <GlassInp label="Email" ic="mail" type="email" value={form.email} onChange={(e:any)=>upd("email",e.target.value)} placeholder="you@email.com" t={t}/>
            <GlassInp label="Password" ic="shield" type={showPw?"text":"password"} value={form.password} onChange={(e:any)=>upd("password",e.target.value)} placeholder="Your password" t={t}
              suffix={<button onClick={()=>setShowPw(s=>!s)} style={{background:"none",border:"none",cursor:"pointer",color:t.muted,display:"flex",padding:0}}><I n={showPw?"eyeO":"eye"} s={15}/></button>}
            />
            {(authError||configError)&&<p style={{fontSize:12,color:t.danger,fontWeight:600,textAlign:"center"}}>⚠ {authError||configError}</p>}
            <button className="press" onClick={signInSubmit} disabled={authLoading}
              style={{width:"100%",padding:"14px 0",borderRadius:14,background:`linear-gradient(135deg,${t.primary},${t.accent})`,color:"#fff",border:"none",cursor:"pointer",fontFamily:"Syne",fontWeight:800,fontSize:15,opacity:authLoading?.6:1}}>
              {authLoading?"Signing in…":"Sign In"}
            </button>
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <button className="press" onClick={()=>socialLogin("google")} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:12,background:t.secondary,border:`1px solid ${t.border}`,cursor:"pointer",color:t.text,fontSize:12,fontWeight:600}}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="press" onClick={()=>socialLogin("apple")} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:12,background:t.secondary,border:`1px solid ${t.border}`,cursor:"pointer",color:t.text,fontSize:12,fontWeight:600}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={t.text}><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Apple
              </button>
            </div>
          </div>
        </GCard>
        <button onClick={()=>{setMode("register");setStep(1);setAuthError("");}} style={{display:"block",margin:"18px auto 0",background:"none",border:"none",cursor:"pointer",color:t.primary,fontSize:13,fontWeight:700}}>
          Don't have an account? Sign up →
        </button>
      </div>
    </div>
  );

  /* Step 2 - Registration */
  if(step===2) return(
    <div className="su" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 16px 80px"}}>
      <div style={{width:"100%",maxWidth:600}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
          <button className="press" onClick={()=>setStep(1)}
            style={{width:40,height:40,borderRadius:12,background:t.secondary,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:t.muted,cursor:"pointer"}}>
            <I n="arL" s={16}/>
          </button>
          <div style={{flex:1}}>
            <h2 style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:t.text}}>{role==="helper"?"Helper Registration":"User Registration"}</h2>
            <p style={{fontSize:12,color:t.muted,marginTop:3}}>All fields become your real profile data</p>
          </div>
          <span style={{padding:"4px 14px",borderRadius:99,fontSize:11,fontWeight:700,background:role==="helper"?`${t.accent}20`:`${t.primary}20`,color:role==="helper"?t.accent:t.primary,border:`1px solid ${role==="helper"?t.accent+"40":t.primary+"40"}`}}>
            {role==="helper"?"Helper":"User"}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
            <span style={{fontSize:12,color:t.muted,fontWeight:500}}>Profile completeness</span>
            <span style={{fontSize:12,fontWeight:800,color:t.primary}}>{pct}%</span>
          </div>
          <div style={{height:6,background:t.secondary,borderRadius:99,overflow:"hidden",border:`1px solid ${t.border}`}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${t.primary},${t.accent})`,borderRadius:99,transition:"width .45s cubic-bezier(.22,1,.36,1)",boxShadow:`0 0 12px ${t.primary}60`}}/>
          </div>
        </div>

        <GCard t={t} style={{padding:"26px 24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{gridColumn:"1/-1"}}><GlassInp label="Full Name *" ic="user" value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="Your real full name" t={t} err={err.name}/></div>
            <GlassInp label="Age *" ic="cal" type="number" value={form.age} onChange={e=>upd("age",e.target.value)} placeholder="e.g. 24" t={t} err={err.age}/>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:t.sub,marginBottom:7,letterSpacing:"0.5px",textTransform:"uppercase"}}>Gender *</label>
              <select value={form.gender} onChange={e=>upd("gender",e.target.value)}
                style={{width:"100%",padding:"12px 14px",borderRadius:12,background:t.mode==="dark"?"rgba(139,92,246,0.06)":"rgba(255,255,255,0.75)",border:`1.5px solid ${err.gender?t.danger:t.border}`,color:form.gender?t.text:t.muted,fontSize:14,outline:"none",backdropFilter:"blur(8px)"}}>
                <option value="">Select gender</option>
                <option value="Male">Male</option><option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option><option value="Prefer not to say">Prefer not to say</option>
              </select>
              {err.gender&&<p style={{fontSize:11,color:t.danger,marginTop:5,fontWeight:600}}>⚠ {err.gender}</p>}
            </div>
            <GlassInp label="Email *" ic="mail" type="email" value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="you@email.com" t={t} err={err.email}/>
            <GlassInp label="Phone *" ic="phone" type="tel" value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+91 98765 43210" t={t} err={err.phone}/>
            <div style={{gridColumn:"1/-1"}}><GlassInp label="Address *" ic="pin" value={form.address} onChange={e=>upd("address",e.target.value)} placeholder="Area, City, State, Pincode" t={t} err={err.address}/></div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:t.sub,marginBottom:7,letterSpacing:"0.5px",textTransform:"uppercase"}}>Short Bio (optional)</label>
              <textarea value={form.bio} onChange={e=>upd("bio",e.target.value)} placeholder={role==="helper"?"Describe your experience and skills…":"What kind of help are you looking for?"}
                style={{width:"100%",padding:"12px 16px",borderRadius:12,background:t.mode==="dark"?"rgba(139,92,246,0.06)":"rgba(255,255,255,0.75)",border:`1.5px solid ${t.border}`,color:t.text,fontSize:14,outline:"none",resize:"vertical",minHeight:72,backdropFilter:"blur(8px)",fontFamily:"DM Sans"}}/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <GlassInp label="Password *" ic="shield" type={showPw?"text":"password"} value={form.password} onChange={e=>upd("password",e.target.value)} placeholder="Create a strong password" t={t} err={err.password}
                suffix={<button onClick={()=>setShowPw(s=>!s)} style={{background:"none",border:"none",cursor:"pointer",color:t.muted,display:"flex",padding:0}}><I n={showPw?"eyeO":"eye"} s={15}/></button>}
              />
              {form.password.length>0&&(
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:9}}>
                  <div style={{flex:1,display:"flex",gap:3}}>
                    {[1,2,3,4].map(i=>(
                      <div key={i} style={{flex:1,height:4,borderRadius:99,background:i<=pwStr.s?pwStr.c:t.secondary,transition:"background .25s",boxShadow:i<=pwStr.s?`0 0 6px ${pwStr.c}60`:"none"}}/>
                    ))}
                  </div>
                  <span style={{fontSize:11,fontWeight:800,color:pwStr.c}}>{pwStr.l}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${t.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
              <I n="sparkles" s={14} c={t.primary}/>
              <span style={{fontSize:13,fontWeight:700,color:t.text}}>{role==="helper"?"Your Skills & Services":"What do you need help with?"}</span>
            </div>
            <p style={{fontSize:12,color:t.muted,marginBottom:14}}>Saved to profile for AI-powered task matching</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
              {INTS.map(tag=>{
                const on=form.interests.includes(tag.id);
                return(
                  <button key={tag.id} className="press" onClick={()=>togInt(tag.id)}
                    style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:99,
                      background:on?`${tag.color}22`:`${t.secondary}`,
                      color:on?tag.color:t.muted,
                      border:`1.5px solid ${on?tag.color+"55":t.border}`,
                      cursor:"pointer",fontSize:13,fontWeight:on?700:400,
                      transition:"all .18s",
                      boxShadow:on?`0 0 12px ${tag.color}30`:"none",
                    }}>
                    <I n={on?"check":tag.ic} s={12} c="currentColor"/>{tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(authError||configError)&&<p style={{fontSize:12,color:t.danger,fontWeight:600,textAlign:"center",marginTop:12}}>⚠ {authError||configError}</p>}
          <button className="press" onClick={submit} disabled={authLoading}
            style={{marginTop:24,width:"100%",padding:"14px 0",borderRadius:14,background:`linear-gradient(135deg,${t.primary},${t.accent})`,color:"#fff",border:"none",cursor:"pointer",fontFamily:"Syne",fontWeight:800,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:`0 8px 28px ${t.primary}50`,letterSpacing:"0.3px",opacity:authLoading?.6:1}}>
            {authLoading?"Creating account…":<>Create My Account <I n="arR" s={17} c="#fff" sw={2.5}/></>}
          </button>
          <p style={{fontSize:11,color:t.muted,textAlign:"center",marginTop:12}}>By registering you agree to our Terms & Privacy Policy</p>
        </GCard>
      </div>
    </div>
  );

  /* Step 1 - Role select */
  return(
    <div className="su" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 16px",position:"relative"}}>
      <button className="press" onClick={toggleTheme}
        style={{position:"absolute",top:22,right:22,display:"flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:12,background:t.glass,backdropFilter:"blur(16px)",border:`1px solid ${t.border}`,cursor:"pointer",color:t.sub,fontSize:13,fontWeight:600,boxShadow:t.shadow}}>
        <I n={isDark?"sun":"moon"} s={14}/>{isDark?"Light":"Dark"}
      </button>

      <div style={{textAlign:"center",maxWidth:700}}>
        {/* Logo mark */}
        <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:68,height:68,borderRadius:22,background:`linear-gradient(135deg,${t.primary},${t.accent})`,marginBottom:28,boxShadow:`0 0 50px ${t.glow}`,animation:"breathe 4s ease-in-out infinite"}}>
          <I n="zap" s={30} c="#fff" sw={2}/>
        </div>

        <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 20px",borderRadius:99,background:t.secondary,border:`1px solid ${t.border}`,color:t.primary,fontSize:13,fontWeight:700,marginBottom:26,backdropFilter:"blur(8px)"}}>
          <I n="sparkles" s={13} c={t.primary}/>Join the MicroLink community
        </div>

        <h1 style={{fontFamily:"Syne",fontSize:"clamp(38px,6vw,66px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-2px",marginBottom:20}}>
          <span style={{background:`linear-gradient(120deg,${t.primary},${t.accent})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Earn</span>
          <span style={{color:t.muted,margin:"0 .15em"}}>·</span>
          <span style={{background:`linear-gradient(120deg,${t.accent},#06b6d4)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Help</span>
          <span style={{color:t.muted,margin:"0 .15em"}}>·</span>
          <span style={{background:`linear-gradient(120deg,#a78bfa,${t.primary})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Grow</span>
          <br/>
          <span style={{color:t.text,fontSize:".8em",fontWeight:700}}>Together</span>
        </h1>

        <p style={{color:t.sub,fontSize:17,lineHeight:1.7,maxWidth:440,margin:"0 auto 52px"}}>
          Connect with your local community — post tasks or earn money helping others nearby.
        </p>

        <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
          {[
            {r:"user",title:"Join as User",desc:"Post tasks, find verified helpers nearby",ic:"brief",col:t.primary,grad:t.primaryGrad,feats:["Post unlimited tasks","Smart AI matching","Secure escrow payments","Rate & review helpers"]},
            {r:"helper",title:"Join as Helper",desc:"Earn by helping your community",ic:"wrench",col:t.accent,grad:t.accentGrad,feats:["Set your own rates","Flexible schedule","Build reputation","Get paid instantly"]},
          ].map(({r,title,desc,ic,col,grad,feats})=>(
            <RoleCard key={r} title={title} desc={desc} ic={ic} col={col} grad={grad} feats={feats} t={t}
              onClick={()=>{setRole(r);setStep(2);}}/>
          ))}
        </div>

        {/* Social login + Sign in */}
        <div style={{marginTop:40,display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
          <p style={{fontSize:13,color:t.muted,fontWeight:600}}>Or sign in with</p>
          <div style={{display:"flex",gap:12}}>
            <button className="press" onClick={()=>socialLogin("google")} disabled={authLoading}
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",borderRadius:14,background:t.glass,backdropFilter:"blur(16px)",border:`1px solid ${t.border}`,cursor:"pointer",color:t.text,fontSize:13,fontWeight:600,boxShadow:t.shadow}}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="press" onClick={()=>socialLogin("apple")} disabled={authLoading}
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",borderRadius:14,background:t.glass,backdropFilter:"blur(16px)",border:`1px solid ${t.border}`,cursor:"pointer",color:t.text,fontSize:13,fontWeight:600,boxShadow:t.shadow}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={t.text}><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </button>
          </div>
          <button onClick={()=>{setMode("signin");setStep(2);setRole(null);}} style={{background:"none",border:"none",cursor:"pointer",color:t.primary,fontSize:13,fontWeight:700,marginTop:4}}>
            Already have an account? Sign in →
          </button>
          {(authError||configError)&&<p style={{fontSize:12,color:t.danger,fontWeight:600,textAlign:"center"}}>{authError||configError}</p>}
        </div>
      </div>
    </div>
  );
}

function RoleCard({title,desc,ic,col,grad,feats,t,onClick}:any){
  const [h,setH]=useState(false);
  const isDark=t.mode==="dark";
  return(
    <button className="press" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick}
      style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:18,padding:"28px 24px",borderRadius:24,
        background:h?(isDark?`rgba(${col.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},0.12)`:`rgba(${col.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},0.08)`):t.glass,
        backdropFilter:"blur(20px)",
        border:`1.5px solid ${h?col+"50":t.border}`,
        cursor:"pointer",minWidth:250,textAlign:"left",
        transition:"all .22s ease",
        transform:h?"translateY(-8px)":"none",
        boxShadow:h?`0 24px 60px ${col}28,0 0 0 1px ${col}20`:t.shadow,
      }}>
      <div style={{width:56,height:56,borderRadius:18,background:h?`${grad},${col}22`:t.secondary,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .22s",boxShadow:h?`0 0 24px ${col}40`:"none"}}>
        <I n={ic} s={24} c={h?"#fff":col}/>
      </div>
      <div>
        <div style={{fontFamily:"Syne",fontSize:18,fontWeight:800,color:t.text,marginBottom:6}}>{title}</div>
        <div style={{fontSize:13,color:t.sub,lineHeight:1.6,maxWidth:200}}>{desc}</div>
      </div>
      <ul style={{display:"flex",flexDirection:"column",gap:8,listStyle:"none"}}>
        {feats.map(f=>(
          <li key={f} style={{display:"flex",alignItems:"center",gap:9,fontSize:12,color:t.muted}}>
            <div style={{width:16,height:16,borderRadius:"50%",background:`${col}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <I n="check" s={9} c={col} sw={2.5}/>
            </div>{f}
          </li>
        ))}
      </ul>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:99,background:h?grad:t.secondary,color:h?"#fff":col,fontSize:13,fontWeight:700,transition:"all .22s",border:`1px solid ${h?"transparent":col+"30"}`}}>
        Get Started <I n="arR" s={14} c="currentColor" sw={2.5}/>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   LAYOUT CHROME
═══════════════════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",label:"Dashboard",ic:"home"},
  {id:"discover",label:"Discover",ic:"compass"},
  {id:"bidding",label:"Bidding",ic:"tag"},
  {id:"chat",label:"Chat",ic:"msg"},
  {id:"profile",label:"Profile",ic:"user"},
];

function Sidebar({page,setPage,t,isDark,toggleTheme,online,setOnline,user}:any){
  const initials=user?.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"?";
  return(
    <aside style={{width:220,minHeight:"100vh",background:t.mode==="dark"?"rgba(7,6,26,0.85)":"rgba(240,235,255,0.88)",backdropFilter:"blur(24px)",borderRight:`1px solid ${t.border}`,display:"flex",flexDirection:"column",padding:"20px 10px 16px",position:"sticky",top:0,flexShrink:0,zIndex:10}}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:11,padding:"0 10px 24px"}}>
        <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${t.primary},${t.accent})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 20px ${t.glow}`}}>
          <I n="zap" s={18} c="#fff" sw={2}/>
        </div>
        <span style={{fontFamily:"Syne",fontWeight:800,fontSize:18,color:t.text,letterSpacing:"-.5px"}}>MicroLink</span>
      </div>

      {/* Nav */}
      {NAV.map(item=>{
        const a=page===item.id;
        return(
          <button key={item.id} onClick={()=>setPage(item.id)} className="nav-item"
            style={{display:"flex",alignItems:"center",gap:11,padding:"11px 14px",borderRadius:13,background:a?`linear-gradient(135deg,${t.primary}22,${t.accent}12)`:"transparent",color:a?t.primary:t.muted,border:`1px solid ${a?t.primary+"30":"transparent"}`,cursor:"pointer",width:"100%",textAlign:"left",fontWeight:a?700:400,fontSize:14,marginBottom:3,position:"relative",boxShadow:a?`0 4px 12px ${t.primary}20`:"none"}}
            onMouseEnter={e=>{if(!a){e.currentTarget.style.background=t.secondary;e.currentTarget.style.color=t.text;}}}
            onMouseLeave={e=>{if(!a){e.currentTarget.style.background="transparent";e.currentTarget.style.color=t.muted;}}}>
            {a&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:20,background:`linear-gradient(180deg,${t.primary},${t.accent})`,borderRadius:"0 3px 3px 0"}}/>}
            <I n={item.ic} s={16}/>
            {item.label}
            {item.id==="chat"&&<span style={{marginLeft:"auto",background:`linear-gradient(135deg,${t.primary},${t.accent})`,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,padding:"2px 7px",boxShadow:`0 0 8px ${t.primary}50`}}>2</span>}
          </button>
        );
      })}

      <div style={{flex:1}}/>

      {/* User card */}
      {user&&(
        <div style={{padding:"12px 12px",borderRadius:14,background:t.secondary,border:`1px solid ${t.border}`,marginBottom:10,backdropFilter:"blur(8px)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary},${t.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",flexShrink:0,boxShadow:`0 0 12px ${t.primary}50`}}>
              {initials}
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:t.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
              <div style={{fontSize:10,color:t.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Online toggle */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",marginBottom:4}}>
        <div onClick={()=>setOnline(o=>!o)} style={{width:38,height:22,borderRadius:99,background:online?`linear-gradient(90deg,${t.accent},${t.accent}cc)`:`${t.muted}40`,position:"relative",cursor:"pointer",transition:"background .25s",flexShrink:0,boxShadow:online?`0 0 10px ${t.accent}50`:"none"}}>
          <div style={{position:"absolute",top:3,left:online?18:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
        </div>
        <span style={{fontSize:12,color:online?t.accent:t.muted,fontWeight:600}}>{online?"● Online":"● Busy"}</span>
      </div>

      <button onClick={toggleTheme} className="nav-item"
        style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"none",border:"none",cursor:"pointer",color:t.muted,fontSize:12,borderRadius:10,fontWeight:500}}>
        <I n={isDark?"sun":"moon"} s={14}/>{isDark?"Light mode":"Dark mode"}
      </button>
    </aside>
  );
}

function MobileNav({page,setPage,t}:any){
  return(
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:t.mode==="dark"?"rgba(7,6,26,0.92)":"rgba(240,235,255,0.92)",backdropFilter:"blur(24px)",borderTop:`1px solid ${t.border}`,display:"flex",zIndex:20,padding:"6px 0 calc(6px + env(safe-area-inset-bottom,0px))"}}>
      {NAV.map(item=>{
        const a=page===item.id;
        return(
          <button key={item.id} onClick={()=>setPage(item.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:a?t.primary:t.muted,padding:"4px 0",position:"relative"}}>
            {a&&<div style={{position:"absolute",top:-6,width:32,height:2,background:`linear-gradient(90deg,${t.primary},${t.accent})`,borderRadius:99}}/>}
            <I n={item.ic} s={20}/>
            <span style={{fontSize:9,fontWeight:a?800:400,fontFamily:"Syne"}}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   VOICE AI BUTTON
═══════════════════════════════════════════════════════ */
function VoiceBtn({t}:any){
  const [on,setOn]=useState(false);
  const [pulsing,setPulsing]=useState(false);

  useEffect(()=>{
    if(on){
      setPulsing(true);
    } else {
      setPulsing(false);
    }
  },[on]);

  return(
    <div style={{position:"fixed",bottom:on?72:80,right:22,zIndex:15,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
      {on&&(
        <div style={{background:t.mode==="dark"?"rgba(18,14,44,0.9)":"rgba(255,255,255,0.9)",backdropFilter:"blur(16px)",border:`1px solid ${t.border}`,borderRadius:16,padding:"10px 18px",animation:"slideUp .2s ease both",boxShadow:t.shadow}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{display:"flex",gap:3,alignItems:"flex-end",height:22}}>
              {[3,5,4,6,3,5,4].map((h,i)=>(
                <div key={i} style={{width:3,background:`linear-gradient(180deg,${t.primary},${t.accent})`,borderRadius:99,height:`${h*3}px`,animation:`waveBar .5s ease-in-out ${i*.09}s infinite`}}/>
              ))}
            </div>
            <span style={{fontSize:12,fontWeight:700,color:t.sub}}>Listening…</span>
            <div style={{width:7,height:7,borderRadius:"50%",background:t.accent,animation:"breathe .8s ease-in-out infinite"}}/>
          </div>
        </div>
      )}
      <button className="press" onClick={()=>setOn(v=>!v)}
        style={{width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary},${t.accent})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 28px ${t.primary}60`,animation:pulsing?"pulseRing 1.4s ease-in-out infinite":"none",position:"relative",overflow:"visible"}}>
        {on?(
          <div style={{display:"flex",gap:3,alignItems:"flex-end"}}>
            {[1,2,3,4,3,2].map((h,i)=><div key={i} style={{width:3,background:"#fff",borderRadius:99,height:`${h*4}px`,animation:`waveBar .55s ease-in-out ${i*.09}s infinite`}}/>)}
          </div>
        ):<I n="mic" s={22} c="#fff"/>}
      </button>
    </div>
  );
}

function TopBar({t,user,online,setOnline,setPage,onSignOut}:any){
  const initials=user?.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"?";
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"14px 0 6px",gap:12}}>
      <div onClick={()=>setOnline(o=>!o)} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 15px",borderRadius:99,background:t.glass,backdropFilter:"blur(12px)",border:`1px solid ${online?t.accent+"40":t.border}`,cursor:"pointer",transition:"all .2s"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:online?t.accent:t.muted,boxShadow:online?`0 0 8px ${t.accent}`:"none",transition:"all .2s"}}/>
        <span style={{fontSize:12,fontWeight:700,color:online?t.accent:t.muted}}>{online?"Online":"Busy"}</span>
      </div>
      <button onClick={onSignOut}
        style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:99,background:t.secondary,border:`1px solid ${t.border}`,cursor:"pointer",color:t.muted,fontSize:12,fontWeight:700}}>
        <I n="x" s={12} c={t.muted}/>
        Sign out
      </button>
      <button onClick={()=>setPage("profile")}
        style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary},${t.accent})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",fontFamily:"Syne",boxShadow:`0 0 16px ${t.glow}`}}>
        {initials}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════ */
function Dashboard({t,user}:any){
  const [taskCount,setTaskCount]=useState(0);
  const [earned,setEarned]=useState(0);
  const greeting=()=>{const h=new Date().getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening";};

  const stats=[
    {label:"Tasks Completed",val:taskCount,ic:"checkC",badge:"New account",col:t.accent,grad:t.accentGrad},
    {label:"Total Earned",val:`₹${earned}`,ic:"award",badge:"Start earning!",col:t.primary,grad:t.primaryGrad},
    {label:"Active Tasks",val:"0",ic:"clock",badge:"Browse tasks",col:t.warn,grad:`linear-gradient(135deg,${t.warn},#f97316)`},
    {label:"Rating",val:"—",ic:"star",badge:"No reviews yet",col:"#fbbf24",grad:"linear-gradient(135deg,#fbbf24,#f59e0b)"},
  ];

  return(
    <div className="su" style={{padding:"20px 0",maxWidth:920}}>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <p style={{fontSize:13,color:t.muted,fontWeight:600,marginBottom:6}}>{greeting()}, {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</p>
            <h2 style={{fontFamily:"Syne",fontSize:28,fontWeight:800,color:t.text,letterSpacing:"-0.5px"}}>
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h2>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
              <span style={{padding:"3px 12px",borderRadius:99,fontSize:11,fontWeight:700,background:user?.role==="helper"?`${t.accent}20`:`${t.primary}20`,color:user?.role==="helper"?t.accent:t.primary,border:`1px solid ${user?.role==="helper"?t.accent+"40":t.primary+"40"}`}}>
                {user?.role==="helper"?"⚡ Helper":"👤 User"}
              </span>
              <span style={{fontSize:12,color:t.muted}}>Joined {user?.joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginBottom:28}}>
        {stats.map((s,i)=>(
          <GCard key={s.label} t={t} className={`su${i}`} style={{padding:"20px 20px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{width:42,height:42,borderRadius:13,background:`${s.col}18`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 16px ${s.col}30`}}>
                <I n={s.ic} s={18} c={s.col}/>
              </div>
              <span style={{fontSize:10,fontWeight:800,color:s.col,background:`${s.col}15`,padding:"3px 9px",borderRadius:99,border:`1px solid ${s.col}30`}}>{s.badge}</span>
            </div>
            <div style={{fontFamily:"Syne",fontSize:28,fontWeight:800,color:t.text,marginBottom:3}}>{s.val}</div>
            <div style={{fontSize:12,color:t.muted,fontWeight:500}}>{s.label}</div>
          </GCard>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{marginBottom:24}}>
        <h3 style={{fontFamily:"Syne",fontSize:15,fontWeight:700,color:t.text,marginBottom:13}}>Quick Actions</h3>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {(user?.role==="helper"?[
            {label:"Browse Tasks",ic:"compass",col:t.primary},
            {label:"View My Bids",ic:"tag",col:t.accent},
            {label:"Check Messages",ic:"msg",col:"#3b82f6"},
          ]:[
            {label:"Post a Task",ic:"plus",col:t.primary},
            {label:"Find Helpers",ic:"compass",col:t.accent},
            {label:"Messages",ic:"msg",col:"#3b82f6"},
          ]).map(a=>(
            <button key={a.label} className="press hover-lift"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:12,background:`${a.col}12`,color:a.col,border:`1.5px solid ${a.col}30`,cursor:"pointer",fontSize:13,fontWeight:700,backdropFilter:"blur(8px)"}}>
              <I n={a.ic} s={14} c={a.col}/>{a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile info */}
      <h3 style={{fontFamily:"Syne",fontSize:15,fontWeight:700,color:t.text,marginBottom:13}}>Your Profile Information</h3>
      <GCard t={t} style={{overflow:"hidden"}}>
        {[
          {label:"Full Name",val:user?.name,ic:"user"},
          {label:"Email Address",val:user?.email,ic:"mail"},
          {label:"Phone Number",val:user?.phone,ic:"phone"},
          {label:"Location",val:user?.address,ic:"pin"},
          {label:"Age",val:user?.age?`${user.age} years old`:null,ic:"cal"},
          {label:"Gender",val:user?.gender,ic:"user"},
          {label:"Account Type",val:user?.role==="helper"?"Helper Account":"User Account",ic:user?.role==="helper"?"wrench":"brief"},
          {label:user?.role==="helper"?"Skills & Services":"Interests",val:user?.interests?.length>0?user.interests.map(id=>INTS.find(x=>x.id===id)?.label).filter(Boolean).join(", "):"None selected",ic:"sparkles"},
          ...(user?.bio?[{label:"Bio",val:user.bio,ic:"info"}]:[]),
        ].map((row,i,arr)=>(
          <div key={row.label} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 22px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=t.secondary}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:34,height:34,borderRadius:10,background:t.secondary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${t.border}`}}>
              <I n={row.ic} s={14} c={t.muted}/>
            </div>
            <div>
              <div style={{fontSize:11,color:t.muted,fontWeight:700,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.5px"}}>{row.label}</div>
              <div style={{fontSize:13,color:row.val?t.text:t.muted,fontWeight:500}}>{row.val||"—"}</div>
            </div>
          </div>
        ))}
      </GCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DISCOVER
═══════════════════════════════════════════════════════ */
const TASKS_DATA=[
  {id:1,title:"Math Tutor Needed",loc:"Alkapuri, Vadodara",budget:700,cat:"Tutoring",urgent:false,dist:"1.2 km",desc:"Need a patient math tutor for Class 10 board prep. 3 sessions/week.",poster:"Rahul M.",posted:"45 min ago",rating:4.8},
  {id:2,title:"Laptop WiFi Repair",loc:"Manjalpur, Vadodara",budget:500,cat:"Repair",urgent:true,dist:"2.4 km",desc:"WiFi stopped working after an update. Need urgent diagnosis + fix.",poster:"Sneha K.",posted:"1 hr ago",rating:4.6},
  {id:3,title:"Grocery Pickup",loc:"Karelibaug",budget:200,cat:"Delivery",urgent:false,dist:"0.8 km",desc:"Pick up groceries from Reliance Fresh and deliver to my apartment.",poster:"Amit P.",posted:"2 hr ago",rating:4.9},
  {id:4,title:"Kitchen Sink Plumbing",loc:"Gotri",budget:600,cat:"Repair",urgent:true,dist:"3.1 km",desc:"Persistent kitchen sink leak. Need experienced plumber ASAP.",poster:"Priya S.",posted:"3 hr ago",rating:4.7},
  {id:5,title:"React Developer Help",loc:"Fatehgunj",budget:900,cat:"Tech",urgent:false,dist:"1.8 km",desc:"Need help debugging a React app. 2-3 hours of pair programming.",poster:"Dev R.",posted:"4 hr ago",rating:5.0},
  {id:6,title:"Dog Walking",loc:"Sama",budget:300,cat:"Pet Care",urgent:false,dist:"2.2 km",desc:"Walk my Golden Retriever daily for 30 mins. Morning preferred.",poster:"Nisha T.",posted:"5 hr ago",rating:4.5},
];
const MAP_PINS=[
  {x:22,y:25,label:"Tutor",col:"#3b82f6"},
  {x:58,y:18,label:"Repair",col:"#f59e0b"},
  {x:36,y:60,label:"Delivery",col:"#06d6a0"},
  {x:72,y:48,label:"Plumbing",col:"#f87171"},
  {x:48,y:38,label:"Tech",col:"#8b5cf6"},
  {x:82,y:72,label:"Pet Care",col:"#ec4899"},
];

function Discover({t}:any){
  const [q,setQ]=useState("");
  const [filt,setFilt]=useState("All");
  const [cat,setCat]=useState(null);
  const [sel,setSel]=useState(null);

  let tasks=[...TASKS_DATA];
  if(q)tasks=tasks.filter(x=>x.title.toLowerCase().includes(q.toLowerCase())||x.desc.toLowerCase().includes(q.toLowerCase()));
  if(cat)tasks=tasks.filter(x=>x.cat===cat);
  if(filt==="High Pay")tasks=[...tasks].sort((a,b)=>b.budget-a.budget);
  if(filt==="Urgent")tasks=tasks.filter(x=>x.urgent);
  if(filt==="Nearby")tasks=[...tasks].sort((a,b)=>parseFloat(a.dist)-parseFloat(b.dist));

  return(
    <div className="su" style={{padding:"20px 0",maxWidth:950}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:"Syne",fontSize:28,fontWeight:800,color:t.text,letterSpacing:"-0.5px"}}>Task Discovery</h2>
        <p style={{color:t.sub,marginTop:5,fontSize:14}}>{tasks.length} tasks available near you</p>
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:14}}>
        <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)"}}><I n="search" s={16} c={t.muted}/></div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tasks by title or description…"
          style={{width:"100%",padding:"12px 16px 12px 44px",borderRadius:14,background:t.glass,backdropFilter:"blur(16px)",border:`1.5px solid ${t.border}`,color:t.text,fontSize:14,outline:"none",transition:"border-color .15s"}}
          onFocus={e=>e.target.style.borderColor=t.primary} onBlur={e=>e.target.style.borderColor=t.border}/>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        {["Repair","Tutoring","Delivery","Tech","Pet Care"].map(c=>(
          <button key={c} className="press" onClick={()=>setCat(cat===c?null:c)}
            style={{padding:"6px 15px",borderRadius:99,fontSize:12,fontWeight:700,cursor:"pointer",background:cat===c?t.primary:t.secondary,color:cat===c?"#fff":t.muted,border:`1.5px solid ${cat===c?t.primary:t.border}`,transition:"all .15s",boxShadow:cat===c?`0 0 12px ${t.primary}40`:"none"}}>{c}</button>
        ))}
        <div style={{width:1,height:20,background:t.border}}/>
        {["All","Nearby","High Pay","Urgent"].map(f=>(
          <button key={f} className="press" onClick={()=>setFilt(f)}
            style={{padding:"6px 15px",borderRadius:99,fontSize:12,fontWeight:700,cursor:"pointer",background:filt===f?`${t.accent}20`:"transparent",color:filt===f?t.accent:t.muted,border:`1.5px solid ${filt===f?t.accent+"50":t.border}`,transition:"all .15s"}}>{f}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Map */}
        <div style={{position:"relative",height:320,borderRadius:20,overflow:"hidden",border:`1px solid ${t.border}`}}>
          <div style={{position:"absolute",inset:0,background:t.mode==="dark"?"rgba(18,14,44,0.8)":"rgba(240,235,255,0.8)",backdropFilter:"blur(4px)"}}/>
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.3}}>
            <defs><pattern id="mg" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke={t.primary} strokeWidth=".7"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#mg)"/>
          </svg>
          {/* Decorative roads */}
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.2}}>
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke={t.muted} strokeWidth="1.5" strokeDasharray="8,4"/>
            <line x1="35%" y1="0" x2="35%" y2="100%" stroke={t.muted} strokeWidth="1.5" strokeDasharray="8,4"/>
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke={t.muted} strokeWidth="1" strokeDasharray="4,6"/>
            <line x1="0" y1="70%" x2="100%" y2="70%" stroke={t.muted} strokeWidth="1" strokeDasharray="4,6"/>
          </svg>
          {MAP_PINS.map((p,i)=>(
            <div key={i} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,display:"flex",flexDirection:"column",alignItems:"center",animation:`slideUp .5s ease ${i*.12}s both`,zIndex:2}}>
              <div style={{position:"relative"}}>
                <div style={{position:"absolute",inset:-4,borderRadius:"50%",background:`${p.col}25`,animation:`ripple 2.8s ease-out ${i*.45}s infinite`}}/>
                <div style={{width:16,height:16,borderRadius:"50%",background:p.col,border:"2.5px solid rgba(255,255,255,0.8)",position:"relative",zIndex:1,boxShadow:`0 0 12px ${p.col}70`}}/>
              </div>
              <span style={{marginTop:6,fontSize:9,fontWeight:800,color:t.text,background:t.mode==="dark"?"rgba(18,14,44,0.85)":"rgba(255,255,255,0.88)",backdropFilter:"blur(8px)",padding:"2px 7px",borderRadius:6,whiteSpace:"nowrap",border:`1px solid ${p.col}30`}}>{p.label}</span>
            </div>
          ))}
          <div style={{position:"absolute",bottom:14,left:14,background:t.mode==="dark"?"rgba(18,14,44,0.88)":"rgba(255,255,255,0.88)",backdropFilter:"blur(12px)",padding:"6px 14px",borderRadius:10,fontSize:12,color:t.text,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:6,fontWeight:600}}>
            <I n="pin" s={12} c={t.primary}/>{tasks.length} tasks found
          </div>
          <div style={{position:"absolute",top:14,right:14,background:t.mode==="dark"?"rgba(18,14,44,0.88)":"rgba(255,255,255,0.88)",backdropFilter:"blur(12px)",padding:"4px 12px",borderRadius:99,fontSize:11,color:t.accent,border:`1px solid ${t.accent}30`,fontWeight:700}}>● LIVE</div>
        </div>

        {/* Task list */}
        <div style={{display:"flex",flexDirection:"column",gap:10,overflowY:"auto",maxHeight:320,paddingRight:2}}>
          {tasks.length===0?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:200,gap:12,color:t.muted}}>
              <I n="search" s={28} c={t.muted}/>
              <span style={{fontSize:13,fontWeight:600}}>No tasks match your search</span>
            </div>
          ):tasks.map((task,i)=>(
            <div key={task.id} className="hover-lift"
              onClick={()=>setSel(sel===task.id?null:task.id)}
              style={{padding:"14px 16px",borderRadius:14,background:sel===task.id?`${t.primary}12`:t.glass,backdropFilter:"blur(16px)",border:`1.5px solid ${sel===task.id?t.primary+"50":t.border}`,animation:`slideIn .3s ease ${i*.06}s both`,cursor:"pointer",transition:"all .18s",boxShadow:sel===task.id?`0 4px 20px ${t.primary}20`:t.shadow}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                    <span style={{fontSize:13,fontWeight:700,color:t.text}}>{task.title}</span>
                    {task.urgent&&<span style={{fontSize:9,fontWeight:800,color:t.danger,background:`${t.danger}18`,padding:"2px 7px",borderRadius:99,border:`1px solid ${t.danger}30`}}>URGENT</span>}
                  </div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:t.muted,display:"flex",alignItems:"center",gap:3}}><I n="pin" s={10}/>{task.loc}</span>
                    <span style={{fontSize:11,color:t.muted,display:"flex",alignItems:"center",gap:3}}><I n="clock" s={10}/>{task.dist}</span>
                    <span style={{fontSize:11,color:t.muted,display:"flex",alignItems:"center",gap:3}}><I n="user" s={10}/>{task.poster}</span>
                  </div>
                  {sel===task.id&&<p style={{fontSize:12,color:t.sub,marginTop:8,lineHeight:1.5,animation:"fadeIn .2s ease both"}}>{task.desc}</p>}
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"Syne",fontSize:16,fontWeight:800,color:t.text}}>₹{task.budget}</div>
                  <div style={{fontSize:11,color:t.muted}}>{task.posted}</div>
                </div>
              </div>
              {sel===task.id&&(
                <button className="press" style={{marginTop:10,width:"100%",padding:"8px 0",borderRadius:10,background:`linear-gradient(135deg,${t.primary},${t.accent})`,color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"Syne",boxShadow:`0 4px 14px ${t.primary}40`,animation:"fadeIn .2s ease both"}}>
                  Apply for this Task →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BIDDING
═══════════════════════════════════════════════════════ */
const BIDS_DATA=[
  {id:1,title:"Fix Laptop WiFi",budget:500,loc:"Manjalpur",posted:"30 min ago",desc:"WiFi adapter stopped working after Windows update. Need someone experienced to diagnose and fix. Must bring own tools if needed.",bids:3,poster:"Raj Patel",posterRating:4.8,cat:"Tech"},
  {id:2,title:"Math Tutor for Class 10",budget:700,loc:"Alkapuri",posted:"1 hr ago",desc:"Need a math tutor for my son who is preparing for board exams. Focus on algebra, geometry, and statistics. 2 sessions per week, 1.5 hrs each.",bids:5,poster:"Priya Sharma",posterRating:4.9,cat:"Tutoring"},
  {id:3,title:"Home Plumbing Fix",budget:800,loc:"Gotri",posted:"2 hr ago",desc:"Kitchen sink has been leaking for 3 days. Need an experienced plumber to fix it permanently. All materials will be provided.",bids:2,poster:"Amit Kumar",posterRating:4.6,cat:"Repair"},
  {id:4,title:"Evening Dog Walk",budget:300,loc:"Sama",posted:"3 hr ago",desc:"Daily 30-minute walk for my friendly Labrador. 6–7 PM preferred. Dog is vaccinated and leash-trained.",bids:1,poster:"Nisha Tiwari",posterRating:5.0,cat:"Pet Care"},
];

function Bidding({t}:any){
  const [exp,setExp]=useState(null);
  const [amounts,setAmounts]=useState({});
  const [placed,setPlaced]=useState(new Set());
  const [note,setNote]=useState({});

  return(
    <div className="su" style={{padding:"20px 0",maxWidth:720}}>
      <div style={{marginBottom:24}}>
        <h2 style={{fontFamily:"Syne",fontSize:28,fontWeight:800,color:t.text,letterSpacing:"-0.5px"}}>Task Bidding</h2>
        <p style={{color:t.sub,marginTop:5,fontSize:14}}>{BIDS_DATA.length - placed.size} active tasks accepting bids</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:13}}>
        {BIDS_DATA.map((task,i)=>{
          const open=exp===task.id,done=placed.has(task.id);
          return(
            <GCard key={task.id} t={t} className={`su${i}`} style={{overflow:"hidden",border:`1.5px solid ${open?t.primary+"50":t.border}`,transition:"border-color .2s"}}>
              <button onClick={()=>setExp(open?null:task.id)}
                style={{width:"100%",padding:"18px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",gap:12}}>
                <div style={{textAlign:"left",flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:15,fontWeight:700,color:t.text}}>{task.title}</span>
                    <span style={{fontSize:9,fontWeight:800,color:t.primary,background:`${t.primary}15`,padding:"2px 8px",borderRadius:99}}>{task.cat}</span>
                  </div>
                  <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                    {[{n:"pin",v:task.loc},{n:"clock",v:task.posted},{n:"tag",v:`${task.bids} bids`},{n:"user",v:task.poster}].map(x=>(
                      <span key={x.v} style={{fontSize:12,color:t.muted,display:"flex",alignItems:"center",gap:4}}><I n={x.n} s={11}/>{x.v}</span>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"Syne",fontSize:20,fontWeight:800,color:t.text}}>₹{task.budget}</div>
                    <div style={{fontSize:10,color:t.muted}}>budget</div>
                  </div>
                  <div style={{width:28,height:28,borderRadius:8,background:t.secondary,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .2s",transform:open?"rotate(180deg)":"none"}}>
                    <I n="chD" s={14} c={t.muted}/>
                  </div>
                </div>
              </button>
              {open&&(
                <div style={{padding:"0 22px 22px",borderTop:`1px solid ${t.border}`,paddingTop:18,animation:"slideUp .22s ease both"}}>
                  <div style={{padding:"12px 16px",borderRadius:12,background:t.secondary,border:`1px solid ${t.border}`,marginBottom:14}}>
                    <p style={{fontSize:13,color:t.sub,lineHeight:1.7}}>{task.desc}</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,padding:"8px 14px",borderRadius:10,background:`${t.primary}10`,border:`1px solid ${t.primary}20`}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary},${t.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0}}>
                      {task.poster[0]}
                    </div>
                    <div>
                      <span style={{fontSize:12,fontWeight:700,color:t.text}}>{task.poster}</span>
                      <span style={{fontSize:11,color:t.muted,marginLeft:8}}>★ {task.posterRating} rating</span>
                    </div>
                  </div>
                  {done?(
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",borderRadius:12,background:`${t.accent}15`,border:`1px solid ${t.accent}30`}}>
                      <I n="checkC" s={18} c={t.accent}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:t.accent}}>Bid placed: ₹{amounts[task.id]||task.budget}</div>
                        <div style={{fontSize:11,color:t.muted}}>Waiting for {task.poster} to accept</div>
                      </div>
                    </div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      <div style={{display:"flex",gap:10}}>
                        <div style={{position:"relative",flex:1}}>
                          <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,color:t.sub,fontWeight:700}}>₹</span>
                          <input type="number" placeholder={`${task.budget}`} value={amounts[task.id]||""}
                            onChange={e=>setAmounts(p=>({...p,[task.id]:e.target.value}))}
                            style={{width:"100%",padding:"11px 14px 11px 30px",borderRadius:12,background:t.input,border:`1.5px solid ${t.border}`,color:t.text,fontSize:14,outline:"none",backdropFilter:"blur(8px)"}}/>
                        </div>
                        <button className="press" onClick={()=>setPlaced(p=>new Set([...p,task.id]))}
                          style={{padding:"11px 22px",borderRadius:12,background:`linear-gradient(135deg,${t.primary},${t.accent})`,color:"#fff",border:"none",cursor:"pointer",fontFamily:"Syne",fontWeight:700,fontSize:14,flexShrink:0,boxShadow:`0 4px 16px ${t.primary}40`}}>
                          Place Bid
                        </button>
                      </div>
                      <textarea placeholder="Add a note to your bid (optional)…" value={note[task.id]||""} onChange={e=>setNote(p=>({...p,[task.id]:e.target.value}))}
                        style={{padding:"10px 14px",borderRadius:12,background:t.input,border:`1.5px solid ${t.border}`,color:t.text,fontSize:13,outline:"none",resize:"none",height:60,backdropFilter:"blur(8px)",fontFamily:"DM Sans"}}/>
                    </div>
                  )}
                </div>
              )}
            </GCard>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAT
═══════════════════════════════════════════════════════ */
const CONVOS_DATA=[
  {id:0,name:"Raj Patel",last:"I can come by today afternoon.",time:"10:32 AM",unread:2,online:true,avatar:"R",role:"Helper"},
  {id:1,name:"Priya Sharma",last:"Thanks for the tutoring session!",time:"9:15 AM",unread:0,online:false,avatar:"P",role:"Helper"},
  {id:2,name:"Amit Kumar",last:"Is the plumbing work done?",time:"Yesterday",unread:1,online:false,avatar:"A",role:"User"},
];
const MSGS_INIT=[
  {id:1,from:"them",text:"Hello! I saw your task posting for the laptop repair.",time:"10:30 AM"},
  {id:2,from:"me",text:"Hi! Yes, my laptop WiFi isn't working after an update. Can you fix it?",time:"10:31 AM"},
  {id:3,from:"them",text:"Absolutely, I specialise in hardware and driver issues. I have my tools ready.",time:"10:32 AM"},
  {id:4,from:"me",text:"Great! What time works for you today?",time:"10:33 AM"},
  {id:5,from:"them",text:"I can come by today afternoon around 3 PM. Does that work?",time:"10:34 AM"},
];

function Chat({t}:any){
  const [msgs,setMsgs]=useState(MSGS_INIT);
  const [inp,setInp]=useState("");
  const [active,setActive]=useState(0);
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs,active]);

  const send=()=>{
    if(!inp.trim())return;
    const now=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    setMsgs(p=>[...p,{id:p.length+1,from:"me",text:inp.trim(),time:now}]);
    setInp("");
  };

  return(
    <div className="su" style={{padding:"20px 0",maxWidth:950}}>
      <div style={{marginBottom:18}}>
        <h2 style={{fontFamily:"Syne",fontSize:28,fontWeight:800,color:t.text,letterSpacing:"-0.5px"}}>Messages</h2>
        <p style={{color:t.sub,marginTop:5,fontSize:14}}>Chat with task helpers and users</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"230px 1fr",gap:14,height:540}}>
        {/* Sidebar */}
        <GCard t={t} style={{display:"flex",flexDirection:"column",overflow:"hidden",padding:0}}>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:13,fontWeight:800,color:t.text,fontFamily:"Syne"}}>Conversations</span>
            <span style={{width:20,height:20,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary},${t.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff"}}>3</span>
          </div>
          {CONVOS_DATA.map((c,i)=>(
            <button key={c.id} onClick={()=>setActive(i)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:active===i?`${t.primary}12`:"none",borderLeft:`2.5px solid ${active===i?t.primary:"transparent"}`,border:"none",borderBottom:`1px solid ${t.border}`,cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
              <div style={{position:"relative",flexShrink:0}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary}80,${t.accent}80)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff"}}>{c.avatar}</div>
                {c.online&&<div style={{position:"absolute",bottom:1,right:1,width:10,height:10,borderRadius:"50%",background:t.accent,border:`2px solid ${t.card}`,boxShadow:`0 0 6px ${t.accent}`}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:700,color:t.text}}>{c.name}</span>
                  <span style={{fontSize:10,color:t.muted}}>{c.time}</span>
                </div>
                <p style={{fontSize:11,color:t.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>{c.last}</p>
              </div>
              {c.unread>0&&<span style={{width:20,height:20,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary},${t.accent})`,color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 8px ${t.primary}50`}}>{c.unread}</span>}
            </button>
          ))}
        </GCard>

        {/* Chat panel */}
        <GCard t={t} style={{display:"flex",flexDirection:"column",overflow:"hidden",padding:0}}>
          {/* Header */}
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:14}}>
            <div style={{position:"relative"}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${t.primary}80,${t.accent}80)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff"}}>{CONVOS_DATA[active].avatar}</div>
              {CONVOS_DATA[active].online&&<div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:t.accent,border:`2px solid ${t.card}`}}/>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:t.text,fontFamily:"Syne"}}>{CONVOS_DATA[active].name}</div>
              <div style={{fontSize:11,fontWeight:600,color:CONVOS_DATA[active].online?t.accent:t.muted,display:"flex",alignItems:"center",gap:4}}>
                {CONVOS_DATA[active].online?<><div style={{width:6,height:6,borderRadius:"50%",background:t.accent}}/>Online</>:"Offline"}
                <span style={{marginLeft:8,color:t.muted}}>· {CONVOS_DATA[active].role}</span>
              </div>
            </div>
            <button style={{width:34,height:34,borderRadius:10,background:t.secondary,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.muted}}>
              <I n="info" s={14}/>
            </button>
          </div>
          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
            {msgs.map((m,i)=>(
              <div key={m.id} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start",animation:`slideUp .22s ease ${i*.02}s both`}}>
                <div style={{maxWidth:"74%",padding:"11px 16px",borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.from==="me"?`linear-gradient(135deg,${t.primary},${t.primary}cc)`:t.secondary,color:m.from==="me"?"#fff":t.text,boxShadow:m.from==="me"?`0 4px 14px ${t.primary}40`:t.shadow}}>
                  <p style={{fontSize:13,lineHeight:1.55}}>{m.text}</p>
                  <p style={{fontSize:10,marginTop:4,opacity:.65,textAlign:m.from==="me"?"right":"left"}}>{m.time}</p>
                </div>
              </div>
            ))}
            <div ref={endRef}/>
          </div>
          {/* Input */}
          <div style={{padding:"12px 16px",borderTop:`1px solid ${t.border}`,display:"flex",gap:9,alignItems:"center"}}>
            <button style={{width:36,height:36,borderRadius:10,background:t.secondary,border:`1px solid ${t.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:t.muted,flexShrink:0}}>
              <I n="clip" s={14}/>
            </button>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message…"
              style={{flex:1,padding:"10px 15px",borderRadius:12,background:t.input,border:`1.5px solid ${t.border}`,color:t.text,fontSize:13,outline:"none",backdropFilter:"blur(8px)",transition:"border-color .15s"}}
              onFocus={e=>e.target.style.borderColor=t.primary} onBlur={e=>e.target.style.borderColor=t.border}/>
            <button className="press" onClick={send}
              style={{width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${t.primary},${t.accent})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px ${t.primary}40`,flexShrink:0}}>
              <I n="send" s={14} c="#fff"/>
            </button>
          </div>
        </GCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROFILE — REAL USER DATA ONLY
═══════════════════════════════════════════════════════ */
function Profile({t,user,online,setOnline}:any){
  if(!user)return null;
  const initials=user.name.split(" ").map((w:string)=>w[0]).join("").toUpperCase().slice(0,2);
  const ints=user.interests.map((id:string)=>INTS.find(x=>x.id===id)).filter(Boolean);
  const memberDays=Math.floor((Date.now()-new Date(user.joinedFull||Date.now()).getTime())/(1000*60*60*24));

  return(
    <div className="su" style={{padding:"20px 0",maxWidth:640}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <h2 style={{fontFamily:"Syne",fontSize:28,fontWeight:800,color:t.text,letterSpacing:"-0.5px"}}>My Profile</h2>
          <p style={{fontSize:12,color:t.muted,marginTop:4,display:"flex",alignItems:"center",gap:5}}>
            <I n="info" s={11} c={t.muted}/>All data from your registration
          </p>
        </div>
        <button className="press" style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:12,background:t.secondary,border:`1px solid ${t.border}`,cursor:"pointer",color:t.muted,fontSize:12,fontWeight:600}}>
          <I n="edit" s={13}/>Edit Profile
        </button>
      </div>

      {/* Hero card */}
      <GCard t={t} style={{padding:"24px 24px",marginBottom:14}}>
        <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${t.primary},${t.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne",fontSize:28,fontWeight:800,color:"#fff",boxShadow:`0 0 40px ${t.glow}`}}>
              {initials}
            </div>
            <div onClick={()=>setOnline(o=>!o)} title="Click to toggle status"
              style={{position:"absolute",bottom:4,right:4,width:16,height:16,borderRadius:"50%",background:online?t.accent:t.muted,border:`2.5px solid ${t.card}`,cursor:"pointer",transition:"background .2s",boxShadow:online?`0 0 8px ${t.accent}`:"none"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:10}}>
              <h3 style={{fontFamily:"Syne",fontSize:22,fontWeight:800,color:t.text}}>{user.name}</h3>
              <span style={{padding:"3px 11px",borderRadius:99,fontSize:11,fontWeight:700,background:online?`${t.accent}20`:`${t.muted}15`,color:online?t.accent:t.muted,border:`1px solid ${online?t.accent+"40":t.border}`}}>
                {online?"● Online":"● Busy"}
              </span>
              <span style={{padding:"3px 11px",borderRadius:99,fontSize:11,fontWeight:700,background:`${t.primary}15`,color:t.primary,border:`1px solid ${t.primary}30`}}>
                {user.role==="helper"?"⚡ Helper":"👤 User"}
              </span>
            </div>
            {user.bio&&<p style={{fontSize:13,color:t.sub,lineHeight:1.6,marginBottom:12,fontStyle:"italic"}}>"{user.bio}"</p>}
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {user.address&&<span style={{fontSize:12,color:t.muted,display:"flex",alignItems:"center",gap:4}}><I n="pin" s={11} c={t.muted}/>{user.address}</span>}
              <span style={{fontSize:12,color:t.muted,display:"flex",alignItems:"center",gap:4}}><I n="cal" s={11} c={t.muted}/>Joined {user.joinedDate}</span>
              {memberDays>=0&&<span style={{fontSize:12,color:t.muted}}>· {memberDays===0?"Today":"Day "+memberDays}</span>}
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:20,paddingTop:18,borderTop:`1px solid ${t.border}`}}>
          {[{label:"Tasks",val:"0"},{label:"Reviews",val:"—"},{label:"Rating",val:"—"}].map(s=>(
            <div key={s.label} style={{textAlign:"center",padding:"10px 0",borderRadius:12,background:t.secondary}}>
              <div style={{fontFamily:"Syne",fontSize:20,fontWeight:800,color:t.text}}>{s.val}</div>
              <div style={{fontSize:11,color:t.muted,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
      </GCard>

      {/* Contact info */}
      <GCard t={t} style={{overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"14px 22px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:8}}>
          <I n="user" s={14} c={t.primary}/>
          <span style={{fontSize:13,fontWeight:800,color:t.text,fontFamily:"Syne"}}>Contact Information</span>
        </div>
        {[
          {ic:"mail",label:"Email Address",val:user.email},
          {ic:"phone",label:"Phone Number",val:user.phone},
          {ic:"pin",label:"Location",val:user.address},
          {ic:"cal",label:"Age",val:user.age?`${user.age} years old`:null},
          {ic:"user",label:"Gender",val:user.gender},
        ].filter(r=>r.val).map((row,i,arr)=>(
          <div key={row.label} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 22px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=t.secondary}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:36,height:36,borderRadius:11,background:t.secondary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${t.border}`}}>
              <I n={row.ic} s={14} c={t.muted}/>
            </div>
            <div>
              <div style={{fontSize:10,color:t.muted,fontWeight:700,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.5px"}}>{row.label}</div>
              <div style={{fontSize:14,color:t.text,fontWeight:600}}>{row.val}</div>
            </div>
          </div>
        ))}
      </GCard>

      {/* Skills / Interests — real from form */}
      {ints.length>0&&(
        <GCard t={t} style={{padding:"18px 22px",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:800,color:t.text,marginBottom:14,display:"flex",alignItems:"center",gap:8,fontFamily:"Syne"}}>
            <I n="sparkles" s={14} c={t.primary}/>{user.role==="helper"?"Skills & Services Offered":"My Interests"}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
            {ints.map(tag=>(
              <span key={tag.id} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:99,background:`${tag.color}15`,color:tag.color,fontSize:13,fontWeight:700,border:`1.5px solid ${tag.color}30`,boxShadow:`0 0 10px ${tag.color}20`}}>
                <I n={tag.ic} s={13} c={tag.color}/>{tag.label}
              </span>
            ))}
          </div>
        </GCard>
      )}

      {/* Badges */}
      <GCard t={t} style={{padding:"18px 22px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,color:t.text,marginBottom:14,display:"flex",alignItems:"center",gap:8,fontFamily:"Syne"}}>
          <I n="shield" s={14} c={t.primary}/>Badges & Status
        </div>
        <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:12}}>
          <span style={{padding:"5px 14px",borderRadius:99,fontSize:12,fontWeight:700,background:`${t.primary}15`,color:t.primary,border:`1px solid ${t.primary}30`}}>✦ New Member</span>
          {ints.length>0&&<span style={{padding:"5px 14px",borderRadius:99,fontSize:12,fontWeight:700,background:`${t.accent}15`,color:t.accent,border:`1px solid ${t.accent}30`}}>✦ Profile Complete</span>}
          <span style={{padding:"5px 14px",borderRadius:99,fontSize:12,fontWeight:700,background:`${t.warn}15`,color:t.warn,border:`1px solid ${t.warn}30`}}>⏳ ID Pending</span>
        </div>
        <p style={{fontSize:12,color:t.muted,lineHeight:1.65}}>
          Complete your first {user.role==="helper"?"task":"hire"} to unlock ratings, community reviews, and verified badges.
        </p>
      </GCard>

      {/* Empty reviews */}
      <GCard t={t} style={{padding:"22px 24px"}}>
        <div style={{fontSize:13,fontWeight:800,color:t.text,marginBottom:18,fontFamily:"Syne"}}>Community Reviews</div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 0",gap:12}}>
          <div style={{width:56,height:56,borderRadius:18,background:t.secondary,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${t.border}`}}>
            <I n="star" s={26} c={t.muted}/>
          </div>
          <p style={{fontSize:14,fontWeight:700,color:t.text}}>No reviews yet</p>
          <p style={{fontSize:12,color:t.muted,textAlign:"center",maxWidth:300,lineHeight:1.65}}>
            {user.role==="helper"?"Complete your first task and ask your client to leave a review.":"Post and complete a task to start receiving community feedback."}
          </p>
        </div>
      </GCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════ */
export default function App(){
  injectCSS();
  const { user: authUser, profile, loading: authLoading, signOut } = useAuth();
  const [dark,setDark]=useState(true);
  const [page,setPage]=useState(authUser ? "dashboard" : "login");
  const [online,setOnline]=useState(true);
  const [wide,setWide]=useState(typeof window!=="undefined"&&window.innerWidth>=860);

  useEffect(()=>{
    const h=()=>setWide(window.innerWidth>=860);
    window.addEventListener("resize",h);
    return()=>window.removeEventListener("resize",h);
  },[]);

  // Auto-navigate based on auth state
  useEffect(()=>{
    if(!authLoading){
      if(authUser && page==="login"){
        setPage("dashboard");
      } else if(!authUser && page!=="login"){
        setPage("login");
      }
    }
  },[authUser, authLoading, page]);

  const t=(TH as any)[dark?"dark":"light"];
  const loggedIn=page!=="login" && !!authUser;

  const userForUI = authUser ? {
    name: profile?.name || authUser.displayName || authUser.email?.split("@")[0] || "User",
    email: profile?.email || authUser.email || "",
    phone: profile?.phone || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    address: profile?.address || "",
    bio: profile?.bio || "",
    interests: profile?.interests || [],
    role: profile?.role || "user",
    joinedDate: profile?.joinedDate || new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),
    joinedFull: profile?.joinedFull || authUser.metadata.creationTime || new Date().toISOString(),
    rating: 0,
  } : null;

  const login=useCallback(()=>{
    setPage("dashboard");
  },[]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setPage("login");
  }, [signOut]);

  if(authLoading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:t.bgGrad,color:t.text}}>
      <Bg t={t}/>
      <div style={{textAlign:"center",zIndex:1}}>
        <div style={{width:56,height:56,borderRadius:18,background:`linear-gradient(135deg,${t.primary},${t.accent})`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16,boxShadow:`0 0 40px ${t.glow}`}}>
          <I n="zap" s={24} c="#fff" sw={2}/>
        </div>
        <p style={{fontFamily:"Syne",fontSize:18,fontWeight:700}}>Loading MicroLink…</p>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",color:t.text,display:"flex",position:"relative",background:t.bgGrad}}>
      <Bg t={t}/>

      {loggedIn&&wide&&(
        <Sidebar page={page} setPage={setPage} t={t} isDark={dark}
          toggleTheme={()=>setDark(v=>!v)} online={online}
          setOnline={setOnline} user={userForUI}/>
      )}

      <main style={{flex:1,position:"relative",zIndex:1,overflowY:"auto",paddingBottom:loggedIn&&!wide?80:0,minHeight:"100vh"}}>
        {loggedIn&&(
          <div style={{padding:"0 24px"}}>
            <TopBar t={t} user={userForUI} online={online} setOnline={setOnline} setPage={setPage} onSignOut={handleSignOut}/>
          </div>
        )}
        <div style={{padding:loggedIn?"0 24px":0}}>
          {page==="login"    &&<LoginPage onLogin={login} t={t} isDark={dark} toggleTheme={()=>setDark(v=>!v)}/>}
          {page==="dashboard"&&<Dashboard t={t} user={userForUI}/>}
          {page==="discover" &&<Discover t={t}/>}
          {page==="bidding"  &&<Bidding t={t}/>}
          {page==="chat"     &&<Chat t={t}/>}
          {page==="profile"  &&<Profile t={t} user={userForUI} online={online} setOnline={setOnline}/>}
        </div>
      </main>

      {loggedIn&&!wide&&<MobileNav page={page} setPage={setPage} t={t}/>}
      {loggedIn&&<VoiceBtn t={t}/>}
    </div>
  );
}
