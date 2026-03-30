import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

/* ─── design tokens ───────────────────────────────────────────── */
const SIDEBAR_BG    = "#12152E";
const SIDEBAR_ACTIVE= "#2D3057";
const ACCENT        = "#6C5DD3";
const ACCENT_LIGHT  = "#EEF0FF";
const BODY_BG       = "#F4F5FA";
const CARD_BG       = "#FFFFFF";
const TEXT_MAIN     = "#1A1D2E";
const TEXT_MUTED    = "#8F95B2";
const BORDER        = "#E4E6F0";

/* ─── sample data ─────────────────────────────────────────────── */
const csatData = [
  { score:"1", count:8,   label:"1 ★" },
  { score:"2", count:14,  label:"2 ★" },
  { score:"3", count:27,  label:"3 ★" },
  { score:"4", count:63,  label:"4 ★" },
  { score:"5", count:112, label:"5 ★" },
];

const responses = [
  { id:1, visitTitle:"Visita #4821 — Supermercado Central",    visitDate:"28 mar 2026", responseDate:"28 mar 2026", csat:1, driver:"Carlos Muñoz",    address:"Av. Providencia 1234, Santiago",   additionals:[{ q:"¿Qué salió mal?", type:"text", value:"El paquete llegó completamente aplastado." }, { q:"Puntualidad", type:"stars", value:1 }] },
  { id:2, visitTitle:"Visita #4798 — Farmacia Cruz Verde",     visitDate:"27 mar 2026", responseDate:"27 mar 2026", csat:2, driver:"Mario Espinoza",   address:"Los Leones 890, Providencia",     additionals:[{ q:"¿Qué salió mal?", type:"text", value:"El repartidor no tocó el timbre." },            { q:"Puntualidad", type:"stars", value:2 }] },
  { id:3, visitTitle:"Visita #4755 — Tienda Ripley Mall",      visitDate:"26 mar 2026", responseDate:"26 mar 2026", csat:3, driver:"Roberto Soto",     address:"Av. Kennedy 5413, Las Condes",    additionals:[{ q:"¿Qué salió mal?", type:"text", value:"Llegó un poco tarde, pero sin mayor problema." }, { q:"Puntualidad", type:"stars", value:3 }] },
  { id:4, visitTitle:"Visita #4742 — Cliente Residencial",     visitDate:"25 mar 2026", responseDate:"25 mar 2026", csat:5, driver:"Diego Ramírez",    address:"Camino Los Boldos 23, Lo Barnechea", additionals:[{ q:"¿Qué salió mal?", type:"text", value:"Nada, todo perfecto." },                   { q:"Puntualidad", type:"stars", value:5 }] },
  { id:5, visitTitle:"Visita #4731 — Bodega Norte Express",    visitDate:"24 mar 2026", responseDate:"24 mar 2026", csat:4, driver:"Carlos Muñoz",    address:"Ruta 5 Norte km 12, Quilicura",   additionals:[{ q:"¿Qué salió mal?", type:"text", value:"Sin comentarios adicionales." },              { q:"Puntualidad", type:"stars", value:4 }] },
  { id:6, visitTitle:"Visita #4710 — Importadora del Pacífico",visitDate:"23 mar 2026", responseDate:"23 mar 2026", csat:1, driver:"Mario Espinoza",   address:"Teatinos 280, Santiago Centro",   additionals:[{ q:"¿Qué salió mal?", type:"text", value:"Entregaron en el lugar equivocado, tuve que ir a buscar el paquete." }, { q:"Puntualidad", type:"stars", value:1 }] },
  { id:7, visitTitle:"Visita #4698 — Sucursal Maipú",          visitDate:"22 mar 2026", responseDate:"22 mar 2026", csat:4, driver:"Roberto Soto",     address:"Av. Pajaritos 3150, Maipú",       additionals:[{ q:"¿Qué salió mal?", type:"text", value:"Todo bien." },                               { q:"Puntualidad", type:"stars", value:4 }] },
  { id:8, visitTitle:"Visita #4672 — Clínica Bupa Las Condes", visitDate:"21 mar 2026", responseDate:"21 mar 2026", csat:5, driver:"Diego Ramírez",    address:"Estoril 450, Las Condes",         additionals:[{ q:"¿Qué salió mal?", type:"text", value:"Sin problemas, excelente." },                 { q:"Puntualidad", type:"stars", value:5 }] },
  { id:9, visitTitle:"Visita #4651 — Ferretería El Maestro",   visitDate:"20 mar 2026", responseDate:"20 mar 2026", csat:2, driver:"Carlos Muñoz",    address:"Gran Avenida 6780, San Miguel",   additionals:[{ q:"¿Qué salió mal?", type:"text", value:"Caja dañada y sellado abierto." },            { q:"Puntualidad", type:"stars", value:2 }] },
  { id:10,visitTitle:"Visita #4630 — MiniMarket Aconcagua",    visitDate:"19 mar 2026", responseDate:"19 mar 2026", csat:3, driver:"Mario Espinoza",   address:"Manuel Montt 1456, Providencia",  additionals:[{ q:"¿Qué salió mal?", type:"text", value:"Regular, el conductor fue poco amable." },    { q:"Puntualidad", type:"stars", value:3 }] },
];

