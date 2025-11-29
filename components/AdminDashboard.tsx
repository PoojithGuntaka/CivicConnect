import React, { useEffect, useState } from 'react';
import { Issue, SentimentReport } from '../types';
import { analyzeConstituentSentiment } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, TrendingUp, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { SimulatedMap } from './SimulatedMap';

interface Props {
  issues: Issue[];
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

export const AdminDashboard: React.FC<Props> = ({ issues }) => {
  const [sentiment, setSentiment] = useState<SentimentReport | null>(null);
  const [loadingSentiment, setLoadingSentiment] = useState(false);

  useEffect(() => {
    // Only fetch if we have issues and haven't fetched yet
    if (issues.length > 0 && !sentiment) {
      setLoadingSentiment(true);
      analyzeConstituentSentiment(issues).then(res => {
        setSentiment(res);
        setLoadingSentiment(false);
      });
    }
  }, [issues, sentiment]);

  const stats = {
    total: issues.length,
    submitted: issues.filter(i => i.status === 'submitted').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

  const pieData = [
    { name: 'Pending', value: stats.submitted },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Resolved', value: stats.resolved },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Executive Overview</h2>
        <p className="text-slate-500">District 4 Operational Dashboard</p>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><AlertCircle size={16}/> Pending Issues</div>
          <div className="text-2xl font-bold text-red-600">{stats.submitted}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><Loader2 size={16}/> In Progress</div>
          <div className="text-2xl font-bold text-amber-500">{stats.inProgress}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><CheckCircle size={16}/> Resolved</div>
          <div className="text-2xl font-bold text-emerald-600">{stats.resolved}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><MessageSquare size={16}/> Total Reports</div>
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GIS Map */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-lg mb-4">Live Incident Map (GIS)</h3>
          <SimulatedMap issues={issues} />
        </div>

        {/* AI Sentiment Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BotIcon /> AI Community Sentiment
            </h3>
            {loadingSentiment && <Loader2 className="animate-spin text-blue-500" />}
          </div>

          {sentiment ? (
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                   <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                     {sentiment.score}
                   </div>
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                     <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                     <path className={`${sentiment.score > 70 ? 'text-emerald-500' : sentiment.score > 40 ? 'text-amber-500' : 'text-red-500'}`} strokeDasharray={`${sentiment.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                   </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500 uppercase font-semibold tracking-wider">Overall Mood</div>
                  <div className="text-xl font-medium capitalize">{sentiment.overallSentiment}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 italic">
                "{sentiment.summary}"
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Top Concerns</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sentiment.keyThemes.map((theme, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
             <div className="flex-1 flex items-center justify-center text-slate-400">
               Waiting for analysis...
             </div>
          )}
        </div>
      </div>
      
       {/* Charts Row */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
            <h3 className="font-semibold text-lg mb-4">Issue Status Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
         </div>
         
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Recent Priority Issues</h3>
            <div className="space-y-3">
              {issues.slice(0, 5).map(issue => (
                <div key={issue.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-slate-50">
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{issue.title}</div>
                    <div className="text-xs text-slate-500">{issue.category} • {issue.date}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 
                    issue.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
         </div>
       </div>
    </div>
  );
};

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-purple-600"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);