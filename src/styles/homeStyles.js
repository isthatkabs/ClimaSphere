export const styles = {
  root: {
    position: "relative",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    color: "#e8e0ff",
    overflowX: "hidden",
  },
  bgGradient: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    transition: "background 0.3s ease",
  },
  orb: {
    position: "fixed",
    borderRadius: "50%",
    filter: "blur(80px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  orb1: {
    width: 500, height: 500,
    top: "-100px", right: "10%",
    background: "rgba(120,40,255,0.18)",
    animation: "float1 12s ease-in-out infinite",
  },
  orb2: {
    width: 400, height: 400,
    bottom: "20%", left: "-100px",
    background: "rgba(0,160,255,0.15)",
    animation: "float2 15s ease-in-out infinite",
  },
  orb3: {
    width: 300, height: 300,
    top: "60%", right: "5%",
    background: "rgba(180,80,255,0.1)",
    animation: "float3 18s ease-in-out infinite",
  },
  grid: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    backgroundImage: `linear-gradient(rgba(138,60,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(138,60,255,0.04) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
    pointerEvents: "none",
  },

  // NAV
  nav: {
    position: "relative", zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 60px",
    borderBottom: "1px solid rgba(138,60,255,0.15)",
    backdropFilter: "blur(20px)",
    background: "rgba(8,6,17,0.6)",
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: { fontSize: 22 },
  logoText: { fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#c4b0ff", letterSpacing: "-0.3px" },
  logoBold: { color: "#a06bff" },
  navLinks: { display: "flex", gap: 32 },
  navLink: { color: "rgba(200,190,240,0.7)", fontSize: 14, fontWeight: 500, letterSpacing: "0.02em" },
  navActions: { display: "flex", gap: 12, alignItems: "center" },
  navCta: {
    background: "linear-gradient(135deg, #7c3aff, #5a7cff)",
    color: "#fff", fontSize: 14, fontWeight: 600,
    padding: "8px 20px", borderRadius: 8, letterSpacing: "0.02em",
  },

  // HERO
  hero: {
    position: "relative", zIndex: 5,
    display: "flex", alignItems: "center", gap: 80,
    padding: "80px 60px",
    minHeight: "calc(100vh - 70px)",
  },
  heroLeft: { flex: 1, maxWidth: 560, animation: "slideUp 0.7s ease both" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(138,60,255,0.15)",
    border: "1px solid rgba(138,60,255,0.3)",
    borderRadius: 100, padding: "6px 14px",
    fontSize: 12, fontWeight: 500, color: "#b090ff",
    marginBottom: 24, letterSpacing: "0.04em", textTransform: "uppercase",
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#7c3aff",
    animation: "pulse 2s ease-in-out infinite",
    display: "inline-block",
  },
  headline: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(44px, 5vw, 68px)",
    lineHeight: 1.05, color: "#f0ecff",
    marginBottom: 24, letterSpacing: "-1px",
  },
  headlineAccent: {
    background: "linear-gradient(135deg, #a06bff 0%, #6fa8ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontStyle: "italic",
  },
  subhead: {
    fontSize: 17, lineHeight: 1.7,
    color: "rgba(200,190,240,0.7)",
    marginBottom: 36, fontWeight: 300, maxWidth: 420,
  },
  heroActions: { display: "flex", gap: 16, alignItems: "center", marginBottom: 48 },
  ctaBtn: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "linear-gradient(135deg, #7c3aff 0%, #5a7cff 100%)",
    color: "#fff", fontWeight: 600, fontSize: 15,
    padding: "13px 28px", borderRadius: 10,
    boxShadow: "0 8px 32px rgba(124,58,255,0.4)",
    cursor: "pointer",
  },
  ctaArrow: { fontSize: 18, lineHeight: 1 },
  ghostBtn: {
    color: "rgba(200,190,240,0.8)", fontWeight: 500, fontSize: 15,
    padding: "13px 24px", borderRadius: 10,
    border: "1px solid rgba(138,60,255,0.3)", cursor: "pointer",
  },
  statsRow: { display: "flex", gap: 40 },
  stat: { display: "flex", flexDirection: "column", gap: 2 },
  statVal: { fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "#f0ecff", letterSpacing: "-0.5px" },
  statLabel: { fontSize: 12, color: "rgba(200,190,240,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" },

  // WEATHER CARD
  heroRight: {
    flex: 1, display: "flex", justifyContent: "center",
    position: "relative", animation: "slideUp 0.7s 0.2s ease both",
  },
  weatherCard: {
    background: "rgba(20,12,40,0.85)",
    border: "1px solid rgba(138,60,255,0.25)",
    borderRadius: 24, padding: "28px 32px", width: 360,
    backdropFilter: "blur(40px)",
    boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(138,60,255,0.1) inset",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  cardCity: { fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#f0ecff", letterSpacing: "-0.3px" },
  cardTime: { fontSize: 12, color: "rgba(200,190,240,0.5)", marginTop: 2 },
  cardIcon: { fontSize: 40, lineHeight: 1 },
  tempDisplay: { display: "flex", alignItems: "flex-start", marginBottom: 4 },
  tempNum: { fontFamily: "'DM Serif Display', serif", fontSize: 80, lineHeight: 1, color: "#f0ecff", letterSpacing: "-3px" },
  tempUnit: { fontSize: 28, color: "rgba(200,190,240,0.6)", marginTop: 14, marginLeft: 4 },
  conditionText: { fontSize: 14, color: "rgba(180,160,255,0.8)", marginBottom: 24, fontWeight: 400 },
  cardStats: {
    display: "flex", alignItems: "center",
    background: "rgba(138,60,255,0.08)",
    borderRadius: 12, padding: "12px 20px", marginBottom: 20,
  },
  cardStat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  cardStatIcon: { fontSize: 18 },
  cardStatVal: { fontSize: 15, fontWeight: 600, color: "#e8e0ff" },
  cardStatLabel: { fontSize: 11, color: "rgba(200,190,240,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" },
  cardStatDivider: { width: 1, height: 36, background: "rgba(138,60,255,0.2)", margin: "0 16px" },
  cityDots: { display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 },
  dot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "rgba(138,60,255,0.3)",
    border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s",
  },
  dotActive: { background: "#7c3aff", width: 20, borderRadius: 4 },
  miniRow: { display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(138,60,255,0.15)", paddingTop: 16 },
  miniDay: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  miniLabel: { fontSize: 11, color: "rgba(200,190,240,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" },
  miniIcon: { fontSize: 18 },
  miniTemp: { fontSize: 13, fontWeight: 600, color: "#d0c0ff" },
  floatingAlert: {
    position: "absolute", bottom: -20, left: -30,
    display: "flex", alignItems: "center", gap: 12,
    background: "rgba(255,140,0,0.12)",
    border: "1px solid rgba(255,160,0,0.3)",
    borderRadius: 14, padding: "12px 18px",
    backdropFilter: "blur(20px)", fontSize: 13,
    animation: "float3 8s ease-in-out infinite",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  alertTitle: { fontWeight: 600, color: "#ffd080", fontSize: 13 },
  alertSub: { fontSize: 11, color: "rgba(255,200,100,0.7)", marginTop: 1 },

  // FEATURES
  features: { position: "relative", zIndex: 5, padding: "100px 60px", textAlign: "center" },
  sectionLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8060d0", marginBottom: 16, fontWeight: 600 },
  sectionTitle: { fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 3.5vw, 48px)", lineHeight: 1.15, color: "#f0ecff", marginBottom: 60, letterSpacing: "-0.5px" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, maxWidth: 1000, margin: "0 auto" },
  featureCard: {
    background: "rgba(20,12,40,0.7)",
    border: "1px solid rgba(138,60,255,0.15)",
    borderRadius: 18, padding: "32px 24px", textAlign: "left",
    backdropFilter: "blur(20px)", cursor: "default",
  },
  featureIcon: { fontSize: 28, marginBottom: 16 },
  featureLabel: { fontWeight: 600, fontSize: 15, color: "#e0d4ff", marginBottom: 8 },
  featureDesc: { fontSize: 13, color: "rgba(180,160,240,0.6)", lineHeight: 1.6 },

  // CTA BAND
  ctaBand: {
    position: "relative", zIndex: 5,
    margin: "0 60px 80px", borderRadius: 24,
    background: "linear-gradient(135deg, rgba(124,58,255,0.25) 0%, rgba(90,124,255,0.15) 100%)",
    border: "1px solid rgba(138,60,255,0.25)",
    padding: "70px 60px", textAlign: "center",
    backdropFilter: "blur(20px)", overflow: "hidden",
  },
  ctaBandInner: { position: "relative", zIndex: 1 },
  ctaBandTitle: { fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 3vw, 42px)", color: "#f0ecff", marginBottom: 12, letterSpacing: "-0.5px" },
  ctaBandSub: { fontSize: 15, color: "rgba(200,180,255,0.65)", marginBottom: 32 },

  // FOOTER
  footer: {
    position: "relative", zIndex: 5,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "24px 60px",
    borderTop: "1px solid rgba(138,60,255,0.12)",
  },
  footerLinks: { display: "flex", gap: 28 },
  footerLink: { fontSize: 13, color: "rgba(180,160,240,0.5)" },
  footerCopy: { fontSize: 12, color: "rgba(180,160,240,0.4)" },
}

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow-x: hidden; }
  a { text-decoration: none; }
  @keyframes float1 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50%       { transform: translate(30px,-40px) scale(1.1); }
  }
  @keyframes float2 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50%       { transform: translate(-20px,30px) scale(0.9); }
  }
  @keyframes float3 {
    0%, 100% { transform: translate(0,0); }
    33%       { transform: translate(15px,-20px); }
    66%       { transform: translate(-10px,15px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(0.85); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`