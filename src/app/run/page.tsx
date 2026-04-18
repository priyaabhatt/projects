"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ─── Inline SVG icons (Lucide-style, 24-viewBox, 16px display, stroke 1.5) */
const Ic = {
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  MoveLeft: () => (
    /* Lucide MoveLeft — horizontal arrow with full-width line */
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8L2 12L6 16"/><path d="M2 12H22"/>
    </svg>
  ),
  Play: () => (
    /* Stroked play — no fill */
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  ),
  ZoomIn: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/>
    </svg>
  ),
  ZoomOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/>
    </svg>
  ),
  Redo: () => (
    /* Lucide Redo — used as zoom-reset in PDF toolbar */
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
    </svg>
  ),
  Upload: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Code: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  Settings: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  SearchCheck: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Tag: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>
    </svg>
  ),
  Braces: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>
    </svg>
  ),
  TextIcon: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
  TableProp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3v18"/><rect width="18" height="18" x="3" y="3"/><path d="M3 9h18"/><path d="M3 15h12"/>
    </svg>
  ),
  PenLine: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  Grip: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
      <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
      <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="13" height="13" x="9" y="9" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  TimerClock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

/* ─── Tooltip wrapper ────────────────────────────────────────────── */
function Tooltip({ label, children, placement = "top" }: { label: string; children: React.ReactNode; placement?: "top" | "bottom" | "right" }) {
  const posClass =
    placement === "top"    ? "bottom-full mb-2 left-1/2 -translate-x-1/2" :
    placement === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" :
                             "left-full ml-2 top-1/2 -translate-y-1/2";
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <span className={`pointer-events-none absolute z-50 px-2 py-1 bg-[#171717] text-[#fafafa] text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${posClass}`}>
        {label}
      </span>
    </div>
  );
}

/* ─── Figma asset icon (16×16 container) ─────────────────────────── */
const FigmaIcon = ({ src, size = 16 }: { src: string; size?: number }) => (
  <div style={{ width: size, height: size, flexShrink: 0 }}>
    <img src={src} width={size} height={size} alt="" style={{ display: "block", width: "100%", height: "100%" }} />
  </div>
);

/* ─── Animated circular progress ─────────────────────────────────── */
function CircularProgress({ percent }: { percent: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: "absolute", inset: 0 }}>
        <circle cx="28" cy="28" r={r} stroke="#e5e5e5" strokeWidth="4" fill="none"/>
        <circle cx="28" cy="28" r={r} stroke="#2563eb" strokeWidth="4" fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ * percent / 100} ${circ}`}
          transform="rotate(-90 28 28)"
          style={{ transition: "stroke-dasharray 0.3s ease" }}
        />
      </svg>
      <span className="text-[11px] font-medium text-[#171717] z-10 leading-none">{Math.round(percent)}%</span>
    </div>
  );
}

/* ─── Toast / fun fact messages ──────────────────────────────────── */
const toastMessages = [
  "The smallest valid PDF file is only 67 bytes, but most are thousands of times larger.",
  "PDF stands for Portable Document Format, created by Adobe in 1993.",
  "The PDF/A standard ensures documents look the same 100 years from now.",
  "Over 2.5 trillion PDF pages are produced each year worldwide.",
  "A single PDF can embed 3D models, videos, and interactive forms.",
  "PDF became an ISO open standard (ISO 32000) in 2008.",
];

/* ─── Loading status messages that cycle ─────────────────────────── */
const statusMessages = [
  "Initializing standard extraction",
  "Detecting document structure",
  "Parsing page layouts",
  "Identifying field boundaries",
  "Extracting schema fields",
  "Validating extracted data",
  "Finalizing results",
];

type SchemaRow = { id: number; name: string; type: string; desc: string; editing: boolean };

/* ─── Preview result text (used for copy / download) ─────────────── */
const PREVIEW_CONTENT = `## Image Description

This is a wide-angle, over-the-shoulder photograph depicting a home delivery. The central focus is a green paper bag from Uber Eats placed on a concrete step in front of a dark door.

## The Delivery Bag

A bright green paper bag with brown paper handles sits on the doorstep.

- Branding: The bag is prominently branded with the Uber Eats logo in a dark, sans-serif font. The word "Uber" is stacked on top of the word "Eats".
- Contents: The bag is open, and several items are visible inside:
- A bouquet of fresh flowers, including red and yellow tulips.
- A pink rectangular box.
- A clear glass or bottle.

## The Setting

The delivery is set in an outdoor entryway, surrounded by nature.

- Doorstep: The bag rests on a textured, light-colored concrete step.
- Door and Walls: Behind the bag is a dark, solid-colored door or wall. To the left and right are concrete walls.
- Foliage: The scene is framed with lush greenery. To the left, vines and small-leafed plants grow up the concrete wall.
- Structure: On the far right, a wooden structure with vertical slats, possibly a fence or part of the house's exterior, is visible.

## The Person