const navItems = [
  { icon:"👥", label:"Usuarios" },
  { icon:"🚗", label:"Vehículos" },
  { icon:"📱", label:"App móvil" },
  { icon:"🔒", label:"Seguridad" },
  { icon:"💬", label:"Comunicaciones", active:true, expanded:true },
  { icon:"🗺️", label:"Zonas" },
  { icon:"⚡", label:"Automatizaciones" },
  { icon:"🗓️", label:"Creación de rutas" },
  { icon:"🎨", label:"Personalización" },
];
const subNav = [
  { label:"Comunicaciones" },
  { label:"WhatsApp Pro" },
  { label:"Encuesta de satisfacción", active:true },
];

/* ─── helpers ─────────────────────────────────────────────────── */
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_ES   = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];

function startOfDay(d){ const r=new Date(d); r.setHours(0,0,0,0); return r; }
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function sameDay(a,b){ return a&&b&&a.toDateString()===b.toDateString(); }
function isBetween(d,from,to){ return from&&to&&d>from&&d<to; }
function formatDate(d){ return d?`${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0,3)} ${d.getFullYear()}`:"—"; }
function buildGrid(base){
  const y=base.getFullYear(),m=base.getMonth();
  const first=new Date(y,m,1), last=new Date(y,m+1,0);
  let dow=first.getDay(); dow=dow===0?6:dow-1;
  const cells=[];
  for(let i=0;i<dow;i++) cells.push(null);
  for(let d=1;d<=last.getDate();d++) cells.push(new Date(y,m,d));
  return cells;
}

/* ─── score helpers ───────────────────────────────────────────── */
function scoreBadge(score){
  const cfg = score<=2
    ? { bg:"#FEE2E2", color:"#DC2626" }
    : score===3
    ? { bg:"#FEF9C3", color:"#B45309" }
    : { bg:"#DCFCE7", color:"#16A34A" };
  return (
    <span style={{ ...cfg, fontWeight:700, fontSize:12, padding:"3px 8px",
                   borderRadius:20, display:"inline-flex", alignItems:"center", gap:4 }}>
      {"★".repeat(score)}{"☆".repeat(5-score)}
    </span>
  );
}

