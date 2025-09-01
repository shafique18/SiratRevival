// frontend/src/pages/Hadith.js
import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/layout/Layout";

const PAGE_SIZE = 20;

export default function Hadith() {
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [language, setLanguage] = useState("en");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [totalEstimate, setTotalEstimate] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch helper
  const fetchJSON = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  // Load sources and categories once
  useEffect(() => {
    (async () => {
      const sourcesData = await fetchJSON("http://localhost:8000/content/hadiths/sources");
      setSources(sourcesData);

      const categoriesData = await fetchJSON("http://localhost:8000/content/hadiths/categories");
      setCategories(categoriesData);
    })();
  }, []);

  // Build query string for Hadith API
  const buildParams = useCallback(() => {
    const p = new URLSearchParams();
    p.set("page", page);
    p.set("page_size", PAGE_SIZE);
    p.set("language", language);
    if (source) p.set("source", source);
    if (category) p.set("category", category);
    if (q.trim()) p.set("q", q.trim());
    return p.toString();
  }, [page, source, category, q, language]);

  // Load Hadiths from backend
  const loadData = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const params = buildParams();
      const url = `http://localhost:8000/content/hadiths?${params}`;
      const data = await fetchJSON(url);

      setItems(prev => reset ? data.items || [] : [...prev, ...(data.items || [])]);
      setTotalLoaded(prev => reset ? (data.items?.length || 0) : prev + (data.items?.length || 0));
      setTotalEstimate(data.total_estimate || 0);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [source, category, q, language]);

  // Load data whenever page or filters change
  useEffect(() => {
    loadData(page === 1);
  }, [loadData, page]);

  const canLoadMore = totalLoaded < totalEstimate;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Hadith Library</h1>
            <p className="text-sm text-gray-600">
              Search and browse hadith by source, category, and language.
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="ur">Urdu</option>
            </select>
            <button
              onClick={() => { setQ(""); setCategory(""); setSource(""); setPage(1); }}
              className="px-3 py-2 rounded-lg border"
            >
              Reset
            </button>
          </div>
        </header>

        {/* Filters */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by text, chapter, book…"
              className="w-full border rounded-lg px-3 py-2"
            />
            <button
              onClick={() => { setPage(1); loadData(true); }}
              className="px-3 py-2 rounded-lg border"
            >
              Search
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            >
              <option value="">All Sources</option>
              {sources.map(s => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Category buttons */}
        <section className="overflow-x-auto">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat === category ? "" : cat); setPage(1); }}
                className={`px-3 py-2 rounded-full border whitespace-nowrap ${cat === category ? "bg-gray-100" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Hadith list */}
        <section className="space-y-4">
          {items.length === 0 && !loading && (
            <div className="text-gray-600">No hadith found for your filters.</div>
          )}

          {items.map(h => (
            <article key={h.id} className="border rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{h.book || h.source?.replaceAll("-", " ")}</span>
                  {h.chapter && <> · <span>{h.chapter}</span></>}
                  {h.number && <> · <span>#{h.number}</span></>}
                </div>
                {h.category && (
                  <span className="text-xs border rounded-full px-2 py-1">{h.category}</span>
                )}
              </div>

              <div className={`mt-3 leading-relaxed ${language === "ar" ? "text-right" : ""}`}>
                {h.text}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Available languages: {h.available_languages.join(", ")}
              </div>
            </article>
          ))}

          {canLoadMore && (
            <div className="flex justify-center">
              <button
                disabled={loading}
                onClick={() => setPage(prev => prev + 1)}
                className="px-4 py-2 rounded-lg border"
              >
                {loading ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