In the bottom-right foreground, the back of a person's head and shoulder are partially visible. They have blonde or light-brown hair and are wearing a red or pink shirt. Their posture suggests they are looking down towards the delivery bag.
`;

/* ─── PDF page rendered as styled HTML ───────────────────────────── */
function Hl({ on, children }: { on: boolean; children: React.ReactNode }) {
  return on
    ? <mark style={{ background: "rgba(253,224,71,0.45)", borderRadius: 2, padding: "0 1px" }}>{children}</mark>
    : <>{children}</>;
}

function PdfPageContent({ page, highlight }: { page: number; highlight: boolean }) {
  const bodyStyle: React.CSSProperties = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "10.5pt",
    lineHeight: 1.68,
    color: "#111",
  };
  const h1Style: React.CSSProperties = { fontWeight: "bold", fontSize: "11pt", letterSpacing: "0.06em", textAlign: "center", marginBottom: 22 };
  const secHead: React.CSSProperties = { display: "flex", gap: 14, fontWeight: "bold", marginBottom: 6 };
  const numCol: React.CSSProperties = { minWidth: 22, flexShrink: 0 };
  const body: React.CSSProperties = { paddingLeft: 36, marginBottom: 8, textAlign: "justify" } as React.CSSProperties;
  const ul: React.CSSProperties = { paddingLeft: 52, margin: "0 0 12px", display: "flex", flexDirection: "column", gap: 4 };
  const footer: React.CSSProperties = { borderTop: "1px solid #ccc", marginTop: 32, paddingTop: 8, textAlign: "center", fontSize: "8pt", color: "#aaa", letterSpacing: "0.06em" };

  if (page !== 12) {
    // Generic page for all other page numbers
    return (
      <div style={bodyStyle}>
        <p style={h1Style}>SYSTEM DESIGN DOCUMENT</p>
        {page === 1 ? (
          <>
            <p style={{ textAlign: "center", fontWeight: "bold", marginBottom: 18 }}>TABLE OF CONTENTS</p>
            {[
              "1  Introduction ......................................................................................  3",
              "   1.1  Purpose ....................................................................................  3",
              "   1.2  Scope ......................................................................................  4",
              "   1.3  Definitions, Acronyms, and Abbreviations .........................................  4",
              "2  System Overview ............................................................................  6",
              "   2.1  System Context .........................................................................  6",
              "   2.2  Major System Components ..........................................................  8",
              "3  File and Database Design ...............................................................  12",
              "   3.1  Database Management System Files ...........................................  12",
              "   3.2  Non-Database Management System Files ....................................  13",
              "4  Human-Machine Interface ................................................................  15",
              "5  Requirements Traceability Matrix ....................................................  18",
            ].map((line, i) => (
              <p key={i} style={{ marginBottom: 2, fontFamily: "monospace", fontSize: "9.5pt", whiteSpace: "pre" }}>{line}</p>
            ))}
          </>
        ) : (
          <>
            <div style={{ ...secHead, marginBottom: 10 }}>
              <span style={numCol}>{page < 6 ? "1" : page < 10 ? "2" : "5"}</span>
              <span>{page < 6 ? "INTRODUCTION" : page < 10 ? "SYSTEM OVERVIEW" : "REQUIREMENTS TRACEABILITY"}</span>
            </div>
            <p style={body}>
              This section provides detailed information as required for understanding the system architecture
              and design decisions for the project under development. Additional documentation may be provided
              as appendices where applicable.
            </p>
            <p style={{ borderTop: "1px solid #ccc", marginTop: 32, paddingTop: 8, textAlign: "center", fontSize: "8pt", color: "#aaa", letterSpacing: "0.06em" }}>
              SYSTEM DESIGN DOCUMENT · Page {page}
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={bodyStyle}>
      <p style={h1Style}>SYSTEM DESIGN DOCUMENT</p>

      {/* § 3 */}
      <div style={{ marginBottom: 14 }}>
        <div style={secHead}><span style={numCol}>3</span><span>FILE AND DATABASE DESIGN</span></div>
        <p style={body}>
          Interact with the Database Administrator (DBA) when preparing this section. The section
          should reveal the final design of all database management system (DBMS) files and the
          non-DBMS files associated with the system under development. Additional information may
          add as required for the particular project. Provide a comprehensive data dictionary showing
          data element name, type, length, source, validation rules, maintenance (create, read, update,
          delete (CRUD) capability), data stores, aliases, and description. Can be included as an appendix.
        </p>
      </div>

      {/* § 3.1 */}
      <div style={{ marginBottom: 14 }}>
        <div style={secHead}><span style={numCol}>3.1</span><span>Database Management System Files</span></div>
        <p style={body}>
          This section reveals the final design of the DBMS files and includes the following
          information, as appropriate (refer to the data dictionary):
        </p>
        <ul style={ul}>
          <li style={{ textAlign: "justify" }}>
            <Hl on={highlight}>Refined logical model: provide normalized table layouts, entity relationship
            diagrams, and other logical design information</Hl>
          </li>
          <li style={{ textAlign: "justify" }}>
            A physical description of the DBMS schemas, sub-schemas, records, sets, tables, storage page sizes, etc.
          </li>
          <li style={{ textAlign: "justify" }}>
            Access methods (such as indexed, via set, sequential, random access, sorted pointer array, etc.)
          </li>
          <li style={{ textAlign: "justify" }}>
            <Hl on={highlight}>Estimate of the DBMS file size or volume of data within the file, and data pages,
            including overhead resulting from access methods and free space</Hl>
          </li>
          <li style={{ textAlign: "justify" }}>
            Definition of the update frequency of the database tables, views, files, areas, records, sets, and data
            pages; estimate the number of transactions if the database is an online transaction-based system
          </li>
        </ul>
      </div>

      {/* § 3.2 */}
      <div style={{ marginBottom: 14 }}>
        <div style={secHead}><span style={numCol}>3.2</span><span>Non-Database Management System Files</span></div>
        <p style={body}>
          In this section, provide the detailed description of all non-DBMS files and include a narrative
          description of the usage of each file—including if the file is used for input, output, or both;
          if this file is a temporary file; an indication of which modules read and write the file, etc.;
          and file structures (refer to the data dictionary). As appropriate, the file structure information should:
        </p>
        <ul style={ul}>
          <li style={{ textAlign: "justify" }}>Identify record structures, record keys or indexes, and reference data elements within the records</li>
          <li style={{ textAlign: "justify" }}>Define record length (fixed or variable length) and blocking factors</li>
          <li style={{ textAlign: "justify" }}>Define file access method—for example, indexed sequential, virtual sequential, random access, etc.</li>
          <li style={{ textAlign: "justify" }}>
            <Hl on={highlight}>Estimate the file size or volume of data within the file, including overhead resulting
            from access methods and free space</Hl>
          </li>
          <li style={{ textAlign: "justify" }}>
            Define the update frequency of the file; if the file is part of an online transaction-based system,
            provide the estimated number of transactions per unit time, and the statistical mean, mode, and
            distribution of those transactions
          </li>
        </ul>
      </div>

      {/* § 4 */}
      <div style={{ marginBottom: 14 }}>
        <div style={secHead}><span style={numCol}>4</span><span>HUMAN-MACHINE INTERFACE</span></div>
        <p style={body}>This section provides the detailed design of the system and subsystem inputs and outputs</p>
      </div>

      <p style={footer}>SYSTEM DESIGN DOCUMENT</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function RunPage() {
  /* ── top-level state ── */
  const [activeTab, setActiveTab]     = useState<"config" | "result">("config");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [urlInput, setUrlInput]       = useState("");
  const [modelSelected, setModelSelected] = useState("Alpha (fast, accurate)");
  const [citationsOn, setCitationsOn] = useState(false);
  const [runState, setRunState]       = useState<"idle" | "loading" | "done">("idle");

  /* ── Result panel sub-state ── */
  const [resultTab, setResultTab]     = useState<"preview" | "markdown" | "json">("preview");
  const [dlToastState, setDlToastState] = useState<"hidden" | "in" | "out">("hidden");
  const dlToastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── PDF viewer state ── */
  const totalPages = 24;
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel]     = useState(100); // percent
  const ZOOM_STEP = 25;
  const ZOOM_MIN  = 25;
  const ZOOM_MAX  = 300;
  const DEFAULT_ZOOM = 100;

  /* ── Loading animation state ── */
  const [progress, setProgress]         = useState(0);
  const [dotCount, setDotCount]         = useState(1);
  const [toastIdx, setToastIdx]         = useState(0);
  const [statusIdx, setStatusIdx]       = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Resizable panel state ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPct, setLeftPct]       = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [handleHovered, setHandleHovered] = useState(false);

  /* ── Schema rows state ── */
  const [schemaRows, setSchemaRows] = useState<SchemaRow[]>([]);
  const nextIdRef = useRef(3);

  /* ─── Derived ─────────────────────────────────────── */
  const hasFile = fileUploaded || urlInput.trim().length > 4;
  const canRun  = hasFile && modelSelected !== "";

  /* ─── Page navigation ───────────────────────────────────────────── */
  function prevPage() { if (currentPage > 1) setCurrentPage(p => p - 1); }
  function nextPage() { if (currentPage < totalPages) setCurrentPage(p => p + 1); }

  /* ─── Zoom ──────────────────────────────────────────────────────── */
  function zoomIn()    { setZoomLevel(z => Math.min(ZOOM_MAX, z + ZOOM_STEP)); }
  function zoomOut()   { setZoomLevel(z => Math.max(ZOOM_MIN, z - ZOOM_STEP)); }
  function zoomReset() { setZoomLevel(DEFAULT_ZOOM); }

  /* ─── Loading animation ─────────────────────────────────────────── */
  function startLoading() {
    if (!canRun) return;
    setRunState("loading");
    setProgress(0);
    setDotCount(1);
    setToastIdx(0);
    setStatusIdx(0);

    let p = 0;
    progressRef.current = setInterval(() => {
      // slow ramp: fast start, slow middle, fast end
      const increment = p < 20 ? 1.5 : p < 70 ? 0.6 : 1.2;
      p = Math.min(100, p + increment);
      setProgress(p);
      if (p >= 100) {
        clearInterval(progressRef.current!);
        setTimeout(() => { setRunState("done"); setActiveTab("result"); }, 400);
      }
    }, 100);

    dotRef.current   = setInterval(() => setDotCount(d => d >= 3 ? 1 : d + 1), 500);
    toastRef.current = setInterval(() => setToastIdx(i => (i + 1) % toastMessages.length), 3000);
    statusRef.current = setInterval(() => setStatusIdx(i => (i + 1) % statusMessages.length), 1800);
  }

  useEffect(() => {
    if (runState !== "loading") {
      [progressRef, dotRef, toastRef, statusRef].forEach(r => { if (r.current) clearInterval(r.current); });
    }
    return () => { [progressRef, dotRef, toastRef, statusRef].forEach(r => { if (r.current) clearInterval(r.current); }); };
  }, [runState]);

  /* ─── Resizable drag ────────────────────────────────────────────── */
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct  = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftPct(Math.max(20, Math.min(78, pct)));
  }, [isDragging]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  /* ─── Schema table helpers ──────────────────────────────────────── */
  function addSchemaRow() {
    const id = nextIdRef.current++;
    setSchemaRows(rows => [...rows, { id, name: "", type: "String", desc: "", editing: true }]);
  }
  function updateRow(id: number, field: keyof SchemaRow, value: string | boolean) {
    setSchemaRows(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  }
  function commitRow(id: number) {
    setSchemaRows(rows => rows.map(r => r.id === id ? { ...r, editing: false } : r));
  }
  function deleteRow(id: number) {
    setSchemaRows(rows => rows.filter(r => r.id !== id));
  }

  const typeOptions = ["String", "Number", "Boolean", "Array", "Object"];
  const models = [
    "Alpha (fast, accurate)",
    "Beta (balanced, versatile)",
    "Gamma (thorough, structured)",
    "Delta (advanced reasoning, vision)",
  ];
  const templateOptions = [
    "Policy document",
    "endorsment",
    "sds",
    "990form",
    "form420 Schema",
    "272284939_202112_990EZ_2023030921062",
    "272284939_202112_990EZ_202303092106257...",
    "sebilargepdf",
  ];

  /* ── Dropdown open state ── */
  const [modelOpen, setModelOpen]       = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [templateSelected, setTemplateSelected] = useState("");

  /* ─── Copy / Download handlers ─────────────────────────────────── */
  function handleCopy() {
    navigator.clipboard.writeText(PREVIEW_CONTENT).catch(() => {});
  }

  function handleDownload() {
    if (dlToastRef.current) clearTimeout(dlToastRef.current);
    setDlToastState("in");
    dlToastRef.current = setTimeout(() => {
      setDlToastState("out");
      setTimeout(() => setDlToastState("hidden"), 380);
    }, 4200);
    const blob = new Blob([PREVIEW_CONTENT], { type: "text/markdown" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: "morgan-stanley-result.md" });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#fafafa]">

      {/* ══════ DOWNLOAD TOAST ═══════════════════════════════════════ */}
      {dlToastState !== "hidden" && (
        <div
          className="fixed top-4 right-5 z-50 flex items-center gap-2 bg-white border border-[#e5e5e5] px-4 py-2 text-[13px] font-medium text-[#0a0a0a]"
          style={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            animation: dlToastState === "in"
              ? "toastSlideDown 0.2s ease-out forwards"
              : "toastFadeOut 0.38s ease-out forwards",
          }}
        >
          <Ic.TimerClock />
          Result downloaded
        </div>
      )}

      {/* ══════ TOP BAR ══════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 px-4 border-b shrink-0"
           style={{ height: 49, borderColor: "#e4e4e7", background: "#fafafa" }}>
        {/* Back */}
        <Link href="/"
              className="flex items-center gap-1.5 px-1.5 py-1.5 border bg-white text-[13px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors shrink-0"
              style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
          <Ic.MoveLeft />
          <span>Back</span>
        </Link>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="text-[14px] text-[#737373]">Playground</span>
          <span className="text-[#737373]"><Ic.ChevronRight /></span>
          <span className="text-[14px] text-[#0a0a0a]">Morgan-stanley-research.pdf</span>
          <span className="text-[#737373]"><Ic.ChevronRight /></span>
          <span className="inline-flex items-center px-2 py-0.5 text-[12px] font-medium text-[#fafafa] bg-[#171717]">Demo</span>
        </div>
        {/* Bell + Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center justify-center w-7 h-7 border bg-white text-[#737373] hover:text-[#171717] transition-colors"
                  style={{ borderColor: "#e5e5e5" }}>
            <Ic.Bell />
          </button>
          <div className="w-7 h-7 border-2 border-zinc-200 overflow-hidden shrink-0">
            <img src="/assets/avatar.png" width={28} height={28} alt="User avatar"
                 style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>

      {/* ══════ MAIN SPLIT AREA ══════════════════════════════════════ */}
      <div ref={containerRef}
           className="flex flex-1 min-h-0 pt-3 pr-2 pb-2"
           style={{ userSelect: isDragging ? "none" : "auto" }}>
        <div className="flex flex-1 min-h-0 bg-white border" style={{ borderColor: "#e5e5e5" }}>

          {/* ─── LEFT PANEL ────────────────────────────────────────── */}
          <div className="flex flex-col h-full border-r overflow-hidden"
               style={{ width: `${leftPct}%`, borderColor: "#e5e5e5", flexShrink: 0 }}>

            {hasFile ? (
              <>
                {/* PDF toolbar */}
                <div className="flex items-center justify-between shrink-0 px-4 py-3 border-b"
                     style={{ background: "#f5f5f5", borderColor: "#e5e5e5" }}>
                  {/* Page nav */}
                  <div className="flex items-center">
                    <Tooltip label="Previous page" placement="bottom">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-8 h-8 transition-colors"
                        style={{ color: currentPage === 1 ? "#d4d4d4" : "#737373", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>
                        <Ic.ChevronLeft />
                      </button>
                    </Tooltip>
                    <div className="flex items-center justify-center border bg-white text-[13px] font-medium text-[#0a0a0a] shrink-0"
                         style={{ width: 42, height: 32, borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      {currentPage}
                    </div>
                    <span className="px-2 text-[13px] font-medium text-[#737373]">of {totalPages}</span>
                    <Tooltip label="Next page" placement="bottom">
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-8 h-8 transition-colors"
                        style={{ color: currentPage === totalPages ? "#d4d4d4" : "#737373", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}>
                        <Ic.ChevronRight />
                      </button>
                    </Tooltip>
                  </div>
                  {/* Zoom controls */}
                  <div className="flex items-center">
                    <Tooltip label="Zoom in" placement="bottom">
                      <button onClick={zoomIn} disabled={zoomLevel >= ZOOM_MAX}
                              className="flex items-center justify-center w-8 h-8 transition-colors"
                              style={{ color: zoomLevel >= ZOOM_MAX ? "#d4d4d4" : "#737373", cursor: zoomLevel >= ZOOM_MAX ? "not-allowed" : "pointer" }}>
                        <Ic.ZoomIn />
                      </button>
                    </Tooltip>
                    <div className="flex items-center justify-center border bg-white text-[13px] font-medium text-[#737373] shrink-0"
                         style={{ height: 32, paddingLeft: 10, paddingRight: 10, borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      {zoomLevel}%
                    </div>
                    <Tooltip label="Zoom out" placement="bottom">
                      <button onClick={zoomOut} disabled={zoomLevel <= ZOOM_MIN}
                              className="flex items-center justify-center w-8 h-8 transition-colors"
                              style={{ color: zoomLevel <= ZOOM_MIN ? "#d4d4d4" : "#737373", cursor: zoomLevel <= ZOOM_MIN ? "not-allowed" : "pointer" }}>
                        <Ic.ZoomOut />
                      </button>
                    </Tooltip>
                    <Tooltip label="Reset zoom" placement="bottom">
                      <button onClick={zoomReset}
                              className="flex items-center justify-center w-8 h-8 text-[#737373] hover:text-[#171717] transition-colors">
                        <Ic.Redo />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* PDF content */}
                <div className="flex-1 min-h-0 overflow-auto flex flex-col items-center py-4 gap-3"
                     style={{ background: "#f5f5f5" }}>
                  <div style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "top center",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    paddingLeft: 16,
                    paddingRight: 16,
                  }}>
                    {/* Designed PDF pages — fill canvas width, show up to 6 pages */}
                    {Array.from({ length: Math.min(6, totalPages - currentPage + 1) }, (_, i) => currentPage + i).map(pg => (
                      <div key={pg} className="w-full bg-white shadow-sm" style={{ padding: "52px 60px", minHeight: 680 }}>
                        <PdfPageContent page={pg} highlight={citationsOn && runState === "done"} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Upload area */
              <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#f5f5f5" }}>
                <div className="w-full h-full border border-dashed border-[#d1d1d1] bg-white flex items-center justify-center">
                  <div className="flex flex-col gap-6 items-center w-[340px]">
                    <div className="flex flex-col gap-4 items-center text-center w-full">
                      <div className="flex items-center justify-center w-10 h-10 bg-white">
                        <Ic.Upload />
                      </div>
                      <div className="flex flex-col gap-2 items-center w-full">
                        <p className="text-[18px] font-medium text-[#0a0a0a] leading-7">Upload your document</p>
                        <div className="text-[14px] text-[#737373] leading-5 text-center">
                          <p>Drop a file here or click to browse.</p>
                          <p>Supports PDF, Word, Excel, PowerPoint, and images.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-center w-full">
                      <button
                        className="flex items-center gap-2 h-9 px-4 bg-[#171717] text-[#fafafa] text-[14px] font-medium w-full justify-center hover:bg-[#333] transition-colors"
                        onClick={() => { setFileUploaded(true); setCurrentPage(1); }}>
                        <Ic.Plus /> Upload a file
                      </button>
                      <div className="flex items-center h-5 w-full relative">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-[#e5e5e5]" />
                        <div className="relative mx-auto bg-white px-2 text-[14px] text-[#737373]">or paste a file URL</div>
                      </div>
                      <div className="flex items-center w-full" style={{ boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                        <div className="flex items-center justify-center h-9 px-3 border bg-[#f5f5f5] text-[14px] font-medium text-[#171717] shrink-0"
                             style={{ borderColor: "#e5e5e5", borderRight: "none" }}>
                          https://
                        </div>
                        <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                               placeholder="acmeinc.com"
                               className="flex-1 h-9 min-w-0 border bg-white px-3 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa]"
                               style={{ borderColor: "#e5e5e5" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── RESIZABLE HANDLE ──────────────────────────────────── */}
          <div
            className="flex items-center justify-center shrink-0 relative transition-colors"
            style={{
              width: 8,
              cursor: "col-resize",
              background: isDragging || handleHovered ? "#e5e5e5" : "transparent",
              borderLeft:  "1px solid #e5e5e5",
              borderRight: "1px solid #e5e5e5",
              transition: "background 0.15s",
            }}
            onMouseDown={e => { e.preventDefault(); setIsDragging(true); }}
            onMouseEnter={() => setHandleHovered(true)}
            onMouseLeave={() => setHandleHovered(false)}>
            <div className="absolute flex items-center justify-center"
                 style={{
                   width: 12, height: 16,
                   border: "1px solid #e5e5e5",
                   background: isDragging ? "#d4d4d4" : "#e5e5e5",
                   top: "50%", left: "50%",
                   transform: "translate(-50%, -50%)",
                 }}>
              <Ic.Grip />
            </div>
          </div>

          {/* ─── RIGHT PANEL ───────────────────────────────────────── */}
          <div className="flex flex-col flex-1 min-w-0 h-full">

            {/* Tabs + action buttons */}
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white"
                 style={{ borderColor: "#e5e5e5" }}>
              {/* Tab bar */}
              <div className="flex items-center h-9 px-0.5 py-0.5 bg-[#f5f5f5]" style={{ width: 219 }}>
                <button
                  className="flex items-center gap-1.5 px-2 py-1 text-[13px] font-medium text-[#171717] transition-colors"
                  style={{
                    background: activeTab === "config" ? "white" : "transparent",
                    border: activeTab === "config" ? "1px solid #e5e5e5" : "1px solid transparent",
                    height: 30,
                  }}
                  onClick={() => setActiveTab("config")}>
                  <Ic.Settings /> Configuration
                </button>
                <Tooltip label={runState !== "done" ? "Fill in all fields and run Parse to see results here." : "Results"} placement="bottom">
                  <button
                    className="flex items-center gap-1.5 px-2 py-1 text-[13px] font-medium text-[#171717] transition-all"
                    style={{
                      background: activeTab === "result" ? "white" : "transparent",
                      border: activeTab === "result" ? "1px solid #e5e5e5" : "1px solid transparent",
                      opacity: runState === "done" ? 1 : 0.45,
                      cursor: runState === "done" ? "pointer" : "default",
                      height: 30,
                    }}
                    onClick={() => runState === "done" && setActiveTab("result")}>
                    <Ic.SearchCheck /> Result
                  </button>
                </Tooltip>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 px-2 py-1.5 border bg-white text-[12px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors"
                        style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                  <Ic.Code /> API Examples
                </button>
                <Tooltip label={!canRun ? "Upload a file and select a model first." : "Run Parse"} placement="bottom">
                  <button
                    onClick={startLoading}
                    disabled={!canRun || runState === "loading"}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] font-medium transition-all"
                    style={canRun && runState !== "loading" ? {
                      background: "#2563eb", color: "white", border: "1px solid #2563eb", cursor: "pointer",
                    } : {
                      background: "#2563eb", color: "white",
                      border: "1px solid #2563eb", opacity: 0.5, cursor: "not-allowed",
                    }}>
                    <Ic.Play /> Run Parse
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* ── Result sub-header: Preview/Markdown/JSON + controls ── */}
            {activeTab === "result" && runState === "done" && (
              <div className="flex items-center justify-between px-4 border-b shrink-0 bg-white"
                   style={{ borderColor: "#e5e5e5", height: 42 }}>
                {/* Sub-tabs */}
                <div className="flex items-center gap-5 h-full">
                  {(["preview", "markdown", "json"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setResultTab(tab)}
                      className="h-full text-[13px] font-medium capitalize transition-colors border-b-2"
                      style={{
                        borderColor: resultTab === tab ? "#171717" : "transparent",
                        color: resultTab === tab ? "#171717" : "#737373",
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1">
                  {/* Source highlighting toggle */}
                  <div className="flex items-center gap-2 mr-1">
                    <span className="text-[12px] text-[#737373] whitespace-nowrap">Source highlighting</span>
                    <button
                      onClick={() => setCitationsOn(v => !v)}
                      className="flex items-center px-0.5 shrink-0 transition-colors"
                      style={{ width: 36, height: 20, background: citationsOn ? "#171717" : "#e5e5e5", transition: "background 0.2s" }}
                    >
                      <div className="bg-white shrink-0" style={{
                        width: 16, height: 16,
                        transform: citationsOn ? "translateX(16px)" : "translateX(0)",
                        transition: "transform 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }} />
                    </button>
                  </div>

                  {/* Copy */}
                  <Tooltip label="Copy" placement="bottom">
                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center w-8 h-8 text-[#737373] hover:text-[#171717] hover:bg-neutral-100 transition-colors"
                    >
                      <Ic.Copy />
                    </button>
                  </Tooltip>

                  {/* Download */}
                  <Tooltip label="Download" placement="bottom">
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center w-8 h-8 text-[#737373] hover:text-[#171717] hover:bg-neutral-100 transition-colors"
                    >
                      <Ic.Download />
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}

            {/* Panel body */}
            <div className="flex-1 min-h-0 overflow-auto flex flex-col justify-between">

              {/* ── Loading state ── */}
              {runState === "loading" && (
                <div className="flex flex-col items-center justify-center flex-1 gap-6 p-6">
                  <div className="flex flex-col items-center gap-1">
                    <CircularProgress percent={progress} />
                    <div className="h-9 flex items-center justify-center">
                      <span className="text-[13px] font-medium text-[#737373]">
                        {statusMessages[statusIdx]}{".".repeat(dotCount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 border bg-white transition-all"
                       style={{ width: Math.min(356, 340), borderColor: "#e5e5e5", boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.1)" }}>
                    <div className="flex items-start pt-0.5 shrink-0">
                      <img src="/assets/ic-info-circle.svg" width={18} height={18} alt="" />
                    </div>
                    <p className="text-[13px] font-medium text-[#0a0a0a] leading-5 flex-1 min-w-0" key={toastIdx}
                       style={{ animation: "fadeIn 0.4s ease" }}>
                      {toastMessages[toastIdx]}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Config tab ── */}
              {activeTab === "config" && runState !== "loading" && (
                <div className="flex flex-col gap-7 p-4 overflow-auto">

                  {/* Configure fields */}
                  <div className="border p-3 flex flex-col gap-4" style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Ic.TableProp /><p className="text-[15px] font-medium text-[#0a0a0a]">Configure fields</p>
                      </div>
                      <p className="text-[13px] text-[#737373] leading-5">Tell us what to extract and how to process it.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {/* Model */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium text-[#737373]">Model</label>
                        <div className="relative">
                          <button
                            onClick={() => { setModelOpen(v => !v); setTemplateOpen(false); }}
                            className="w-full h-9 border bg-white px-3 text-[13px] text-left flex items-center justify-between gap-2 outline-none cursor-pointer hover:bg-[#fafafa] transition-colors"
                            style={{ borderColor: modelOpen ? "#a3a3a3" : "#e5e5e5", boxShadow: modelOpen ? "0 0 0 3px rgba(163,163,163,0.3)" : "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                            <span className={modelSelected ? "text-[#0a0a0a]" : "text-[#a1a1aa]"}>
                              {modelSelected || "Alpha (fast, accurate)"}
                            </span>
                            <span className="shrink-0 text-[#737373]"><Ic.ChevronDown /></span>
                          </button>
                          {modelOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} />
                              <div className="absolute left-0 right-0 top-full mt-0.5 z-50 bg-white border py-1"
                                   style={{ borderColor: "#e5e5e5", boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" }}>
                                {models.map(m => (
                                  <button key={m} onClick={() => { setModelSelected(m); setModelOpen(false); }}
                                          className="w-full flex items-center gap-2 pl-8 pr-3 py-1.5 text-[13px] text-[#0a0a0a] text-left hover:bg-[#f5f5f5] transition-colors relative">
                                    {modelSelected === m && (
                                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0a0a0a]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      </span>
                                    )}
                                    {m}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {/* Citations */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium text-[#737373]">Citations Extraction</label>
                        <button className="flex items-center gap-3 h-9" onClick={() => setCitationsOn(v => !v)}>
                          <div className="flex items-center px-0.5 shrink-0"
                               style={{ width: 36, height: 20, background: citationsOn ? "#171717" : "#e5e5e5", transition: "background 0.2s" }}>
                            <div className="bg-white shrink-0" style={{
                              width: 16, height: 16,
                              transform: citationsOn ? "translateX(16px)" : "translateX(0)",
                              transition: "transform 0.2s",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                            }} />
                          </div>
                          <span className="text-[13px] font-medium text-[#0a0a0a]">Highlight source in PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Schema */}
                  <div className="border p-3 flex flex-col gap-4" style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                    <div className="flex flex-col gap-1">
                      <p className="text-[15px] font-medium text-[#0a0a0a]">Schema</p>
                      <p className="text-[13px] text-[#737373] leading-5">Define which fields to extract from the document.</p>
                    </div>
                    {/* Schema sub-tabs */}
                    <div className="flex items-center border-b" style={{ borderColor: "#e5e5e5" }}>
                      <button className="flex items-center gap-1.5 px-2 py-2 text-[13px] font-medium text-[#0a0a0a] border-b-2 border-[#171717]">
                        <Ic.PenLine /> Manual
                      </button>
                      <button className="flex items-center gap-1.5 px-2 py-2 text-[13px] font-medium text-[#737373] hover:text-[#0a0a0a] transition-colors">
                        <Ic.Sparkles /> Auto-Suggest
                        <span className="px-1 py-0.5 text-[10px] font-medium text-violet-700 bg-violet-100 leading-4">Beta</span>
                      </button>
                    </div>
                    {/* Name + Template */}
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <label className="text-[13px] font-medium text-[#737373]">Name</label>
                        <input type="text" placeholder="e.g. Invoice processing"
                               className="h-9 border bg-white px-3 text-[13px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa]"
                               style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }} />
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <label className="text-[13px] font-medium text-[#737373]">Template</label>
                        <div className="relative">
                          <button
                            onClick={() => { setTemplateOpen(v => !v); setModelOpen(false); }}
                            className="w-full h-9 border bg-white px-3 text-[13px] text-left flex items-center justify-between gap-2 outline-none cursor-pointer hover:bg-[#fafafa] transition-colors"
                            style={{ borderColor: templateOpen ? "#a3a3a3" : "#e5e5e5", boxShadow: templateOpen ? "0 0 0 3px rgba(163,163,163,0.3)" : "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                            <span className={`truncate ${templateSelected ? "text-[#0a0a0a]" : "text-[#a1a1aa]"}`}>
                              {templateSelected || "Browse pre-built field sets"}
                            </span>
                            <span className="shrink-0 text-[#737373]"><Ic.ChevronDown /></span>
                          </button>
                          {templateOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setTemplateOpen(false)} />
                              <div className="absolute left-0 right-0 top-full mt-0.5 z-50 bg-white border py-1 max-h-60 overflow-y-auto"
                                   style={{ borderColor: "#e5e5e5", boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" }}>
                                {templateOptions.map(t => (
                                  <button key={t} onClick={() => { setTemplateSelected(t); setTemplateOpen(false); }}
                                          className="w-full flex items-center gap-2 pl-8 pr-3 py-1.5 text-[13px] text-[#0a0a0a] text-left hover:bg-[#f5f5f5] transition-colors relative">
                                    {templateSelected === t && (
                                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0a0a0a]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      </span>
                                    )}
                                    <span className="truncate">{t}</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Schema table */}
                    <div className="border flex flex-col" style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      {/* Header */}
                      <div className="flex" style={{ background: "#fafafa" }}>
                        {[["Name", <Ic.Tag key="t" />], ["Type", <Ic.Braces key="b" />], ["Description", <Ic.TextIcon key="d" />]].map(([lbl, icon]) => (
                          <div key={lbl as string} className="flex items-center gap-1.5 px-3 py-1.5 border-b flex-1" style={{ borderColor: "#e5e5e5" }}>
                            <span className="text-[#737373]">{icon}</span>
                            <span className="text-[13px] font-medium text-[#737373]">{lbl as string}</span>
                          </div>
                        ))}
                        <div className="shrink-0 border-b" style={{ width: 52, borderColor: "#e5e5e5" }} />
                      </div>

                      {/* Rows */}
                      {schemaRows.map(row => (
                        <div key={row.id} className="flex items-center border-b" style={{ minHeight: 52, borderColor: "#e5e5e5" }}>
                          {row.editing ? (
                            /* Editable row */
                            <>
                              <div className="flex-1 px-2 py-1.5">
                                <input autoFocus type="text" value={row.name}
                                       onChange={e => updateRow(row.id, "name", e.target.value)}
                                       onKeyDown={e => e.key === "Enter" && commitRow(row.id)}
                                       placeholder="Field name"
                                       className="w-full h-8 border bg-white px-2 text-[13px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa]"
                                       style={{ borderColor: "#2563eb" }} />
                              </div>
                              <div className="flex-1 px-2 py-1.5">
                                <div className="relative">
                                  <select value={row.type} onChange={e => updateRow(row.id, "type", e.target.value)}
                                          className="w-full h-8 border bg-white px-2 text-[13px] text-[#0a0a0a] appearance-none outline-none cursor-pointer"
                                          style={{ borderColor: "#e5e5e5" }}>
                                    {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#737373]"><Ic.ChevronDown /></div>
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1.5">
                                <input type="text" value={row.desc}
                                       onChange={e => updateRow(row.id, "desc", e.target.value)}
                                       onKeyDown={e => e.key === "Enter" && commitRow(row.id)}
                                       placeholder="Description"
                                       className="w-full h-8 border bg-white px-2 text-[13px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa]"
                                       style={{ borderColor: "#e5e5e5" }} />
                              </div>
                            </>
                          ) : (
                            /* Display row */
                            <>
                              <div className="flex-1 flex items-center px-3 py-2 min-w-0">
                                <span className="text-[13px] font-medium text-[#0a0a0a] truncate">{row.name}</span>
                              </div>
                              <div className="flex-1 flex items-center px-3 py-2 min-w-0">
                                <span className="text-[13px] font-medium text-[#0a0a0a] truncate">{row.type}</span>
                              </div>
                              <div className="flex-1 flex items-center px-3 py-2 min-w-0">
                                <span className="text-[13px] text-[#0a0a0a] truncate">{row.desc}</span>
                              </div>
                            </>
                          )}
                          <div className="shrink-0 flex items-center justify-center px-2" style={{ width: 52 }}>
                            <button onClick={() => deleteRow(row.id)}
                                    className="flex items-center justify-center w-8 h-8 hover:bg-red-50 transition-colors text-[#737373] hover:text-red-500">
                              <Ic.Trash />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add schema row */}
                      <div className="flex items-center" style={{ height: 44 }}>
                        <button onClick={addSchemaRow}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors w-full">
                          <Ic.Plus /> Add Schema
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Result tab ── */}
              {activeTab === "result" && runState === "done" && (
                <div className="flex-1 min-h-0 overflow-auto px-5 py-4">
                  {resultTab === "preview" && (
                    <div style={{ fontFamily: "inherit", fontSize: 13, lineHeight: 1.7, color: "#374151" }}>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Image Description</h2>
                      <p style={{ margin: "0 0 16px", color: "#4b5563" }}>
                        This is a wide-angle, over-the-shoulder photograph depicting a home delivery. The central focus is a green
                        paper bag from Uber Eats placed on a concrete step in front of a dark door.
                      </p>

                      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>The Delivery Bag</h2>
                      <p style={{ margin: "0 0 8px", color: "#4b5563" }}>A bright green paper bag with brown paper handles sits on the doorstep.</p>
                      <ul style={{ paddingLeft: 20, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                        {[
                          'Branding: The bag is prominently branded with the Uber Eats logo in a dark, sans-serif font. The word "Uber" is stacked on top of the word "Eats".',
                          "Contents: The bag is open, and several items are visible inside:",
                          "A bouquet of fresh flowers, including red and yellow tulips.",
                          "A pink rectangular box.",
                          "A clear glass or bottle.",
                        ].map((item, i) => (
                          <li key={i} style={{ color: "#4b5563", fontSize: 13 }}>{item}</li>
                        ))}
                      </ul>

                      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>The Setting</h2>
                      <p style={{ margin: "0 0 8px", color: "#4b5563" }}>The delivery is set in an outdoor entryway, surrounded by nature.</p>
                      <ul style={{ paddingLeft: 20, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                        {[
                          "Doorstep: The bag rests on a textured, light-colored concrete step.",
                          "Door and Walls: Behind the bag is a dark, solid-colored door or wall. To the left and right are concrete walls.",
                          "Foliage: The scene is framed with lush greenery. To the left, vines and small-leafed plants grow up the concrete wall. To the right of the door, there are more plants with long, thin, light-green leaves.",
                          "Structure: On the far right, a wooden structure with vertical slats, possibly a fence or part of the house's exterior, is visible.",
                        ].map((item, i) => (
                          <li key={i} style={{ color: "#4b5563", fontSize: 13 }}>{item}</li>
                        ))}
                      </ul>

                      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>The Person</h2>
                      <p style={{ margin: "0 0 16px", color: "#4b5563" }}>
                        In the bottom-right foreground, the back of a person's head and shoulder are partially visible. They have
                        blonde or light-brown hair and are wearing a red or pink shirt. Their posture suggests they are looking
                        down towards the delivery bag.
                      </p>

                      {/* Styled image area — no imported image, designed representation */}
                      <div style={{
                        borderRadius: 4, overflow: "hidden", height: 168,
                        background: "linear-gradient(145deg, #1c2b3a 0%, #0d1a24 55%, #1a2e1a 100%)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        position: "relative",
                      }}>
                        {/* Greenery blobs */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, width: 100, height: 130,
                          background: "radial-gradient(ellipse at 20% 85%, rgba(34,197,94,0.22) 0%, transparent 70%)" }} />
                        <div style={{ position: "absolute", bottom: 0, right: 20, width: 80, height: 110,
                          background: "radial-gradient(ellipse at 75% 90%, rgba(21,128,61,0.28) 0%, transparent 70%)" }} />
                        {/* Bag silhouette */}
                        <div style={{ width: 48, height: 60, background: "rgba(34,197,94,0.68)", borderRadius: "4px 4px 5px 5px", position: "relative", marginBottom: 6 }}>
                          <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
                            width: 28, height: 12, borderTop: "4px solid rgba(110,70,30,0.8)",
                            borderLeft: "4px solid rgba(110,70,30,0.8)", borderRight: "4px solid rgba(110,70,30,0.8)",
                            borderRadius: "8px 8px 0 0" }} />
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.32)", fontSize: 10, letterSpacing: "0.04em" }}>
                          morgan-stanley-research.pdf · page {currentPage}
                        </div>
                      </div>
                    </div>
                  )}

                  {resultTab === "markdown" && (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#a1a1aa]">
                      Markdown view — coming in next update
                    </div>
                  )}

                  {resultTab === "json" && (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#a1a1aa]">
                      JSON view — coming in next update
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              {activeTab === "config" && runState !== "loading" && (
                <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0 bg-white"
                     style={{ borderColor: "#e5e5e5" }}>
                  <div className="flex items-center gap-2">
                    <Link href="/"
                          className="flex items-center gap-2 px-2.5 py-1.5 border bg-white text-[13px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors"
                          style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      Cancel
                    </Link>
                    <button className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f5f5f5] text-[13px] font-medium text-[#171717] hover:bg-neutral-200 transition-colors">
                      Save Changes
                      <span className="flex items-center justify-center h-5 min-w-5 px-1 bg-neutral-200 text-[11px] font-medium text-[#737373]">⌘⏎</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn         { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastSlideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastFadeOut   { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </div>
  );
}
