'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Github, Star, Calendar, Loader2, AlertCircle, ExternalLink, Plus, Trash2, Users, CheckCircle2, XCircle, User, Code2, Layers } from 'lucide-react';

const TECH_STACKS = [
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Vue', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'NestJS', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Prisma', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'Firebase', category: 'Cloud' },
  { name: 'Supabase', category: 'Cloud' }
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [username, setUsername] = useState('');
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([]);
  const [language, setLanguage] = useState('');
  const [minStars, setMinStars] = useState('0');
  const [limit, setLimit] = useState('20');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ repos: any[] } | null>(null);
  
  const [activeUsers, setActiveUsers] = useState(1);
  const visitorId = useMemo(() => typeof window !== 'undefined' ? (localStorage.getItem('visitor_id') || Math.random().toString(36).substring(7)) : '', []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('visitor_id')) {
      localStorage.setItem('visitor_id', visitorId);
    }
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId })
        });
        const data = await res.json();
        setActiveUsers(data.count || 1);
      } catch (e) {
        console.error("Stats error", e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [visitorId]);

  const toggleStack = (stack: string) => {
    setSelectedStacks(prev => 
      prev.includes(stack) ? prev.filter(s => s !== stack) : [...prev, stack]
    );
  };

  const addDetail = () => setDetails([...details, '']);
  const updateDetail = (index: number, value: string) => {
    const newDetails = [...details];
    newDetails[index] = value;
    setDetails(newDetails);
  };
  const removeDetail = (index: number) => setDetails(details.filter((_, i) => i !== index));

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    // Combine main query with selected tech stacks for better GitHub results
    const fullQuery = [query, ...selectedStacks].join(' ');
    // Combine selected stacks with manual details for deep README check
    const checkDetails = [...selectedStacks, ...details.filter(d => d.trim())];

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: fullQuery,
          username: username || undefined,
          details: checkDetails,
          language: language || undefined,
          limit: parseInt(limit),
          minStars: parseInt(minStars)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
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
        
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-blue-400 text-sm font-medium animate-pulse">
            <Users className="w-4 h-4" />
            <span>Active Users: {activeUsers}</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            <Github className="w-12 h-12 text-slate-100" />
            GitHub Research Pro
          </h1>
          <p className="text-slate-400 text-lg">ค้นหาโปรเจกต์พร้อมระบบตรวจสอบ Tech Stack และรายละเอียดแบบเจาะลึก</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl p-6 mb-10">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-[2] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="ค้นหาโปรเจกต์หลัก เช่น Dashboard, E-commerce, Discord Bot..."
                  className="w-full pl-12 pr-4 py-4 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 transition-all shadow-inner"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex-grow relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="GitHub Username (ไม่บังคับ)"
                  className="w-full pl-12 pr-4 py-4 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 transition-all shadow-inner"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !query}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 whitespace-nowrap"
              >
                {isLoading ? <><Loader2 className="animate-spin w-5 h-5" /> กำลังประมวลผล...</> : <><Search className="w-5 h-5" /> ค้นหาและวิเคราะห์</>}
              </button>
            </div>

            {/* Tech Stack Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                <Code2 className="w-4 h-4 text-blue-400" />
                ระบุ Tech Stack ที่ต้องการ (จะทำการตรวจสอบใน README อัตโนมัติ)
              </div>
              <div className="flex flex-wrap gap-2">
                {TECH_STACKS.map((stack) => (
                  <button
                    key={stack.name}
                    type="button"
                    onClick={() => toggleStack(stack.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedStacks.includes(stack.name)
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20 scale-105'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {stack.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Details Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                  <Layers className="w-4 h-4 text-purple-400" />
                  รายละเอียดอื่นๆ ที่ต้องการตรวจสอบ
                </div>
                <button 
                  type="button"
                  onClick={addDetail}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" /> เพิ่มรายละเอียด
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {details.map((detail, index) => (
                  <div key={index} className="relative group animate-in slide-in-from-left-2 fade-in">
                    <input
                      type="text"
                      placeholder={`เช่น MIT License, PromptPay, SSR...`}
                      value={detail}
                      onChange={(e) => updateDetail(index, e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 border border-slate-700/50 rounded-xl bg-slate-800/30 text-slate-200 text-sm focus:ring-1 focus:ring-blue-500/50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeDetail(index)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/50">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-400">ภาษาหลัก (Primary Language)</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-200 cursor-pointer">
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
                <input type="number" value={minStars} onChange={(e) => setMinStars(e.target.value)} className="w-full p-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-400">จำนวนผลลัพธ์</label>
                <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} min="1" max="100" className="w-full p-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-800/50 text-slate-200" />
              </div>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-300 p-4 rounded-xl mb-10 flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-slate-800 pb-4">
              <Github className="w-7 h-7" />
              ผลการวิเคราะห์ Repository ({results.repos.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {results.repos.map((repo: any, index: number) => (
                <div key={index} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all group flex flex-col h-full shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold text-xl hover:text-blue-300 transition-colors truncate pr-2 group-hover:underline">
                      {repo.fullName}
                    </a>
                    <ExternalLink className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
                  </div>
                  
                  {repo.matchDetails && repo.matchDetails.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                      {repo.matchDetails.map((m: any, idx: number) => (
                        <div key={idx} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${m.found ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400 opacity-60'}`}>
                          {m.found ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {m.detail}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {repo.description || 'ไม่มีคำอธิบายสำหรับโปรเจกต์นี้'}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold mt-auto pt-4 border-t border-slate-800/50">
                    <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-2.5 py-1.5 rounded-lg border border-yellow-400/20">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {repo.stars.toLocaleString()}
                    </span>
                    {repo.language && <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1.5 rounded-lg border border-blue-500/20">{repo.language}</span>}
                    <span className="flex items-center gap-1.5 text-slate-500 ml-auto">
                      <Calendar className="w-3.5 h-3.5" />
                      {repo.lastUpdate ? new Date(repo.lastUpdate).toLocaleDateString('th-TH') : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
