import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Terminal } from 'lucide-react';
import type { ToolCall } from './ChatMessage';

interface ToolExecutionPanelProps {
  tools: ToolCall[];
}

export function ToolExecutionPanel({ tools }: ToolExecutionPanelProps) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  if (!tools || tools.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedTool(prev => prev === id ? null : id);
  };

  return (
    <div className="mt-5 bg-[#040d24]/60 border border-purple-900/40 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(128,90,213,0.05)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-950/40 border-b border-purple-900/40 text-purple-300">
        <Terminal size={14} className="opacity-80" />
        <span className="text-xs font-bold uppercase tracking-widest opacity-90">Developer Mode: Tools Used</span>
        <span className="ml-auto text-xs font-semibold bg-purple-900/60 px-2 py-0.5 rounded-full">{tools.length}</span>
      </div>
      
      {/* Tool List */}
      <div className="divide-y divide-purple-900/20">
        {tools.map((tool) => (
          <div key={tool.id} className="flex flex-col">
            <button 
              onClick={() => toggleExpand(tool.id)}
              className="group flex items-center gap-3 px-4 py-3 hover:bg-purple-900/20 transition-colors text-left focus:outline-none"
            >
              <CheckCircle2 size={16} className="text-emerald-500/90 flex-shrink-0" />
              <span className="flex-1 text-sm text-slate-300 font-mono group-hover:text-purple-200 transition-colors">{tool.name}</span>
              {expandedTool === tool.id ? (
                <ChevronDown size={16} className="text-purple-400/70" />
              ) : (
                <ChevronRight size={16} className="text-slate-600 group-hover:text-purple-400/70 transition-colors" />
              )}
            </button>
            
            {/* Expanded Content */}
            {expandedTool === tool.id && (
              <div className="px-4 pb-4 pt-1 bg-slate-950/60 border-t border-purple-900/10">
                <pre className="p-4 rounded-lg bg-[#0f071a] border border-purple-900/30 text-xs text-purple-200 font-mono overflow-x-auto custom-scrollbar shadow-inner">
                  {JSON.stringify(tool.result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
