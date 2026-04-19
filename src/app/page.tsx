"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PanelLeftClose, PanelLeftOpen, Info, LockOpen, Bell, Terminal, X,
  ChevronRight, ArrowRight, Home, Activity, Settings, GitPullRequest,
  Lock, Briefcase, FileBox, Navigation, Gamepad2,
} from "lucide-react";

/* ─── Lucide icons — every glyph at strokeWidth 1.5 ────────────────── */
const STROKE = 2;
const IcPanelClose = () => <PanelLeftClose size={16} strokeWidth={STROKE} />;
const IcPanelOpen  = () => <PanelLeftOpen  size={16} strokeWidth={STROKE} />;
const IcInfo       = () => <Info           size={16} strokeWidth={STROKE} />;
const IcLockOpen   = () => <LockOpen       size={16} strokeWidth={STROKE} />;
const IcBell       = () => <Bell           size={16} strokeWidth={STROKE} />;
const IcTerminal   = () => <Terminal       size={20} strokeWidth={STROKE} />;
const IcX          = () => <X              size={16} strokeWidth={STROKE} />;
const IcChevronR   = () => <ChevronRight   size={15} strokeWidth={STROKE} />;
const IcArrowR     = () => <ArrowRight     size={16} strokeWidth={STROKE} />;

/* ─── Tooltip wrapper for icon rail ─────────────────────────────── */
const TooltipIcon = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative group flex items-center justify-center">
    {children}
    <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50 px-2 py-1 bg-[#171717] text-[#fafafa] text-[12px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
      {label}
    </span>
  </div>
);

