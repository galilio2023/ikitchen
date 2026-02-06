"use client";

import { useState } from "react";
import { Database } from "lucide-react";

interface EmptyDashboardProps {
  error?: string | null;
}

export default function EmptyDashboard({ error }: EmptyDashboardProps) {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        // Simple UX: reload to fetch newly created projects
        window.location.reload();
      } else if (json && json.error) {
        console.error("SEED_FAILURE", json);
        alert(`Seed failed: ${json.error}`);
      } else {
        console.error("SEED_FAILURE_UNKNOWN", res.status);
        alert("Seed failed: unknown error");
      }
    } catch (err) {
      console.error("SEED_FAILURE", err);
      alert("Seed failed: network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-64 flex flex-col items-center justify-center text-center space-y-6 bg-card/30 rounded-xl border border-border/30">
      <div className="space-y-4 flex flex-col items-center">
        <div className="p-4 rounded-full bg-accent/20 border border-border text-foreground/30">
          <Database size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-foreground font-bold">
            No Active Projects Found
          </h3>
          <p className="text-sm text-foreground/60">
            {error
              ? `Error: ${error}`
              : "No projects established in dashboard."}
          </p>
        </div>
      </div>

      <button
        onClick={handleSeed}
        disabled={loading}
        className="px-8 py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 transition-all"
      >
        {loading ? "Seeding..." : "Create Sample Projects"}
      </button>
    </div>
  );
}
