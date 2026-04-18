"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Icon set ───────────────────────────────────────────────────── */
const IcPanelClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" /><path d="M9 3v18"/><path d="m14 9-3 3 3 3"/>
  </svg>
);
const IcPanelOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" /><path d="M9 3v18"/><path d="m10 15 3-3-3-3"/>
  </svg>
);
const IcInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);
const IcLockOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" /><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);
const IcBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);
const IcChevronR = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const IcChevronL = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const IcChevronD = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const IcPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
  </svg>
);
const IcUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IcPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcCode = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const IcSettings = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IcSearchCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const IcTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>
  </svg>
);
const IcBraces = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>
  </svg>
);
const IcText = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/>
  </svg>
);
const IcTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);
const IcTableProp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3v18"/><rect width="18" height="18" x="3" y="3"/><path d="M3 9h18"/><path d="M3 15h12"/>
  </svg>
);
const IcPenLine = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IcSparkles = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
const IcGrip = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
  </svg>
);
const IcZoomIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);
const IcZoomOut = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);
const IcRedo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
  </svg>
);

/* ─── Figma asset icon wrapper ───────────────────────────────────── */
const FigmaIcon = ({ src, size = 16 }: { src: string; size?: number }) => (
  <img src={src} width={size} height={size} alt="" style={{ display: "block", flexShrink: 0 }} />
);

/* ─── Tooltip wrapper ────────────────────────────────────────────── */
const TooltipIcon = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative group flex items-center justify-center">
    {children}
    <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50 px-2 py-1 bg-[#171717] text-[#fafafa] text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
      {label}
    </span>
  </div>
);

/* ─── Animated circular progress SVG ────────────────────────────── */
function CircularProgress({ percent }: { percent: number }) {
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * (percent / 100);
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ position: "absolute", inset: 0 }}>
        {/* track */}
        <circle cx="28" cy="28" r={r} stroke="#e5e5e5" strokeWidth="4" />
        {/* progress */}
        <circle
          cx="28" cy="28" r={r}
          stroke="#2563eb"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference * 0.25}
          style={{ transition: "stroke-dasharray 0.4s ease" }}
          transform="rotate(-90 28 28)"
        />
      </svg>
      <span className="text-[11px] font-medium text-[#171717] z-10">{Math.round(percent)}%</span>
    </div>
  );
}

/* ─── Toast messages ─────────────────────────────────────────────── */
const toastMessages = [
  "The smallest valid PDF file is only 67 bytes, but most are thousands of times larger.",
  "PDF stands for Portable Document Format, developed by Adobe in 1993.",
  "The PDF format became an open standard (ISO 32000) in 2008.",
  "Over 2.5 trillion PDFs are estimated to exist since the format was introduced.",
  "A single PDF page can embed fonts, images, and vector graphics simultaneously.",
];

type RunState = "empty" | "ready" | "loading" | "done";

