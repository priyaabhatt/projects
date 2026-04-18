"use client";
import { useState } from "react";
import Image from "next/image";

/* ─── SVG Icons ─────────────────────────────────────────────────── */
const Icon = ({ children, size = 16, className }: { children: React.ReactNode; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

const IcHome       = () => <Icon><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>;
const IcActivity   = () => <Icon><rect width="18" height="18" x="3" y="3" rx="0"/><path d="M17 12h-2l-2 5-2-10-2 5H7"/></Icon>;
const IcSettings   = () => <Icon><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></Icon>;
const IcInfo       = () => <Icon><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></Icon>;
const IcPanelClose = () => <Icon><rect width="18" height="18" x="3" y="3" rx="0"/><path d="M9 3v18"/><path d="m14 9-3 3 3 3"/></Icon>;
const IcGamepad    = () => <Icon><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="17" y1="11" y2="13"/><line x1="17" x2="15" y1="11" y2="13"/><rect width="20" height="12" x="2" y="6" rx="0"/></Icon>;
const IcGitPR      = () => <Icon><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/></Icon>;
const IcLock       = () => <Icon><rect width="18" height="11" x="3" y="11" rx="0"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>;
const IcBriefcase  = () => <Icon><rect width="20" height="14" x="2" y="7" rx="0"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>;
const IcLockOpen   = () => <Icon><rect width="18" height="11" x="3" y="11" rx="0"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></Icon>;
const IcBell       = () => <Icon><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Icon>;
const IcTerminal   = () => <Icon size={20}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></Icon>;
const IcX          = () => <Icon><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>;
const IcChevronR   = () => <Icon size={15}><path d="m9 18 6-6-6-6"/></Icon>;
const IcArrowR     = () => <Icon><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Icon>;
const IcFileBox    = () => <Icon><path d="M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><polyline points="14 2 14 8 20 8"/><path d="M2 20v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M8 20h-4"/><path d="M2 15l3-3 2 2 3-3"/></Icon>;
const IcNavigation = () => <Icon><polygon points="3 11 22 2 13 21 11 13 3 11"/></Icon>;

/* ─── Unsiloed AI Logo ───────────────────────────────────────────── */
const UnsiloedLogo = () => (
  <svg width="17" height="25" viewBox="0 0 17 25" fill="none">
    <path d="M8.5 0L17 5V15L8.5 20L0 15V5L8.5 0Z" fill="#171717" fillOpacity="0.9"/>
    <path d="M8.5 4L14 7.5V14.5L8.5 18L3 14.5V7.5L8.5 4Z" fill="white" fillOpacity="0.15"/>
    <circle cx="8.5" cy="11" r="2.5" fill="white" fillOpacity="0.9"/>
  </svg>
);

/* ─── Type Badge ─────────────────────────────────────────────────── */
type DocType = "Parse" | "Extract" | "Split";
const typeBadgeStyle: Record<DocType, string> = {
  Parse:   "bg-orange-50 text-orange-600",
  Extract: "bg-fuchsia-50 text-fuchsia-700",
  Split:   "bg-indigo-50 text-indigo-600",
};
const DocTypeBadge = ({ type }: { type: DocType }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-[13px] font-medium ${typeBadgeStyle[type]}`}>
    {type}
  </span>
);

/* ─── Template Cards Data ────────────────────────────────────────── */
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

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafafa]">

      {/* ── SIDEBAR ───────────────────────────────────────────────── */}
      <aside className="flex flex-col shrink-0 h-full" style={{ width: 304 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 border-b border-r shrink-0"
             style={{ borderColor: "#e4e4e7", background: "#fafafa", height: 49 }}>
          <div className="flex items-center gap-2">
            <UnsiloedLogo />
            <span className="font-semibold text-[15px] text-[#171717] leading-none">Unsiloed AI</span>
          </div>
          <button className="p-1.5 border text-[#737373] hover:text-[#171717] transition-colors"
                  style={{ borderColor: "#e5e5e5" }}>
            <IcPanelClose />
          </button>
        </div>

        {/* Body: icon rail + text nav */}
        <div className="flex flex-1 min-h-0">

          {/* Icon rail */}
          <div className="flex flex-col items-center pt-3 shrink-0 border-r"
               style={{ width: 48, background: "#fafafa", borderColor: "#e4e4e7" }}>
            <div className="flex flex-col gap-1 flex-1">
              <button className="flex items-center justify-center w-8 h-8 text-[#2563eb] bg-blue-100">
                <IcHome />
              </button>
              <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-100 transition-colors">
                <IcActivity />
              </button>
              <button className="flex items-center justify-center w-8 h-8 text-[#737373] hover:bg-neutral-100 transition-colors">
                <IcSettings />
              </button>
            </div>
            <button className="flex items-center justify-center w-8 h-8 mb-2 text-[#737373] hover:bg-neutral-100 transition-colors">
              <IcInfo />
            </button>
          </div>

          {/* Text nav */}
          <div className="flex flex-col flex-1 min-h-0 relative pt-3"
               style={{ background: "#fafafa", width: 256 }}>
            <div className="flex flex-col gap-0.5 px-2">
              <button className="flex items-center gap-2 h-8 px-2 w-full text-left bg-blue-100 text-blue-600 text-[14px] font-medium">
                <IcGamepad /> Playground
              </button>
              <button className="flex items-center gap-2 h-8 px-2 w-full text-left opacity-50 text-[14px] hover:bg-neutral-100 transition-colors">
                <IcGitPR />
                <span className="flex-1 text-[#0a0a0a]">Workflows</span>
                <IcLock />
              </button>
              <button className="flex items-center gap-2 h-8 px-2 w-full text-left opacity-50 text-[14px] hover:bg-neutral-100 transition-colors">
                <IcBriefcase />
                <span className="flex-1 text-[#0a0a0a]">Jobs</span>
                <IcLock />
              </button>
            </div>

            {/* Footer CTA card */}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-4">
              <div className="w-full bg-white border" style={{ borderColor: "#e4e4e7", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" }}>
                <div className="px-3 pt-3 pb-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[#18181b] mt-px shrink-0"><IcLockOpen /></span>
                    <p className="text-[12px] font-medium text-[#18181b] leading-4">Try it on your own docs</p>
                  </div>
                  <p className="text-[12px] text-[#737373] leading-4">
                    Upload any PDF and see real output in under 30 seconds.
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 text-[13px] font-medium text-white bg-[#171717] text-center hover:bg-[#333] transition-colors">
                      Sign up
                    </button>
                    <button className="flex-1 py-1.5 text-[13px] font-medium text-[#0a0a0a] border border-[#e5e5e5] bg-white text-center hover:bg-neutral-50 transition-colors">
                      Book a demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 h-full">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 border-b shrink-0"
             style={{ height: 49, borderColor: "#e4e4e7", background: "#fafafa" }}>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-[14px] text-[#737373]">Playground</span>
            <span className="text-[#737373]"><IcChevronR /></span>
            <span className="inline-flex items-center px-2 py-0.5 text-[12px] font-medium text-[#fafafa] bg-[#171717]">
              Demo
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center justify-center w-[28px] h-[28px] border bg-white text-[#737373] hover:text-[#171717] transition-colors"
                    style={{ borderColor: "#e5e5e5" }}>
              <IcBell />
            </button>
            <div className="w-[28px] h-[28px] border-2 border-zinc-200 overflow-hidden bg-gradient-to-br from-violet-400 to-indigo-500 shrink-0" />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex flex-1 min-h-0 flex-col p-2 pb-2 overflow-auto">
          <div className="flex flex-col flex-1 bg-white border min-h-0" style={{ borderColor: "#e5e5e5" }}>

            {/* Alert banner */}
            {alertVisible && (
              <div className="flex items-center gap-3 px-4 py-2 border-b shrink-0"
                   style={{ background: "#fff7ed", borderColor: "#e5e5e5" }}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-orange-600 shrink-0"><IcTerminal /></span>
                  <p className="text-[13px] font-medium text-orange-700 truncate">
                    You&apos;re in Sandbox mode. Explore freely. Processing is limited to 10 pages per run.
                  </p>
                </div>
                <button className="shrink-0 px-2.5 py-1.5 text-[13px] font-medium border bg-white hover:bg-neutral-50 transition-colors"
                        style={{ borderColor: "#e5e5e5" }}>
                  Sign up free
                </button>
                <button className="shrink-0 text-[#737373] hover:text-[#171717] transition-colors"
                        onClick={() => setAlertVisible(false)}>
                  <IcX />
                </button>
              </div>
            )}

            {/* Action cards */}
            <div className="flex flex-col gap-4 p-4 shrink-0">
              <div className="flex items-center gap-2">
                <IcNavigation />
                <span className="text-[16px] font-medium text-[#0a0a0a]">Get started</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { src: "/assets/parse-icon.svg",   w: 43, h: 52, title: "Parse Documents",  desc: "Parse any PDF or scan into structured Markdown & JSON with layout preserved." },
                  { src: "/assets/extract-icon.svg", w: 52, h: 52, title: "Extract Data",     desc: "Extract fields, tables, or entities with confidence scores. Includes citation extraction." },
                  { src: "/assets/split-icon.svg",   w: 40, h: 52, title: "Split Documents",  desc: "Split multi-document PDFs into clean individual files using layout signals." },
                ].map(({ src, w, h, title, desc }) => (
                  <div key={title} className="flex flex-col gap-4 p-4 border bg-white"
                       style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                    <div className="flex items-start justify-between">
                      {/* Exact Figma illustration */}
                      <img src={src} width={w} height={h} alt={title} />
                      <button disabled
                              className="flex items-center gap-1.5 px-1.5 py-1.5 border bg-white opacity-50 text-[13px] font-medium cursor-not-allowed"
                              style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                        <IcLock />
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

            {/* Template gallery */}
            <div className="flex flex-col flex-1 min-h-0 px-4 overflow-auto">
              <div className="flex flex-col gap-1 py-4 shrink-0">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 text-[16px] font-medium text-[#0a0a0a]">
                    <IcFileBox />
                    Try a template
                  </button>
                  <span className="px-2 py-0.5 text-[13px] font-medium text-[#171717] bg-neutral-100">
                    For Demo
                  </span>
                </div>
                <p className="text-[14px] text-[#737373] leading-5">
                  Open a real document and see exactly what the output looks like.
                </p>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-3 gap-4 pb-4">
                {templates.map(({ category, type, title }, i) => (
                  <div key={i} className="flex flex-col gap-4 p-3 border bg-white"
                       style={{ height: 309, borderColor: "#e5e5e5" }}>
                    {/* Doc preview — bg is neutral-100 (#f5f5f5), not white */}
                    <div className="flex-1 min-h-0 border overflow-hidden flex flex-col items-start justify-start"
                         style={{ background: "#f5f5f5", borderColor: "#e5e5e5" }}>
                      <div className="w-full h-full flex items-start justify-center pt-6 px-6">
                        <div className="w-full bg-white overflow-hidden" style={{ borderRadius: 0 }}>
                          <Image
                            src="/assets/doc-preview.png"
                            alt="Document preview"
                            width={322}
                            height={255}
                            className="w-full h-auto object-top"
                            style={{ borderRadius: 0 }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="flex items-end justify-between shrink-0">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[13px] font-medium text-[#171717] bg-neutral-100">
                            {category}
                          </span>
                          <DocTypeBadge type={type} />
                        </div>
                        <p className="text-[13px] font-medium text-neutral-800 whitespace-nowrap">{title}</p>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border bg-white text-[13px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors shrink-0"
                              style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                        Try
                        <IcChevronR />
                      </button>
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
