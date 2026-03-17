import { BarChart3 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="glass-card p-12 text-center border-dashed border-2 border-slate-700/50 flex flex-col items-center animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
        <BarChart3 className="w-8 h-8 text-brand-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">Awaiting Quant & ML Pipeline</h3>
      <p className="text-slate-400 max-w-md text-sm leading-relaxed">
        Enter a ticker symbol and select a time horizon to run real-time market grounding alongside an XGBoost-style predictive momentum architecture.
      </p>
    </div>
  );
}
