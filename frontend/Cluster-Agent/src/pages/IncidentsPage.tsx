import { useState, useEffect } from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

interface Incident {
  id: number;
  resource_name: string;
  namespace: string;
  severity: string;
  issue: string;
  fingerprint: string;
  status: string;
  resolution_summary?: string;
  resolved_at?: string;
  created_at: string;
}

export function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/incidents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setIncidents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch incidents:", err);
        setLoading(false);
      });
  }, []);

  const handleResolve = async (id: number) => {
    if (!resolutionText.trim()) return;
    try {
      const res = await fetch(`http://localhost:4000/incidents/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution_summary: resolutionText })
      });
      if (res.ok) {
        setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'fixed', resolution_summary: resolutionText } : inc));
        setResolvingId(null);
        setResolutionText('');
      } else {
        console.error("Failed to resolve incident: Server returned", res.status);
      }
    } catch (err) {
      console.error("Failed to resolve incident", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-red-400" />
          Incidents Dashboard
        </h1>
        <p className="text-slate-400 mt-2 text-lg">View and manage cluster issues automatically detected by the AIOps Agent.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-[0_8px_40px_rgba(128,90,213,0.15)] overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-500/20 text-xs uppercase tracking-wider text-purple-300/80 bg-[#040d24]/60">
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold">Resource</th>
                  <th className="p-5 font-semibold">Namespace</th>
                  <th className="p-5 font-semibold">Severity</th>
                  <th className="p-5 font-semibold w-2/5">Issue Details</th>
                  <th className="p-5 font-semibold text-right">Detected At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 text-lg">
                      No incidents recorded yet. Your cluster is healthy! ✨
                    </td>
                  </tr>
                ) : (
                  incidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-purple-900/20 transition-colors group">
                      <td className="p-5 align-top">
                        {inc.status === 'open' ? (
                          <div className="flex flex-col gap-2 items-start">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                              <AlertCircle className="h-4 w-4" />
                              Open
                            </span>
                            {resolvingId === inc.id ? (
                              <div className="mt-2 flex flex-col gap-2 w-48">
                                <textarea
                                  className="w-full bg-[#040d24] text-slate-200 border border-purple-500/30 rounded p-2 text-xs focus:outline-none focus:border-purple-400 placeholder-slate-500"
                                  placeholder="How was this fixed?"
                                  rows={3}
                                  value={resolutionText}
                                  onChange={(e) => setResolutionText(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleResolve(inc.id)}
                                    disabled={!resolutionText.trim()}
                                    className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded text-xs font-medium hover:bg-emerald-500/30 disabled:opacity-50 transition-all"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    onClick={() => { setResolvingId(null); setResolutionText(''); }}
                                    className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs font-medium hover:bg-slate-700 transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setResolvingId(inc.id); setResolutionText(''); }}
                                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 transition-all"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Mark Fixed
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 items-start">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="h-4 w-4" />
                              Fixed
                            </span>
                            {inc.resolution_summary && (
                              <div className="mt-2 text-xs text-emerald-300/80 bg-emerald-900/20 p-2 rounded border border-emerald-500/20 w-48">
                                <span className="font-semibold block mb-1">Resolution:</span>
                                {inc.resolution_summary}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-5 align-top font-medium text-purple-50 text-base">{inc.resource_name}</td>
                      <td className="p-5 align-top text-slate-300">
                        <span className="bg-[#040d24] px-2.5 py-1 rounded border border-purple-500/20 text-xs">{inc.namespace}</span>
                      </td>
                      <td className="p-5 align-top">
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          inc.severity?.toLowerCase() === 'high' ? 'text-red-400' : 
                          inc.severity?.toLowerCase() === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                        }`}>
                          {inc.severity || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="p-5 align-top text-slate-300 text-sm leading-relaxed max-w-md truncate group-hover:whitespace-normal group-hover:break-words transition-all duration-300">
                        {inc.issue}
                      </td>
                      <td className="p-5 align-top text-slate-400 text-sm text-right whitespace-nowrap font-mono">
                        {new Date(inc.created_at).toLocaleString(undefined, { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
