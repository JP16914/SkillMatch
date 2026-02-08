'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  Bookmark,
  Send,
  ExternalLink,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Globe,
  Building2,
  Zap,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (params: any = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/marketplace/jobs', { params });
      setJobs(data.jobs);
    } catch (err) {
      console.error('Failed to fetch marketplace jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      await api.post(`/marketplace/jobs/${jobId}/apply`);
      setStatus({ type: 'success', msg: 'Application submitted! Check your dashboard.' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to apply' });
    } finally {
      setApplying(null);
    }
  };

  const handleSave = async (jobId: string) => {
    try {
      await api.post(`/marketplace/jobs/${jobId}/save`);
      setStatus({ type: 'success', msg: 'Job saved to favorites.' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Failed to save job');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <Zap size={14} className="fill-current" /> Fast Apply Available
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">Jobs Marketplace</h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">Browse 180+ curated roles from top tech companies. Find your next career move with AI matching.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search company, title, or skills..."
            className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-[2rem] shadow-premium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchJobs({ search: searchTerm })}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg">
          <Filter size={16} /> Filters
        </div>
        {['Remote', 'Full-time', 'Internship', 'New Grad', 'Senior'].map(label => (
          <button key={label} className="bg-white hover:bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 transition-all active:scale-95 shadow-soft">
            {label}
          </button>
        ))}
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <button className="text-primary-600 text-sm font-black hover:underline underline-offset-4" onClick={() => { setSearchTerm(''); fetchJobs(); }}>Clear all</button>
      </div>

      {/* Status Toast Simulation */}
      {status && (
        <div className={`fixed bottom-10 right-10 p-6 rounded-3xl shadow-2xl flex items-center gap-4 border animate-in slide-in-from-bottom-10 duration-300 z-50 ${status.type === 'success' ? 'bg-white border-emerald-100 text-emerald-700' : 'bg-white border-red-100 text-red-700'
          }`}>
          <div className={`p-2 rounded-xl ${status.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <p className="font-black text-sm tracking-tight">{status.type === 'success' ? 'Success!' : 'Error'}</p>
            <p className="text-xs font-medium text-slate-500">{status.msg}</p>
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-primary-600" size={48} />
          <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Scanning Marketplace...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
          {jobs.map((job) => (
            <div key={job.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-premium hover:shadow-2xl transition-all duration-300 flex flex-col p-8 hover:-translate-y-1">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 group-hover:bg-primary-50 transition-colors">
                    {job.company.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Building2 size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-primary-600 transition-colors">{job.company.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                      <MapPin size={12} /> {job.location} {job.remote && '• Remote'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSave(job.id)}
                  className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all"
                >
                  <Bookmark size={20} />
                </button>
              </div>

              {/* Card Body */}
              <div className="flex-1 space-y-4">
                <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter uppercase">{job.title}</h4>
                <p className="text-slate-500 text-sm line-clamp-3 font-medium leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-2 pt-4">
                  {job.skills.slice(0, 4).map((skill: string) => (
                    <span key={skill} className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-white group-hover:border-primary-100 transition-all">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && <span className="text-[10px] font-black text-slate-300 flex items-center">+{job.skills.length - 4} more</span>}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Just posted</span>
                </div>
                <div className="flex gap-3">
                  <button className="w-11 h-11 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all">
                    <ExternalLink size={20} />
                  </button>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={applying === job.id}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-primary-600/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {applying === job.id ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Quick Apply</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-center pb-20">
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-8 py-4 rounded-3xl font-black text-slate-900 hover:bg-slate-50 transition-all shadow-premium group">
          Load more opportunities <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
