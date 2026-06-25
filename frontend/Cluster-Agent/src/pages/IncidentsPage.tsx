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
  created_at: string;
}

export function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

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
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                            <AlertCircle className="h-4 w-4" />
                            Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="h-4 w-4" />
                            Fixed
                          </span>
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
