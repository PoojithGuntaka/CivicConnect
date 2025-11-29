import React, { useState } from 'react';
import { Issue, Poll } from '../types';
import { MapPin, Upload, ThumbsUp, Video, Users, FileText, ArrowRight } from 'lucide-react';
import { MOCK_LIVE_CHAT } from '../constants';

interface Props {
  issues: Issue[];
  polls: Poll[];
  onReportIssue: (issue: Omit<Issue, 'id' | 'status' | 'date' | 'upvotes'>) => void;
  onVote: (pollId: string, optionId: string) => void;
}

export const CitizenDashboard: React.FC<Props> = ({ issues, polls, onReportIssue, onVote }) => {
  const [view, setView] = useState<'home' | 'report' | 'live'>('home');
  const [newIssue, setNewIssue] = useState({ title: '', description: '', category: 'Infrastructure', lat: 50, lng: 50 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportIssue({
      title: newIssue.title,
      description: newIssue.description,
      category: newIssue.category,
      location: { lat: newIssue.lat, lng: newIssue.lng }
    });
    setNewIssue({ title: '', description: '', category: 'Infrastructure', lat: 50, lng: 50 });
    setView('home');
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
        <button 
          onClick={() => setView('home')} 
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${view === 'home' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Community Hub
        </button>
        <button 
          onClick={() => setView('report')} 
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${view === 'report' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Report an Issue
        </button>
        <button 
          onClick={() => setView('live')} 
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${view === 'live' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Town Hall (Live)
        </button>
      </div>

      {view === 'home' && (
        <div className="space-y-8">
          {/* Active Polls */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="text-blue-600" /> Active Consultations
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {polls.map(poll => (
                <div key={poll.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h4 className="font-semibold text-lg mb-4">{poll.question}</h4>
                  <div className="space-y-3">
                    {poll.options.map(option => (
                      <button
                        key={option.id}
                        onClick={() => onVote(poll.id, option.id)}
                        className="w-full flex justify-between items-center p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                      >
                        <span className="font-medium text-slate-700 group-hover:text-blue-700">{option.text}</span>
                        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded group-hover:bg-white">{option.votes} votes</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-slate-400 text-right">{poll.totalVotes} total citizens participated</div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Community Reports */}
          <section>
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" /> Community Reports
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {issues.slice(0, 3).map(issue => (
                <div key={issue.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                        issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {issue.status}
                    </span>
                    <span className="text-xs text-slate-400">{issue.date}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-1">{issue.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{issue.description}</p>
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <span className="flex items-center gap-1"><MapPin size={14}/> {issue.category}</span>
                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={14} /> {issue.upvotes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {view === 'report' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Report an Issue</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
              <input
                required
                type="text"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Broken streetlight on 5th Ave"
                value={newIssue.title}
                onChange={e => setNewIssue({...newIssue, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={newIssue.category}
                  onChange={e => setNewIssue({...newIssue, category: e.target.value})}
                >
                  <option>Infrastructure</option>
                  <option>Sanitation</option>
                  <option>Safety</option>
                  <option>Noise</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Location (Approx)</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <MapPin size={16} className="text-slate-400" />
                   </div>
                   <input
                      type="text"
                      disabled
                      value="Current Location Detected"
                      className="w-full border border-slate-300 rounded-lg pl-10 px-4 py-2 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                   />
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                required
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Please describe the issue in detail..."
                value={newIssue.description}
                onChange={e => setNewIssue({...newIssue, description: e.target.value})}
              />
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
              <Upload className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm">Click to upload photos (Optional)</p>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2">
              Submit Report <ArrowRight size={18} />
            </button>
          </form>
        </div>
      )}

      {view === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Video Stream Area */}
          <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden relative group">
            <img 
              src="https://picsum.photos/800/600" 
              alt="Town Hall Stream" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
              </button>
            </div>
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div> LIVE
            </div>
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-bold">Monthly Town Hall: City Infrastructure</h3>
              <p className="text-sm opacity-80">Featuring Mayor Sarah Jenkins • 1.2k Viewers</p>
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm">
            <div className="p-4 border-b border-slate-200 font-semibold text-slate-700">Live Discussion</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MOCK_LIVE_CHAT.map((chat, i) => (
                <div key={i} className="text-sm">
                  <span className="font-bold text-slate-800">{chat.user}: </span>
                  <span className="text-slate-600">{chat.message}</span>
                </div>
              ))}
              <div className="text-center text-xs text-slate-400 italic mt-4">
                Chat allows you to ask questions directly to representatives.
              </div>
            </div>
            <div className="p-3 border-t border-slate-200">
               <input 
                 type="text" 
                 placeholder="Type your question..." 
                 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
               />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};