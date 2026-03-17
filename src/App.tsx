import { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldAlert } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Skeleton } from './components/Skeleton';
import { EmptyState } from './components/EmptyState';
import { TickerInput } from './components/TickerInput';
import { AnalysisResults, type AnalysisData } from './components/AnalysisResults';

export default function App() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mode, setMode] = useState<'pro' | 'fast'>('pro');
  const [quota, setQuota] = useState({ remaining: 15, limit: 15 });
  const [data, setData] = useState<AnalysisData | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('gemini_mode') as 'pro' | 'fast' | null;
    if (savedMode) setMode(savedMode);

    const todayStr = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('gemini_quota_date');
    const savedRemaining = localStorage.getItem('gemini_quota_remaining');
    
    if (savedDate === todayStr && savedRemaining) {
      setQuota(q => ({ ...q, remaining: parseInt(savedRemaining, 10) }));
    } else {
      // Reset daily
      localStorage.setItem('gemini_quota_date', todayStr);
      localStorage.setItem('gemini_quota_remaining', '15');
      setQuota({ remaining: 15, limit: 15 });
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'pro' ? 'fast' : 'pro';
    setMode(newMode);
    localStorage.setItem('gemini_mode', newMode);
  };

  const parseGeminiResponse = (text: string): AnalysisData => {
    const extractSection = (tag: string) => {
      const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : `No ${tag} data found in response.`;
    };

    return {
      marketContext: extractSection('MARKET_CONTEXT'),
      technicalIndicators: extractSection('TECHNICAL_INDICATORS'),
      mlPrediction: extractSection('ML_PREDICTION'),
      riskAssessment: extractSection('RISK_ASSESSMENT')
    };
  };

  const handleAnalyze = async (ticker: string, horizon: string) => {
    if (quota.remaining <= 0) {
      toast.error('Daily Request Limit Reached');
      return;
    }

    setStatus('loading');
    setData(null);
    toast.info(`Initializing AI Quant Pipeline: ${ticker}`, { id: 'analyze_toast' });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          horizon,
          model: mode === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'API Request Failed');
      }

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Invalid response format from Gemini');
      }

      const parsedData = parseGeminiResponse(text);
      // Attach DuckDuckGo sources if returned
      if (result.customSources && result.customSources.length > 0) {
        parsedData.sources = result.customSources;
      }

      setData(parsedData);
      setStatus('success');
      toast.success(`Analysis Complete: ${ticker}`, { id: 'analyze_toast' });

      // Decrement Quota
      const newRemaining = Math.max(0, quota.remaining - 1);
      setQuota(q => ({ ...q, remaining: newRemaining }));
      localStorage.setItem('gemini_quota_remaining', newRemaining.toString());

    } catch (error: any) {
      console.error(error);
      setStatus('error');
      toast.error(`Analysis Failed: ${error.message}`, { id: 'analyze_toast' });
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-24 flex flex-col items-center justify-start relative overflow-x-hidden bg-surface pb-32">
      <Toaster theme="dark" position="bottom-right" richColors />
      
      {/* Background Decorators */}
      <div className="fixed top-1/4 -right-20 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full z-10 flex flex-col items-center">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-12 w-full gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <LayoutDashboard size={16} />
            Quant & ML Architecture
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={toggleMode}
              disabled={status === 'loading'}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all w-fit disabled:opacity-50 ${mode === 'pro'
                ? 'bg-gradient-to-br from-brand-600 to-teal-600 shadow-lg shadow-brand-500/20 text-white'
                : 'bg-gradient-to-br from-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/20 text-white'
                }`}
            >
              {mode === 'pro' ? '⚡ PRO MODEL' : '🚀 FAST MODEL'}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${(quota.remaining / quota.limit) * 100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">{quota.remaining}/{quota.limit} REQ</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Market Intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-200">
              Terminal
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Query deep fundamental market context seamlessly bridged with mathematical predictive confidence scoring.
          </p>
        </div>

        {/* Interactive Input Layer */}
        <TickerInput 
          onAnalyze={handleAnalyze} 
          isLoading={status === 'loading'} 
          disabled={quota.remaining <= 0} 
        />

        {/* Dynamic Display Board */}
        <div className="w-full relative z-10 min-h-[400px]">
          {status === 'idle' && <EmptyState />}
          {status === 'loading' && <Skeleton />}
          {status === 'success' && data && <AnalysisResults data={data} />}
          {status === 'error' && (
             <div className="glass-card p-12 text-center border-red-500/30 flex flex-col items-center">
                 <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
                 <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                 <p className="text-slate-400">The prediction engine encountered a fault or API timeout. Please verify your ticker formatting (ex: AAPL, RELIANCE.NS) and retry.</p>
             </div>
          )}
        </div>

        <div className="mt-24 text-center text-xs font-medium text-slate-600 tracking-wide uppercase">
          <p>© {new Date().getFullYear()}. Private Architectural Sandbox. Not Financial Advice.</p>
        </div>

      </div>
    </div>
  )
}
