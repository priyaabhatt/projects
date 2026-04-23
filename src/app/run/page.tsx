"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import type { ReactNode, CSSProperties } from "react";
import Link from "next/link";
import {
  Bell, ChevronRight, MoveLeft, Play, ChevronLeft, ZoomIn, ZoomOut, Redo,
  Upload, Plus, Code, Settings, SearchCheck, ChevronDown, Tag, Braces,
  AlignJustify, Trash2, TableProperties, PenLine, Sparkles, GripVertical,
  Copy, Download, Clock, WandSparkles, LoaderCircle, Check,
} from "lucide-react";

/* ─── Lucide-backed icon shim — every glyph at strokeWidth 1.5 ────── */
const STROKE = 2;
const Ic = {
  Bell:         () => <Bell           size={16} strokeWidth={STROKE} />,
  ChevronRight: () => <ChevronRight   size={15} strokeWidth={STROKE} />,
  MoveLeft:     () => <MoveLeft       size={16} strokeWidth={STROKE} />,
  Play:         () => <Play           size={14} strokeWidth={STROKE} />,
  ChevronLeft:  () => <ChevronLeft    size={16} strokeWidth={STROKE} />,
  ZoomIn:       () => <ZoomIn         size={16} strokeWidth={STROKE} />,
  ZoomOut:      () => <ZoomOut        size={16} strokeWidth={STROKE} />,
  Redo:         () => <Redo           size={16} strokeWidth={STROKE} />,
  Upload:       () => <Upload         size={24} strokeWidth={STROKE} />,
  Plus:         () => <Plus           size={14} strokeWidth={STROKE} />,
  Code:         () => <Code           size={14} strokeWidth={STROKE} />,
  Settings:     () => <Settings       size={14} strokeWidth={STROKE} />,
  SearchCheck:  () => <SearchCheck    size={14} strokeWidth={STROKE} />,
  ChevronDown:  () => <ChevronDown    size={14} strokeWidth={STROKE} />,
  Tag:          () => <Tag            size={13} strokeWidth={STROKE} />,
  Braces:       () => <Braces         size={13} strokeWidth={STROKE} />,
  TextIcon:     () => <AlignJustify   size={13} strokeWidth={STROKE} />,
  Trash:        () => <Trash2         size={14} strokeWidth={STROKE} />,
  TableProp:    () => <TableProperties size={14} strokeWidth={STROKE} />,
  PenLine:      () => <PenLine        size={13} strokeWidth={STROKE} />,
  Sparkles:     () => <Sparkles       size={13} strokeWidth={STROKE} />,
  Grip:         () => <GripVertical   size={10} strokeWidth={STROKE} />,
  Copy:         () => <Copy           size={14} strokeWidth={STROKE} />,
  Download:     () => <Download       size={14} strokeWidth={STROKE} />,
  TimerClock:   () => <Clock          size={13} strokeWidth={STROKE} />,
  WandSparkles: () => <WandSparkles   size={13} strokeWidth={STROKE} />,
  LoaderCircle: () => <LoaderCircle   size={13} strokeWidth={STROKE} style={{ animation: "spin 1s linear infinite" }} />,
};

/* ─── Tooltip wrapper ────────────────────────────────────────────── */
function Tooltip({ label, children, placement = "top" }: { label: string; children: ReactNode; placement?: "top" | "bottom" | "right" }) {
  const posClass =
    placement === "top"    ? "bottom-full mb-2 left-1/2 -translate-x-1/2" :
    placement === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" :
                             "left-full ml-2 top-1/2 -translate-y-1/2";
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <span className={`pointer-events-none absolute z-50 px-2 py-1 bg-[#171717] text-[#fafafa] text-[12px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${posClass}`}>
        {label}
      </span>
    </div>
  );
}

/* ─── Animated circular progress ─────────────────────────────────── */
function CircularProgress({ percent }: { percent: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const len  = (circ * percent) / 100;
  const angleRad = (-90 + (percent / 100) * 360) * (Math.PI / 180);
  const dotX = 28 + r * Math.cos(angleRad);
  const dotY = 28 + r * Math.sin(angleRad);
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: "absolute", inset: 0 }}>
        <circle cx="28" cy="28" r={r} stroke="#e5e5e5" strokeWidth="4" fill="none"/>
        <circle cx="28" cy="28" r={r} stroke="#2563eb" strokeWidth="4" fill="none"
          strokeLinecap="round"
          strokeDasharray={`${len} ${circ}`}
          transform="rotate(-90 28 28)"
        />
        <circle cx={dotX} cy={dotY} r="2.5" fill="#2563eb"/>
      </svg>
      <span className="text-[12px] font-medium text-[#171717] z-10 leading-none">{Math.floor(percent)}%</span>
    </div>
  );
}

/* ─── Toast facts shown during loading (rotates every 5 s) ────────── */
const toastMessages = [
  "Morgan Stanley research PDFs average 48 pages — Unsiloed processes them in under 15 seconds.",
  "Unsiloed preserves table structure with 99.2% accuracy across complex financial documents.",
  "Charts, footnotes, and multi-column layouts are extracted without losing context.",
  "Every figure is traceable back to its source page and coordinates.",
  "Unsiloed handles scanned PDFs with OCR automatically — no preprocessing needed.",
  "Named entities, tickers, and financial metrics are tagged and structured as you read this.",
  "Output is queryable JSON — ready to drop into your pipeline, RAG, or analytics stack.",
  "Processing is cancellation-safe and resumable if the session drops.",
];

/* ─── Status label derived from progress percent ──────────────────── */
function statusForPercent(p: number): string {
  if (p >= 100) return "Extraction complete";
  if (p >= 86)  return "Finalizing extraction";
  if (p >= 71)  return "Cross-referencing entities";
  if (p >= 56)  return "Analyzing financial data";
  if (p >= 41)  return "Identifying tables and figures";
  if (p >= 26)  return "Extracting text blocks";
  if (p >= 13)  return "Parsing document structure";
  return "Initializing standard extraction";
}

type SchemaRow = { id: number; name: string; type: string; desc: string; editing: boolean };

/* ─── Citation map: result section → PDF container ID ──────────────── */
const CITATIONS: Record<string, string> = {
  "newsletter-title":  "title",
  "intro":             "intro",
  "capital-raised":    "new-capital",
  "new-owners":        "new-owners-1",
  "meetings-stat":     "stat-meetings",
  "partners-list":     "names-list",
  "sales":             "sales",
  "team-updates":      "team-members",
  "new-mentor":        "new-mentor",
  "us-trip":           "us-trip",
  "nab":               "nab",
  "wwdc":              "wwdc",
  "launch-date":       "development",
  "agm":               "agm",
};

