'use client';

import { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  ShieldCheck,
  ArrowUpCircle,
  MoreHorizontal,
  LayoutDashboard,
  Briefcase,
  BarChart3
} from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import ReviewModal from '@/components/ReviewModal';

export default function ResumePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchResumes();
  }, [router]);

  const fetchResumes = async () => {
    try {
      // Mocking or fetching from API if exists. Let's assume we want to show a list.
      // const { data } = await api.get('/resumes');
      // setResumes(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch resumes');
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setParsing(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Call parse-resume endpoint
      const { data } = await api.post('/profile/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Check for scanned PDF error
      if (data.error === 'scanned_pdf') {
        setStatus({ type: 'error', msg: data.message });
        setFile(null);
        return;
      }

      // Show review modal with parsed data
      setParsedData(data);
      setShowReviewModal(true);
      setParsing(false);
    } catch (err: any) {
      console.error('Parse error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to parse resume. Please try a different PDF.';
      setStatus({ type: 'error', msg: errorMsg });
      setFile(null);
    } finally {
      setUploading(false);
      setParsing(false);
    }
  };

  const handleSaveProfile = async (profileData: any) => {
    try {
      await api.put('/profile', profileData);
      setStatus({ type: 'success', msg: 'Profile updated successfully!' });
      setFile(null);
      setParsedData(null);
      fetchResumes();
    } catch (err) {
      console.error('Error saving profile:', err);
      setStatus({ type: 'error', msg: 'Failed to save profile. Please try again.' });
    }
  };

  if (!user) return null;

  return (
    <div className="flex max-w-[1400px] mx-auto min-h-[calc(100vh-100px)] gap-10 p-6 md:p-10">

      {/* 1. Left Sidebar Navigation */}
      <aside className="hidden xl:flex flex-col w-72 gap-6 sticky top-32 h-fit">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100 space-y-2">
          {[
            { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
            { label: 'Applications', icon: Briefcase, href: '/jobs' },
            { label: 'Resume Lab', icon: FileText, active: true, href: '/resumes' },
            { label: 'Analytics', icon: BarChart3, href: '/analytics' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.href || '#')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all ${item.active ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-primary-50 p-6 rounded-[2rem] border border-primary-100">
          <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center text-primary-600 shadow-sm mb-4">
            <ShieldCheck size={20} />
          </div>
          <p className="text-primary-900 font-black text-sm tracking-tight mb-1">Privacy Focused</p>
          <p className="text-primary-600 text-xs font-medium leading-relaxed">Your resumes are encrypted and only visible to you.</p>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Resume Lab</h1>
          <p className="text-slate-500 font-medium">Manage and optimize your professional profiles.</p>
        </div>

        {/* Upload Zone */}
        <section className="bg-white p-2 rounded-[3rem] shadow-premium border border-slate-100">
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 transition-all hover:bg-white hover:border-primary-300">
            {!file ? (
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-primary-600/20 animate-bounce cursor-pointer">
                  <ArrowUpCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Upload New Resume</h3>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto">Drag and drop your PDF here, or click to browse from your device.</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  id="resume-upload"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="resume-upload"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 cursor-pointer shadow-lg"
                >
                  Select PDF
                </label>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Supports PDF only (Max 10MB)</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-500 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                  <FileText size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight truncate max-w-sm">{file.name}</h3>
                  <p className="text-emerald-600 text-xs font-black uppercase tracking-widest">Ready to process</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary-600/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        {parsing ? 'Parsing Resume...' : 'Uploading...'}
                      </>
                    ) : (
                      'Parse & Review'
                    )}
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    className="bg-white border border-slate-200 text-slate-400 px-10 py-4 rounded-2xl font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Status Toast Simulation */}
        {status && (
          <div className={`p-6 rounded-3xl flex items-center gap-4 border animate-in slide-in-from-top-4 duration-300 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
            <div className={`p-2 rounded-xl ${status.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <p className="font-bold text-sm tracking-tight">{status.msg}</p>
          </div>
        )}

        {/* Resumes List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Your Library</h2>
            <div className="flex gap-2">
              <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-lg uppercase">3 Total</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mock Card 1 */}
            <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium hover:border-primary-300 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center font-black">
                  <FileText size={24} />
                </div>
                <div className="flex gap-2">
                  <span className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Main</span>
                  <button className="text-slate-300 hover:text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-1 mb-8">
                <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none truncate">Software_Engineer_2024.pdf</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Updated 2 days ago</p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <Eye size={18} />
                  </button>
                  <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <button className="bg-slate-50 text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors">Select for Scan</button>
              </div>
            </div>

            {/* Mock Card 2 */}
            <div className="group bg-white/60 p-8 rounded-[2.5rem] border border-slate-100 shadow-premium hover:border-primary-300 transition-all">
              <div className="flex items-start justify-between mb-8 opacity-50">
                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black">
                  <FileText size={24} />
                </div>
                <button className="text-slate-300 hover:text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="space-y-1 mb-8 opacity-50">
                <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none truncate">UI_Designer_V2.pdf</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Updated 1 week ago</p>
              </div>
              <div className="flex items-center justify-center h-10 border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-[10px] font-black text-slate-300 uppercase">Archived</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Right Sidebar Hints */}
      <aside className="hidden 2xl:flex flex-col w-80 gap-8 sticky top-32 h-fit">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl"></div>
          <h3 className="text-2xl font-black tracking-tighter italic">Optimization Tips</h3>
          <ul className="space-y-6">
            {[
              'Use quantified results (e.g., +20% Revenue)',
              'Include keywords from Job Description',
              'Keep it under 1-2 pages for best ATS scan'
            ].map((tip, i) => (
              <li key={i} className="flex gap-4">
                <span className="text-primary-400 font-black">0{i + 1}.</span>
                <p className="text-sm font-medium leading-relaxed text-slate-300">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Review Modal */}
      {showReviewModal && parsedData && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setParsedData(null);
            setFile(null);
          }}
          parsedData={parsedData}
          onSave={handleSaveProfile}
        />
      )}

    </div>
  );
}
