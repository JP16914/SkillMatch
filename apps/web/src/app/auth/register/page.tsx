'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, Github, Chrome, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
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
      const { data } = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-white/40 backdrop-blur-xl border-r border-slate-100">
        <div className="max-w-md w-full space-y-10">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black shadow-premium">S</div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Join SkillMatch</h1>
            <p className="text-slate-500 font-medium text-lg">Start tracking your career growth.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold animate-shake">{error}</div>}

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
                <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-xl shadow-primary-600/30 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
            </button>

            <button type="button" className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors">
              <Chrome size={20} className="text-red-500" /> Sign up with Google
            </button>
          </form>

          <p className="text-center font-bold text-slate-500">
            Already have an account? <Link href="/auth/login" className="text-primary-600 hover:underline hover:underline-offset-4">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center p-20 bg-primary-600 text-white relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <ShieldCheck size={18} className="text-primary-200" />
              <span className="text-xs font-black uppercase tracking-widest text-primary-50">Secure & Private</span>
            </div>
            <h3 className="text-5xl font-black leading-tight tracking-tighter">Your career data,<br />elevated.</h3>
            <p className="text-primary-100 text-xl font-medium max-w-md">Join thousands of professionals using AI-driven insights to land their dream roles.</p>
          </div>

          <div className="grid gap-6">
            {[
              { label: 'Smart Matching', desc: 'AI-powered scoring for every job' },
              { label: 'Real-time Alerts', desc: 'Never miss a deadline again' },
              { label: 'Privacy First', desc: 'Your data is encrypted and safe' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black">{i + 1}</div>
                <div>
                  <p className="text-lg font-black">{feature.label}</p>
                  <p className="text-primary-200 text-sm font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