/* ─── DateRangePicker ──────────────────────────────────────────── */
function DateRangePicker({ from, to, onChange }){
  const [open,setOpen]       = useState(false);
  const [hover,setHover]     = useState(null);
  const [selecting,setSelecting] = useState(null);
  const [month,setMonth]     = useState(()=>{ const d=new Date(); d.setDate(1); return d; });
  const ref = useRef();

  useEffect(()=>{
    const fn=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",fn);
    return ()=>document.removeEventListener("mousedown",fn);
  },[]);

  function applyPreset(days){
    const end=startOfDay(new Date()), start=startOfDay(addDays(new Date(),-days+1));
    onChange({ from:start, to:end }); setSelecting(null); setOpen(false);
  }
  function handleDay(day){
    if(!day) return;
    const d=startOfDay(day);
    if(!selecting){ setSelecting(d); onChange({ from:d, to:null }); }
    else{
      if(d<selecting) onChange({ from:d, to:selecting });
      else onChange({ from:selecting, to:d });
      setSelecting(null); setOpen(false);
    }
  }

  const vFrom=selecting?selecting:from, vTo=selecting?hover:to;

  function dayStyle(day){
    const isFrom=sameDay(day,vFrom), isTo=sameDay(day,vTo), inRange=isBetween(day,vFrom,vTo);
    let bg="transparent",color=TEXT_MAIN,borderRadius="50%",fontWeight=400;
    if(isFrom||isTo){ bg=ACCENT; color="white"; fontWeight=700; }
    else if(inRange){ bg=ACCENT_LIGHT; color=ACCENT; borderRadius="0"; }
    if(isFrom) borderRadius="50% 0 0 50%";
    if(isTo)   borderRadius="0 50% 50% 0";
    if(isFrom&&sameDay(vFrom,vTo)) borderRadius="50%";
    return { bg, color, borderRadius, fontWeight };
  }

  const nextMonth = new Date(month.getFullYear(), month.getMonth()+1, 1);
  const label = from&&to ? `${formatDate(from)} → ${formatDate(to)}` : from ? `${formatDate(from)} → ...` : "Selecciona un rango";

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={()=>setOpen(!open)} style={{
        display:"flex", alignItems:"center", gap:8,
        background:CARD_BG, border:`1px solid ${open?ACCENT:BORDER}`,
        borderRadius:8, padding:"7px 14px", cursor:"pointer",
        color:TEXT_MAIN, fontSize:13, fontWeight:500,
        boxShadow:open?`0 0 0 3px ${ACCENT_LIGHT}`:"none",
      }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={ACCENT} strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {label}
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={TEXT_MUTED} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:1000,
          background:CARD_BG, borderRadius:12, border:`1px solid ${BORDER}`,
          boxShadow:"0 8px 30px rgba(0,0,0,0.12)", display:"flex", overflow:"hidden",
        }}>
          {/* Presets */}
          <div style={{ width:150, borderRight:`1px solid ${BORDER}`, padding:"16px 0", display:"flex", flexDirection:"column" }}>
            <p style={{ margin:"0 0 8px", padding:"0 16px", fontSize:11, fontWeight:700, color:TEXT_MUTED, textTransform:"uppercase", letterSpacing:.5 }}>Atajos</p>
            {[{label:"Hoy",days:1},{label:"Últimos 7 días",days:7},{label:"Últimos 30 días",days:30},{label:"Últimos 90 días",days:90}].map(({label:l,days})=>(
              <button key={l} onClick={()=>applyPreset(days)} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px 16px", textAlign:"left", fontSize:13, color:TEXT_MAIN }}
                onMouseEnter={e=>e.currentTarget.style.background=BODY_BG} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                {l}
              </button>
            ))}
          </div>

          {/* Calendars */}
          <div style={{ padding:20, display:"flex", gap:24, paddingBottom:50 }}>
            {[month, nextMonth].map((m,idx)=>{
              const cells=buildGrid(m);
              return (
                <div key={idx} style={{ width:210 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    {idx===0 ? <button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))} style={{ background:"none",border:"none",cursor:"pointer",color:TEXT_MUTED,fontSize:16,padding:"0 4px" }}>‹</button> : <span style={{width:24}}/>}
                    <span style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN }}>{MONTHS_ES[m.getMonth()]} {m.getFullYear()}</span>
                    {idx===1 ? <button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))} style={{ background:"none",border:"none",cursor:"pointer",color:TEXT_MUTED,fontSize:16,padding:"0 4px" }}>›</button> : <span style={{width:24}}/>}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
                    {DAYS_ES.map(d=><div key={d} style={{ textAlign:"center",fontSize:11,fontWeight:600,color:TEXT_MUTED,padding:"2px 0" }}>{d}</div>)}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", rowGap:2 }}>
                    {cells.map((day,i)=>{
                      if(!day) return <div key={`e-${i}`}/>;
                      const { bg, color, borderRadius, fontWeight } = dayStyle(day);
                      const disabled = day > new Date();
                      return (
                        <div key={i} onClick={()=>!disabled&&handleDay(day)}
                          onMouseEnter={()=>selecting&&setHover(startOfDay(day))}
                          onMouseLeave={()=>selecting&&setHover(null)}
                          style={{ display:"flex",alignItems:"center",justifyContent:"center",height:30,fontSize:12,fontWeight,background:bg,color:disabled?"#D0D3E0":color,borderRadius,cursor:disabled?"default":"pointer",userSelect:"none" }}>
                          {day.getDate()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position:"absolute",bottom:0,left:150,right:0,borderTop:`1px solid ${BORDER}`,padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:CARD_BG }}>
            <span style={{ fontSize:12,color:TEXT_MUTED }}>{selecting?"Selecciona la fecha de fin":from&&to?`${formatDate(from)} → ${formatDate(to)}`:"Selecciona la fecha de inicio"}</span>
            <button onClick={()=>{onChange({from:null,to:null});setSelecting(null);}} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:TEXT_MUTED,fontWeight:500 }}>Limpiar</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Response Detail Modal ───────────────────────────────────── */
function DetailModal({ response, onClose }){
  if(!response) return null;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center" }}
         onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ position:"absolute",inset:0,background:"rgba(18,21,46,.5)",backdropFilter:"blur(2px)" }}/>
      <div style={{
        position:"relative", background:CARD_BG, borderRadius:16, width:520,
        boxShadow:"0 20px 60px rgba(0,0,0,0.2)", overflow:"hidden",
      }}>
        {/* Modal header */}
        <div style={{ background:ACCENT, padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ margin:0,fontSize:11,color:"rgba(255,255,255,.7)",fontWeight:600,textTransform:"uppercase",letterSpacing:.5 }}>Detalle de respuesta</p>
            <h2 style={{ margin:"4px 0 0",fontSize:16,fontWeight:700,color:"white" }}>{response.visitTitle}</h2>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",color:"white",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
        </div>

        <div style={{ padding:24, display:"flex", flexDirection:"column", gap:20 }}>
          {/* Visit info */}
          <div style={{ background:BODY_BG, borderRadius:10, padding:16, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { label:"Conductor",         value:response.driver },
              { label:"Fecha de visita",   value:response.visitDate },
              { label:"Dirección",         value:response.address },
              { label:"Fecha de respuesta",value:response.responseDate },
            ].map(({ label, value })=>(
              <div key={label}>
                <p style={{ margin:0,fontSize:11,color:TEXT_MUTED,fontWeight:600,textTransform:"uppercase",letterSpacing:.4 }}>{label}</p>
                <p style={{ margin:"3px 0 0",fontSize:13,color:TEXT_MAIN,fontWeight:500 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* CSAT */}
          <div>
            <p style={{ margin:"0 0 8px",fontSize:12,color:TEXT_MUTED,fontWeight:600,textTransform:"uppercase",letterSpacing:.5 }}>Evaluación CSAT</p>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {scoreBadge(response.csat)}
              <span style={{ fontSize:13, color:TEXT_MUTED }}>{response.csat}/5</span>
            </div>
          </div>

          {/* Additional answers */}
          {response.additionals.length > 0 && (
            <div>
              <p style={{ margin:"0 0 10px",fontSize:12,color:TEXT_MUTED,fontWeight:600,textTransform:"uppercase",letterSpacing:.5 }}>Preguntas adicionales</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {response.additionals.map((a,i)=>(
                  <div key={i} style={{ borderLeft:`3px solid ${ACCENT_LIGHT}`, paddingLeft:12 }}>
                    <p style={{ margin:"0 0 4px", fontSize:12, color:TEXT_MUTED, fontWeight:600 }}>{a.q}</p>
                    {a.type==="text"
                      ? <p style={{ margin:0, fontSize:13, color:TEXT_MAIN }}>{a.value}</p>
                      : <span style={{ color:"#F5A623", fontSize:16 }}>{"★".repeat(a.value)}{"☆".repeat(5-a.value)}</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── StarRating ──────────────────────────────────────────────── */
function StarRating({ value }){
  return (
    <span style={{ color:"#F5A623", fontSize:14 }}>
      {[1,2,3,4,5].map(i=><span key={i} style={{ opacity:i<=Math.round(value)?1:.25 }}>★</span>)}
    </span>
  );
}

/* ─── Main ────────────────────────────────────────────────────── */
export default function MockupResultados(){
  const [activeTab, setActiveTab]   = useState("resultados");
  const [dateRange, setDateRange]   = useState({ from:startOfDay(addDays(new Date(),-29)), to:startOfDay(new Date()) });
  const [scoreFilter, setScoreFilter] = useState("all");
  const [modalResponse, setModalResponse] = useState(null);

  const totalResponses = csatData.reduce((s,d)=>s+d.count, 0);
  const csatAvg = (csatData.reduce((s,d)=>s+d.count*parseInt(d.score),0)/totalResponses).toFixed(1);

  const scoreFilterOptions = [
    { key:"all",  label:"Todas",          count:responses.length },
    { key:"bad",  label:"Malas (1–2)",    count:responses.filter(r=>r.csat<=2).length },
    { key:"mid",  label:"Neutras (3)",    count:responses.filter(r=>r.csat===3).length },
    { key:"good", label:"Positivas (4–5)",count:responses.filter(r=>r.csat>=4).length },
  ];

  const filteredResponses = responses.filter(r=>{
    if(scoreFilter==="bad")  return r.csat<=2;
    if(scoreFilter==="mid")  return r.csat===3;
    if(scoreFilter==="good") return r.csat>=4;
    return true;
  });

  const TABLE_COLS = ["Visita","Fecha visita","Fecha respuesta","Evaluación","Respuesta adicional",""];

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Inter','Segoe UI',sans-serif", background:BODY_BG, fontSize:13 }}>

      {/* ── Sidebar ── */}
      <div style={{ width:220, background:SIDEBAR_BG, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid #1e2240" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28,height:28,borderRadius:8,background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center" }}><span style={{color:"white",fontSize:14}}>→</span></div>
            <span style={{ color:"white", fontWeight:700, fontSize:15 }}>Ajustes</span>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {navItems.map(item=>(
            <div key={item.label}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 20px",background:item.active?SIDEBAR_ACTIVE:"transparent",cursor:"pointer" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:14,opacity:.8 }}>{item.icon}</span>
                  <span style={{ color:item.active?"white":"#8F95B2",fontSize:13,fontWeight:item.active?600:400 }}>{item.label}</span>
                </div>
                {item.expanded&&<span style={{color:TEXT_MUTED,fontSize:11}}>−</span>}
              </div>
              {item.expanded&&subNav.map(sub=>(
                <div key={sub.label} style={{padding:"7px 20px 7px 48px",cursor:"pointer"}}>
                  <span style={{color:sub.active?"white":TEXT_MUTED,fontWeight:sub.active?600:400,fontSize:12}}>
                    {sub.active&&<span style={{color:ACCENT,marginRight:6}}>●</span>}{sub.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 20px", borderTop:"1px solid #1e2240" }}>
          <div style={{width:32,height:32,borderRadius:"50%",background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"white",fontWeight:700,fontSize:13}}>J</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:CARD_BG, borderBottom:`1px solid ${BORDER}`, padding:"18px 32px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:TEXT_MAIN }}>Encuesta de satisfacción de entrega</h1>
              <p style={{ margin:"4px 0 0", color:TEXT_MUTED, fontSize:13 }}>Configura y personaliza la encuesta que recibirá tu cliente después de cada entrega</p>
            </div>
            {activeTab==="resultados"&&(
              <button style={{ background:ACCENT, color:"white", border:"none", borderRadius:8, padding:"8px 18px", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                ↓ Exportar CSV
              </button>
            )}
          </div>
          <div style={{ display:"flex" }}>
            {["configuracion","resultados"].map(tab=>{
              const isActive=activeTab===tab;
              return <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:"10px 20px",border:"none",background:"transparent",cursor:"pointer",fontWeight:isActive?700:400,fontSize:13,color:isActive?ACCENT:TEXT_MUTED,borderBottom:isActive?`2px solid ${ACCENT}`:"2px solid transparent",marginBottom:-1 }}>
                {tab==="configuracion"?"Configuración":"Resultados"}
              </button>;
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab==="resultados" ? (
          <div style={{ flex:1, overflowY:"auto", padding:32 }}>

            {/* Filter row */}
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:24 }}>
              <DateRangePicker from={dateRange.from} to={dateRange.to} onChange={setDateRange}/>
            </div>

            {/* Metric cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
              <div style={{ background:CARD_BG, borderRadius:12, padding:24, border:`1px solid ${BORDER}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ margin:0,fontSize:12,color:TEXT_MUTED,fontWeight:600,textTransform:"uppercase",letterSpacing:.5 }}>CSAT Promedio</p>
                    <div style={{ display:"flex",alignItems:"baseline",gap:8,marginTop:8 }}>
                      <span style={{ fontSize:42,fontWeight:800,color:TEXT_MAIN,lineHeight:1 }}>{csatAvg}</span>
                      <span style={{ fontSize:16,color:TEXT_MUTED,fontWeight:500 }}>/5</span>
                    </div>
                    <div style={{marginTop:8}}><StarRating value={parseFloat(csatAvg)}/></div>
                  </div>
                  <div style={{ background:ACCENT_LIGHT,borderRadius:10,padding:"10px 12px",fontSize:22 }}>⭐</div>
                </div>
                <p style={{ margin:"12px 0 0",fontSize:12,color:"#27AE60",fontWeight:500 }}>↑ +0.3 vs período anterior</p>
              </div>
              <div style={{ background:CARD_BG, borderRadius:12, padding:24, border:`1px solid ${BORDER}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ margin:0,fontSize:12,color:TEXT_MUTED,fontWeight:600,textTransform:"uppercase",letterSpacing:.5 }}>Encuestas respondidas</p>
                    <div style={{ display:"flex",alignItems:"baseline",gap:8,marginTop:8 }}>
                      <span style={{ fontSize:42,fontWeight:800,color:TEXT_MAIN,lineHeight:1 }}>{totalResponses}</span>
                    </div>
                    <p style={{ margin:"8px 0 0",fontSize:12,color:TEXT_MUTED }}>De un total de 3.240 visitas en el período</p>
                  </div>
                  <div style={{ background:"#EEF9F3",borderRadius:10,padding:"10px 12px",fontSize:22 }}>📋</div>
                </div>
                <p style={{ margin:"12px 0 0",fontSize:12,color:"#27AE60",fontWeight:500 }}>↑ +18 vs período anterior</p>
              </div>
            </div>

            {/* Chart */}
            <div style={{ background:CARD_BG, borderRadius:12, padding:24, border:`1px solid ${BORDER}`, marginBottom:24 }}>
              <h3 style={{ margin:"0 0 4px",fontSize:14,fontWeight:700,color:TEXT_MAIN }}>Distribución de respuestas CSAT</h3>
              <p style={{ margin:"0 0 20px",fontSize:12,color:TEXT_MUTED }}>Cantidad de respuestas por puntuación (escala 1–5)</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={csatData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER}/>
                  <XAxis dataKey="label" tick={{fontSize:12,fill:TEXT_MUTED}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:TEXT_MUTED}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{borderRadius:8,border:`1px solid ${BORDER}`,fontSize:12}} formatter={val=>[`${val} respuestas`,"Cantidad"]}/>
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {csatData.map(entry=>(
                      <Cell key={entry.score} fill={entry.score==="5"||entry.score==="4"?ACCENT:entry.score==="3"?"#A29ED6":"#F87171"}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Responses table */}
            <div style={{ background:CARD_BG, borderRadius:12, border:`1px solid ${BORDER}`, overflow:"hidden" }}>
              {/* Table header */}
              <div style={{ padding:"18px 24px 0", borderBottom:`1px solid ${BORDER}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <h3 style={{ margin:0,fontSize:14,fontWeight:700,color:TEXT_MAIN }}>Respuestas</h3>
                    <p style={{ margin:"2px 0 0",fontSize:12,color:TEXT_MUTED }}>{filteredResponses.length} resultado{filteredResponses.length!==1?"s":""}</p>
                  </div>
                </div>

                {/* Filter chips */}
                <div style={{ display:"flex", gap:8, paddingBottom:16 }}>
                  {scoreFilterOptions.map(opt=>{
                    const active = scoreFilter===opt.key;
                    let activeColor = ACCENT, activeBg = ACCENT_LIGHT;
                    if(opt.key==="bad")  { activeColor="#DC2626"; activeBg="#FEE2E2"; }
                    if(opt.key==="mid")  { activeColor="#B45309"; activeBg="#FEF9C3"; }
                    if(opt.key==="good") { activeColor="#16A34A"; activeBg="#DCFCE7"; }
                    return (
                      <button key={opt.key} onClick={()=>setScoreFilter(opt.key)} style={{
                        background: active?activeBg:BODY_BG,
                        color: active?activeColor:TEXT_MUTED,
                        border: `1px solid ${active?activeColor:BORDER}`,
                        borderRadius:20, padding:"5px 12px",
                        fontSize:12, fontWeight:active?700:500, cursor:"pointer",
                        display:"flex", alignItems:"center", gap:5,
                      }}>
                        {opt.label}
                        <span style={{ background:active?activeColor:"#D1D5DB", color:"white", borderRadius:10, padding:"0 5px", fontSize:10, fontWeight:700 }}>
                          {opt.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:BODY_BG }}>
                      {TABLE_COLS.map(col=>(
                        <th key={col} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:TEXT_MUTED, textTransform:"uppercase", letterSpacing:.4, whiteSpace:"nowrap", borderBottom:`1px solid ${BORDER}` }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResponses.map((r,i)=>(
                      <tr key={r.id} style={{ borderBottom: i<filteredResponses.length-1?`1px solid ${BORDER}`:"none" }}
                          onMouseEnter={e=>e.currentTarget.style.background=BODY_BG}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        {/* Visita */}
                        <td style={{ padding:"14px 16px", maxWidth:200 }}>
                          <p style={{ margin:0, fontSize:13, fontWeight:600, color:TEXT_MAIN, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.visitTitle}</p>
                          <p style={{ margin:"2px 0 0", fontSize:11, color:TEXT_MUTED }}>{r.driver}</p>
                        </td>
                        {/* Fecha visita */}
                        <td style={{ padding:"14px 16px", fontSize:13, color:TEXT_MAIN, whiteSpace:"nowrap" }}>{r.visitDate}</td>
                        {/* Fecha respuesta */}
                        <td style={{ padding:"14px 16px", fontSize:13, color:TEXT_MUTED, whiteSpace:"nowrap" }}>{r.responseDate}</td>
                        {/* CSAT */}
                        <td style={{ padding:"14px 16px" }}>{scoreBadge(r.csat)}</td>
                        {/* Respuesta adicional preview */}
                        <td style={{ padding:"14px 16px", maxWidth:220 }}>
                          <p style={{ margin:0, fontSize:12, color:TEXT_MUTED, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {r.additionals[0]?.value ?? "—"}
                          </p>
                        </td>
                        {/* Action */}
                        <td style={{ padding:"14px 16px" }}>
                          <button onClick={()=>setModalResponse(r)} style={{ background:ACCENT_LIGHT, color:ACCENT, border:"none", borderRadius:6, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredResponses.length===0&&(
                      <tr><td colSpan={6} style={{ padding:"40px 16px", textAlign:"center", color:TEXT_MUTED, fontSize:13 }}>No hay respuestas para este filtro</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <p style={{ color:TEXT_MUTED, fontSize:14 }}>Vista de Configuración (ver SOL-2340)</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <DetailModal response={modalResponse} onClose={()=>setModalResponse(null)}/>
    </div>
  );
}
