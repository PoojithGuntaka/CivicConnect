import React from 'react';
import { Issue } from '../types';

interface Props {
  issues: Issue[];
}

export const SimulatedMap: React.FC<Props> = ({ issues }) => {
  // A simple SVG map simulation. Coordinates 0-100.
  
  return (
    <div className="w-full h-[400px] bg-emerald-50 rounded-xl border border-emerald-100 relative overflow-hidden group">
      {/* Background patterns simulating roads/blocks */}
      <svg width="100%" height="100%" className="absolute inset-0 opacity-10 pointer-events-none">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-900"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* River Simulation */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/50 skew-x-12 blur-xl"></div>

      {/* City Center Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-800 font-bold opacity-20 text-4xl">
        CITY HALL
      </div>

      {/* Issue Markers */}
      {issues.map((issue) => {
        // Fallback random positions if simulated location missing (for safety)
        const top = issue.location?.lat ?? Math.random() * 80 + 10;
        const left = issue.location?.lng ?? Math.random() * 80 + 10;
        
        let color = 'bg-slate-500';
        if (issue.status === 'submitted') color = 'bg-red-500 animate-pulse';
        if (issue.status === 'in-progress') color = 'bg-amber-500';
        if (issue.status === 'resolved') color = 'bg-emerald-500';

        return (
          <div
            key={issue.id}
            className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer group/marker transition-transform hover:scale-150 ${color}`}
            style={{ top: `${top}%`, left: `${left}%` }}
            title={`${issue.title} (${issue.status})`}
          >
            <div className="hidden group-hover/marker:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              {issue.category}
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-2 rounded-lg text-xs shadow-sm">
        <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> New Issue</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> In Progress</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Resolved</div>
      </div>
    </div>
  );
};