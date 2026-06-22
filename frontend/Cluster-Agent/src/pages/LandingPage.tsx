import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Activity, AlertTriangle, Box, ArrowRight } from 'lucide-react';
import k8sLogo from '../assets/k8s.png';

export function LandingPage() {
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = "AI-Powered Kubernetes Operations Assistant";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col text-white overflow-y-auto custom-scrollbar">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden shrink-0">
        <div className="mb-8 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full scale-150"></div>
            <img src={k8sLogo} alt="Kubernetes Logo" className="relative h-40 w-40 md:h-56 md:w-56 object-contain drop-shadow-[0_0_40px_rgba(17,79,216,0.5)]" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl flex items-center justify-center flex-wrap min-h-[96px] md:min-h-[72px]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-400">
            {displayText}
          </span>
          {!isTypingComplete && (
            <span className="inline-block w-1 h-10 md:h-14 bg-purple-400 ml-1 md:ml-2 animate-[pulse_1s_ease-in-out_infinite]"></span>
          )}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
          Monitor, troubleshoot, and investigate Kubernetes clusters using natural language. 
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/register" 
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(128,90,213,0.3)] hover:shadow-[0_0_40px_rgba(128,90,213,0.5)]"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/login" 
            className="flex items-center justify-center px-8 py-4 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-500/50 text-white font-semibold rounded-xl transition-all"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-6 py-20 border-t border-purple-900/20 bg-[#040d24]/40 shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Feature Highlights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#040d24]/80 border border-purple-900/30 hover:border-purple-500/50 transition-colors shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-400 mb-4">
                <Bot size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Troubleshooting</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Diagnose cluster issues using natural language.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#040d24]/80 border border-purple-900/30 hover:border-purple-500/50 transition-colors shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-emerald-900/30 flex items-center justify-center text-emerald-400 mb-4">
                <Activity size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Observability</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monitor metrics through Prometheus & Grafana.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#040d24]/80 border border-purple-900/30 hover:border-purple-500/50 transition-colors shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-rose-900/30 flex items-center justify-center text-rose-400 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Incident Detection</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Identify and track cluster incidents automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#040d24]/80 border border-purple-900/30 hover:border-purple-500/50 transition-colors shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400 mb-4">
                <Box size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Kubernetes Integration</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Inspect pods, deployments, nodes, logs and events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Queries */}
      <section className="px-6 py-20 border-t border-purple-900/20 shrink-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Example Queries</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Check cluster health",
              "Show failing pods",
              "Why is my deployment failing?",
              "Analyze CrashLoopBackOff pods"
            ].map((query, i) => (
              <div key={i} className="px-6 py-3 rounded-full bg-purple-900/10 border border-purple-500/20 text-purple-200 font-mono text-sm shadow-sm cursor-default hover:bg-purple-900/30 transition-colors">
                "{query}"
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
