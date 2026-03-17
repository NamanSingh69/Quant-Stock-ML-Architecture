import { Activity, Zap, ShieldAlert, ShieldCheck, TrendingUp, Link2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface AnalysisData {
  marketContext: string;
  technicalIndicators: string;
  mlPrediction: string;
  riskAssessment: string;
  sources?: Array<{ title: string; url: string; snippet: string }>;
}

export function AnalysisResults({ data }: { data: AnalysisData }) {
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Card 1: Market Context */}
        <div className="glass-card p-6 md:p-8 border-slate-700/50 hover:border-brand-500/30 transition-colors w-full h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Market Context</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 flex-grow">
            <ReactMarkdown>{data.marketContext}</ReactMarkdown>
          </div>
        </div>

        {/* Card 2: Technical Indicators */}
        <div className="glass-card p-6 md:p-8 border-slate-700/50 hover:border-brand-500/30 transition-colors w-full h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Technical Indicators</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 flex-grow">
            <ReactMarkdown>{data.technicalIndicators}</ReactMarkdown>
          </div>
        </div>

        {/* Card 3: ML Prediction */}
        <div className="glass-card p-6 md:p-8 border-brand-500/30 bg-gradient-to-br from-brand-900/20 to-surface hover:from-brand-900/30 transition-all w-full h-full flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[50px] group-hover:bg-brand-500/20 transition-all" />
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-500/20 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white">ML Return Prediction</h3>
            <span className="ml-auto text-[10px] font-mono uppercase px-2 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 tracking-wider">XGBoost Emulator</span>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-200 flex-grow relative z-10">
            <ReactMarkdown>{data.mlPrediction}</ReactMarkdown>
          </div>
        </div>

        {/* Card 4: Risk Assessment */}
        <div className="glass-card p-6 md:p-8 border-slate-700/50 hover:border-amber-500/30 transition-colors w-full h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              {data.riskAssessment.includes('HIGH') ? (
                 <ShieldAlert className="w-5 h-5 text-red-400" />
              ) : (
                 <ShieldCheck className="w-5 h-5 text-brand-400" />
              )}
            </div>
            <h3 className="text-xl font-bold text-white">Risk Profile</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 flex-grow">
            <ReactMarkdown>{data.riskAssessment}</ReactMarkdown>
          </div>
        </div>

      </div>

      {/* Grounding Sources */}
      {data.sources && data.sources.length > 0 && (
        <div className="glass-card p-6 mt-6 border-slate-700/50">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            <Link2 size={14} /> Grounding Sources (DuckDuckGo)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sources.slice(0, 3).map((src, idx) => (
              <a 
                key={idx} 
                href={src.url} 
                target="_blank" 
                rel="noreferrer"
                className="block p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-brand-500/40 hover:bg-slate-800 transition-all group"
              >
                <h5 className="text-xs font-bold text-slate-300 line-clamp-1 group-hover:text-brand-400 transition-colors">{src.title}</h5>
                <p className="text-[10px] text-slate-500 mt-1 truncate">{new URL(src.url).hostname}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
