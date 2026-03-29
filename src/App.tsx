import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Route, 
  AlertTriangle, 
  Sparkles, 
  Wallet,
  Settings,
  ChevronRight,
  ArrowRight,
  Zap,
  TrendingDown,
  TrendingUp,
  Network,
  CreditCard,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  BookOpen,
  Lightbulb,
  Clock,
  Upload,
  Database,
  FileText
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from './lib/utils';
import { AnalysisData, Recommendation, MoneyJourneyStep, Issue } from './types';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journey', label: 'Journey', icon: Route },
    { id: 'issues', label: 'Issues', icon: AlertTriangle },
    { id: 'recs', label: 'Recommendations', icon: Sparkles },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface py-4 z-40 border-r border-outline-variant">
      <div className="font-headline font-bold text-on-surface px-6 py-8 text-xl tracking-tighter flex items-center gap-2">
        <div className="w-2 h-8 bg-primary rounded-full" />
        The Precision Ledger
      </div>
      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 transition-all text-sm font-medium",
              activeTab === tab.id 
                ? "text-primary bg-white rounded-r-full shadow-[20px_40px_4%_on_surface] font-bold" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto px-6 py-4">
        <div className="bg-surface-container-low rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium">Ledger Synchronized</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ from, to }: { from: string, to: string }) => (
  <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-8 py-4 border-b border-outline-variant">
    <div className="flex items-center gap-3">
      <Wallet className="w-6 h-6 text-primary" />
      <h1 className="font-headline font-bold text-lg tracking-tight">Money Flow Debugger</h1>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-low rounded-full">
        <Route className="w-3 h-3 text-primary" />
        <span className="text-xs font-semibold text-on-surface">{from} → {to}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-white/50 transition-colors"><Settings className="w-5 h-5 text-on-surface-variant" /></button>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest">
          <img src="https://picsum.photos/seed/fintech/100/100" alt="User" referrerPolicy="no-referrer" />
        </div>
      </div>
    </div>
  </header>
);

