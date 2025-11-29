import React, { useState } from 'react';
import { INITIAL_ISSUES, INITIAL_POLLS } from './constants';
import { Issue, Poll, UserRole } from './types';
import { CitizenDashboard } from './components/CitizenDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Chatbot } from './components/Chatbot';
import { LayoutDashboard, Users, ShieldCheck } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole>('citizen');
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);

  const handleReportIssue = (newIssueData: Omit<Issue, 'id' | 'status' | 'date' | 'upvotes'>) => {
    const issue: Issue = {
      ...newIssueData,
      id: Date.now().toString(),
      status: 'submitted',
      date: new Date().toISOString().split('T')[0],
      upvotes: 0
    };
    setIssues([issue, ...issues]);
  };

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(polls.map(poll => {
      if (poll.id !== pollId) return poll;
      const updatedOptions = poll.options.map(opt => 
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );
      return { ...poll, options: updatedOptions, totalVotes: poll.totalVotes + 1 };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <ShieldCheck size={24} />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">CivicConnect</span>
            </div>
            
            {/* Role Switcher for Demo Purposes */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:block">View as:</span>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setRole('citizen')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    role === 'citizen' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Users size={16} /> Citizen
                </button>
                <button
                  onClick={() => setRole('official')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    role === 'official' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LayoutDashboard size={16} /> Official
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {role === 'citizen' ? (
          <div className="animate-in fade-in duration-500">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Welcome, Neighbor</h1>
              <p className="text-slate-600 mt-2">Participate in your local democracy and improve your community.</p>
            </header>
            <CitizenDashboard 
              issues={issues} 
              polls={polls} 
              onReportIssue={handleReportIssue} 
              onVote={handleVote} 
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
             <AdminDashboard issues={issues} />
          </div>
        )}
      </main>

      {/* Shared Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          &copy; 2024 CivicConnect. Powered by Gemini AI for Digital Governance.
        </div>
      </footer>

      {/* AI Assistant - Always available for Citizens */}
      {role === 'citizen' && <Chatbot />}
    </div>
  );
}