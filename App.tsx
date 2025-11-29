
import React, { useState } from 'react';
import { INITIAL_ISSUES, INITIAL_POLLS } from './constants';
import { Issue, Poll, User } from './types';
import { CitizenDashboard } from './components/CitizenDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Chatbot } from './components/Chatbot';
import { Auth } from './components/Auth';
import { ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
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

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // If not authenticated, show Auth screen
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

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
            
            {/* User Profile & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                <UserIcon size={16} />
                <span className="font-medium">{user.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide font-bold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'citizen' ? (
          <div className="animate-in fade-in duration-500">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name.split(' ')[0]}</h1>
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

      {/* AI Assistant - Available for everyone, but customized context could be added */}
      <Chatbot />
    </div>
  );
}