const Dashboard = ({ data, setActiveTab }: { data: AnalysisData, setActiveTab: (tab: string) => void }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">AI Intelligence Layer</span>
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface leading-tight max-w-lg">
              {data.heroInsight.headline}
            </h2>
            <p className="text-on-surface-variant text-lg font-medium max-w-md">
              {data.heroInsight.subheadline}
            </p>
          </div>
        </div>
        
        <div className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Wallet className="w-40 h-40" />
          </div>
          <div>
            <p className="text-primary-container/80 text-xs font-bold uppercase tracking-widest mb-1">Total Volume Analyzed</p>
            <p className="text-4xl font-headline font-extrabold">${data.summary.totalVolume.toLocaleString()}</p>
          </div>
          <div className="mt-8">
            <p className="text-primary-container/80 text-xs font-bold uppercase tracking-widest mb-1">Efficiency Gap</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-headline font-extrabold text-white">{data.summary.avgInefficiencyPct.toFixed(2)}%</p>
              <span className="text-xs font-bold text-primary-container">of total volume</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Inefficiency', value: `$${data.summary.totalInefficiency.toLocaleString()}`, icon: AlertTriangle, color: 'text-error', bg: 'bg-error-container' },
          { label: 'Largest Issue', value: data.summary.largestIssue, icon: RefreshCcw, color: 'text-tertiary', bg: 'bg-tertiary-container' },
          { label: 'Active Flows', value: data.moneyJourney.length.toString(), icon: Network, color: 'text-primary', bg: 'bg-primary-container' },
          { label: 'Recommendations', value: data.recommendations.length.toString(), icon: Lightbulb, color: 'text-secondary', bg: 'bg-secondary-container' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-0.5">{stat.label}</p>
              <p className="text-lg font-headline font-extrabold text-on-surface truncate max-w-[140px]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Inefficiency Breakdown</h3>
              <p className="text-sm text-on-surface-variant font-medium">Distribution of losses across providers</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg border border-outline-variant/20">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Loss Amount</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.breakdowns.byProvider}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="provider" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f3f4f6'}}
                />
                <Bar dataKey="value" fill="#0061A4" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Top Recommendations</h3>
            <div className="space-y-6">
              {data.recommendations.slice(0, 3).map((rec, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{rec.title}</h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-1 line-clamp-2">{rec.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Est. Save: ${rec.estimatedSavings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveTab('recs')}
              className="w-full mt-8 py-4 px-6 bg-surface-container text-on-surface rounded-2xl font-bold text-sm transition-all hover:bg-surface-container-high flex items-center justify-center gap-2"
            >
              View All Recommendations
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Journey = ({ data }: { data: AnalysisData }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="mb-12">
        <span className="text-primary font-bold tracking-widest text-xs uppercase">Live Debug Session</span>
        <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mt-2">Flow Journey: {data.fromCountry}-{data.toCountry}</h2>
        <p className="text-on-surface-variant mt-2 max-w-2xl font-medium">Visualizing capital velocity and identification of systemic friction points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl p-10 relative border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#e0e3e5 1px, transparent 1px), linear-gradient(90deg, #e0e3e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative flex flex-col items-center">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-outline-variant/40 border-l border-dashed border-outline-variant/60 z-0"></div>
            <div className="space-y-12 w-full max-w-md z-10">
              {data.moneyJourney.map((step, i) => (
                <React.Fragment key={i}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                    <div className={cn(
                      "bg-surface-container-lowest border px-6 py-4 rounded-lg shadow-sm w-full transition-all",
                      step.isInefficient ? "border-2 border-error" : "border-outline-variant hover:border-primary"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-md flex items-center justify-center",
                            step.type === 'country' ? "bg-primary/10 text-primary" : 
                            step.type === 'provider' ? "bg-indigo-500 text-white" : "bg-error/10 text-error"
                          )}>
                            {step.type === 'country' ? <MapPin className="w-5 h-5" /> : 
                             step.type === 'provider' ? <CreditCard className="w-5 h-5" /> : <RefreshCcw className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-on-surface-variant leading-none mb-1">{step.label}</div>
                            <div className="font-headline font-bold text-lg">{step.value}</div>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-outline-variant">ID: {step.value.toUpperCase()}_NODE</div>
                      </div>
                      {step.isInefficient && step.issue && (
                        <div className="mt-3 pt-3 border-t border-error/20">
                          <div className="flex items-start gap-2 text-[11px] text-error font-bold">
                            <AlertTriangle className="w-4 h-4 mt-0.5" />
                            <span>DEBUG: {step.issue}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  {i < data.moneyJourney.length - 1 && (
                    <div className="h-12 flex justify-center items-center">
                      <div className="text-[10px] font-mono bg-surface px-2 py-0.5 border border-outline-variant rounded-full text-outline-variant">LINK_{i+1}</div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
            <h3 className="font-headline font-bold text-on-surface mb-4">Route Efficiency</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-extrabold text-error font-headline">{(100 - data.summary.avgInefficiencyPct).toFixed(0)}</span>
              <span className="text-on-surface-variant font-medium mb-1">/ 100</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Cost efficiency</span>
                <span className={cn("font-bold", data.summary.avgInefficiencyPct > 2 ? "text-error" : "text-primary")}>
                  {data.summary.avgInefficiencyPct > 2 ? "Poor" : "Good"}
                </span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className={cn("h-full", data.summary.avgInefficiencyPct > 2 ? "bg-error" : "bg-primary")} style={{ width: `${100 - data.summary.avgInefficiencyPct}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-primary mb-2">Architect's Fix</h3>
            <p className="text-sm text-on-primary-container leading-relaxed mb-4">
              Switching to the <b>optimized flow</b> would bypass intermediate steps and reduce conversion leakage.
            </p>
            <div className="space-y-3 mb-6">
              {data.optimizedFlows[0]?.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-on-surface">
                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px]">{idx + 1}</div>
                  {step.value}
                </div>
              ))}
            </div>
            <button className="w-full py-3 px-4 primary-gradient text-white rounded-lg font-bold text-sm shadow-lg hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
              Apply Optimized Route
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Issues = ({ data }: { data: AnalysisData }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-2">
        <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Precision Debugger</h2>
        <p className="text-on-surface-variant max-w-2xl">Visualizing transaction friction and structural inefficiencies in the {data.fromCountry}-{data.toCountry} corridor.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold">TOP ISSUES</h3>
            <span className="text-xs font-label uppercase tracking-widest text-outline">Detected Today</span>
          </div>
          {data.issues.map((issue) => (
            <div key={issue.id} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm transition-all hover:translate-y-[-2px] border border-outline-variant/10">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  issue.severity === 'critical' ? "bg-error-container text-error" : "bg-tertiary-container text-tertiary"
                )}>
                  {issue.id.includes('double') ? <RefreshCcw className="w-5 h-5" /> : 
                   issue.id.includes('rail') ? <CreditCard className="w-5 h-5" /> : <Network className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "px-3 py-1 text-[10px] font-bold uppercase rounded-full",
                  issue.severity === 'critical' ? "bg-error-container text-error" : "bg-tertiary-container text-tertiary"
                )}>{issue.severity}</span>
              </div>
              <h4 className="font-bold text-lg mb-1">{issue.title}</h4>
              <p className="text-sm text-on-surface-variant font-medium mb-4">{issue.description}</p>
              <div className="flex items-end justify-between border-t border-outline-variant/15 pt-4">
                <div>
                  <p className="text-xs text-outline mb-1">Est. Daily Loss</p>
                  <p className={cn("text-xl font-headline font-extrabold", issue.severity === 'critical' ? "text-error" : "text-tertiary")}>
                    -${issue.estLoss.toLocaleString()}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-outline" />
              </div>
            </div>
          ))}
        </section>

        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold">RECOMMENDATIONS</h3>
            <button className="bg-primary text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg">Apply All</button>
          </div>
          {data.recommendations.map((rec, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-primary">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="font-bold text-lg">{rec.title}</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{rec.description}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex-1 bg-surface-container-low p-3 rounded-lg text-center">
                      <p className="text-[10px] text-outline uppercase font-bold mb-1">Current</p>
                      <p className="font-headline font-bold text-on-surface">Standard Rail</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-outline-variant" />
                    <div className="flex-1 bg-primary/10 p-3 rounded-lg text-center border border-primary/20">
                      <p className="text-[10px] text-primary uppercase font-bold mb-1">Target</p>
                      <p className="font-headline font-bold text-primary">{rec.provider} Direct</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-40 flex flex-col items-center justify-center bg-primary-container text-white rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase mb-1 opacity-80">Annual Saving</p>
                  <p className="text-2xl font-headline font-extrabold">${rec.estimatedSavings.toLocaleString()}</p>
                  <div className="mt-2 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

const LandingPage = ({ onUpload, onUseSample, error }: { 
  onUpload: (file: File, from: string, to: string) => void, 
  onUseSample: (from: string, to: string) => void,
  error: string | null
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fromCountry, setFromCountry] = React.useState('Singapore');
  const [toCountry, setToCountry] = React.useState('Indonesia');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file, fromCountry, toCountry);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-8 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Money Flow Intelligence
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">
            Analyze cross-border transaction flows and optimize your capital velocity.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-3xl cloud-shadow border border-white space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <label className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 block">From</label>
              <select 
                value={fromCountry}
                onChange={(e) => setFromCountry(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Singapore">Singapore</option>
              </select>
            </div>
            <div className="text-left">
              <label className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 block">To</label>
              <select 
                value={toCountry}
                onChange={(e) => setToCountry(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Indonesia">Indonesia</option>
                <option value="Malaysia">Malaysia</option>
              </select>
            </div>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-outline-variant rounded-2xl p-10 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv" 
              className="hidden" 
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-outline" />
              </div>
              <div>
                <p className="font-bold text-on-surface">Upload Transaction CSV</p>
                <p className="text-xs text-on-surface-variant mt-1">Drag and drop or click to browse</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-outline-variant/30"></div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">OR</span>
            <div className="h-px flex-1 bg-outline-variant/30"></div>
          </div>

          <button 
            onClick={() => onUseSample(fromCountry, toCountry)}
            className="w-full py-4 px-6 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border border-outline-variant/20"
          >
            <Database className="w-5 h-5 text-primary" />
            Use Sample Data
          </button>

          <div className="text-left p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/10">
            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Expected CSV Format
            </h4>
            <div className="font-mono text-[10px] text-on-surface-variant bg-surface-container-low p-2 rounded border border-outline-variant/20 overflow-x-auto">
              transaction_id,date,source_currency,source_amount,target_currency,target_amount,fx_rate_applied,reference_fx_rate,provider,flow_type,route,entity
            </div>
            <p className="text-[10px] text-outline mt-2 italic">
              * Ensure your export includes these headers for accurate analysis.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-error-container text-error rounded-xl text-sm font-medium flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </div>

        <p className="text-xs text-outline font-medium">
          Supported formats: .csv (Standard transaction export)
        </p>
      </motion.div>

      {/* Customer Profiles Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl w-full mt-24 space-y-12"
      >
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Who uses FlowIQ — Customer Profiles</span>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface">Built for Modern Finance Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "The Finance Lead",
              role: "CFO / Head of Finance",
              initials: "RA",
              tag: "Primary ICP",
              description: "Series A–B startup, $1M–$20M/month cross-border, operating 3+ SEA markets. Needs to quantify and reduce FX losses.",
              stack: ["Airwallex", "Stripe", "Wise"],
              color: "bg-primary/10 text-primary"
            },
            {
              title: "The Technical Builder",
              role: "CTO / VP Engineering",
              initials: "TK",
              tag: "Secondary ICP",
              description: "Built payment flows fast in year 1. Now multi-market, knows routes are inefficient but has no diagnostic tool to audit them.",
              stack: ["Stripe-heavy", "APAC expansion"],
              color: "bg-amber-500/10 text-amber-600"
            },
            {
              title: "The Treasury Manager",
              role: "Treasury / Ops Lead",
              initials: "SM",
              tag: "Tertiary ICP",
              description: "100–500 person enterprise. High-volume cross-border, correspondent banks, no benchmark tool to compare routing quality.",
              stack: ["Enterprise", "High volume"],
              color: "bg-blue-500/10 text-blue-600"
            }
          ].map((profile, i) => (
            <div key={i} className={cn(
              "bg-surface-container-lowest p-8 rounded-3xl border transition-all hover:scale-[1.02] hover:shadow-xl",
              i === 0 ? "border-primary/30 ring-1 ring-primary/10" : "border-outline-variant/30"
            )}>
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg", profile.color)}>
                  {profile.initials}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">{profile.title}</h3>
                  <p className="text-xs text-on-surface-variant font-medium">{profile.role}</p>
                </div>
              </div>
              <span className={cn(
                "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4",
                profile.color
              )}>
                {profile.tag}
              </span>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4 font-medium">
                {profile.description}
              </p>
              {i === 0 && (
                <p className="text-xs italic text-primary font-medium mb-6 border-l-2 border-primary/20 pl-3 py-1">
                  "I know we're losing money somewhere in our Indonesia payments but I can't tell the board exactly where or how much. I need a number."
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.stack.map((item, j) => (
                  <span key={j} className="px-2 py-1 bg-surface-container rounded-md text-[10px] font-bold text-outline-variant">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Who This Is Not For */}
        <div className="bg-surface-container-low/30 rounded-3xl p-10 border border-outline-variant/20">
          <div className="mb-8">
            <span className="text-[10px] font-bold text-error uppercase tracking-widest">Who this is NOT for</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Single-market businesses", desc: "No cross-border flow = no corridor problem to solve. Domestic payments are a different category." },
              { title: "Very early stage (pre-revenue)", desc: "Under $100K/month volume — savings are too small to justify switching costs or a tool subscription." },
              { title: "Enterprise with dedicated treasury team", desc: "Large banks and MNCs already have Bloomberg terminals and treasury systems. Not your buyer." },
              { title: "Consumer / personal transfers", desc: "This is a B2B intelligence tool. Consumer remittances are a different product entirely." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1 h-full bg-error/30 rounded-full flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-on-surface mb-1">{item.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [data, setData] = React.useState<AnalysisData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log("[DEBUG] App mounted, pinging API...");
    fetch("/api/ping")
      .then(res => res.json())
      .then(data => console.log("[DEBUG] API Ping Response:", data))
      .catch(err => console.error("[DEBUG] API Ping Error:", err));
  }, []);

  const handleUpload = async (file: File, from: string, to: string) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fromCountry', from);
    formData.append('toCountry', to);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        let errorMessage = `Failed to analyze CSV (URL: ${res.url})`;
        try {
          const errData = JSON.parse(text);
          errorMessage = errData.detail || errData.error || errorMessage;
        } catch (e) {
          errorMessage = `${errorMessage}: ${text.slice(0, 100)}`;
        }
        throw new Error(errorMessage);
      }
      const result = await res.json();
      setData(result);
      setActiveTab('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  const handleUseSample = async (from: string, to: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sample-data?fromCountry=${from}&toCountry=${to}`);
      if (!res.ok) {
        const text = await res.text();
        let errorMessage = `Failed to fetch sample data (URL: ${res.url})`;
        try {
          const errData = JSON.parse(text);
          errorMessage = errData.detail || errorMessage;
        } catch (e) {
          errorMessage = `${errorMessage}: ${text.slice(0, 100)}`;
        }
        throw new Error(errorMessage);
      }
      const result = await res.json();
      setData(result);
      setActiveTab('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setActiveTab('dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-headline font-bold text-on-surface-variant">Analyzing Transaction Flows...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <LandingPage onUpload={handleUpload} onUseSample={handleUseSample} error={error} />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="md:ml-64 min-h-screen">
        <Header from={data.fromCountry} to={data.toCountry} />
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-6 flex justify-end">
            <button 
              onClick={handleReset}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-2"
            >
              <RefreshCcw className="w-3 h-3" />
              New Analysis
            </button>
          </div>
          {activeTab === 'dashboard' && <Dashboard data={data} setActiveTab={setActiveTab} />}
          {activeTab === 'journey' && <Journey data={data} />}
          {activeTab === 'issues' && <Issues data={data} />}
          {activeTab === 'recs' && <Issues data={data} />}
        </div>
      </main>
      
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-outline-variant/20 z-50 flex justify-around py-4">
        {[
          { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
          { id: 'journey', label: 'Journey', icon: Route },
          { id: 'issues', label: 'Issues', icon: AlertTriangle },
          { id: 'recs', label: 'Recs', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center transition-all",
              activeTab === tab.id ? "text-primary" : "text-on-surface-variant"
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