/* ─── Preview result text (used for copy / download) ─────────────── */
const PREVIEW_CONTENT = `## Newsletter Title

DrylabNews — for investors & friends · May 2017

## Capital Raised

5 MNOK total: 2.13 MNOK investment round + 2.05 MNOK Innovation Norway loan + Filmlance International dev agreement.

## New Owners

Unni Jacobsen, Torstein Jahr, Suzanne Bolstad, Eivind Bergene, Turid Brun, Vigdis Trondsen, Lea Blindheim, Kristine Holmsen, Torstein Hansen, Jostein Aanensen.

## Sales Performance

- Return customer rate: 80%
- Revenue Jan–Apr 2017: 200 kNOK (vs 339 kNOK total in 2016)
- New markets: Canada (Film Factory Montreal), France (Lumiere Numeriques)
- Notable user: Gareth Unwin, producer of "The King's Speech"

## Team Updates

Two permanent developers in Łódź, two interns from U of Oslo's Entrepreneurship Program, two CS interns on ML/Swift.

## USA Tour

Pontus and Audun visited New York, St. Louis, San Francisco, Los Angeles in Feb–Mar. Met Netflix, AMPAS, ICG, Local 871, Apple.

## NAB Convention

Andreas and Audun attended NAB in Las Vegas (April). Met PIX System, attended DIT-WIT party. Discussed cloud with Amazon, Google, IBM.

## Launch Date

Drylab 3.0 launches at IBC Amsterdam — September 2017.

## Annual General Meeting

June 16, 2017 at 15:00.
`;

/* ─── Drylab newsletter (PrinceXML sample) — paragraph blocks ────── */
type PdfBlock = {
  id: string;
  page: number;
  type: "title" | "subtitle" | "para" | "para-bold" | "stat" | "names" | "footnote";
  content: ReactNode;
};

const PDF_BLOCKS: PdfBlock[] = [
  /* ───────── PAGE 1 ───────── */
  { id: "title",      page: 1, type: "title",    content: "DrylabNews" },
  { id: "subtitle",   page: 1, type: "subtitle", content: "for investors & friends · May 2017" },
  { id: "intro",      page: 1, type: "para",     content: "Welcome to our first newsletter of 2017! It's been a while since the last one, and a lot has happened. We promise to keep them coming every two months hereafter, and permit ourselves to make this one rather long. The big news is the beginnings of our launch in the American market, but there are also interesting updates on sales, development, mentors and (of course) the investment round that closed in January." },
  { id: "new-capital", page: 1, type: "para",
    content: <><strong>New capital:</strong> The investment round was successful. We raised 2.13 MNOK to match the 2.05 MNOK loan from Innovation Norway. Including the development agreement with Filmlance International, the total new capital is 5 MNOK, partly tied to the successful completion of milestones. All formalities associated with this process are now finalized.</> },
  { id: "new-owners-1", page: 1, type: "para",
    content: <><strong>New owners:</strong> We would especially like to warmly welcome our new owners to the Drylab family: Unni Jacobsen, Torstein Jahr, Suzanne Bolstad, Eivind Bergene, Turid Brun, Vigdis Trondsen, Lea Blindheim, Kristine</> },
  { id: "stat-meetings", page: 1, type: "stat",  content: "" },
  { id: "names-list",  page: 1, type: "names",
    content: "Academy of Motion Picture Arts and Sciences · Alesha & Jamie Metzger · Amazon AWS · Apple · Caitlin Burns, PGA · Carlos Melcer · Chimney L.A. · Dado Valentic · Dave Stump · DIT WIT · ERA NYC · Facebook · Fancy Film · FilmLight · Geo Labelle · Google · IBM · Innovation Norway (NYC) · Innovation Norway (SF) · International Cinematographers Guild · NBC · Local 871 · Netflix · Pomfort · Radiant Images · Screening Room · Signiant · Moods of Norway · Tapad · Team Downey" },

  /* ───────── PAGE 2 ───────── */
  { id: "owners-cont", page: 2, type: "para",
    content: "Holmsen, Torstein Hansen, and Jostein Aanensen. We look forward to working with you!" },
  { id: "sales", page: 2, type: "para",
    content: <><strong>Sales:</strong> Return customer rate is now 80%, proving value and willingness to pay. Film Factory Montreal is our first customer in Canada. Lumiere Numeriques have started using us in France. We also have new customers in Norway, and high-profile users such as Gareth Unwin, producer of Oscar-winning <em>The King&apos;s Speech</em>. Revenue for the first four months is 200 kNOK, compared to 339 kNOK for all of 2016. We are working on a partnership to safeguard sales in Norway while beginning to focus more on the US.</> },
  { id: "team-members", page: 2, type: "para",
    content: <><strong>New team members:</strong> We&apos;ve extended our organization with two permanent developers based in Łódź, the film capital of Poland. Two highly skilled interns from the University of Oslo&apos;s Entrepreneurship Program, will be working on market research until mid-June (starting in March), preparing for the US launch. Also, two computer science students are working as part-time interns during spring, on machine learning and analysis research, as well as innovative architectures based on the Swift language. We hope our interns will consider sticking around!</> },
  { id: "new-mentor", page: 2, type: "para",
    content: <><strong>New mentor:</strong> We are honored to have Caitlin Burns joining us as a mentor. She&apos;s an accomplished producer based in New York, an active member of the Producers Guild of America, and the collaboration has already yielded good results, including valuable contacts for our visit in Los Angeles. Oscar-winning VFX supervisor <strong>Dave Stump</strong> joined us earlier.</> },
  { id: "us-trip", page: 2, type: "para",
    content: <><strong>New York, St. Louis, San Francisco and Los Angeles:</strong> Pontus and Audun did a tour of the US in February and March, meeting users, partners and potential customers. The trip was very successful, with several high points, including meetings with Netflix, the Academy of Motion Picture Arts and Sciences, the International Cinematographers Guild, Local 871 (the script supervisors&apos; union), one of the world&apos;s leading DITs, and Apple. See the separate attachment for a more detailed summary.</> },
  { id: "nab", page: 2, type: "para",
    content: <><strong>NAB:</strong> Andreas and Audun travelled to the National Association of Broadcasters convention (NAB) in Las Vegas for three hectic days in April. NAB gathers 100,000 participants from film and TV. It&apos;s a very efficient way of meeting people in the business, and getting an updated picture of the business landscape. The most exciting meeting was with PIX System, one of our most important competitors. It was interesting to note that they regarded the indie market as bigger than their own.</> },

  /* ───────── PAGE 3 ───────── */
  { id: "nab-cont", page: 3, type: "para",
    content: "Andreas was able to secure us an invitation to the DIT-WIT party, with some of the world's leading DITs in attendance. It was a great place for informal feedback on Drylab Viewer. The pattern was the same as for other users: Initial polite interest turns to real enthusiasm the moment someone is able to personally try Drylab Viewer! We also met with Pomfort and Apple about our on-going collaborations; ARRI and Teradek/Paralinx about camera integration; Amazon, Google and IBM about cloud computing." },
  { id: "wwdc", page: 3, type: "para",
    content: <><strong>WWDC and Silicon Valley:</strong> We were very pleasantly surprised to be invited by Apple to their World Wide Developers Conference in San Jose in June, despite not having applied. It&apos;s a valuable chance to learn and make new connections. We&apos;re also setting aside time to meet other potential partners.</> },
  { id: "cine-gear", page: 3, type: "para",
    content: <><strong>Cine Gear:</strong> We have decided not to attend the Cine Gear expo in L.A. this year, since feedback from many users about the show were mixed, and our planned beta version of 3.0 is slightly delayed.</> },
  { id: "development", page: 3, type: "para",
    content: <><strong>Development and launch:</strong> Development is around one month behind our original schedule. We expect the delay to decrease, with new developers on board. The launch of Drylab 3.0 will take place at the International Broadcasters Convention in Amsterdam in September, and we are working hard to get solid feedback from pilot users before then.</> },
  { id: "agm", page: 3, type: "para",
    content: <><strong>Annual General Meeting:</strong> Drylab&apos;s AGM will be held on June 16th at 15:00. An invitation will be distributed to all owners well in advance. We hope to see you there!</> },
  { id: "closing", page: 3, type: "para-bold",
    content: "As you can see it has been a hectic spring that has given us a lot of confirmation about our product. We are now working eagerly and hard towards the US launch with Drylab 3.0, while keeping momentum in Europe with our existing system." },
  { id: "footnote", page: 3, type: "footnote",
    content: "[Drylab has kindly allowed this newsletter to be redone in HTML/CSS and converted to PDF with Prince. Navngen helped anonymize names in the process.]" },
];

