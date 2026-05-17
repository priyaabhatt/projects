"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  MoveLeft, ChevronRight, ChevronUp, ChevronDown, Bell, Play, Upload, Plus,
  Settings, SearchCheck, Settings2, SlidersVertical,
  Image as ImageIcon, Type, TableProperties, BookOpenText, Ellipsis, Info, Cpu,
  Share, Download,
} from "lucide-react";

const STROKE = 2;

/* ─── Header (outer top app bar) ────────────────────────────────── */
function TopBar() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#e4e4e7] bg-[#fafafa] shrink-0">
      <div className="flex flex-1 items-center gap-3">
        <Link href="/" className="flex items-center justify-center gap-2 px-1.5 py-1.5 border bg-white text-[14px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors"
              style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
          <MoveLeft size={16} strokeWidth={STROKE} />
          Back
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[14px] text-[#737373]">Playground</span>
          <ChevronRight size={15} strokeWidth={STROKE} className="text-[#737373]" />
          <span className="text-[14px] text-[#0a0a0a]">Morgan-stanley-research.pdf</span>
          <ChevronRight size={15} strokeWidth={STROKE} className="text-[#737373]" />
          <span className="inline-flex items-center px-2 py-0.5 text-[12px] font-medium text-[#fafafa] bg-[#171717] border border-[#fafafa]">
            Demo
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center w-7 h-7 border bg-white text-[#737373] hover:text-[#171717] transition-colors"
                style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
          <Bell size={16} strokeWidth={STROKE} />
        </button>
        <div className="w-7 h-7 border-2 border-zinc-200 overflow-hidden shrink-0">
          <img src="/assets/avatar.png" width={28} height={28} alt="User avatar"
               style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Tooltip-less info dot ─────────────────────────────────────── */
function InfoDot() {
  return <Info size={14} strokeWidth={STROKE} className="text-[#a3a3a3] shrink-0" />;
}

/* ─── Field wrappers ────────────────────────────────────────────── */
function FieldLabel({ label, optional, hideInfo }: { label: string; optional?: boolean; hideInfo?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] font-medium text-[#525252] leading-5">{label}</span>
      {optional && <span className="text-[14px] text-[#a3a3a3] leading-5">[Optional]</span>}
      {!hideInfo && <InfoDot />}
    </div>
  );
}

function SwitchField({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex flex-col gap-1 w-full">
      <FieldLabel label={label} />
      <button onClick={() => setOn(v => !v)} className="flex items-center gap-3 cursor-pointer text-left">
        <span className={`flex h-5 w-9 items-center px-0.5 transition-colors ${on ? "bg-[#F861A8]" : "bg-[#e5e5e5]"}`}>
          <span className={`block w-4 h-4 bg-white transition-transform ${on ? "translate-x-4" : "translate-x-0"}`}
                style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" }} />
        </span>
        <span className="flex-1 text-[14px] text-[#737373] leading-5">{desc}</span>
      </button>
    </div>
  );
}

/* Advanced-tab variant: muted "section" label above, switch with bold inline title */
function LabeledSwitch({ label, title, defaultOn = false }: { label: string; title: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex flex-col gap-1 w-full">
      <p className="text-[14px] font-medium text-[#737373] leading-5">{label}</p>
      <button onClick={() => setOn(v => !v)} className="flex items-center gap-3 h-9 cursor-pointer text-left w-full">
        <span className={`flex h-5 w-9 items-center px-0.5 transition-colors ${on ? "bg-[#F861A8]" : "bg-[#e5e5e5]"}`}>
          <span className={`block w-4 h-4 bg-white transition-transform ${on ? "translate-x-4" : "translate-x-0"}`}
                style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" }} />
        </span>
        <span className="flex-1 text-[14px] font-medium text-[#0a0a0a] leading-none">{title}</span>
      </button>
    </div>
  );
}

function DropdownField({
  label, value, options, desc, optional,
}: {
  label: string;
  value: string;
  options?: string[];
  desc?: string;
  optional?: boolean;
}) {
  const [selected, setSelected] = useState(value);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  function toggle() {
    if (!options) return;
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 2, left: r.left, width: r.width });
    setOpen(v => !v);
  }

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <FieldLabel label={label} optional={optional} />
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 h-9 px-3 py-1 border bg-white text-[14px] text-[#0a0a0a] text-left outline-none hover:bg-[#fafafa] transition-colors"
        style={{
          borderColor: open ? "#a3a3a3" : "#e5e5e5",
          boxShadow: open ? "0 0 0 3px rgba(163,163,163,0.3)" : "0 1px 2px 0 rgba(0,0,0,0.05)",
          cursor: options ? "pointer" : "default",
        }}
      >
        <span className="flex-1 truncate">{selected}</span>
        <ChevronDown size={14} strokeWidth={STROKE} className="text-[#737373]" />
      </button>
      {desc && <p className="text-[14px] text-[#737373] leading-5">{desc}</p>}
      {mounted && open && options && createPortal(
        <div
          ref={menuRef}
          style={{
            position: "fixed", zIndex: 9999,
            top: pos.top, left: pos.left, width: pos.width,
            background: "white", border: "1px solid #e5e5e5", padding: "4px 0",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
          }}
        >
          {options.map(opt => {
            const isSelected = opt === selected;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { setSelected(opt); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                  fontSize: 14, color: "#0a0a0a", textAlign: "left",
                  background: isSelected ? "#f5f5f5" : "transparent",
                  border: "none", cursor: "pointer",
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f5f5f5"; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                {opt}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}

function InputField({ label, placeholder, optional, desc }: { label: string; placeholder: string; optional?: boolean; desc?: string }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <FieldLabel label={label} optional={optional} />
      <input type="text" placeholder={placeholder}
             className="h-9 px-3 py-1 border bg-white text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa]"
             style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }} />
      {desc && <p className="text-[14px] text-[#737373] leading-5">{desc}</p>}
    </div>
  );
}

function TextareaField({ label, placeholder, optional }: { label: string; placeholder: string; optional?: boolean }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <FieldLabel label={label} optional={optional} hideInfo />
      <textarea placeholder={placeholder}
                className="w-full h-[150px] p-3 border bg-white text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa] resize-none"
                style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }} />
    </div>
  );
}

/* ─── Collapsible section ───────────────────────────────────────── */
function Section({
  icon, title, desc, children,
}: { icon: ReactNode; title: string; desc: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col gap-4 p-3 border bg-white w-full"
         style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
      <button onClick={() => setOpen(v => !v)} className="flex flex-col gap-1 items-start text-left">
        <div className="flex items-center gap-2 w-full">
          <span className="text-[#0a0a0a] shrink-0">{icon}</span>
          <span className="flex-1 text-[16px] font-medium text-[#0a0a0a] leading-6">{title}</span>
          {open
            ? <ChevronUp size={16} strokeWidth={STROKE} className="text-[#737373]" />
            : <ChevronDown size={16} strokeWidth={STROKE} className="text-[#737373]" />}
        </div>
        <p className="text-[14px] text-[#737373] leading-5">{desc}</p>
      </button>
      {open && <div className="flex flex-col gap-4">{children}</div>}
    </div>
  );
}

/* ─── Upload (empty) panel ──────────────────────────────────────── */
function UploadPanel({ hasFile, onUpload }: { hasFile: boolean; onUpload: () => void }) {
  if (hasFile) {
    return (
      <div className="flex-1 flex items-stretch p-4 bg-[#f5f5f5] min-h-0">
        <div className="flex-1 flex items-center justify-center bg-white border" style={{ borderColor: "#e5e5e5" }}>
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="w-10 h-10 bg-[#fdf2f8] flex items-center justify-center">
              <Upload size={20} strokeWidth={STROKE} className="text-[#F861A8]" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[16px] font-medium text-[#0a0a0a]">Morgan-stanley-research.pdf</p>
              <p className="text-[14px] text-[#737373]">Ready to split. Press Run Splitting to continue.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 flex items-stretch p-4 bg-[#f5f5f5] min-h-0">
      <div className="flex-1 flex items-center justify-center border border-dashed bg-white"
           style={{ borderColor: "#d1d1d1" }}>
        <div className="flex flex-col gap-6 items-center w-[340px] p-8">
          <div className="flex flex-col gap-4 items-center w-full text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-white">
              <Upload size={24} strokeWidth={STROKE} className="text-[#0a0a0a]" />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-[18px] font-medium text-[#0a0a0a] leading-7">Upload your document</p>
              <div className="text-[14px] text-[#737373] leading-[1.625]">
                <p>Drop a file here or click to browse.</p>
                <p>Supports PDF, Word, Excel, PowerPoint, and images.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center w-full">
            <button onClick={onUpload}
                    className="flex items-center justify-center gap-2 h-9 px-4 bg-[#171717] text-[#fafafa] text-[14px] font-medium w-full hover:bg-[#333] transition-colors">
              <Plus size={16} strokeWidth={STROKE} />
              Upload a file
            </button>
            <div className="flex items-center h-5 w-full relative">
              <div className="absolute inset-x-0 top-1/2 h-px bg-[#e5e5e5]" />
              <div className="relative mx-auto bg-white px-2 text-[14px] text-[#737373]">or paste a file URL</div>
            </div>
            <div className="flex items-center w-full" style={{ boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-center h-9 px-4 border bg-[#f5f5f5] text-[14px] font-medium text-[#171717] shrink-0"
                   style={{ borderColor: "#e5e5e5", borderRight: "none" }}>
                https://
              </div>
              <input type="text" placeholder="acmeinc.com"
                     className="flex-1 h-9 min-w-0 border bg-white px-3 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa]"
                     style={{ borderColor: "#e5e5e5" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Config sidebar (Configuration tab) ────────────────────────── */
function ConfigSidebar({ hasFile }: { hasFile: boolean }) {
  const [outerTab, setOuterTab] = useState<"configuration" | "result">("configuration");
  const [innerTab, setInnerTab] = useState<"basic" | "advanced">("basic");
  const [hasRun, setHasRun] = useState(false);

  function handleRun() {
    if (!hasFile) return;
    setHasRun(true);
    setOuterTab("result");
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-white min-h-0">
      {/* Inner top app bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: "#e5e5e5" }}>
        <div className="flex items-center gap-0.5 h-9 px-[3px] py-0.5 bg-[#f5f5f5]">
          <button onClick={() => setOuterTab("configuration")}
                  className={`flex items-center gap-2 px-2 py-1 text-[14px] font-medium transition-colors ${
                    outerTab === "configuration"
                      ? "bg-white text-[#171717] border"
                      : "text-[#171717] opacity-50"
                  }`}
                  style={outerTab === "configuration" ? { borderColor: "#e5e5e5" } : undefined}>
            <Settings size={16} strokeWidth={STROKE} />
            Configuration
          </button>
          <button onClick={() => setOuterTab("result")}
                  className={`flex items-center gap-2 px-2 py-1 text-[14px] font-medium transition-colors ${
                    outerTab === "result"
                      ? "bg-white text-[#171717] border"
                      : "text-[#171717] opacity-50"
                  }`}
                  style={outerTab === "result" ? { borderColor: "#e5e5e5" } : undefined}>
            <SearchCheck size={16} strokeWidth={STROKE} />
            Result
          </button>
        </div>
        <button onClick={handleRun}
                disabled={!hasFile}
                title={!hasFile ? "Upload a file first" : undefined}
                className="flex items-center justify-center gap-2 p-1.5 bg-[#F861A8] text-[#fafafa] text-[14px] font-medium transition-opacity"
                style={{
                  opacity: hasFile ? 1 : 0.5,
                  cursor: hasFile ? "pointer" : "not-allowed",
                }}>
          <Play size={16} strokeWidth={STROKE} />
          Run Splitting
        </button>
      </div>

      {/* Card body */}
      {outerTab === "configuration" ? (
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="flex flex-col gap-6 pt-6 px-6 pb-0">
            {/* Basic / Advanced tabs */}
            <div className="flex items-center border-b" style={{ borderColor: "#e5e5e5" }}>
              <button onClick={() => setInnerTab("basic")}
                      className={`flex items-center gap-2 p-2 text-[14px] font-medium transition-colors ${
                        innerTab === "basic" ? "text-[#0a0a0a] border-b-[3px] border-[#171717] -mb-px" : "text-[#737373]"
                      }`}>
                <Settings2 size={16} strokeWidth={STROKE} />
                Basic
              </button>
              <button onClick={() => setInnerTab("advanced")}
                      className={`flex items-center gap-2 p-2 text-[14px] font-medium transition-colors ${
                        innerTab === "advanced" ? "text-[#0a0a0a] border-b-[3px] border-[#171717] -mb-px" : "text-[#737373]"
                      }`}>
                <SlidersVertical size={16} strokeWidth={STROKE} />
                Advanced
              </button>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-7">
              {innerTab === "basic" ? (
                <>
                  <Section icon={<ImageIcon size={16} strokeWidth={STROKE} />}
                           title="Image Processing"
                           desc="Control how images, charts, and visual elements are processed.">
                    <SwitchField label="Enhanced Image Quality" desc="Higher fidelity processing for complex visuals." />
                    <SwitchField label="Image Description" desc="Generate detailed image descriptions" />
                    <TextareaField label="Custom Image Prompt" optional
                                   placeholder="Enter custom instructions for image descriptions (e.g., 'Focus on technical details' or 'Describe in simple language')...." />
                    <SwitchField label="Chart Data Extraction" desc="Extract structured data from charts and graphs" />
                    <SwitchField label="Checkbox Detection" desc="Detect checkboxes in the document" />
                  </Section>

                  <Section icon={<Type size={16} strokeWidth={STROKE} />}
                           title="Text Processing"
                           desc="Control how text content and metadata are extracted from the document.">
                    <SwitchField label="Extract Colors" desc="Attach color metadata to OCR words from PDF" />
                    <SwitchField label="Extract Links" desc="Attach hyperlink URLs to OCR words from PDF annotations" />
                  </Section>

                  <Section icon={<TableProperties size={16} strokeWidth={STROKE} />}
                           title="Table Processing"
                           desc="Control how tables are detected, extracted, and structured across pages">
                    <SwitchField label="Merge Cross-Page Tables" desc="Consolidate tables spanning multiple pages" />
                    <DropdownField label="Segment Validation" value="Select segment validation" />
                    <SwitchField label="Enhanced Table OCR" desc="Advanced OCR for better table extraction" />
                  </Section>

                  <Section icon={<BookOpenText size={16} strokeWidth={STROKE} />}
                           title="Page Selection"
                           desc="Choose which pages to process. Leave blank to process all pages.">
                    <InputField label="Page Range" optional
                                placeholder="e.g, 1-5 or 1,3,5-8 (leave empty for all pages)" />
                  </Section>

                  <Section icon={<Ellipsis size={16} strokeWidth={STROKE} />}
                           title="Others"
                           desc="Configure OCR, content filtering, and layout detection for this parse run.">
                    <DropdownField label="Content Filter" value="All Content Types"
                                   options={["All Content Types", "Tables Only", "Pictures Only", "Tables & Pictures", "Tables & Formulas", "Pictures & Formulas"]}
                                   desc="Choose which types of content to include in the parsed output" />
                    <DropdownField label="OCR Strategy" value="Process All Content"
                                   options={["Automatic Detection", "Process All Content"]}
                                   desc="Choose whether OCR runs automatically on detected images or processes all content" />
                    <DropdownField label="Layout Analysis" value="Smart Layout Detection"
                                   options={["Smart Layout Detection", "Page-by-Page Processing", "Advanced Layout Detection"]}
                                   desc="How the system analyzes and segments document structure" />
                    <DropdownField label="OCR Engine" value="UnsiloedHawk"
                                   options={["UnsiloedStorm", "UnsiloedHawk", "UnsiloedBeta"]}
                                   desc="Select the optimal character recognition engine for fast extraction" />
                  </Section>
                </>
              ) : (
                <>
                  {/* Citations Extraction + Output Fields — plain card, no heading */}
                  <div className="flex flex-col gap-4 p-3 border bg-white w-full"
                       style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                    <LabeledSwitch label="Citations Extraction" title="Highlight source in PDF" />
                    <LabeledSwitch label="Output Fields" title="Customize included fields" />
                  </div>

                  <Section icon={<Cpu size={16} strokeWidth={STROKE} />}
                           title="VLM Model Selection"
                           desc="Choose the VLM model for each content type in this parse run.">
                    <DropdownField label="Table Processing" value="Astra"
                                   options={["Astra", "Astra V2", "Astra V3"]} />
                    <DropdownField label="Picture Processing" value="Nova"
                                   options={["Nova", "Luna", "Sol"]} />
                    <DropdownField label="Formula Processing" value="Nova"
                                   options={["Nova", "Luna", "Sol"]} />
                  </Section>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-end gap-2 px-6 py-4 bg-white border-t mt-6"
               style={{ borderColor: "#e5e5e5" }}>
            <button className="px-2.5 py-1.5 text-[14px] font-medium text-[#0a0a0a] bg-white border hover:bg-neutral-50 transition-colors"
                    style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
              Cancel
            </button>
            <button className="flex items-center gap-2 px-2.5 py-1.5 text-[14px] font-medium text-[#171717] bg-[#f5f5f5] hover:bg-[#ebebeb] transition-colors">
              Save Changes
              <span className="flex items-center justify-center h-5 min-w-5 px-1 bg-[#f5f5f5] text-[12px] font-medium text-[#737373] leading-4">⌘⏎</span>
            </button>
          </div>
        </div>
      ) : hasRun ? (
        <SplitterResult />
      ) : (
        <div className="flex-1 flex items-center justify-center text-[14px] text-[#737373]">
          Upload a file and run splitting to see the result.
        </div>
      )}
    </div>
  );
}

/* ─── Splitter result view ─────────────────────────────────────── */
const SEGMENTS = [
  { title: "Q3 Performance Overview", pages: 3, confidence: 0.95, previews: [0, 1, 2] },
  { title: "Market Outlook & Risks",  pages: 3, confidence: 0.92, previews: [3, 4, 5] },
];

function SplitterResult() {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <div className="flex flex-col gap-6 py-0">
        {/* Header bar */}
        <div className="flex items-start justify-center gap-3 px-4 py-2 border-b" style={{ borderColor: "#e5e5e5" }}>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-[16px] font-medium text-[#0a0a0a] leading-6">Splitter Result</p>
            <p className="text-[14px] text-[#737373] leading-5">2 segments across 24 pages</p>
          </div>
          <button className="flex items-center justify-center gap-2 p-2 border bg-white text-[14px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors"
                  style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
            <Share size={16} strokeWidth={STROKE} />
            Share
          </button>
          <button className="flex items-center justify-center gap-2 p-2 border bg-white text-[14px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors"
                  style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
            <Download size={16} strokeWidth={STROKE} />
            Download all
          </button>
        </div>

        {/* Segments */}
        <div className="flex flex-col gap-6 px-4 pb-6">
          {SEGMENTS.map(({ title, pages, confidence, previews }) => (
            <div key={title} className="flex flex-col gap-4 border pt-4 px-4 pb-0" style={{ borderColor: "#e4e4e7" }}>
              {/* Title row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[14px] font-medium text-[#0a0a0a] leading-5">{title}</span>
                  <span className="text-[14px] text-[#737373] leading-5">・</span>
                  <span className="text-[14px] font-medium text-[#737373] leading-5">{pages} pages</span>
                  <span className="text-[14px] text-[#737373] leading-5">・</span>
                  <span className="inline-flex items-center px-2 py-1 bg-[#dcfce7] text-[#15803d] text-[12px] font-medium leading-none">
                    Confidence score: {confidence.toFixed(2)}
                  </span>
                </div>
                <button className="flex items-center justify-center p-2 hover:bg-neutral-100 transition-colors text-[#0a0a0a]">
                  <Download size={16} strokeWidth={STROKE} />
                </button>
              </div>
              {/* Page thumbnails */}
              <div className="flex items-center justify-center gap-4">
                {previews.map(idx => (
                  <div key={idx} className="flex-1 min-w-0 h-[138px] border pt-3 px-3"
                       style={{ background: "#e5e5e5", borderColor: "#e5e5e5" }}>
                    <div className="bg-white h-[125px] w-full overflow-hidden flex items-start justify-center">
                      <img src={`/assets/previews/preview-${idx}.png`} alt={`page ${idx + 1}`}
                           className="w-full h-auto" style={{ display: "block" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function SplitPage() {
  const [hasFile, setHasFile] = useState(false);
  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa]">
      <TopBar />
      <div className="flex-1 min-h-0 px-0 pt-3 pb-2">
        <div className="flex items-stretch h-full bg-white border" style={{ borderColor: "#e4e4e7" }}>
          {/* Left: upload */}
          <div className="flex flex-col flex-1 min-w-0 border-r overflow-hidden" style={{ borderColor: "#e5e5e5" }}>
            <UploadPanel hasFile={hasFile} onUpload={() => setHasFile(true)} />
          </div>
          {/* Right: config sidebar */}
          <ConfigSidebar hasFile={hasFile} />
        </div>
      </div>
    </div>
  );
}
