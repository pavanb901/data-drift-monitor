import { useState } from "react";
import api from "./api/backend";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend
} from "recharts";

// ---------- Shared config ----------

const healthStatusConfig = {
  safe: { label: "Safe", tone: "healthy" },
  good: { label: "Good", tone: "healthy" },
  monitor: { label: "Monitor", tone: "monitor" },
  retraining_suggested: { label: "Retraining suggested", tone: "critical" }
};

const toneStyles = {
  healthy: {
    badge: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    border: "border-emerald-500/80 ring-emerald-100"
  },
  monitor: {
    badge: "bg-amber-50 text-amber-800 ring-amber-100",
    border: "border-amber-500/80 ring-amber-100"
  },
  critical: {
    badge: "bg-rose-50 text-rose-800 ring-rose-100",
    border: "border-rose-500/80 ring-rose-100"
  },
  neutral: {
    badge: "bg-slate-100 text-slate-700 ring-slate-100",
    border: "border-slate-200 ring-slate-100"
  }
};

// ---------- Upload panel ----------

function UploadPanel({ onUpload }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [baseline, setBaseline] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!file || !name) {
      alert("Please provide dataset name and file");
      return;
    }

    try {
      setSubmitting(true);
      const form = new FormData();
      form.append("dataset_name", name);
      form.append("is_baseline", baseline);
      form.append("file", file);

      const res = await api.post("/datasets/upload", form);
      console.log("Upload response:", res.data);

      if (!baseline) {
        onUpload(res.data.dataset_id, name);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check backend logs for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearDatasets = async () => {
    await api.delete("/datasets/clear");
    alert("All datasets cleared");
  };

  return (
    <section
      id="overview"
      className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] items-start"
    >
      <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
              Dataset upload
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Ingest a new dataset snapshot or register a baseline profile.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            Step 1 · Upload
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
                Dataset name
              </label>
              <input
                className="block w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g. production_2026_01_snapshot"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                checked={baseline}
                onChange={(e) => setBaseline(e.target.checked)}
              />
              <span>Mark as baseline profile (no analysis triggered)</span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
                Dataset file
              </label>
              <input
                type="file"
                className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-sky-700 hover:file:bg-sky-100"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Uploading…" : "Upload & analyze"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-sky-50 via-emerald-50 to-indigo-50 px-4 py-4">
            <h3 className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
              Pipeline overview
            </h3>
            <ol className="mt-2 space-y-1.5 text-xs text-slate-700">
              <li>1. Upload baseline once to define “healthy” data.</li>
              <li>2. Upload production snapshots on a schedule.</li>
              <li>3. Monitor health, drift, and AI explanations below.</li>
            </ol>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm">

          <button
              type="button"
              onClick={clearDatasets}
              className="inline-flex w-full items-center justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear datasets
            </button>

        </div>
      </div>
    </section>
  );
}

// ---------- Section tabs ----------

function SectionTabs() {
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "drift-prioritization", label: "Drift" },
    { id: "distribution-analysis", label: "Distribution" },
    { id: "drift-timeline", label: "Timeline" },
    { id: "ai-insights", label: "AI Insights" }
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white/90">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-2 overflow-x-auto py-2">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs md:text-sm text-slate-600 shadow-sm hover:bg-sky-50 hover:text-sky-900 whitespace-nowrap"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- KPI overview ----------

