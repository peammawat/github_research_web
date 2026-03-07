'use client';

import React, { useState } from 'react';
import { Search, Github, Star, Calendar, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [minStars, setMinStars] = useState('100');
  const [limit, setLimit] = useState('20');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ repos: any[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: language || undefined,
          limit: parseInt(limit),
          minStars: parseInt(minStars)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            <Github className="w-12 h-12 text-slate-100" />
            GitHub Search
          </h1>
          <p className="text-slate-400 text-lg">ค้นหา open-source repository ที่คุณต้องการได้ทันใจ</p>
        </div>

        {/* Search Form */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl p-6 mb-10">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="ค้นหาโปรเจกต์ เช่น React, Tailwind CSS, Machine Learning..."
                  className="w-full pl-12 pr-4 py-4 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 transition-all shadow-inner"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !query}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    กำลังค้นหา...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    ค้นหา GitHub
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-400">ภาษา (Language)</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-200 cursor-pointer"
                >
                  <option value="">ทั้งหมด</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="PHP">PHP</option>
                  <option value="Java">Java</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-400">ดาวขั้นต่ำ (Min Stars)</label>
                <input
                  type="number"
                  value={minStars}
                  onChange={(e) => setMinStars(e.target.value)}
                  className="w-full p-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-200 shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-400">จำนวนผลลัพธ์</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  min="1"
                  max="100"
                  className="w-full p-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-200 shadow-inner"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-300 p-4 rounded-xl mb-10 flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-slate-800 pb-4">
              <Github className="w-7 h-7" />
              ผลการค้นหา ({results.repos.length})
            </h2>
            
            {results.repos.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-800">
                <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">ไม่พบ Repository ที่คุณกำลังมองหา</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.repos.map((repo: any, index: number) => (
                  <div key={index} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all group flex flex-col h-full shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold text-lg hover:text-blue-300 transition-colors truncate pr-2 group-hover:underline">
                        {repo.fullName}
                      </a>
                      <ExternalLink className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
                    </div>
                    
                    <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {repo.description || 'ไม่มีคำอธิบายสำหรับโปรเจกต์นี้'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold mt-auto pt-4 border-t border-slate-800/50">
                      <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-2.5 py-1.5 rounded-lg border border-yellow-400/20">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {repo.stars.toLocaleString()}
                      </span>
                      
                      {repo.language && (
                        <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1.5 rounded-lg border border-blue-500/20">
                          {repo.language}
                        </span>
                      )}
                      
                      <span className="flex items-center gap-1.5 text-slate-500 ml-auto">
                        <Calendar className="w-3.5 h-3.5" />
                        {repo.lastUpdate ? new Date(repo.lastUpdate).toLocaleDateString('th-TH') : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
