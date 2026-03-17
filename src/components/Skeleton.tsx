import { Activity, Zap, Shield, TrendingUp } from 'lucide-react';

export function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      
      {/* Card 1: Market Context */}
      <div className="glass-card p-6 border-slate-700/50 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center">
            <Activity className="w-5 h-5 text-slate-500" />
          </div>
          <div className="h-6 w-32 bg-slate-800 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-800/60 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-800/60 rounded"></div>
          <div className="h-4 w-4/6 bg-slate-800/60 rounded"></div>
        </div>
        <div className="mt-8 pt-4 border-t border-slate-800/50 flex gap-4">
           <div className="h-8 w-24 bg-slate-800/60 rounded-full"></div>
           <div className="h-8 w-24 bg-slate-800/60 rounded-full"></div>
        </div>
      </div>

      {/* Card 2: Tech Indicators */}
      <div className="glass-card p-6 border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center">
            <Zap className="w-5 h-5 text-slate-500" />
          </div>
          <div className="h-6 w-40 bg-slate-800 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="h-20 bg-slate-800/50 rounded-xl"></div>
           <div className="h-20 bg-slate-800/50 rounded-xl"></div>
           <div className="h-20 bg-slate-800/50 rounded-xl col-span-2"></div>
        </div>
      </div>

      {/* Card 3: ML Prediction */}
      <div className="glass-card p-6 border-brand-500/20 bg-brand-500/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-brand-500/50" />
          </div>
          <div className="h-6 w-48 bg-slate-800 rounded"></div>
        </div>
        <div className="flex items-baseline gap-4 mb-6">
           <div className="h-12 w-28 bg-slate-800 rounded-lg"></div>
           <div className="h-6 w-20 bg-slate-800/50 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-800/40 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-800/40 rounded"></div>
        </div>
      </div>

      {/* Card 4: Risk */}
      <div className="glass-card p-6 border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center">
            <Shield className="w-5 h-5 text-slate-500" />
          </div>
          <div className="h-6 w-36 bg-slate-800 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-800/60 rounded-full mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-800/60 rounded"></div>
          <div className="h-4 w-3/4 bg-slate-800/60 rounded"></div>
        </div>
      </div>

    </div>
  );
}
