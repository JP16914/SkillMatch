'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart3,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  Target,
  Calendar,
  ChevronRight,
  Bell,
  Users
} from 'lucide-react';
import api from '@/lib/api';

const STAGES = [
  { id: 'SAVED', label: 'Saved', color: 'bg-slate-200 text-slate-600', icon: Clock },
  { id: 'APPLIED', label: 'Applied', color: 'bg-blue-100 text-blue-600', icon: Briefcase },
  { id: 'INTERVIEW', label: 'Interview', color: 'bg-amber-100 text-amber-600', icon: Calendar },
  { id: 'OFFER', label: 'Offer', color: 'bg-green-100 text-green-600', icon: CheckCircle2 },
  { id: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-600', icon: XCircle },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex max-w-[1700px] mx-auto min-h-[calc(100vh-100px)] gap-10 p-6 md:p-10">

      {/* 1. Left Sidebar: Navigation & Profile (Custom for Dashboard) */}
      <aside className="hidden xl:flex flex-col w-72 gap-8 sticky top-32 h-fit">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100 space-y-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary-500 to-blue-600 p-1 shadow-xl">
              <div className="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center text-4xl font-black text-primary-600 italic">
                {user.email[0].toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{user.email.split('@')[0]}</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Free Member</p>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          <div className="space-y-2">
            {[
              { label: 'Overview', icon: LayoutDashboard, active: true },
              { label: 'My Applications', icon: Briefcase },
              { label: 'Resume Lab', icon: FileText },
              { label: 'Insights', icon: BarChart3 },
            ].map((item, i) => (
              <button key={i} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${item.active ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4">
          <p className="font-black text-lg leading-tight uppercase tracking-tighter italic">Go Pro for Unlimited Matching</p>
          <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-primary-50 transition-colors">Upgrade Now</button>
        </div>
      </aside>

      {/* 2. Main Content: Feed-style Job Pipeline */}
      <main className="flex-1 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Your Pipeline</h1>
            <p className="text-slate-500 font-medium">Tracking {jobs.length} active applications</p>
          </div>
          <button className="flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary-600/30 transition-all active:scale-95">
            <Plus size={22} />
            <span>Post New Job</span>
          </button>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
          {STAGES.map((stage) => {
            const stageJobs = jobs.filter(j => j.stage === stage.id);
            return (
              <div key={stage.id} className="flex-shrink-0 w-[400px] flex flex-col gap-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className={`${stage.color} p-2.5 rounded-2xl shadow-sm`}>
                      <stage.icon size={20} />
                    </div>
                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{stage.label}</h3>
                  </div>
                  <span className="text-sm font-black text-slate-400 bg-white shadow-soft px-3 py-1 rounded-xl">
                    {stageJobs.length}
                  </span>
                </div>

                <div className="space-y-6">
                  {stageJobs.length > 0 ? (
                    stageJobs.map((job) => (
                      <div key={job.id} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-premium hover:border-primary-300 hover:shadow-2xl transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                              {job.company[0]}
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-primary-600 transition-colors">{job.company}</h4>
                              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{job.title}</p>
                            </div>
                          </div>
                          <button className="text-slate-300 hover:text-slate-600 bg-slate-50 p-2 rounded-xl">
                            <MoreVertical size={20} />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-emerald-100">
                            <Target size={14} /> 94% Match
                          </span>
                          <span className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-slate-100">
                            <Clock size={14} /> 2 days left
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                            ))}
                          </div>
                          <button className="text-primary-600 font-black text-sm flex items-center gap-1 group/btn px-4 py-2 hover:bg-primary-50 rounded-xl transition-all">
                            View details <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-52 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                      <p className="text-slate-300 font-black uppercase text-xs tracking-widest">Drop items here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 3. Right Panel: Insights & Social Stats */}
      <aside className="hidden 2xl:flex flex-col w-96 gap-8 sticky top-32 h-fit">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Activity</h3>
            <span className="text-xs font-black text-primary-600 py-1 px-3 bg-primary-50 rounded-full">LIVE</span>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Job Matches', value: '42', color: 'text-blue-600', icon: Target },
              { label: 'Pending OA', value: '12', color: 'text-amber-600', icon: Clock },
              { label: 'Total Views', value: '1.2k', color: 'text-purple-600', icon: Users },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-[0.8rem] flex items-center justify-center">
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <span className="font-bold text-slate-500 text-sm tracking-tight">{stat.label}</span>
                </div>
                <span className="text-lg font-black text-slate-900">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
            <p className="text-sm font-black text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              Rising Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'PyTorch', 'AWS', 'Zustand'].map(chip => (
                <span key={chip} className="text-[10px] font-black bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-soft text-slate-600">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-10 rounded-[2.5rem] text-white shadow-premium">
          <h3 className="text-2xl font-black mb-4 leading-none tracking-tighter">Career Coach AI</h3>
          <p className="text-primary-50 font-medium mb-8">Get personalized feedback on your pipeline velocity.</p>
          <button className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-black text-sm hover:bg-white/20 transition-all">Start Chat</button>
        </div>
      </aside>
    </div>
  );
}