function DrylabBlock({
  block, isActive, onRef,
}: {
  block: PdfBlock;
  isActive: boolean;
  onRef: (el: HTMLDivElement | null) => void;
}) {
  const baseStyle: CSSProperties = {
    border: isActive ? "1px solid #2563eb" : "1px solid transparent",
    background: isActive ? "#eff6ff" : "transparent",
    transition: "background 0.2s ease, border-color 0.2s ease",
    padding: "8px 10px",
    margin: "0 -10px 6px",
    scrollMarginTop: 16,
  };

  switch (block.type) {
    case "title":
      return (
        <div ref={onRef} style={{ ...baseStyle, padding: "16px 10px 4px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "44pt", fontWeight: 700, letterSpacing: "-0.02em", margin: 0, color: "#0a0a0a" }}>
            {block.content}
          </h1>
        </div>
      );
    case "subtitle":
      return (
        <div ref={onRef} style={{ ...baseStyle, padding: "0 10px 18px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "11pt", fontStyle: "italic", color: "#666", margin: 0 }}>
            {block.content}
          </p>
        </div>
      );
    case "stat":
      return (
        <div ref={onRef} style={{
          ...baseStyle,
          background: isActive ? "#eff6ff" : "#f5f5f5",
          padding: "16px 20px",
          margin: "10px 0",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "36pt", fontWeight: 700, lineHeight: 1, color: "#0a0a0a", marginBottom: 4 }}>34</div>
          <div style={{ fontSize: "10pt", textTransform: "uppercase", letterSpacing: "0.12em", color: "#666", marginBottom: 8 }}>meetings</div>
          <div style={{ fontSize: "10pt", color: "#666", lineHeight: 1.4 }}>NY · SF<br/>LA · LV</div>
        </div>
      );
    case "names":
      return (
        <div ref={onRef} style={{
          ...baseStyle,
          padding: "12px 12px",
          margin: "16px 0",
          borderTop: isActive ? "1px solid #2563eb" : "2px solid #ccc",
          borderBottom: isActive ? "1px solid #2563eb" : "2px solid #ccc",
          borderLeft: isActive ? "1px solid #2563eb" : "1px solid transparent",
          borderRight: isActive ? "1px solid #2563eb" : "1px solid transparent",
        }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "9pt", lineHeight: 1.6, color: "#666", textAlign: "justify", margin: 0 }}>
            {block.content}
          </p>
        </div>
      );
    case "footnote":
      return (
        <div ref={onRef} style={{ ...baseStyle, padding: "12px 10px", margin: "20px 0 0" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "8.5pt", fontStyle: "italic", color: "#888", margin: 0, textAlign: "center" }}>
            {block.content}
          </p>
        </div>
      );
    case "para-bold":
      return (
        <div ref={onRef} style={baseStyle}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "12pt", fontWeight: 600, lineHeight: 1.6, margin: 0, color: "#0a0a0a" }}>
            {block.content}
          </p>
        </div>
      );
    case "para":
    default:
      return (
        <div ref={onRef} style={baseStyle}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "10.5pt", lineHeight: 1.65, margin: 0, textAlign: "justify", color: "#1a1a1a" }}>
            {block.content}
          </p>
        </div>
      );
  }
}

