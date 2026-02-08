'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, Github, Chrome, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Auth Section */}
      <div className="flex items-center justify-center p-8 bg-white/40 backdrop-blur-xl">
        <div className="max-w-md w-full space-y-10">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black shadow-premium">S</div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Sign into SkillMatch</h1>
            <p className="text-slate-500 font-medium text-lg">Your professional journey starts here.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between mb-2 ml-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <Link href="#" className="text-primary-600 text-xs font-black">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700">Remember me</span>
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-xl shadow-primary-600/30 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
            </button>

            <div className="relative flex items-center gap-4 text-slate-400 text-xs font-black uppercase tracking-widest">
              <div className="flex-1 h-px bg-slate-100"></div>
              Or
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <button type="button" className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors">
              <Github size={20} /> Continue with GitHub
            </button>
          </form>

          <p className="text-center font-bold text-slate-500">
            New here? <Link href="/auth/register" className="text-primary-600 hover:underline hover:underline-offset-4">Join the community</Link>
          </p>
        </div>
      </div>

      {/* Right: Community Preview Section */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary-600/30 rounded-full blur-[120px]"></div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-black">Live Community Feed</h3>
            <p className="text-slate-400 font-medium">See what other SkillMatchers are achieving</p>
          </div>

          <div className="space-y-6 max-w-lg">
            {/* Fake Feed Card 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl space-y-4 translate-x-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500"></div>
                <div>
                  <p className="text-sm font-black">Alex Rivera</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">2m ago • Software Engineer</p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed">Just received an offer from Vercel! SkillMatch's score engine helped me tailor my resume perfectly. 🚀</p>
            </div>

            {/* Fake Feed Card 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl space-y-4 -translate-x-4 animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-400 to-blue-500"></div>
                <div>
                  <p className="text-sm font-black">Sarah Chen</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">15m ago • UI Designer</p>
                </div>
              </div>
              <div className="flex gap-2">
                {['#React', '#Tailwind'].map(tag => (
                  <span key={tag} className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-lg">{tag}</span>
                ))}
              </div>
            </div>

            {/* Trending Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-600/20 border border-primary-500/30 p-4 rounded-3xl flex items-center gap-4">
                <TrendingUp size={24} className="text-primary-400" />
                <div>
                  <p className="text-lg font-black tracking-tight">842</p>
                  <p className="text-[10px] text-primary-300 font-black uppercase">Offers this week</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4">
                <Users size={24} className="text-slate-400" />
                <div>
                  <p className="text-lg font-black tracking-tight">12.5k</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase">Active Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