/* ─── Type Badge ─────────────────────────────────────────────────── */
type DocType = "Parse" | "Extract" | "Split";
const typeBadgeStyle: Record<DocType, string> = {
  Parse:   "bg-orange-50 text-orange-600",
  Extract: "bg-fuchsia-50 text-fuchsia-700",
  Split:   "bg-indigo-50 text-indigo-600",
};
const DocTypeBadge = ({ type }: { type: DocType }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-[14px] font-medium ${typeBadgeStyle[type]}`}>
    {type}
  </span>
);

/* ─── Template cards data ────────────────────────────────────────── */
const templates = [
  { category: "Legal",      type: "Parse"   as DocType, title: "2023 Product Rollout Plan" },
  { category: "Enterprise", type: "Split"   as DocType, title: "2023 Product Rollout Plan" },
  { category: "Medical",    type: "Extract" as DocType, title: "2023 Product Rollout Plan" },
  { category: "Enterprise", type: "Split"   as DocType, title: "2023 Product Rollout Plan" },
  { category: "Medical",    type: "Extract" as DocType, title: "2023 Product Rollout Plan" },
  { category: "Legal",      type: "Parse"   as DocType, title: "2023 Product Rollout Plan" },
];

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function PlaygroundPage() {
  const [alertVisible, setAlertVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafafa]">

      {/* ══════════════ SIDEBAR ═══════════════════════════════════ */}
      <aside className="flex flex-col shrink-0 h-full transition-all duration-200"
             style={{ width: sidebarOpen ? 304 : 48 }}>

        {/* Header — spans full sidebar width */}
        <div className="border-b border-r shrink-0 overflow-hidden"
             style={{ borderColor: "#e4e4e7", background: "#fafafa", height: 49,
               display: "flex", alignItems: "center",
               justifyContent: sidebarOpen ? "space-between" : "center",
               paddingLeft: sidebarOpen ? 16 : 0,
               paddingRight: sidebarOpen ? 12 : 0,
             }}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <img src="/assets/unsiloed-logo.png" width={17} height={17} alt="Unsiloed AI" style={{ flexShrink: 0 }} />
                <span className="font-semibold text-[16px] text-[#171717] leading-none whitespace-nowrap">
                  Unsiloed AI
                </span>
              </div>
              <button
                className="p-1.5 border text-[#737373] hover:text-[#171717] transition-colors shrink-0"
                style={{ borderColor: "#e5e5e5" }}
                onClick={() => setSidebarOpen(false)}>
                <IcPanelClose />
              </button>
            </>
          ) : (
            /* Collapsed: expand button lives here, not in the icon rail */
            <button
              className="flex items-center justify-center w-full h-full text-[#737373] hover:text-[#171717] transition-colors"
              onClick={() => setSidebarOpen(true)}>
              <IcPanelOpen />
            </button>
          )}
        </div>

        {/* Body: icon rail (always) + text nav (conditional) */}
        <div className="flex flex-1 min-h-0">

          {/* ── Icon rail ── always visible ────────────────────── */}
          <div className="flex flex-col items-center pt-3 shrink-0 border-r"
               style={{ width: 48, background: "#fafafa", borderColor: "#e4e4e7" }}>
            {/* No expand button here — it lives in the header above */}

            <div className="flex flex-col gap-1 flex-1">
              <TooltipIcon label="Home">
                <button className="flex items-center justify-center w-8 h-8 bg-blue-100">
                  <Home size={16} strokeWidth={STROKE} />
                </button>
              </TooltipIcon>
              <TooltipIcon label="Analytics">
                <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-100 transition-colors">
                  <Activity size={16} strokeWidth={STROKE} />
                </button>
              </TooltipIcon>
              <TooltipIcon label="Settings">
                <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-100 transition-colors">
                  <Settings size={16} strokeWidth={STROKE} />
                </button>
              </TooltipIcon>
            </div>

            <button className="flex items-center justify-center w-8 h-8 mb-2 text-[#737373] hover:bg-neutral-100 transition-colors">
              <IcInfo />
            </button>
          </div>

          {/* ── Text nav ── collapses ───────────────────────────── */}
          {sidebarOpen && (
            <div className="flex flex-col flex-1 min-h-0 relative pt-3"
                 style={{ width: 256, background: "#fafafa" }}>
              <div className="flex flex-col gap-0.5 px-2">
                {/* Playground – active */}
                <button className="flex items-center gap-2 h-8 px-2 w-full text-left bg-blue-100 text-blue-600 text-[14px] font-medium">
                  <Gamepad2 size={16} strokeWidth={STROKE} style={{ flexShrink: 0 }} />
                  Playground
                </button>
                {/* Workflows – locked */}
                <div className="relative group">
                  <button className="flex items-center gap-2 h-8 px-2 w-full text-left opacity-50 text-[14px] hover:bg-neutral-100 transition-colors">
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <GitPullRequest size={16} strokeWidth={STROKE} />
                    </span>
                    <span className="flex-1 text-[#0a0a0a]">Workflows</span>
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <Lock size={16} strokeWidth={STROKE} />
                    </span>
                  </button>
                  <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2 py-1.5 bg-[#171717] text-[#fafafa] text-[12px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity leading-4">
                    Sign up to build and manage workflows
                  </span>
                </div>
                {/* Jobs – locked */}
                <div className="relative group">
                  <button className="flex items-center gap-2 h-8 px-2 w-full text-left opacity-50 text-[14px] hover:bg-neutral-100 transition-colors">
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <Briefcase size={16} strokeWidth={STROKE} />
                    </span>
                    <span className="flex-1 text-[#0a0a0a]">Jobs</span>
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <Lock size={16} strokeWidth={STROKE} />
                    </span>
                  </button>
                  <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2 py-1.5 bg-[#171717] text-[#fafafa] text-[12px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity leading-4">
                    Sign up to build and manage jobs
                  </span>
                </div>
              </div>

              {/* CTA card pinned to bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-4">
                <div className="w-full bg-white border"
                     style={{ borderColor: "#e4e4e7", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" }}>
                  <div className="px-3 pt-3 pb-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[#18181b] mt-px shrink-0"><IcLockOpen /></span>
                      <p className="text-[12px] font-medium text-[#18181b] leading-4">Try it on your own docs</p>
                    </div>
                    <p className="text-[12px] text-[#737373] leading-4">
                      Upload any PDF and see real output in under 30 seconds.
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 text-[14px] font-medium text-white bg-[#171717] hover:bg-[#333] transition-colors">
                        Sign up
                      </button>
                      <button className="flex-1 py-1.5 text-[14px] font-medium text-[#0a0a0a] border border-[#e5e5e5] bg-white hover:bg-neutral-50 transition-colors">
                        Book a demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════════════════════ */}
      <div className="flex flex-1 flex-col min-w-0 h-full">

        {/* Top bar — same height as sidebar header (49px) */}
        <div className="flex items-center gap-3 px-4 border-b shrink-0"
             style={{ height: 49, borderColor: "#e4e4e7", background: "#fafafa" }}>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-[14px] text-[#737373]">Playground</span>
            <span className="text-[#737373]"><IcChevronR /></span>
            <span className="inline-flex items-center px-2 py-0.5 text-[12px] font-medium text-[#fafafa] bg-[#171717]">
              Demo
            </span>
          </div>
          {/* Right: bell + avatar */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center justify-center w-[28px] h-[28px] border bg-white text-[#737373] hover:text-[#171717] transition-colors"
                    style={{ borderColor: "#e5e5e5" }}>
              <IcBell />
            </button>
            {/* Actual avatar from Figma */}
            <div className="w-[28px] h-[28px] border-2 border-zinc-200 overflow-hidden shrink-0">
              <img
                src="/assets/avatar.png"
                width={28}
                height={28}
                alt="User avatar"
                style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        {/* Content area — no left padding so white box is flush with sidebar */}
        <div className="flex flex-1 min-h-0 flex-col pt-3 pr-2 pb-2 overflow-auto">
          <div className="flex flex-col flex-1 bg-white border min-h-0" style={{ borderColor: "#e5e5e5" }}>

            {/* Alert banner */}
            {alertVisible && (
              <div className="flex items-center gap-3 px-4 py-2 border-b shrink-0"
                   style={{ background: "#fff7ed", borderColor: "#e5e5e5" }}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-orange-600 shrink-0"><IcTerminal /></span>
                  <p className="text-[14px] font-medium text-orange-700 truncate">
                    You&apos;re in Sandbox mode. Explore freely. Processing is limited to 10 pages per run.
                  </p>
                </div>
                <button className="shrink-0 px-2.5 py-1.5 text-[14px] font-medium border bg-white hover:bg-neutral-50 transition-colors"
                        style={{ borderColor: "#e5e5e5" }}>
                  Sign up free
                </button>
                <button className="shrink-0 text-[#737373] hover:text-[#171717] transition-colors"
                        onClick={() => setAlertVisible(false)}>
                  <IcX />
                </button>
              </div>
            )}

            {/* Get started — action cards */}
            <div className="flex flex-col gap-4 p-4 shrink-0">
              <div className="flex items-center gap-2">
                <Navigation size={16} strokeWidth={STROKE} />
                <span className="text-[16px] font-medium text-[#0a0a0a]">Get started</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { src: "/assets/parse-icon.svg",   w: 43, h: 52, title: "Parse Documents",  desc: "Parse any PDF or scan into structured Markdown & JSON with layout preserved." },
                  { src: "/assets/extract-icon.svg", w: 52, h: 52, title: "Extract Data",      desc: "Extract fields, tables, or entities with confidence scores. Includes citation extraction." },
                  { src: "/assets/split-icon.svg",   w: 40, h: 52, title: "Split Documents",   desc: "Split multi-document PDFs into clean individual files using layout signals." },
                ].map(({ src, w, h, title, desc }) => (
                  <div key={title} className="flex flex-col gap-4 p-4 border bg-white"
                       style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                    <div className="flex items-start justify-between">
                      <img src={src} width={w} height={h} alt={title} style={{ display: "block" }} />
                      <button disabled
                              className="flex items-center gap-1.5 px-1.5 py-1.5 border bg-white opacity-50 text-[14px] font-medium cursor-not-allowed"
                              style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                        <Lock size={16} strokeWidth={STROKE} />
                        <span>Try it</span>
                        <IcArrowR />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-[16px] font-semibold text-[#171717] leading-none">{title}</p>
                      <p className="text-[14px] text-[#737373] leading-5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Try a template — gallery */}
            <div className="flex flex-col flex-1 min-h-0 px-4 overflow-auto">
              {/* Section header */}
              <div className="flex flex-col gap-1 py-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-[16px] font-medium text-[#0a0a0a]">
                    {/* Exact FileBox icon from Figma */}
                    <span className="w-4 h-4 flex items-center justify-center">
                      <FileBox size={16} strokeWidth={STROKE} />
                    </span>
                    Try a template
                  </div>
                  <span className="px-2 py-0.5 text-[14px] font-medium text-[#171717] bg-neutral-100">
                    For Demo
                  </span>
                </div>
                <p className="text-[14px] text-[#737373] leading-5">
                  Open a real document and see exactly what the output looks like.
                </p>
              </div>

              {/* Template cards grid */}
              <div className="grid grid-cols-3 gap-4 pb-4">
                {templates.map(({ category, type, title }, i) => (
                  <div key={i} className="flex flex-col gap-4 p-3 border bg-white"
                       style={{ height: 309, borderColor: "#e5e5e5" }}>
                    {/* Doc preview — neutral-100 background, not white */}
                    <div className="flex-1 min-h-0 border overflow-hidden flex items-start justify-center pt-6 px-6"
                         style={{ background: "#f5f5f5", borderColor: "#e5e5e5" }}>
                      <div className="w-full bg-white overflow-hidden">
                        <Image
                          src="/assets/doc-preview.png"
                          alt="Document preview"
                          width={322}
                          height={255}
                          className="w-full h-auto"
                          style={{ display: "block" }}
                        />
                      </div>
                    </div>
                    {/* Card footer */}
                    <div className="flex items-end justify-between shrink-0">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[14px] font-medium text-[#171717] bg-neutral-100">
                            {category}
                          </span>
                          <DocTypeBadge type={type} />
                        </div>
                        <p className="text-[14px] font-medium text-neutral-800 whitespace-nowrap">{title}</p>
                      </div>
                      <Link href="/run" className="flex items-center gap-1.5 px-3 py-1.5 border bg-white text-[14px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors shrink-0"
                              style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                        Try
                        <IcChevronR />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
