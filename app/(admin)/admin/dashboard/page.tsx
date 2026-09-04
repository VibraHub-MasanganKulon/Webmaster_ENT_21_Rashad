// app/(admin)/admin/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang kembali di panel administrasi</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Berita', value: '1,234', change: '+12%', color: 'blue' },
          { label: 'Total Views', value: '45.6K', change: '+8%', color: 'green' },
          { label: 'Total Clicks', value: '12.3K', change: '+15%', color: 'purple' },
          { label: 'Avg. CTR', value: '27%', change: '+3%', color: 'orange' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}