function PdfPageContent({ page, activeContainerId, registerContainer }: {
  page: number;
  activeContainerId: string | null;
  registerContainer: (id: string, el: HTMLDivElement | null) => void;
}) {
  const blocks = PDF_BLOCKS.filter(b => b.page === page);
  return (
    <div style={{ color: "#1a1a1a" }}>
      {blocks.map(b => (
        <DrylabBlock key={b.id}
                     block={b}
                     isActive={activeContainerId === b.id}
                     onRef={el => registerContainer(b.id, el)} />
      ))}
      <p style={{ fontFamily: "Georgia, serif", textAlign: "center", fontSize: "8pt", color: "#aaa", letterSpacing: "0.08em", marginTop: 28, paddingTop: 8, borderTop: "1px solid #e5e5e5" }}>
        DRYLAB NEWS · MAY 2017 · PAGE {page} OF 3
      </p>
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
  const [citationsOn, setCitationsOn]   = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeSection, setActiveSection]   = useState<string | null>(null);
  const [runState, setRunState]         = useState<"idle" | "loading" | "done">("idle");

  /* ── Result panel sub-state ── */
  const [resultTab, setResultTab]     = useState<"preview" | "markdown" | "json">("preview");
  const [dlToastState, setDlToastState] = useState<"hidden" | "in" | "out">("hidden");
  const dlToastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── PDF viewer state ── */
  const totalPages = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [zoomLevel, setZoomLevel]     = useState(100); // percent
  const ZOOM_STEP = 25;
  const ZOOM_MIN  = 25;
  const ZOOM_MAX  = 300;
  const DEFAULT_ZOOM = 100;
  const pdfScrollRef = useRef<HTMLDivElement>(null);
  const pageRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  /* ── Loading animation state ── */
  const [progress, setProgress] = useState(0);
  const [toastIdx, setToastIdx] = useState(0);
  const rafRef   = useRef<number | null>(null);
  const toastRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
  function goToPage(target: number) {
    const clamped = Math.max(1, Math.min(totalPages, target));
    setCurrentPage(clamped);
    setPageInputValue(String(clamped));
    pageRefs.current[clamped - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
    return clamped;
  }
  function prevPage() { if (currentPage > 1)         goToPage(currentPage - 1); }
  function nextPage() { if (currentPage < totalPages) goToPage(currentPage + 1); }
  function commitPageInput() {
    const n = parseInt(pageInputValue, 10);
    if (Number.isNaN(n)) { setPageInputValue(String(currentPage)); return; }
    goToPage(n);
  }

  /* Keep the visible input in sync when the page changes from elsewhere
     (citation auto-scroll, prev/next buttons, etc.) */
  useEffect(() => { setPageInputValue(String(currentPage)); }, [currentPage]);

  /* ─── Zoom ──────────────────────────────────────────────────────── */
  function zoomIn()    { setZoomLevel(z => Math.min(ZOOM_MAX, z + ZOOM_STEP)); }
  function zoomOut()   { setZoomLevel(z => Math.max(ZOOM_MIN, z - ZOOM_STEP)); }
  function zoomReset() { setZoomLevel(DEFAULT_ZOOM); }

  /* ─── Source citation derived state ────────────────────────────── */
  const citedId             = citationsOn ? (hoveredSection ?? activeSection) : null;
  const citedContainerId    = citedId ? (CITATIONS[citedId] ?? null) : null;
  const citedBlock          = citedContainerId ? PDF_BLOCKS.find(b => b.id === citedContainerId) ?? null : null;

  useEffect(() => {
    if (!citedContainerId || !citedBlock) return;
    setCurrentPage(citedBlock.page);
    requestAnimationFrame(() => {
      const el = containerRefs.current.get(citedContainerId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      else pageRefs.current[citedBlock.page - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citedContainerId]);

  /* ─── Loading animation ─────────────────────────────────────────── */
  function startLoading() {
    if (!canRun) return;
    if (rafRef.current   !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (toastRef.current !== null) { clearInterval(toastRef.current);      toastRef.current = null; }

    setActiveTab("result");
    setRunState("loading");
    setProgress(0);
    setToastIdx(0);

    const TOTAL_MS = 10_000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / TOTAL_MS) * 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        if (toastRef.current !== null) { clearInterval(toastRef.current); toastRef.current = null; }
        setTimeout(() => setRunState("done"), 600);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    toastRef.current = setInterval(() => {
      setToastIdx(i => (i + 1) % toastMessages.length);
    }, 5000);
  }

  /* Unmount cleanup only — never cancel timers on intermediate renders. */
  useEffect(() => {
    return () => {
      if (rafRef.current   !== null) cancelAnimationFrame(rafRef.current);
      if (toastRef.current !== null) clearInterval(toastRef.current);
    };
  }, []);

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

  /* ── Portal mount guard ── */
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  /* ── Dropdown open state ── */
  const [modelOpen, setModelOpen]       = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [templateSelected, setTemplateSelected] = useState("");
  const modelTriggerRef    = useRef<HTMLButtonElement>(null);
  const templateTriggerRef = useRef<HTMLButtonElement>(null);
  const modelMenuRef       = useRef<HTMLDivElement>(null);
  const templateMenuRef    = useRef<HTMLDivElement>(null);
  const [modelPos,    setModelPos]    = useState({ top: 0, left: 0, width: 0 });
  const [templatePos, setTemplatePos] = useState({ top: 0, left: 0, width: 0 });

  /* ── Type column dropdown (one per schema row, portal-based) ── */
  const [typeDropState, setTypeDropState] = useState<{ rowId: number; top: number; left: number; width: number } | null>(null);
  const typeMenuRef      = useRef<HTMLDivElement>(null);
  const typeTriggerRefs  = useRef<Map<number, HTMLButtonElement>>(new Map());

  function openModel() {
    const r = modelTriggerRef.current?.getBoundingClientRect();
    if (r) setModelPos({ top: r.bottom + 2, left: r.left, width: r.width });
    setModelOpen(v => !v); setTemplateOpen(false);
  }
  function openTemplate() {
    const r = templateTriggerRef.current?.getBoundingClientRect();
    if (r) setTemplatePos({ top: r.bottom + 2, left: r.left, width: r.width });
    setTemplateOpen(v => !v); setModelOpen(false);
  }

  /* click-outside closes dropdowns — no overlay needed */
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (modelOpen && !modelTriggerRef.current?.contains(t) && !modelMenuRef.current?.contains(t))
        setModelOpen(false);
      if (templateOpen && !templateTriggerRef.current?.contains(t) && !templateMenuRef.current?.contains(t))
        setTemplateOpen(false);
      if (typeDropState) {
        const trigger = typeTriggerRefs.current.get(typeDropState.rowId);
        if (!typeMenuRef.current?.contains(t) && !trigger?.contains(t))
          setTypeDropState(null);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [modelOpen, templateOpen, typeDropState]);

  /* ── Schema sub-tab ── */
  const [schemaTab, setSchemaTab] = useState<"manual" | "auto">("manual");
  const [autoSuggestText, setAutoSuggestText] = useState("");
  const [autoSuggestLoading, setAutoSuggestLoading] = useState(false);

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
          className="fixed top-4 right-5 z-50 flex items-center gap-2 bg-white border border-[#e5e5e5] px-4 py-2 text-[14px] font-medium text-[#0a0a0a]"
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
              className="flex items-center gap-1.5 px-1.5 py-1.5 border bg-white text-[14px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors shrink-0"
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
                    <input
                      type="text"
                      inputMode="numeric"
                      value={pageInputValue}
                      onChange={e => setPageInputValue(e.target.value.replace(/[^0-9]/g, ""))}
                      onFocus={e => { e.currentTarget.select(); e.currentTarget.style.borderColor = "#2563eb"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "#e5e5e5"; commitPageInput(); }}
                      onKeyDown={e => {
                        if (e.key === "Enter")  { commitPageInput(); (e.currentTarget as HTMLInputElement).blur(); }
                        if (e.key === "Escape") { setPageInputValue(String(currentPage)); (e.currentTarget as HTMLInputElement).blur(); }
                      }}
                      aria-label="Go to page"
                      className="text-center border bg-white text-[14px] font-medium text-[#0a0a0a] shrink-0 outline-none transition-colors"
                      style={{ width: 42, height: 32, borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
                    />
                    <span className="px-2 text-[14px] font-medium text-[#737373]">of {totalPages}</span>
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
                    <div className="flex items-center justify-center border bg-white text-[14px] font-medium text-[#737373] shrink-0"
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
                <div ref={pdfScrollRef}
                     className="flex-1 min-h-0 overflow-auto flex flex-col items-center py-4 gap-3"
                     style={{ background: "#f5f5f5", scrollBehavior: "smooth" }}>
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <div key={pg}
                           ref={el => { pageRefs.current[pg - 1] = el; }}
                           className="w-full bg-white shadow-sm"
                           style={{ padding: "52px 60px", minHeight: 680 }}>
                        <PdfPageContent
                          page={pg}
                          activeContainerId={citedContainerId}
                          registerContainer={(id, el) => containerRefs.current.set(id, el)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Upload area */
              <div className="flex-1 flex items-center justify-center p-4" style={{ background: "#f5f5f5" }}>
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
                  className="flex items-center gap-1.5 px-2 py-1 text-[14px] font-medium text-[#171717] transition-colors"
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
                    className="flex items-center gap-1.5 px-2 py-1 text-[14px] font-medium text-[#171717] transition-all"
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
                      className="h-full text-[14px] font-medium capitalize transition-colors border-b-2"
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
                  <div className="flex items-center gap-3 mr-1">
                    <button
                      onClick={() => setCitationsOn(v => { if (v) { setActiveSection(null); setHoveredSection(null); } return !v; })}
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
                    <span className="text-[14px] font-medium text-[#0a0a0a] leading-none whitespace-nowrap">Source highlighting</span>
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
                <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-8">
                  {/* Progress circle + status */}
                  <div className="flex flex-col items-center gap-2">
                    <CircularProgress percent={progress} />
                    <span className="text-[14px] font-medium text-[#737373]">
                      {statusForPercent(progress)}
                      {progress < 100 && <span className="loading-dots" aria-hidden="true" />}
                    </span>
                  </div>

                  {/* Fact toast card — fixed min-height to prevent jitter on shorter facts */}
                  <div className="flex items-start gap-2 p-4 bg-white border"
                       style={{ width: 356, minHeight: 92, borderColor: "#e5e5e5", boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.1)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" fill="#0a0a0a"/>
                      <path d="M12 16v-4" stroke="white" strokeWidth="1.5"/>
                      <path d="M12 8h.01" stroke="white" strokeWidth="1.5"/>
                    </svg>
                    <p key={toastIdx} className="text-[14px] font-medium text-[#0a0a0a] leading-5 flex-1 min-w-0"
                       style={{ animation: "factCrossfade 400ms ease" }}>
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
                        <Ic.TableProp /><p className="text-[16px] font-medium text-[#0a0a0a]">Configure fields</p>
                      </div>
                      <p className="text-[14px] text-[#737373] leading-5">Tell us what to extract and how to process it.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {/* Model */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-medium text-[#737373]">Model</label>
                        <div className="relative">
                          <button ref={modelTriggerRef}
                            onClick={openModel}
                            className="w-full h-9 border bg-white px-3 text-[14px] text-left flex items-center justify-between gap-2 outline-none cursor-pointer hover:bg-[#fafafa] transition-colors"
                            style={{ borderColor: modelOpen ? "#a3a3a3" : "#e5e5e5", boxShadow: modelOpen ? "0 0 0 3px rgba(163,163,163,0.3)" : "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                            <span className="text-[#0a0a0a]">{modelSelected}</span>
                            <span className="shrink-0 text-[#737373]"><Ic.ChevronDown /></span>
                          </button>
                          {/* model menu rendered via portal at root */}
                        </div>
                      </div>
                      {/* Citations */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-medium text-[#737373]">Citations Extraction</label>
                        <button className="flex items-center gap-3 h-9" onClick={() => setCitationsOn(v => { if (v) { setActiveSection(null); setHoveredSection(null); } return !v; })}>
                          <div className="flex items-center px-0.5 shrink-0"
                               style={{ width: 36, height: 20, background: citationsOn ? "#171717" : "#e5e5e5", transition: "background 0.2s" }}>
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

                  {/* Schema */}
                  <div className="border p-3 flex flex-col gap-4" style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                    <div className="flex flex-col gap-1">
                      <p className="text-[16px] font-medium text-[#0a0a0a]">Schema</p>
                      <p className="text-[14px] text-[#737373] leading-5">Define which fields to extract from the document.</p>
                    </div>
                    {/* Schema sub-tabs */}
                    <div className="flex items-center border-b" style={{ borderColor: "#e5e5e5" }}>
                      <button onClick={() => setSchemaTab("manual")}
                              className={`flex items-center gap-1.5 px-2 py-2 text-[14px] font-medium transition-colors border-b-2 ${schemaTab === "manual" ? "text-[#0a0a0a] border-[#171717]" : "text-[#737373] border-transparent hover:text-[#0a0a0a]"}`}>
                        <Ic.PenLine /> Manual
                      </button>
                      <button onClick={() => setSchemaTab("auto")}
                              className={`flex items-center gap-1.5 px-2 py-2 text-[14px] font-medium transition-colors border-b-2 ${schemaTab === "auto" ? "text-[#0a0a0a] border-[#171717]" : "text-[#737373] border-transparent hover:text-[#0a0a0a]"}`}>
                        <Ic.Sparkles /> Auto-Suggest
                        <span className="px-1 py-0.5 text-[12px] font-medium text-violet-700 bg-violet-100 leading-4">Beta</span>
                      </button>
                    </div>

                    {schemaTab === "manual" ? (
                      /* ── Manual: Name + Template + table ── */
                      <>
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
                              <button ref={templateTriggerRef}
                                onClick={openTemplate}
                                className="w-full h-9 border bg-white px-3 text-[14px] text-left flex items-center justify-between gap-2 outline-none cursor-pointer hover:bg-[#fafafa] transition-colors"
                                style={{ borderColor: templateOpen ? "#a3a3a3" : "#e5e5e5", boxShadow: templateOpen ? "0 0 0 3px rgba(163,163,163,0.3)" : "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                                <span className={`truncate ${templateSelected ? "text-[#0a0a0a]" : "text-[#a1a1aa]"}`}>
                                  {templateSelected || "Browse pre-built field sets"}
                                </span>
                                <span className="shrink-0 text-[#737373]"><Ic.ChevronDown /></span>
                              </button>
                              {/* template menu rendered via portal at root */}
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
                            <span className="text-[14px] font-medium text-[#737373]">{lbl as string}</span>
                          </div>
                        ))}
                        <div className="shrink-0 border-b" style={{ width: 52, borderColor: "#e5e5e5" }} />
                      </div>

                      {/* Rows */}
                      {schemaRows.map(row => (
                        <div key={row.id}
                             className="flex items-center"
                             style={{ minHeight: 52 }}
                             onBlur={(e) => {
                               /* Auto-commit when focus leaves the entire row */
                               if (!e.currentTarget.contains(e.relatedTarget as Node))
                                 commitRow(row.id);
                             }}>
                          {row.editing ? (
                            /* ── Editing row ── */
                            <>
                              {/* Name */}
                              <div className="flex-1 px-2 py-1.5">
                                <input
                                  autoFocus
                                  type="text"
                                  value={row.name}
                                  onChange={e => updateRow(row.id, "name", e.target.value)}
                                  onKeyDown={e => e.key === "Enter" && commitRow(row.id)}
                                  placeholder="Field name"
                                  className="w-full h-8 border bg-white px-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa] transition-colors"
                                  style={{ borderColor: "#e5e5e5" }}
                                  onFocus={e => { e.currentTarget.style.borderColor = "#a3a3a3"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(163,163,163,0.3)"; }}
                                  onBlur={e => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.boxShadow = ""; }}
                                />
                              </div>
                              {/* Type — portal dropdown */}
                              <div className="flex-1 px-2 py-1.5">
                                <button
                                  ref={el => { if (el) typeTriggerRefs.current.set(row.id, el); else typeTriggerRefs.current.delete(row.id); }}
                                  onClick={e => {
                                    if (typeDropState?.rowId === row.id) { setTypeDropState(null); return; }
                                    const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                    setTypeDropState({ rowId: row.id, top: r.bottom + 2, left: r.left, width: r.width });
                                  }}
                                  className="w-full h-8 border bg-white px-2 text-[14px] text-[#0a0a0a] text-left flex items-center justify-between gap-2 outline-none cursor-pointer hover:bg-[#fafafa] transition-colors"
                                  style={{
                                    borderColor: typeDropState?.rowId === row.id ? "#a3a3a3" : "#e5e5e5",
                                    boxShadow: typeDropState?.rowId === row.id ? "0 0 0 3px rgba(163,163,163,0.3)" : undefined,
                                  }}>
                                  <span>{row.type}</span>
                                  <span className="shrink-0 text-[#737373]"><Ic.ChevronDown /></span>
                                </button>
                              </div>
                              {/* Description */}
                              <div className="flex-1 px-2 py-1.5">
                                <input
                                  type="text"
                                  value={row.desc}
                                  onChange={e => updateRow(row.id, "desc", e.target.value)}
                                  onKeyDown={e => e.key === "Enter" && commitRow(row.id)}
                                  placeholder="Description"
                                  className="w-full h-8 border bg-white px-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa] transition-colors"
                                  style={{ borderColor: "#e5e5e5" }}
                                  onFocus={e => { e.currentTarget.style.borderColor = "#a3a3a3"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(163,163,163,0.3)"; }}
                                  onBlur={e => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.boxShadow = ""; }}
                                />
                              </div>
                            </>
                          ) : (
                            /* ── Display row — hover reveals borders, click to re-edit ── */
                            <>
                              <div className="flex-1 px-2 py-1.5 cursor-text group/name"                                   onClick={() => updateRow(row.id, "editing", true)}>
                                <div className="w-full h-8 border border-transparent group-hover/name:border-[#e5e5e5] flex items-center px-2 transition-colors">
                                  <span className="text-[14px] font-medium text-[#0a0a0a] truncate">{row.name}</span>
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1.5 cursor-pointer group/type"                                   onClick={() => updateRow(row.id, "editing", true)}>
                                <div className="w-full h-8 border border-transparent group-hover/type:border-[#e5e5e5] flex items-center justify-between px-2 transition-colors">
                                  <span className="text-[14px] text-[#0a0a0a] truncate">{row.type}</span>
                                  <span className="shrink-0 text-[#737373] opacity-0 group-hover/type:opacity-100 transition-opacity"><Ic.ChevronDown /></span>
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1.5 cursor-text group/desc"
                                   onClick={() => updateRow(row.id, "editing", true)}>
                                <div className="w-full h-8 border border-transparent group-hover/desc:border-[#e5e5e5] flex items-center px-2 transition-colors">
                                  <span className="text-[14px] text-[#0a0a0a] truncate">{row.desc || <span className="text-[#a1a1aa]">—</span>}</span>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="shrink-0 flex items-center justify-center px-2" style={{ width: 52 }}>
                            <button onClick={() => deleteRow(row.id)}
                                    className="flex items-center justify-center w-8 h-8 hover:bg-red-50 transition-colors text-[#a3a3a3] hover:text-red-500">
                              <Ic.Trash />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add schema row */}
                      <div className="flex items-center" style={{ height: 44 }}>
                        <button onClick={addSchemaRow}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[14px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors w-full">
                          <Ic.Plus /> Add Schema
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ── Auto-Suggest tab ── */
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-[#737373]">
                      Describe what fields to extract from your document
                    </label>
                    {/* Textarea container — 150px, flex-col, button sits in bottom addon bar */}
                    <div className="border bg-white flex flex-col"
                         style={{ height: 150, borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      {/* Text area — fills remaining height */}
                      <div className="flex-1 min-h-0 relative p-3">
                        {autoSuggestLoading ? (
                          /* Shimmer text overlay when generating */
                          <div className="text-[14px] leading-5 w-full h-full overflow-hidden"
                               style={{
                                 background: "linear-gradient(90deg, #a3a3a3 25%, #e5e5e5 50%, #a3a3a3 75%)",
                                 backgroundSize: "200% auto",
                                 WebkitBackgroundClip: "text",
                                 WebkitTextFillColor: "transparent",
                                 backgroundClip: "text",
                                 animation: "shimmerText 1.5s linear infinite",
                               }}>
                            {autoSuggestText}
                          </div>
                        ) : (
                          <textarea
                            value={autoSuggestText}
                            onChange={e => setAutoSuggestText(e.target.value)}
                            placeholder="e.g., invoice number, date, total amount, vendor name, line items with descriptions and prices..."
                            className="w-full h-full border-0 outline-none resize-none text-[14px] text-[#0a0a0a] bg-transparent placeholder:text-[#a1a1aa] leading-5"
                          />
                        )}
                      </div>
                      {/* Bottom addon bar */}
                      <div className="flex items-center justify-between shrink-0"
                           style={{ padding: "6px 12px 6px 12px" }}>
                        <div />
                        <button
                          disabled={!autoSuggestText.trim() || autoSuggestLoading}
                          onClick={() => {
                            if (!autoSuggestText.trim() || autoSuggestLoading) return;
                            setAutoSuggestLoading(true);
                            setTimeout(() => setAutoSuggestLoading(false), 3000);
                          }}
                          className="flex items-center gap-1.5 border bg-white text-[12px] font-medium text-[#0a0a0a] transition-colors"
                          style={{
                            padding: "6px 10px",
                            borderColor: "#e5e5e5",
                            opacity: !autoSuggestText.trim() ? 0.5 : 1,
                            cursor: !autoSuggestText.trim() || autoSuggestLoading ? "not-allowed" : "pointer",
                          }}>
                          {autoSuggestLoading ? (
                            <><Ic.LoaderCircle /> Generating schema...</>
                          ) : (
                            <><Ic.WandSparkles /> Generate schema</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                  </div>
                </div>
              )}

              {/* ── Result tab ── */}
              {activeTab === "result" && runState === "done" && (
                <div className="flex-1 min-h-0 overflow-auto">
                  {resultTab === "preview" && (() => {
                    /* Helper: returns props for a citable section container */
                    function citeProps(id: string) {
                      const isActive = citationsOn && (hoveredSection === id || activeSection === id);
                      return {
                        onMouseEnter: citationsOn ? () => setHoveredSection(id) : undefined,
                        onMouseLeave: citationsOn ? () => setHoveredSection(null) : undefined,
                        onClick: citationsOn ? () => setActiveSection(a => a === id ? null : id) : undefined,
                        style: {
                          cursor: citationsOn ? "pointer" : "default",
                          border: isActive ? "1px solid #2563eb" : "1px solid transparent",
                          background: isActive ? "#eff6ff" : "transparent",
                          transition: "background 0.18s ease, border-color 0.18s ease",
                        } as CSSProperties,
                      };
                    }
                    return (
                    <div className="flex flex-col gap-3 p-[10px]">

                      {/* Newsletter Title */}
                      <div className="flex flex-col gap-0.5" {...citeProps("newsletter-title")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Newsletter Title</p>
                        </div>
                        <div className="p-2">
                          <p className="text-[14px] text-[#525252] leading-5">
                            DrylabNews — for investors &amp; friends · May 2017
                          </p>
                        </div>
                      </div>

                      {/* Intro */}
                      <div className="flex flex-col gap-0.5" {...citeProps("intro")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Issue Overview</p>
                        </div>
                        <div className="p-2">
                          <p className="text-[14px] text-[#525252] leading-5">
                            First newsletter of 2017. Highlights: launch in the American market, sales growth, January investment round closed, mentor and team additions.
                          </p>
                        </div>
                      </div>

                      {/* Capital Raised */}
                      <div className="flex flex-col gap-0.5" {...citeProps("capital-raised")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Capital Raised</p>
                        </div>
                        <div className="flex flex-col gap-[10px] p-2 text-[14px] text-[#525252]">
                          <p className="leading-5">Total new capital: <strong>5 MNOK</strong></p>
                          <ul className="list-disc leading-5" style={{ paddingLeft: 21 }}>
                            <li>Investment round: 2.13 MNOK</li>
                            <li>Innovation Norway loan: 2.05 MNOK</li>
                            <li>Filmlance International dev agreement</li>
                            <li>Partly tied to milestone completion</li>
                          </ul>
                        </div>
                      </div>

                      {/* New Owners */}
                      <div className="flex flex-col gap-0.5" {...citeProps("new-owners")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">New Owners</p>
                        </div>
                        <div className="flex flex-col gap-[10px] p-2 text-[14px] text-[#525252]">
                          <p className="leading-5">Welcomed to the Drylab family:</p>
                          <ul className="list-disc leading-5" style={{ paddingLeft: 21 }}>
                            <li>Unni Jacobsen, Torstein Jahr, Suzanne Bolstad, Eivind Bergene</li>
                            <li>Turid Brun, Vigdis Trondsen, Lea Blindheim, Kristine Holmsen</li>
                            <li>Torstein Hansen, Jostein Aanensen</li>
                          </ul>
                        </div>
                      </div>

                      {/* Meetings stat */}
                      <div className="flex flex-col gap-0.5" {...citeProps("meetings-stat")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Meetings</p>
                        </div>
                        <div className="p-2">
                          <p className="text-[14px] text-[#525252] leading-5">
                            <strong>34 meetings</strong> across NY, SF, LA and LV during the spring US tour.
                          </p>
                        </div>
                      </div>

                      {/* Partners list */}
                      <div className="flex flex-col gap-0.5" {...citeProps("partners-list")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Partners &amp; Contacts</p>
                        </div>
                        <div className="p-2">
                          <p className="text-[14px] text-[#525252] leading-5">
                            Notable contacts: Apple, Netflix, Amazon AWS, Google, IBM, Facebook, AMPAS, International Cinematographers Guild, Local 871, FilmLight, Pomfort, Radiant Images, Signiant, NBC, Team Downey.
                          </p>
                        </div>
                      </div>

                      {/* Sales */}
                      <div className="flex flex-col gap-0.5" {...citeProps("sales")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Sales Performance</p>
                        </div>
                        <div className="flex flex-col gap-[10px] p-2 text-[14px] text-[#525252]">
                          <ul className="list-disc leading-5" style={{ paddingLeft: 21 }}>
                            <li>Return customer rate: <strong>80%</strong></li>
                            <li>Revenue Jan–Apr 2017: <strong>200 kNOK</strong> (vs 339 kNOK total in 2016)</li>
                            <li>New markets: Canada (Film Factory Montreal), France (Lumiere Numeriques)</li>
                            <li>Notable user: Gareth Unwin, producer of <em>The King&apos;s Speech</em></li>
                          </ul>
                        </div>
                      </div>

                      {/* Team Updates */}
                      <div className="flex flex-col gap-0.5" {...citeProps("team-updates")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Team Updates</p>
                        </div>
                        <div className="flex flex-col gap-[10px] p-2 text-[14px] text-[#525252]">
                          <ul className="list-disc leading-5" style={{ paddingLeft: 21 }}>
                            <li>2 permanent developers in Łódź, Poland</li>
                            <li>2 interns from U of Oslo&apos;s Entrepreneurship Program (market research)</li>
                            <li>2 CS interns on machine learning &amp; Swift architectures</li>
                          </ul>
                        </div>
                      </div>

                      {/* New Mentor */}
                      <div className="flex flex-col gap-0.5" {...citeProps("new-mentor")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">New Mentor</p>
                        </div>
                        <div className="p-2">
                          <p className="text-[14px] text-[#525252] leading-5">
                            Caitlin Burns — accomplished NY producer, member of the Producers Guild of America. Joins Oscar-winning VFX supervisor Dave Stump.
                          </p>
                        </div>
                      </div>

                      {/* USA Tour */}
                      <div className="flex flex-col gap-0.5" {...citeProps("us-trip")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">USA Tour (Feb–Mar)</p>
                        </div>
                        <div className="flex flex-col gap-[10px] p-2 text-[14px] text-[#525252]">
                          <p className="leading-5">Pontus and Audun visited New York, St. Louis, San Francisco, Los Angeles. Key meetings:</p>
                          <ul className="list-disc leading-5" style={{ paddingLeft: 21 }}>
                            <li>Netflix</li>
                            <li>Academy of Motion Picture Arts and Sciences</li>
                            <li>International Cinematographers Guild</li>
                            <li>Local 871 (script supervisors&apos; union)</li>
                            <li>Apple</li>
                          </ul>
                        </div>
                      </div>

                      {/* NAB */}
                      <div className="flex flex-col gap-0.5" {...citeProps("nab")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">NAB Convention (April)</p>
                        </div>
                        <div className="flex flex-col gap-[10px] p-2 text-[14px] text-[#525252]">
                          <p className="leading-5">Andreas and Audun in Las Vegas, 100,000 attendees. Highlights:</p>
                          <ul className="list-disc leading-5" style={{ paddingLeft: 21 }}>
                            <li>Met PIX System (top competitor) — they regard the indie market as bigger than their own</li>
                            <li>DIT-WIT party with leading DITs</li>
                            <li>Camera integration talks: ARRI, Teradek/Paralinx</li>
                            <li>Cloud talks: Amazon, Google, IBM</li>
                          </ul>
                        </div>
                      </div>

                      {/* WWDC */}
                      <div className="flex flex-col gap-0.5" {...citeProps("wwdc")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">WWDC Invitation</p>
                        </div>
                        <div className="p-2">
                          <p className="text-[14px] text-[#525252] leading-5">
                            Apple invited Drylab to WWDC in San Jose (June) — without applying.
                          </p>
                        </div>
                      </div>

                      {/* Launch */}
                      <div className="flex flex-col gap-0.5" {...citeProps("launch-date")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Launch Date</p>
                        </div>
                        <div className="p-2">
                          <p className="text-[14px] text-[#525252] leading-5">
                            <strong>Drylab 3.0</strong> launches at the International Broadcasters Convention in Amsterdam — <strong>September 2017</strong>. Development is ~1 month behind schedule.
                          </p>
                        </div>
                      </div>

                      {/* AGM */}
                      <div className="flex flex-col gap-0.5" {...citeProps("agm")}>
                        <div className="p-2">
                          <p className="text-[16px] font-semibold text-[#171717] leading-none">Annual General Meeting</p>
                        </div>
                        <div className="p-2">
                          <p className="text-[14px] text-[#525252] leading-5">
                            <strong>June 16, 2017</strong> at 15:00. Invitations sent to all owners.
                          </p>
                        </div>
                      </div>

                    </div>
                    );
                  })()}

                  {resultTab === "markdown" && (
                    <div className="flex items-center justify-center py-20 text-[14px] text-[#a1a1aa]">
                      Markdown view — coming in next update
                    </div>
                  )}

                  {resultTab === "json" && (
                    <div className="flex items-center justify-center py-20 text-[14px] text-[#a1a1aa]">
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
                          className="flex items-center gap-2 px-2.5 py-1.5 border bg-white text-[14px] font-medium text-[#0a0a0a] hover:bg-neutral-50 transition-colors"
                          style={{ borderColor: "#e5e5e5", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
                      Cancel
                    </Link>
                    <button className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f5f5f5] text-[14px] font-medium text-[#171717] hover:bg-neutral-200 transition-colors">
                      Save Changes
                      <span className="flex items-center justify-center h-5 min-w-5 px-1 bg-neutral-200 text-[12px] font-medium text-[#737373]">⌘⏎</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Dropdown portals — rendered at document.body, escape all overflow containers ── */}

      {/* Type column dropdown */}
      {mounted && typeDropState && createPortal(
        <div ref={typeMenuRef}
             style={{ position: "fixed", zIndex: 9999, top: typeDropState.top, left: typeDropState.left, width: typeDropState.width,
                      background: "white", border: "1px solid #e5e5e5", padding: "4px 0",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" }}>
          {typeOptions.map(t => {
            const selected = schemaRows.find(r => r.id === typeDropState.rowId)?.type === t;
            return (
              <button key={t}
                      onClick={() => { updateRow(typeDropState.rowId, "type", t); setTypeDropState(null); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, paddingLeft: 32, paddingRight: 12,
                               paddingTop: 8, paddingBottom: 8, fontSize: 14, color: "#0a0a0a", textAlign: "left",
                               background: "none", border: "none", cursor: "pointer", position: "relative" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                {selected && (
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
                    <Check size={14} strokeWidth={STROKE} />
                  </span>
                )}
                {t}
              </button>
            );
          })}
        </div>,
        document.body
      )}

      {mounted && modelOpen && createPortal(
        <div ref={modelMenuRef}
             style={{ position: "fixed", zIndex: 9999, top: modelPos.top, left: modelPos.left, width: modelPos.width,
                      background: "white", border: "1px solid #e5e5e5", padding: "4px 0",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" }}>
          {models.map(m => (
            <button key={m} onClick={() => { setModelSelected(m); setModelOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, paddingLeft: 32, paddingRight: 12,
                             paddingTop: 8, paddingBottom: 8, fontSize: 14, color: "#0a0a0a", textAlign: "left",
                             background: "none", border: "none", cursor: "pointer", position: "relative" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
              {modelSelected === m && (
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#0a0a0a" }}>
                  <Check size={14} strokeWidth={STROKE} />
                </span>
              )}
              {m}
            </button>
          ))}
        </div>,
        document.body
      )}

      {mounted && templateOpen && createPortal(
        <div ref={templateMenuRef}
             style={{ position: "fixed", zIndex: 9999, top: templatePos.top, left: templatePos.left, width: templatePos.width,
                      background: "white", border: "1px solid #e5e5e5", padding: "4px 0",
                      maxHeight: 224, overflowY: "auto",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" }}>
          {templateOptions.map(t => (
            <button key={t} onClick={() => { setTemplateSelected(t); setTemplateOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, paddingLeft: 32, paddingRight: 12,
                             paddingTop: 8, paddingBottom: 8, fontSize: 14, color: "#0a0a0a", textAlign: "left",
                             background: "none", border: "none", cursor: "pointer", position: "relative" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
              {templateSelected === t && (
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#0a0a0a" }}>
                  <Check size={14} strokeWidth={STROKE} />
                </span>
              )}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</span>
            </button>
          ))}
        </div>,
        document.body
      )}

      <style>{`
        @keyframes fadeIn         { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastSlideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastFadeOut   { from { opacity: 1; } to { opacity: 0; } }
        @keyframes spin           { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmerText    { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes factCrossfade  { 0% { opacity: 0; } 50% { opacity: 0; } 100% { opacity: 1; } }

        /* Animated trailing dots — reserves width so the label never reflows. */
        .loading-dots {
          display: inline-block;
          width: 1.5ch;
          text-align: left;
          vertical-align: bottom;
        }
        .loading-dots::after {
          content: '';
          animation: loadingDots 1.6s infinite;
        }
        @keyframes loadingDots {
          0%,  24.99% { content: ''; }
          25%, 49.99% { content: '.'; }
          50%, 74.99% { content: '..'; }
          75%, 100%   { content: '...'; }
        }
      `}</style>
    </div>
  );
}
