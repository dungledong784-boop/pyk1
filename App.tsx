import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Power, 
  Activity, 
  Settings, 
  List, 
  CheckCircle2, 
  BarChart3, 
  Globe,
  ChevronRight,
  Menu,
  X,
  Smartphone,
  Sparkles,
  Lock,
  Key,
  Unlock,
  AlertCircle,
  Copy,
  Zap,
  Fingerprint
} from 'lucide-react';
import { Tab, LogEntry, AppStats } from './types';
import { MOCK_DOMAINS_ALLOWED, MOCK_DOMAINS_BLOCKED, DNS_PROVIDERS } from './constants';
import Background from './components/Background';

// Lazy load heavy components
const StatsChart = React.lazy(() => import('./components/StatsChart'));
const DomainScanner = React.lazy(() => import('./components/DomainScanner'));
const LiveLogs = React.lazy(() => import('./components/LiveLogs'));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState<AppStats>({ adsBlocked: 0, trackersStopped: 0, dataSavedMb: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedDns, setSelectedDns] = useState(DNS_PROVIDERS[0].id);
  const [showMenu, setShowMenu] = useState(false);
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);
  const [autoStart, setAutoStart] = useState(true);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activationKey, setActivationKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize Key
  useEffect(() => {
    // Generate a random key: PURE-XXXX (4 random alphanumeric chars)
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomKey = `PURE-${randomSuffix}`;
    setActivationKey(randomKey);
    console.log('%c [PureGuard] ADMIN KEY: ' + randomKey, 'background: #10b981; color: #fff; padding: 4px; border-radius: 4px; font-weight: bold;');
  }, []);

  const handleLogin = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputKey.trim().toUpperCase() === activationKey) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      // Reset error after animation
      setTimeout(() => setAuthError(false), 2000);
    }
  }, [inputKey, activationKey]);

  const copyToClipboard = () => {
    if (!activationKey) return;
    navigator.clipboard.writeText(activationKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Simulate Traffic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && isAuthenticated) {
      interval = setInterval(() => {
        const isBlock = Math.random() > 0.7; // 30% chance of block
        const domainList = isBlock ? MOCK_DOMAINS_BLOCKED : MOCK_DOMAINS_ALLOWED;
        const randomDomain = domainList[Math.floor(Math.random() * domainList.length)];
        
        const newLog: LogEntry = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          domain: randomDomain,
          status: isBlock ? 'BLOCKED' : 'ALLOWED',
          source: 'System'
        };

        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50

        if (isBlock) {
          setStats(prev => ({
            adsBlocked: prev.adsBlocked + 1,
            trackersStopped: prev.trackersStopped + (Math.random() > 0.5 ? 1 : 0),
            dataSavedMb: parseFloat((prev.dataSavedMb + 0.05).toFixed(2))
          }));
          
          // Update Chart Data
          const now = new Date();
          const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
          setChartData(prev => {
             const newData = [...prev, { time: timeStr, value: Math.floor(Math.random() * 5) + 1 }];
             return newData.slice(-20); // Keep last 20 points
          });
        }
      }, 1500); // New event every 1.5s
    }

    return () => clearInterval(interval);
  }, [isActive, isAuthenticated]);

  const toggleProtection = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const handleConfigureKey = useCallback(async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
    } else {
      console.warn('AI Studio key selection not available in this environment');
    }
  }, []);

  // Activation Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <Background isActive={false} />

        <div className="w-full max-w-sm glass-panel rounded-[2rem] p-8 shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out border border-white/10">
          
          {/* Holographic Header */}
          <div className="flex flex-col items-center mb-10 relative">
             <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse-glow"></div>
             <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 group">
                <Shield className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" size={40} strokeWidth={1.5} />
                <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl animate-pulse"></div>
             </div>
             
             <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2">
               PureGuard
             </h1>
             <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-emerald-500/80 text-xs font-medium tracking-widest uppercase">安全运行环境</p>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">正版授权验证</label>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <div className="relative flex items-center">
                  <Key className={`absolute left-4 transition-colors duration-300 ${authError ? 'text-red-400' : 'text-slate-500 group-focus-within:text-emerald-400'}`} size={18} />
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value.toUpperCase());
                      setAuthError(false);
                    }}
                    placeholder="请输入产品激活码"
                    className={`w-full bg-slate-950/80 border ${authError ? 'border-red-500/50 text-red-200' : 'border-white/10 text-white focus:border-emerald-500/50'} rounded-xl px-4 py-4 pl-12 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono tracking-wider text-sm shadow-inner`}
                  />
                </div>
              </div>
            </div>

            {authError && (
              <div className="flex items-center justify-center space-x-2 text-red-400 text-xs px-1 animate-pulse bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                <AlertCircle size={12} />
                <span>密钥无效，请重新输入</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full relative group overflow-hidden bg-white text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <div className="flex items-center justify-center space-x-2">
                <Fingerprint size={20} />
                <span>验证并激活</span>
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="bg-white/5 rounded-lg p-3 border border-dashed border-white/10 group hover:border-emerald-500/30 transition-colors">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-emerald-500 transition-colors">[开发者] 管理员密钥</span>
                 <div className="flex items-center space-x-2">
                   <button 
                      onClick={copyToClipboard}
                      className="text-[10px] text-slate-500 hover:text-white flex items-center transition-colors bg-white/5 px-2 py-0.5 rounded"
                      title="复制到剪贴板"
                    >
                      {isCopied ? <CheckCircle2 size={10} className="mr-1 text-emerald-500"/> : <Copy size={10} className="mr-1"/>}
                      {isCopied ? '已复制' : '复制'}
                   </button>
                   <button 
                    onClick={() => setInputKey(activationKey)}
                    className="text-[10px] text-slate-500 hover:text-white flex items-center transition-colors bg-white/5 px-2 py-0.5 rounded"
                    title="自动填入输入框"
                   >
                     <Zap size={10} className="mr-1"/> 自动填入
                   </button>
                 </div>
               </div>
               <p className="text-sm text-slate-300 font-mono select-all tracking-wider text-center py-1">
                 {activationKey}
               </p>
            </div>
            
            <p className="text-[10px] text-slate-600 mt-6 font-mono opacity-50">
              安全加密连接 • 256位数据保护
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out pb-20">
      
      {/* Power Button Section */}
      <div className="relative mt-4 group cursor-pointer" onClick={toggleProtection}>
        {/* Outer Glows */}
        <div className={`absolute -inset-8 rounded-full blur-3xl transition-all duration-1000 ${isActive ? 'bg-emerald-500/30 opacity-100 animate-pulse-glow' : 'bg-slate-500/0 opacity-0'}`}></div>
        
        {/* Animated Rings - Enhanced with Scale */}
        <div className={`absolute -inset-1 rounded-full border border-dashed transition-all duration-[2000ms] ease-out ${isActive ? 'border-emerald-500/30 animate-spin-slow scale-110' : 'border-slate-700/30 scale-100'}`}></div>
        <div className={`absolute -inset-4 rounded-full border border-dotted transition-all duration-[3000ms] ease-out ${isActive ? 'border-emerald-500/20 animate-spin-slower scale-125' : 'border-slate-700/20 scale-100'}`}></div>

        {/* Main Button */}
        <button 
          className={`relative w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all duration-500 backdrop-blur-md shadow-2xl group-active:scale-95 ${
            isActive 
              ? 'bg-gradient-to-b from-emerald-500/10 to-emerald-900/10 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)]' 
              : 'bg-gradient-to-b from-slate-800/40 to-slate-900/40 border-slate-700/50 shadow-inner'
          }`}
        >
          <div className="flex flex-col items-center relative z-10">
            <Power 
              size={56} 
              className={`mb-3 transition-all duration-500 drop-shadow-lg ${isActive ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'text-slate-500'}`} 
            />
            <span className={`text-sm font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isActive ? '防护已开启' : '防护已暂停'}
            </span>
          </div>
          
          {/* Inner Gloss */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
        </button>
      </div>

      {/* Stats Cards (Floating Glass) */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-2xl font-bold text-white mb-1 drop-shadow-md">{stats.adsBlocked}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">拦截广告</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-2xl font-bold text-white mb-1 drop-shadow-md">{stats.trackersStopped}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">阻止追踪</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-2xl font-bold text-emerald-400 mb-1 drop-shadow-md">{stats.dataSavedMb}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">节省流量</span>
        </div>
      </div>

      {/* Modern Chart */}
      <div className={`w-full glass-panel rounded-3xl p-5 border border-white/5 relative overflow-hidden transition-all duration-1000 ${isActive ? 'shadow-[0_0_30px_rgba(16,185,129,0.1)]' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center">
            <Activity size={16} className="mr-2 text-emerald-400" />
            拦截活动监控
          </h3>
          <div className="flex items-center space-x-1">
             <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isActive ? 'animate-pulse' : 'opacity-30'}`}></span>
             <span className={`text-[10px] text-emerald-500 font-mono ${isActive ? '' : 'opacity-50'}`}>实时</span>
          </div>
        </div>
        <div className="-ml-2 min-h-[128px]">
           <React.Suspense fallback={<div className="h-32 flex items-center justify-center text-slate-500 text-xs">加载图表...</div>}>
             <StatsChart data={chartData} active={isActive} />
           </React.Suspense>
        </div>
      </div>

      {/* Status Bar */}
      <div className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-0.5 rounded-2xl">
        <div className="bg-[#0f172a] rounded-[14px] px-4 py-3 flex justify-between items-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-20 animate-shine pointer-events-none"></div>
           <div className="flex items-center space-x-3 z-10">
             <div className="p-1.5 bg-blue-500/20 rounded-lg">
               <Shield size={16} className="text-blue-400" />
             </div>
             <div>
               <div className="text-white font-medium text-xs">Blokada 引擎 v5.21</div>
               <div className="text-slate-400 text-[10px]">规则库更新: 刚刚</div>
             </div>
           </div>
           <CheckCircle2 size={18} className="text-emerald-500 z-10" />
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out pb-24">
      
      {/* DNS Settings */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5">
          <h3 className="font-semibold text-white flex items-center text-sm">
            <Globe size={16} className="mr-2 text-blue-400" />
            DNS 服务器配置
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {DNS_PROVIDERS.map((dns) => (
            <div 
              key={dns.id}
              onClick={() => setSelectedDns(dns.id)}
              className={`p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group ${selectedDns === dns.id ? 'bg-blue-500/5' : ''}`}
            >
              <div className="flex flex-col">
                <span className={`text-sm font-medium transition-colors ${selectedDns === dns.id ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                  {dns.name}
                </span>
                <span className="text-xs text-slate-500">{dns.description}</span>
              </div>
              {selectedDns === dns.id && (
                <div className="bg-blue-500/20 p-1 rounded-full">
                  <CheckCircle2 size={14} className="text-blue-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Settings */}
      <div className="glass-panel rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <Sparkles size={64} className="text-purple-500" />
        </div>
        <div className="p-4 border-b border-white/5 bg-white/5 relative z-10">
          <h3 className="font-semibold text-white flex items-center text-sm">
            <Sparkles size={16} className="mr-2 text-purple-400" />
            Gemini AI 引擎
          </h3>
        </div>
        <div className="p-5 relative z-10">
           <div className="flex items-start justify-between mb-6">
             <div className="text-sm text-slate-300 pr-4 leading-relaxed">
               启用 Gemini API 深度分析功能，识别即时生成的恶意域名。
             </div>
             <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold tracking-wide shadow-lg shadow-purple-500/30">
               PRO
             </div>
           </div>
           
           <button 
             onClick={handleConfigureKey}
             className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 border border-white/10 hover:border-purple-500/50 group"
           >
             <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" />
             <span>配置 API Key</span>
           </button>
        </div>
      </div>

      {/* General Settings */}
      <div className="glass-panel rounded-3xl overflow-hidden">
         <div className="p-4 flex justify-between items-center border-b border-white/5">
           <div className="flex items-center space-x-3">
             <Zap size={18} className="text-amber-400" />
             <span className="text-white text-sm">启动时自动运行</span>
           </div>
           <button 
             onClick={() => setAutoStart(!autoStart)}
             className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${autoStart ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}
           >
             <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${autoStart ? 'translate-x-5.5' : 'translate-x-0.5'}`}></div>
           </button>
         </div>
      </div>
      
      <div className="p-4 text-center opacity-40 hover:opacity-100 transition-opacity">
         <p className="text-[10px] text-slate-400 uppercase tracking-widest">PureGuard v1.0.0 (Build 2024)</p>
         <p className="text-[10px] text-slate-500 mt-1 font-mono">ID: {activationKey}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center text-slate-100 font-sans selection:bg-emerald-500/30">
      <div className="w-full max-w-md min-h-screen relative flex flex-col shadow-2xl overflow-hidden bg-transparent">
        <Background isActive={isActive} />

        {/* Floating Header */}
        <header className="px-6 py-4 flex justify-between items-center sticky top-0 z-30 pt-safe-top">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="relative">
              <Shield className="text-emerald-500" size={24} fill="rgba(16,185,129,0.1)" />
              {isActive && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span>}
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              PureGuard
            </h1>
          </div>
          <button onClick={() => setShowMenu(true)} className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Menu size={20} className="text-slate-300" />
          </button>
        </header>

        {/* Menu Modal */}
        {showMenu && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowMenu(false)}></div>
            <div className="w-72 h-full bg-[#0f172a] border-l border-white/10 p-6 flex flex-col relative animate-in slide-in-from-right duration-300 shadow-2xl">
              <button onClick={() => setShowMenu(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
              
              <div className="mt-12 mb-8">
                 <h2 className="text-2xl font-bold text-white mb-1">PureGuard</h2>
                 <p className="text-xs text-slate-500 uppercase tracking-wider">专业级移动安全防护</p>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
                  <Smartphone size={20} />
                  <span className="text-sm">关于我们</span>
                </button>
                <button className="w-full flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
                  <Shield size={20} />
                  <span className="text-sm">隐私政策</span>
                </button>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <button onClick={() => window.location.reload()} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium py-3 rounded-xl transition-colors border border-red-500/20">
                  退出登录
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-5 pt-4 scrollbar-hide relative z-10">
          {activeTab === Tab.HOME && renderHome()}
          {activeTab === Tab.LOGS && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out pb-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <Activity className="mr-2 text-emerald-500" size={18} />
                  网络活动日志
                </h2>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-400">实时监控</span>
              </div>
              <React.Suspense fallback={<div className="text-center text-slate-500 mt-10">加载日志组件...</div>}>
                <LiveLogs logs={logs} active={isActive} />
              </React.Suspense>
            </div>
          )}
          {activeTab === Tab.SCANNER && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out pb-24">
               <React.Suspense fallback={<div className="text-center text-slate-500 mt-10">加载扫描器...</div>}>
                 <DomainScanner />
               </React.Suspense>
            </div>
          )}
          {activeTab === Tab.SETTINGS && renderSettings()}
        </main>

        {/* Floating Dock Navigation */}
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <nav className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center space-x-8 shadow-2xl pointer-events-auto transform transition-transform hover:scale-[1.02]">
            
            <button 
              onClick={() => setActiveTab(Tab.HOME)} 
              className={`flex flex-col items-center justify-center space-y-1 w-10 relative group`}
            >
              <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === Tab.HOME ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 group-hover:text-white'}`}>
                <Shield size={20} className={activeTab === Tab.HOME ? 'fill-current' : ''} />
              </div>
              {activeTab === Tab.HOME && <span className="absolute -bottom-2 w-1 h-1 bg-emerald-500 rounded-full"></span>}
            </button>
            
            <button 
              onClick={() => setActiveTab(Tab.LOGS)} 
              className={`flex flex-col items-center justify-center space-y-1 w-10 relative group`}
            >
               <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === Tab.LOGS ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                <List size={20} />
              </div>
              {activeTab === Tab.LOGS && <span className="absolute -bottom-2 w-1 h-1 bg-blue-500 rounded-full"></span>}
            </button>

            <button 
              onClick={() => setActiveTab(Tab.SCANNER)} 
              className={`flex flex-col items-center justify-center space-y-1 w-10 relative group`}
            >
               <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === Tab.SCANNER ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 group-hover:text-white'}`}>
                <Sparkles size={20} />
              </div>
              {activeTab === Tab.SCANNER && <span className="absolute -bottom-2 w-1 h-1 bg-purple-500 rounded-full"></span>}
            </button>

            <button 
              onClick={() => setActiveTab(Tab.SETTINGS)} 
              className={`flex flex-col items-center justify-center space-y-1 w-10 relative group`}
            >
               <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === Tab.SETTINGS ? 'bg-slate-500/20 text-slate-300' : 'text-slate-400 group-hover:text-white'}`}>
                <Settings size={20} />
              </div>
              {activeTab === Tab.SETTINGS && <span className="absolute -bottom-2 w-1 h-1 bg-slate-400 rounded-full"></span>}
            </button>

          </nav>
        </div>
      </div>
    </div>
  );
};

export default App;