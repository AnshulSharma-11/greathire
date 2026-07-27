import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useDashboardData() {
  const [data, setData] = useState({
    overview: null,
    snapshot: [],
    metrics: null,
    workforce: [],
    activity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/dashboard");
        if (cancelled) return;
        const { overview, snapshot, metrics, liveWorkforce, recentActivity } = res.data;
        setData({ overview, snapshot, metrics, workforce: liveWorkforce, activity: recentActivity });
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading, error };
}
