import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface TickerInputProps {
  onAnalyze: (ticker: string, horizon: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export function TickerInput({ onAnalyze, isLoading, disabled }: TickerInputProps) {
  const [ticker, setTicker] = useState('');
  const [horizon, setHorizon] = useState('1 month');

  const horizons = ['1 day', '1 week', '1 month', '3 months'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onAnalyze(ticker.trim().toUpperCase(), horizon);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto mb-16 relative z-10 glass-card p-6 border-brand-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        
        <div className="flex-1 relative w-full min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter Ticker (e.g. RELIANCE.NS, AAPL)"
            disabled={disabled || isLoading}
            className="block w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-mono uppercase disabled:opacity-50"
          />
        </div>

        <div className="flex-shrink-0 w-full lg:w-auto overflow-x-auto flex gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-700/50">
          {horizons.map(h => (
            <button
              key={h}
              type="button"
              disabled={disabled || isLoading}
              onClick={() => setHorizon(h)}
              className={`px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all disabled:opacity-50 ${
                horizon === h
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {h}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!ticker.trim() || isLoading || disabled}
          className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap"
        >
          {isLoading ? (
            <><Loader2 className="animate-spin" size={20} /> Analyzing...</>
          ) : 'Analyze & Predict'}
        </button>
      </div>
    </form>
  );
}