function KpiCard({ title, value, subtitle, tone, accent }) {
  const t = toneStyles[tone] ?? toneStyles.neutral;

  return (
    <div
      className={`relative flex flex-col gap-1 overflow-hidden rounded-2xl border bg-white px-4 py-3 text-left shadow-sm ring-1 ${t.border}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
      />
      <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
        {title}
      </p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      )}
    </div>
  );
}

function OverviewKpis({ health, drift, explanation }) {
  if (!health || !drift || !explanation) {
    return (
      <section
        aria-label="Overview metrics"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
      >
        <h2 className="text-sm font-semibold text-slate-800">Overview</h2>
        <p className="mt-1 text-xs text-slate-500">
          Upload a dataset to see health scores, drift impact, and AI
          recommendations.
        </p>
      </section>
    );
  }

  const statusCfg =
    healthStatusConfig[health.status] ?? healthStatusConfig["monitor"];
  const tone = statusCfg.tone;

  const driftedFeatures = new Set(drift.map((d) => d.feature)).size;
  const highSeverityCount = drift.filter((d) => d.severity === "high").length;

  const recommendation =
    health.status === "good" || health.status === "safe"
      ? "Safe to continue"
      : health.status === "monitor"
      ? "Monitor closely"
      : "Consider retraining";

  return (
    <section
      aria-label="Overview metrics"
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
            Overview
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Current dataset vs baseline health, drift, and recommended action.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${toneStyles[tone].badge}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {statusCfg?.label || "Status unknown"}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard
          title="Data health score"
          value={health?.score ?? "--"}
          subtitle={health?.status}
          tone={tone}
          accent="from-emerald-400 via-emerald-500 to-emerald-600"
        />
        <KpiCard
          title="Drifted features"
          value={driftedFeatures}
          subtitle="features affected"
          tone={highSeverityCount > 0 ? "monitor" : "healthy"}
          accent="from-sky-400 via-sky-500 to-sky-600"
        />
        <KpiCard
          title="High severity drift"
          value={highSeverityCount}
          subtitle="critical issues"
          tone={highSeverityCount > 0 ? "critical" : "healthy"}
          accent="from-rose-400 via-rose-500 to-rose-600"
        />
        <KpiCard
          title="Recommendation"
          value={recommendation}
          subtitle="AI-assisted guidance"
          tone={tone}
          accent="from-amber-400 via-amber-500 to-amber-600"
        />
      </div>
    </section>
  );
}

// ---------- Drift prioritization ----------

const severityToValue = (severity) => {
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
};

const severityColor = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#ef4444"
};

function DriftScatterCard({ drift }) {
  if (!drift || drift.length === 0) {
    return (
      <section
        id="drift-prioritization"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
      >
        <h2 className="text-sm font-semibold text-slate-800">
          Feature drift prioritization
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Drift will be visualized once an analysis has completed.
        </p>
      </section>
    );
  }

  const featureMap = {};
  drift.forEach((d) => {
    if (!featureMap[d.feature]) {
      featureMap[d.feature] = {
        feature: d.feature,
        driftMagnitude: d.value ?? 0,
        severity: d.severity
      };
    } else {
      featureMap[d.feature].driftMagnitude = Math.max(
        featureMap[d.feature].driftMagnitude,
        d.value ?? 0
      );
      if (
        severityToValue(d.severity) >
        severityToValue(featureMap[d.feature].severity)
      ) {
        featureMap[d.feature].severity = d.severity;
      }
    }
  });

  const scatterData = Object.values(featureMap).map((f) => ({
    ...f,
    severityValue: severityToValue(f.severity)
  }));

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={severityColor[payload.severity]}
        stroke="#ffffff"
        strokeWidth={1.2}
      />
    );
  };

  return (
    <section
      id="drift-prioritization"
      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Feature drift prioritization
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Each point represents a feature sized by drift magnitude and colored
            by severity.
          </p>
        </div>
      </div>

      <div style={{ width: "100%", height: 340 }} className="mt-4">
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="driftMagnitude"
              name="Drift magnitude"
              tickLine={false}
              axisLine={{ stroke: "#cbd5f5" }}
              label={{
                value: "Drift magnitude",
                position: "insideBottom",
                offset: -4
              }}
            />
            <YAxis
              type="number"
              dataKey="severityValue"
              domain={[0.5, 3.5]}
              ticks={[1, 2, 3]}
              tickFormatter={(v) =>
                v === 1 ? "Low" : v === 2 ? "Medium" : "High"
              }
              tickLine={false}
              axisLine={{ stroke: "#cbd5f5" }}
              label={{
                value: "Severity",
                angle: -90,
                position: "insideLeft"
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow:
                  "0 10px 15px -3px rgba(15,23,42,0.15), 0 4px 6px -4px rgba(15,23,42,0.1)",
                fontSize: 12
              }}
              labelStyle={{ fontWeight: 600, color: "#0f172a" }}
              formatter={(value, name) => {
                if (name === "driftMagnitude") {
                  return [value.toFixed(3), "Drift magnitude"];
                }
                if (name === "severityValue") {
                  if (value === 1) return ["Low", "Severity"];
                  if (value === 2) return ["Medium", "Severity"];
                  if (value === 3) return ["High", "Severity"];
                }
                return [value, name];
              }}
              labelFormatter={(_, payload) =>
                payload && payload[0]
                  ? `Feature: ${payload[0].payload.feature}`
                  : ""
              }
            />
            <Scatter data={scatterData} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
        <span className="font-medium text-slate-600">Severity legend:</span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: severityColor.low }}
          />
          Low
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: severityColor.medium }}
          />
          Medium
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: severityColor.high }}
          />
          High
        </span>
      </div>
    </section>
  );
}

// ---------- Distribution comparison ----------

function DistributionCard({ baselineProfile, currentProfile }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const effectiveFeature =
    selectedFeature ??
    (currentProfile && currentProfile.length > 0
      ? currentProfile[0].feature_name
      : null);

  if (!baselineProfile || !currentProfile || !effectiveFeature) {
    return (
      <section
        id="distribution-analysis"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
      >
        <h2 className="text-sm font-semibold text-slate-800">
          Distribution comparison
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Once a baseline and current profile are available, you can inspect
          distributions per feature here.
        </p>
      </section>
    );
  }

  const base = baselineProfile.find(
    (f) => f.feature_name === effectiveFeature
  );
  const curr = currentProfile.find(
    (f) => f.feature_name === effectiveFeature
  );
  if (!base || !curr) {
    return null;
  }

  let chartData = [];

  if (curr.feature_type === "numerical") {
    const bins = curr.stats.histogram.bins;
    const currCounts = curr.stats.histogram.counts;
    const baseCounts = base.stats.histogram.counts;

    chartData = bins.slice(0, -1).map((_, i) => ({
      bin: `${Math.round(bins[i])}-${Math.round(bins[i + 1])}`,
      Baseline: baseCounts[i] || 0,
      Current: currCounts[i] || 0
    }));
  }

  if (curr.feature_type === "categorical") {
    const categories = new Set([
      ...Object.keys(base.stats.counts),
      ...Object.keys(curr.stats.counts)
    ]);

    chartData = Array.from(categories).map((cat) => ({
      bin: cat,
      Baseline: base.stats.counts[cat] || 0,
      Current: curr.stats.counts[cat] || 0
    }));
  }

  return (
    <section
      id="distribution-analysis"
      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Distribution comparison
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Baseline vs current value distributions for the selected feature.
          </p>
        </div>
        <select
          className="mt-1 inline-flex rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs md:text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          value={effectiveFeature}
          onChange={(e) => setSelectedFeature(e.target.value)}
        >
          {currentProfile.map((f) => (
            <option key={f.feature_name} value={f.feature_name}>
              {f.feature_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100%", height: 340 }} className="mt-3">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="bin"
              tickLine={false}
              axisLine={{ stroke: "#cbd5f5" }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#cbd5f5" }}
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft"
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow:
                  "0 10px 15px -3px rgba(15,23,42,0.15), 0 4px 6px -4px rgba(15,23,42,0.1)",
                fontSize: 12
              }}
              labelStyle={{ fontWeight: 600, color: "#0f172a" }}
            />
            <Legend />
            <Bar dataKey="Baseline" fill="#3b82f6" />
            <Bar dataKey="Current" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ---------- Drift over time ----------

function DriftTimelineCard({ driftHistory }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  if (!driftHistory || driftHistory.length === 0) {
    return (
      <section
        id="drift-timeline"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
      >
        <h2 className="text-sm font-semibold text-slate-800">
          Drift over time
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Time evolution of feature drift will appear after multiple dataset
          versions are analyzed.
        </p>
      </section>
    );
  }

  const features = Array.from(new Set(driftHistory.map((d) => d.feature)));
  const featureToShow = selectedFeature || features[0];

  const chartData = driftHistory
    .filter((d) => d.feature === featureToShow)
    .map((d) => ({
      version: d.version,
      drift: d.value
    }));

  const maxAbsDrift =
    chartData.length > 0
      ? Math.max(
          ...chartData.map((d) =>
            d.drift != null ? Math.abs(d.drift) : 0
          )
        )
      : 0;

  const dotRenderer = (props) => {
    const { cx, cy, value } = props;
    if (cx == null || cy == null) return null;

    let color = "#22c55e";
    if (maxAbsDrift > 0) {
      const ratio = Math.abs(value) / maxAbsDrift;
      if (ratio > 0.66) color = "#ef4444";
      else if (ratio > 0.33) color = "#eab308";
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={color}
        stroke="#ffffff"
        strokeWidth={1.2}
      />
    );
  };

  return (
    <section
      id="drift-timeline"
      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Drift over time
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Track how drift magnitude for a single feature evolves across
            dataset versions.
          </p>
        </div>
        <select
          className="mt-1 inline-flex rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs md:text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          value={featureToShow}
          onChange={(e) => setSelectedFeature(e.target.value)}
        >
          {features.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100%", height: 340 }} className="mt-3">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="version"
              tickLine={false}
              axisLine={{ stroke: "#cbd5f5" }}
              label={{
                value: "Dataset version",
                position: "insideBottom",
                offset: -4
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#cbd5f5" }}
              label={{
                value: "Drift magnitude",
                angle: -90,
                position: "insideLeft"
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow:
                  "0 10px 15px -3px rgba(15,23,42,0.15), 0 4px 6px -4px rgba(15,23,42,0.1)",
                fontSize: 12
              }}
              labelStyle={{ fontWeight: 600, color: "#0f172a" }}
              formatter={(value) => [value, "Drift magnitude"]}
              labelFormatter={(label) => `Version: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="drift"
              stroke="#0f766e"
              strokeWidth={2}
              dot={dotRenderer}
              activeDot={{ r: 5 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
        <span className="font-medium text-slate-600">
          Relative severity:
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Low
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Medium
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          High
        </span>
      </div>
    </section>
  );
}

// ---------- AI insights ----------

function InsightsCard({ explanation }) {
  if (!explanation) {
    return (
      <section
        id="ai-insights"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
      >
        <h2 className="text-sm font-semibold text-slate-800">
          AI-generated insights
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Once analysis has completed, AI will summarize key data quality risks
          and recommended actions here.
        </p>
      </section>
    );
  }

  return (
    <section
      id="ai-insights"
      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-800">
        AI-generated insights
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {explanation.explanation_text}
      </p>
    </section>
  );
}

// ---------- Header ----------

function AppHeader({ datasetName, health }) {
  const statusCfg = health && healthStatusConfig[health.status];
  const tone = statusCfg?.tone ?? "neutral";

  return (
    <header className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 text-slate-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">
            AI Data Quality & Drift Monitor
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200/80">
            <span className="font-medium">Dataset:</span>
            <span className="rounded-full border border-slate-500/60 bg-slate-900/40 px-2 py-0.5 text-[11px] font-medium">
              {datasetName || "No dataset selected"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {health && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full bg-slate-900/40 px-3 py-1 text-xs font-medium ring-1 ${toneStyles[tone].badge}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {statusCfg?.label || "Status unknown"}
            </span>
          )}
        </div>
      </div>
      <SectionTabs />
    </header>
  );
}

// ---------- App ----------

export default function App() {
  const [health, setHealth] = useState(null);
  const [drift, setDrift] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [datasetName, setDatasetName] = useState("");
  const [baselineProfile, setBaselineProfile] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [driftHistory, setDriftHistory] = useState(null);

  const runAnalysis = async (id, name) => {
    console.log("Running analysis for dataset:", id);

    const driftRes = await api.get(`/datasets/${id}/drift`);
    const healthRes = await api.get(`/datasets/${id}/health`);
    const expRes = await api.get(`/datasets/${id}/explanation`);

    const profileRes = await api.get(`/datasets/${id}/profile`);
    setCurrentProfile(profileRes.data);

    const baseProfileRes = await api.get(`/datasets/${id - 1}/profile`);
    setBaselineProfile(baseProfileRes.data);

    setDatasetName(name);
    if (name) {
      const historyRes = await api.get(`/datasets/${name}/drift-history`);
      setDriftHistory(historyRes.data);
    }

    setDrift(driftRes.data);
    setHealth(healthRes.data);
    setExplanation(expRes.data);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader datasetName={datasetName} health={health} />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <UploadPanel onUpload={runAnalysis} />

        <OverviewKpis
          health={health}
          drift={drift}
          explanation={explanation}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)]">
          <DriftScatterCard drift={drift} />
          <DistributionCard
            baselineProfile={baselineProfile}
            currentProfile={currentProfile}
          />
        </div>

        <DriftTimelineCard driftHistory={driftHistory} />

        <InsightsCard explanation={explanation} />
      </main>
    </div>
  );
}

