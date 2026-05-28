import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Filter,
  GraduationCap,
  Laptop,
  Network,
  ShieldCheck,
  Search,
  ClipboardList,
  MessageSquare,
  Server,
  CalendarDays,
  Target,
  BookOpen,
  Wrench,
  FileText,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { days, categories } from "./data/roadmap.js";

const STORAGE_KEY = "it-speedrun-progress-v1";
const UPDATED_KEY = "it-speedrun-last-updated-v1";
const APP_NAME = "30-Day IT Support + Systems Admin Speedrun";

function loadProgress() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function loadLastUpdated() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(UPDATED_KEY);
  } catch {
    return null;
  }
}

function formatLastUpdated(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return null;
  }
}

function typeIcon(type) {
  const map = {
    "MS-900": GraduationCap,
    Lab: Laptop,
    Identity: ShieldCheck,
    AD: Server,
    Networking: Network,
    Windows: Laptop,
    Intune: ShieldCheck,
    Ticketing: ClipboardList,
    Documentation: FileText,
    Interview: MessageSquare,
    Applications: Target,
    Infrastructure: Server,
    Security: ShieldCheck,
    Review: BookOpen,
    Troubleshooting: Wrench,
  };
  return map[type] || Clock;
}

function Card({ className = "", children }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function Button({ className = "", variant = "default", size = "default", ...props }) {
  const variants = {
    default: "bg-blue-700 text-white hover:bg-blue-800 border-transparent",
    outline:
      "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
    destructive: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
  };
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-xl border font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    />
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
      {children}
    </span>
  );
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [category, setCategory] = useState("All");
  const [done, setDone] = useState(loadProgress);
  const [lastUpdated, setLastUpdated] = useState(loadLastUpdated);
  const [search, setSearch] = useState("");
  const importInputRef = useRef(null);

  const day = days.find((d) => d.day === selectedDay);

  const allTasks = useMemo(
    () =>
      days.flatMap((d) =>
        d.blocks.map((b, i) => ({
          day: d.day,
          phase: d.phase,
          idx: i,
          time: b[0],
          title: b[1],
          task: b[2],
          link: b[3],
          type: b[4],
        }))
      ),
    []
  );

  const filteredTasks = allTasks.filter(
    (t) =>
      (category === "All" || t.type === category) &&
      (!search ||
        [t.title, t.task, t.phase, t.type]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()))
  );

  const completedBlocks = Object.values(done).filter(Boolean).length;
  const totalBlocks = allTasks.length;
  const remainingBlocks = totalBlocks - completedBlocks;
  const progress = Math.round((completedBlocks / totalBlocks) * 100);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
      const now = new Date().toISOString();
      localStorage.setItem(UPDATED_KEY, now);
      setLastUpdated(now);
    } catch {
      // localStorage unavailable or quota exceeded
    }
  }, [done]);

  function toggle(key) {
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function goToToday() {
    for (const d of days) {
      const hasIncomplete = d.blocks.some((_, i) => !done[`${d.day}-${i}`]);
      if (hasIncomplete) {
        setSelectedDay(d.day);
        return;
      }
    }
    setSelectedDay(30);
  }

  function handleExport() {
    const payload = {
      appName: APP_NAME,
      exportedAt: new Date().toISOString(),
      progress: done,
      completedCount: completedBlocks,
      totalTasks: totalBlocks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "it-speedrun-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (
          !data ||
          typeof data !== "object" ||
          data.progress === undefined ||
          typeof data.progress !== "object" ||
          Array.isArray(data.progress)
        ) {
          window.alert(
            "Invalid import file: expected a JSON object with a progress field."
          );
          return;
        }
        setDone(data.progress);
        window.alert("Progress imported successfully!");
      } catch {
        window.alert("Invalid import file: could not parse JSON.");
      }
    };
    reader.onerror = () => {
      window.alert("Could not read the selected file.");
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function handleReset() {
    if (
      !window.confirm(
        "Reset all progress? This will clear every completed block and cannot be undone."
      )
    ) {
      return;
    }
    setDone({});
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(UPDATED_KEY);
    } catch {
      // ignore
    }
    setLastUpdated(null);
  }

  const lastUpdatedLabel = formatLastUpdated(lastUpdated);

  if (!day) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
                <CalendarDays className="h-4 w-4" /> {APP_NAME}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Hour-by-hour roadmap for school/MSP IT interviews
              </h1>
              <p className="mt-4 max-w-3xl text-slate-600 text-base md:text-lg">
                Exact daily blocks, official sources, lab tasks, ticket
                simulations, documentation deliverables, and interview drills.
                Designed for Microsoft 365, Active Directory, networking basics,
                Intune, troubleshooting and school IT readiness.
              </p>
            </div>
            <Card className="rounded-2xl bg-slate-900 text-white border-0 md:w-80">
              <CardContent className="p-5">
                <div className="text-sm text-slate-300">Total progress</div>
                <div className="mt-1 text-4xl font-bold">{progress}%</div>
                <div className="mt-3 h-2 rounded-full bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-white transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-300">
                  {completedBlocks} of {totalBlocks} blocks completed. Progress
                  saves automatically in this browser.
                </p>
                {lastUpdatedLabel && (
                  <p className="mt-2 text-xs text-slate-400">
                    Last updated: {lastUpdatedLabel}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-slate-800 p-2">
                    <div className="font-bold text-white">{completedBlocks}</div>
                    <div className="text-slate-400">Done</div>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-2">
                    <div className="font-bold text-white">{remainingBlocks}</div>
                    <div className="text-slate-400">Left</div>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-2">
                    <div className="font-bold text-white">{totalBlocks}</div>
                    <div className="text-slate-400">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={goToToday}>
              <Sparkles className="mr-2 h-4 w-4" />
              Go to Today&apos;s Suggested Day
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Progress
            </Button>
            <Button
              variant="outline"
              onClick={() => importInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Progress
            </Button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImport}
            />
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Reset Progress
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm text-slate-500">Daily load</div>
              <div className="text-2xl font-bold">5–6 hrs</div>
              <p className="text-xs text-slate-500 mt-1">
                Deep work blocks + breaks
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm text-slate-500">Primary cert</div>
              <div className="text-2xl font-bold">MS-900</div>
              <p className="text-xs text-slate-500 mt-1">
                Book around day 28–35
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm text-slate-500">Proof output</div>
              <div className="text-2xl font-bold">SOP Pack</div>
              <p className="text-xs text-slate-500 mt-1">
                Tickets + lab evidence
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm text-slate-500">Target jobs</div>
              <div className="text-2xl font-bold">School/MSP</div>
              <p className="text-xs text-slate-500 mt-1">
                L1/L1.5/sysadmin stretch
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <Filter className="h-5 w-5" /> Day selector
            </div>
            <div className="grid grid-cols-5 gap-2 md:grid-cols-10 lg:grid-cols-15">
              {days.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedDay(d.day)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    selectedDay === d.day
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-3xl shadow-sm overflow-hidden">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-blue-700">
                      Day {day.day} — {day.phase}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mt-1">
                      {day.focus}
                    </h2>
                  </div>
                  <Badge>{day.blocks.length} blocks</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {day.blocks.map((b, i) => {
                    const key = `${day.day}-${i}`;
                    const Icon = typeIcon(b[4]);
                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-slate-200 bg-white p-4 flex gap-3"
                      >
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          className="mt-1 shrink-0"
                          aria-label={
                            done[key] ? "Mark incomplete" : "Mark complete"
                          }
                        >
                          {done[key] ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-slate-300" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                              {b[0]}
                            </span>
                            <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 flex items-center gap-1">
                              <Icon className="h-3 w-3" /> {b[4]}
                            </span>
                          </div>
                          <div className="mt-2 font-bold text-lg">{b[1]}</div>
                          <p className="mt-1 text-sm text-slate-600">{b[2]}</p>
                          {b[3] && (
                            <a
                              href={b[3]}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50 transition"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open source
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="rounded-3xl shadow-sm sticky top-4">
              <CardContent className="p-5 md:p-6">
                <div className="font-bold text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-700" /> Find tasks
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search MFA, DNS, tickets..."
                  className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="mt-4 max-h-96 overflow-auto space-y-2 pr-1">
                  {filteredTasks.slice(0, 50).map((t) => {
                    const key = `${t.day}-${t.idx}`;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedDay(t.day)}
                        className="w-full text-left rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
                      >
                        <div className="text-xs font-semibold text-blue-700">
                          Day {t.day} · {t.time} · {t.type}
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          {t.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm bg-slate-900 text-white border-0">
              <CardContent className="p-5 md:p-6">
                <div className="font-bold text-lg">Rules for the speedrun</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-200 list-disc pl-5">
                  <li>Do the lab immediately after the lecture.</li>
                  <li>
                    Every day produces written proof: SOP, ticket, map, or mock
                    answer.
                  </li>
                  <li>
                    Don&apos;t binge passively. Pause, perform, document,
                    explain.
                  </li>
                  <li>
                    Apply to jobs while learning. Do not wait to feel ready.
                  </li>
                  <li>
                    Never claim production experience you do not have. Say
                    &quot;lab exposure&quot; or &quot;working knowledge.&quot;
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-5 md:p-6">
                <div className="font-bold text-lg">Final evidence pack</div>
                <p className="text-sm text-slate-600 mt-2">
                  By Day 30 you should have:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                  <li>20+ realistic ticket notes</li>
                  <li>
                    6 SOPs: onboarding, offboarding, MFA, Wi-Fi, printer, AV
                  </li>
                  <li>M365/Entra lab screenshots</li>
                  <li>Networking command screenshots</li>
                  <li>40 interview answers</li>
                  <li>MS-900 scheduled or passed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
