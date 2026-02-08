'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, LogOut, User, Bell, ChevronDown, Zap, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (pathname.startsWith('/auth')) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3' : 'bg-transparent py-5'
      }`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center h-10">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-600/20 group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">SkillMatch</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {[
                { label: 'Dashboard', href: '/', icon: LayoutDashboard },
                { label: 'Marketplace', href: '/marketplace', icon: Zap },
                { label: 'Resumes', href: '/resumes', icon: FileText },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === link.href
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

            {user && (
              <div className="flex items-center gap-3 pl-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {user.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">Regular Member</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-blue-600 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-primary-600 font-bold overflow-hidden">
                    <User size={20} />
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
