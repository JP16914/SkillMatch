import { LayoutDashboard, Briefcase, FileText, PieChart, Bell } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="text-2xl font-bold text-primary-600 mb-10">SkillMatch</div>
        <nav className="space-y-4">
          <a href="#" className="flex items-center space-x-3 text-primary-600 font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-primary-600">
            <Briefcase size={20} />
            <span>Jobs</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-primary-600">
            <FileText size={20} />
            <span>Resumes</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-primary-600">
            <PieChart size={20} />
            <span>Analytics</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">Application Pipeline</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell size={24} />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Pipeline Columns */}
        <div className="grid grid-cols-5 gap-6">
          {['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'].map((stage) => (
            <div key={stage} className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
              <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">{stage}</h2>
              <div className="space-y-4">
                {/* Sample Card */}
                {stage === 'SAVED' && (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-xs font-medium text-primary-600 mb-1">Google</div>
                    <div className="font-bold text-gray-900 mb-2">Senior Software Engineer</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">92% Match</span>
                      <span className="text-xs text-gray-400">2d ago</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