/* ═══════════════════════════════════════════════════════════════════ */
export default function RunPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"config" | "result">("config");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [modelSelected, setModelSelected] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [runState, setRunState] = useState<RunState>("empty");
  const [progress, setProgress] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const [toastIndex, setToastIndex] = useState(0);
  const [citationsOn, setCitationsOn] = useState(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canRun = (fileUploaded || urlInput.trim().length > 3) && modelSelected !== "";

  /* derive display state */
  const hasFile = fileUploaded || urlInput.trim().length > 3;

  /* start loading animation */
  function startLoading() {
    if (!canRun) return;
    setRunState("loading");
    setProgress(0);
    setDotCount(1);
    setToastIndex(0);

    let p = 0;
    progressRef.current = setInterval(() => {
      p += 100 / 50; // ~2% per tick, 50 ticks over 5s
      if (p >= 100) {
        p = 100;
        clearInterval(progressRef.current!);
        setRunState("done");
        setActiveTab("result");
      }
      setProgress(p);
    }, 100);

    dotRef.current = setInterval(() => {
      setDotCount(d => d >= 3 ? 1 : d + 1);
    }, 500);

    toastRef.current = setInterval(() => {
      setToastIndex(i => (i + 1) % toastMessages.length);
    }, 2500);
  }

  useEffect(() => {
    if (runState !== "loading") {
      if (progressRef.current) clearInterval(progressRef.current);
      if (dotRef.current) clearInterval(dotRef.current);
      if (toastRef.current) clearInterval(toastRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (dotRef.current) clearInterval(dotRef.current);
      if (toastRef.current) clearInterval(toastRef.current);
    };
  }, [runState]);

  const models = ["GPT-4o (Standard)", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "GPT-4o Mini"];

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafafa]">

      {/* ══════════ SIDEBAR ══════════════════════════════════════════ */}
      <aside className="flex flex-col shrink-0 h-full transition-all duration-200"
             style={{ width: sidebarOpen ? 304 : 48 }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-r shrink-0 overflow-hidden"
             style={{ borderColor: "#e4e4e7", background: "#fafafa", height: 49, paddingLeft: 16, paddingRight: sidebarOpen ? 12 : 6 }}>
          <div className="flex items-center gap-2 min-w-0">
            <img src="/assets/unsiloed-logo.png" width={17} height={17} alt="Unsiloed AI" style={{ flexShrink: 0 }} />
            {sidebarOpen && (
              <span className="font-semibold text-[15px] text-[#171717] leading-none whitespace-nowrap">Unsiloed AI</span>
            )}
          </div>
          {sidebarOpen && (
            <button className="p-1.5 border text-[#737373] hover:text-[#171717] transition-colors shrink-0"
                    style={{ borderColor: "#e5e5e5" }} onClick={() => setSidebarOpen(false)}>
              <IcPanelClose />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Icon rail */}
          <div className="flex flex-col items-center pt-3 shrink-0 border-r"
               style={{ width: 48, background: "#fafafa", borderColor: "#e4e4e7" }}>
            {!sidebarOpen && (
              <button className="flex items-center justify-center w-8 h-8 mb-1 text-[#737373] hover:bg-neutral-100 transition-colors"
                      onClick={() => setSidebarOpen(true)}>
                <IcPanelOpen />
              </button>
            )}
            <div className="flex flex-col gap-1 flex-1">
              <TooltipIcon label="Home">
                <Link href="/" className="flex items-center justify-center w-8 h-8 bg-blue-100">
                  <FigmaIcon src="/assets/ic-home.svg" />
                </Link>
              </TooltipIcon>
              <TooltipIcon label="Analytics">
                <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-100 transition-colors">
                  <FigmaIcon src="/assets/ic-activity.svg" />
                </button>
              </TooltipIcon>
              <TooltipIcon label="Settings">
                <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-100 transition-colors">
                  <FigmaIcon src="/assets/ic-settings.svg" />
                </button>
              </TooltipIcon>
            </div>
            <button className="flex items-center justify-center w-8 h-8 mb-2 text-[#737373] hover:bg-neutral-100 transition-colors">
              <IcInfo />
            </button>
          </div>

          {/* Text nav */}
          {sidebarOpen && (
            <div className="flex flex-col flex-1 min-h-0 relative pt-3" style={{ width: 256, background: "#fafafa" }}>
              <div className="flex flex-col gap-0.5 px-2">
                <Link href="/" className="flex items-center gap-2 h-8 px-2 w-full text-left bg-blue-100 text-blue-600 text-[14px] font-medium">
                  <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                    <FigmaIcon src="/assets/ic-gamepad.svg" />
                  </span>
                  Playground
                </Link>
                <button className="flex items-center gap-2 h-8 px-2 w-full text-left opacity-50 text-[14px]">
                  <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center"><FigmaIcon src="/assets/ic-gitpr.svg" /></span>
                  <span className="flex-1 text-[#0a0a0a]">Workflows</span>
                  <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center"><FigmaIcon src="/assets/ic-lock.svg" /></span>
                </button>
                <button className="flex items-center gap-2 h-8 px-2 w-full text-left opacity-50 text-[14px]">
                  <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center"><FigmaIcon src="/assets/ic-briefcase.svg" /></span>
                  <span className="flex-1 text-[#0a0a0a]">Jobs</span>
                  <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center"><FigmaIcon src="/assets/ic-lock.svg" /></span>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-2 py-4">
                <div className="w-full bg-white border" style={{ borderColor: "#e4e4e7", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" }}>
                  <div className="px-3 pt-3 pb-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[#18181b] mt-px shrink-0"><IcLockOpen /></span>
                      <p className="text-[12px] font-medium text-[#18181b] leading-4">Try it on your own docs</p>
                    </div>
                    <p className="text-[12px] text-[#737373] leading-4">Upload any PDF and see real output in under 30 seconds.</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 text-[13px] font-medium text-white bg-[#171717] hover:bg-[#333] transition-colors">Sign up</button>
                      <button className="flex-1 py-1.5 text-[13px] font-medium text-[#0a0a0a] border border-[#e5e5e5] bg-white hover:bg-neutral-50 transition-colors">Book a demo</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ═════════════════════════════════════ */}
      <div className="flex flex-1 flex-col min-w-0 h-full">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 border-b shrink-0"
             style={{ height: 49, borderColor: "#e4e4e7", background: "#fafafa" }}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Back button */}
            <Link href="/" className="flex items-center gap-1.5 px-1.5 py-1.5 border bg-white text-[13px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors shrink-0"
                  style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
              <IcChevronL />
              <span>Back</span>
            </Link>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[14px] text-[#737373]">Playground</span>
              <span className="text-[#737373]"><IcChevronR /></span>
              <span className="text-[14px] text-[#0a0a0a]">Morgan-stanley-research.pdf</span>
              <span className="text-[#737373]"><IcChevronR /></span>
              <span className="inline-flex items-center px-2 py-0.5 text-[12px] font-medium text-[#fafafa] bg-[#171717]">Demo</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center justify-center w-[28px] h-[28px] border bg-white text-[#737373] hover:text-[#171717] transition-colors"
                    style={{ borderColor: "#e5e5e5" }}>
              <IcBell />
            </button>
            <div className="w-[28px] h-[28px] border-2 border-zinc-200 overflow-hidden shrink-0">
              <img src="/assets/avatar.png" width={28} height={28} alt="User avatar"
                   style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 min-h-0 flex-col pt-3 pr-2 pb-2 overflow-hidden">
          <div className="flex flex-1 min-h-0 bg-white border" style={{ borderColor: "#e5e5e5" }}>

            {/* ── Left panel: Upload area or PDF viewer ── */}
            <div className="flex flex-col border-r flex-1 min-w-0 h-full" style={{ borderColor: "#e5e5e5" }}>

              {hasFile && (
                /* PDF viewer toolbar */
                <div className="flex items-center justify-between shrink-0 px-4 py-3 border-b"
                     style={{ background: "#f5f5f5", borderColor: "#e5e5e5" }}>
                  <div className="flex items-center">
                    <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-200 transition-colors">
                      <IcChevronL />
                    </button>
                    <button className="flex items-center justify-center px-2.5 py-1.5 border bg-white text-[13px] font-medium text-[#0a0a0a] shrink-0"
                            style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", width: 42 }}>
                      12
                    </button>
                    <span className="px-2.5 text-[13px] font-medium text-[#737373]">of 24</span>
                    <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-200 transition-colors">
                      <IcChevronR />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-200 transition-colors">
                      <IcZoomIn />
                    </button>
                    <button className="flex items-center justify-center px-2.5 py-1.5 border bg-white text-[13px] font-medium text-[#737373] shrink-0"
                            style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      125%
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-200 transition-colors">
                      <IcZoomOut />
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-200 transition-colors">
                      <IcRedo />
                    </button>
                  </div>
                </div>
              )}

              {hasFile ? (
                /* PDF page view */
                <div className="flex-1 min-h-0 overflow-auto flex flex-col items-center py-4 px-4 gap-3"
                     style={{ background: "#f5f5f5" }}>
                  <img src="/assets/pdf-page.png" alt="PDF page" className="w-full max-w-[520px] shadow-sm" style={{ display: "block" }} />
                  <img src="/assets/pdf-page.png" alt="PDF page 2" className="w-full max-w-[520px] shadow-sm" style={{ display: "block" }} />
                </div>
              ) : (
                /* Upload area */
                <div className="flex-1 min-h-0 flex items-center justify-center p-8"
                     style={{ background: "#f5f5f5" }}>
                  <div className="w-full h-full border border-dashed border-[#d1d1d1] bg-white flex items-center justify-center">
                    <div className="flex flex-col gap-6 items-center max-w-[340px] w-full">
                      {/* Icon + text */}
                      <div className="flex flex-col gap-4 items-center text-center w-full">
                        <div className="flex items-center justify-center w-10 h-10 bg-white">
                          <IcUpload />
                        </div>
                        <div className="flex flex-col gap-2 items-center w-full">
                          <p className="text-[18px] font-medium text-[#0a0a0a] leading-7">Upload your document</p>
                          <div className="text-[14px] text-[#737373] leading-5 text-center">
                            <p>Drop a file here or click to browse.</p>
                            <p>Supports PDF, Word, Excel, PowerPoint, and images.</p>
                          </div>
                        </div>
                      </div>

                      {/* Upload button + URL input */}
                      <div className="flex flex-col gap-4 items-center w-full">
                        <button
                          className="flex items-center gap-2 h-9 px-4 bg-[#171717] text-[#fafafa] text-[14px] font-medium w-full justify-center hover:bg-[#333] transition-colors"
                          onClick={() => setFileUploaded(true)}>
                          <IcPlus />
                          Upload a file
                        </button>

                        {/* Separator */}
                        <div className="flex items-center h-5 w-full relative">
                          <div className="absolute inset-x-0 top-1/2 h-px bg-[#e5e5e5]" />
                          <div className="relative mx-auto bg-white px-2 text-[14px] text-[#737373]">
                            or paste a file URL
                          </div>
                        </div>

                        {/* URL input with https:// prefix */}
                        <div className="flex items-center w-full" style={{ boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                          <div className="flex items-center justify-center h-9 px-3 border bg-[#f5f5f5] text-[14px] font-medium text-[#171717] shrink-0"
                               style={{ borderColor: "#e5e5e5", borderRight: "none" }}>
                            https://
                          </div>
                          <input
                            type="text"
                            value={urlInput}
                            onChange={e => setUrlInput(e.target.value)}
                            placeholder="acmeinc.com"
                            className="flex-1 h-9 min-w-0 border bg-white px-3 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa]"
                            style={{ borderColor: "#e5e5e5" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Resizable handle ── */}
            <div className="flex items-center justify-center w-2 shrink-0 cursor-col-resize relative"
                 style={{ background: "#fafafa", borderLeft: "1px solid #e5e5e5" }}>
              <div className="flex items-center justify-center w-3 h-4 border bg-[#e5e5e5] absolute"
                   style={{ borderColor: "#e5e5e5" }}>
                <IcGrip />
              </div>
            </div>

            {/* ── Right panel: Tabs + Config ── */}
            <div className="flex flex-col flex-1 min-w-0 h-full">

              {/* Tabs + action buttons */}
              <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white"
                   style={{ borderColor: "#e5e5e5" }}>
                {/* Tab bar */}
                <div className="flex items-center h-9 px-0.5 py-0.5 bg-[#f5f5f5]" style={{ width: 219 }}>
                  <button
                    className="flex items-center gap-2 px-2 py-1 text-[14px] font-medium text-[#171717] shrink-0"
                    style={{
                      background: activeTab === "config" ? "white" : "transparent",
                      border: activeTab === "config" ? "1px solid #e5e5e5" : "none",
                    }}
                    onClick={() => setActiveTab("config")}>
                    <IcSettings />
                    Configuration
                  </button>
                  <div className="relative group">
                    <button
                      className="flex items-center gap-2 px-2 py-1 text-[14px] font-medium text-[#171717] shrink-0 transition-opacity"
                      style={{
                        background: activeTab === "result" ? "white" : "transparent",
                        border: activeTab === "result" ? "1px solid #e5e5e5" : "none",
                        opacity: runState === "done" ? 1 : 0.5,
                        cursor: runState === "done" ? "pointer" : "default",
                      }}
                      onClick={() => runState === "done" && setActiveTab("result")}>
                      <IcSearchCheck />
                      Result
                    </button>
                    {/* Tooltip on hover when disabled */}
                    {runState !== "done" && (
                      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 px-2 py-1.5 bg-[#171717] text-[#fafafa] text-[12px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity w-[220px] text-center leading-4">
                        Fill in all fields and run Parse to see results here.
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 px-1.5 py-1.5 border bg-white text-[13px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors"
                          style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                    <IcCode />
                    API Examples
                  </button>
                  <div className="relative group">
                    <button
                      className="flex items-center gap-1.5 px-1.5 py-1.5 text-[13px] font-medium text-white transition-opacity"
                      style={{
                        background: canRun ? "#2563eb" : "#93c5fd",
                        cursor: canRun ? "pointer" : "not-allowed",
                      }}
                      disabled={!canRun || runState === "loading"}
                      onClick={startLoading}>
                      <IcPlay />
                      Run Parse
                    </button>
                    {!canRun && (
                      <span className="pointer-events-none absolute right-0 bottom-full mb-2 z-50 px-2 py-1.5 bg-[#171717] text-[#fafafa] text-[12px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity leading-4">
                        Upload a file and select a model first.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tab content */}
              <div className="flex-1 min-h-0 overflow-auto flex flex-col justify-between">

                {activeTab === "config" && runState !== "loading" && (
                  <div className="flex flex-col gap-7 p-4">

                    {/* Configure fields section */}
                    <div className="border p-3 flex flex-col gap-4" style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <IcTableProp />
                          <p className="text-[16px] font-medium text-[#0a0a0a]">Configure fields</p>
                        </div>
                        <p className="text-[14px] text-[#737373] leading-5">Tell us what to extract and how to process it.</p>
                      </div>
                      <div className="flex flex-col gap-4">
                        {/* Model select */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[14px] font-medium text-[#737373]">Model</label>
                          <div className="relative">
                            <select
                              value={modelSelected}
                              onChange={e => setModelSelected(e.target.value)}
                              className="w-full h-9 border bg-white px-3 text-[14px] text-[#0a0a0a] appearance-none outline-none cursor-pointer"
                              style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                              <option value="">Select processing model</option>
                              {models.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#737373]">
                              <IcChevronD />
                            </div>
                          </div>
                        </div>
                        {/* Citations extraction */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[14px] font-medium text-[#737373]">Citations Extraction</label>
                          <button className="flex items-center gap-3 h-9"
                                  onClick={() => setCitationsOn(v => !v)}>
                            <div className="flex items-center px-0.5 shrink-0"
                                 style={{
                                   width: 36, height: 20, background: citationsOn ? "#171717" : "#e5e5e5",
                                   transition: "background 0.2s",
                                 }}>
                              <div className="bg-white shrink-0" style={{
                                width: 16, height: 16,
                                transform: citationsOn ? "translateX(16px)" : "translateX(0)",
                                transition: "transform 0.2s",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                              }} />
                            </div>
                            <span className="text-[14px] font-medium text-[#0a0a0a]">Highlight source in PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Schema section */}
                    <div className="border p-3 flex flex-col gap-4" style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      <div className="flex flex-col gap-1">
                        <p className="text-[16px] font-medium text-[#0a0a0a]">Schema</p>
                        <p className="text-[14px] text-[#737373] leading-5">Define which fields to extract from the document.</p>
                      </div>

                      {/* Schema sub-tabs */}
                      <div className="flex items-center border-b" style={{ borderColor: "#e5e5e5" }}>
                        <button className="flex items-center gap-2 px-2 py-2 border-b-2 border-[#171717] text-[14px] font-medium text-[#0a0a0a]">
                          <IcPenLine /> Manual
                        </button>
                        <button className="flex items-center gap-2 px-2 py-2 text-[14px] font-medium text-[#737373]">
                          <IcSparkles /> Auto-Suggest
                          <span className="px-1 py-0.5 text-[11px] font-medium text-violet-700 bg-violet-100 leading-4">Beta</span>
                        </button>
                      </div>

                      {/* Name + Template fields */}
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <label className="text-[14px] font-medium text-[#737373]">Name</label>
                          <input type="text" placeholder="e.g. Invoice processing"
                                 className="h-9 border bg-white px-3 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa]"
                                 style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }} />
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <label className="text-[14px] font-medium text-[#737373]">Template</label>
                          <div className="relative">
                            <select className="w-full h-9 border bg-white px-3 text-[14px] text-[#a1a1aa] appearance-none outline-none cursor-pointer"
                                    style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                              <option value="">Browse pre-built field sets</option>
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#737373]">
                              <IcChevronD />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Schema table */}
                      <div className="border flex flex-col" style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                        {/* Table header */}
                        <div className="flex" style={{ background: "#fafafa" }}>
                          {[["Name", <IcTag key="t" />], ["Type", <IcBraces key="b" />], ["Description", <IcText key="d" />]].map(([label, icon]) => (
                            <div key={label as string} className="flex-1 flex items-center gap-2 px-3 py-1.5 border-b" style={{ borderColor: "#e5e5e5" }}>
                              <span className="text-[#737373]">{icon}</span>
                              <span className="text-[14px] font-medium text-[#737373]">{label as string}</span>
                            </div>
                          ))}
                          <div className="shrink-0 border-b" style={{ width: 60, borderColor: "#e5e5e5" }} />
                        </div>
                        {/* Rows */}
                        {[
                          { name: "UPPER CAP", type: "String", desc: "Upper cap as on March 31, 2017 during instrument Government Debt-General in Revised Limits by FPI" },
                          { name: "990 form", type: "Number", desc: "Percentage Holding" },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center border-b" style={{ height: 52, borderColor: "#e5e5e5" }}>
                            <div className="flex-1 flex items-center px-3 py-2 min-w-0">
                              <span className="text-[14px] font-medium text-[#0a0a0a] truncate">{row.name}</span>
                            </div>
                            <div className="flex-1 flex items-center px-3 py-2 min-w-0">
                              <span className="text-[14px] font-medium text-[#0a0a0a] truncate">{row.type}</span>
                            </div>
                            <div className="flex-1 flex items-center px-3 py-2 min-w-0">
                              <span className="text-[14px] text-[#0a0a0a] truncate">{row.desc}</span>
                            </div>
                            <div className="shrink-0 flex items-center justify-center px-3" style={{ width: 60 }}>
                              <button className="flex items-center justify-center w-9 h-9 border bg-white hover:bg-neutral-50 transition-colors text-[#737373]"
                                      style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                                <IcTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                        {/* Add schema row */}
                        <div className="flex items-center" style={{ height: 52 }}>
                          <button className="flex items-center gap-2 px-2.5 py-1.5 text-[14px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors">
                            <IcPlus /> Add Schema
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {runState === "loading" && (
                  <div className="flex flex-col items-center justify-center flex-1 gap-6 p-6">
                    <div className="flex flex-col items-center gap-0.5">
                      <CircularProgress percent={progress} />
                      <div className="flex items-center justify-center h-9 px-4">
                        <span className="text-[14px] font-medium text-[#737373]">
                          Initializing standard extraction{".".repeat(dotCount)}
                        </span>
                      </div>
                    </div>
                    {/* Sonner toast */}
                    <div className="flex gap-2 p-4 border bg-white"
                         style={{ width: 356, borderColor: "#e5e5e5", boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.1)" }}>
                      <div className="flex items-center py-0.5 shrink-0">
                        <img src="/assets/ic-info-circle.svg" width={20} height={20} alt="" />
                      </div>
                      <p className="text-[14px] font-medium text-[#0a0a0a] leading-5 flex-1 min-w-0">
                        {toastMessages[toastIndex]}
                      </p>
                    </div>
                  </div>
                )}

                {/* Result tab */}
                {activeTab === "result" && runState === "done" && (
                  <div className="flex flex-col items-center justify-center flex-1 gap-3 p-6">
                    <div className="w-full border p-4 bg-white" style={{ borderColor: "#e5e5e5" }}>
                      <p className="text-[14px] font-medium text-[#0a0a0a] mb-2">Extraction complete</p>
                      <p className="text-[13px] text-[#737373] leading-5">Results have been parsed successfully. This is where the structured output would appear in the production implementation.</p>
                    </div>
                  </div>
                )}

                {/* Footer: Cancel + Save Changes */}
                {activeTab === "config" && runState !== "loading" && (
                  <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0 bg-white"
                       style={{ borderColor: "#e5e5e5" }}>
                    <div className="flex items-center gap-2">
                      <Link href="/" className="flex items-center gap-2 px-2.5 py-1.5 border bg-white text-[13px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors"
                            style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                        Cancel
                      </Link>
                      <button className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f5f5f5] text-[13px] font-medium text-[#171717] hover:bg-neutral-200 transition-colors">
                        Save Changes
                        <span className="flex items-center justify-center h-5 min-w-5 px-1 bg-[#f5f5f5] text-[11px] font-medium text-[#737373]">⌘⏎</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
