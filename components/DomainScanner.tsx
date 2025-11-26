import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, AlertTriangle, CheckCircle, History, Trash2, ChevronRight, ExternalLink, Copy, Check } from 'lucide-react';
import { analyzeDomain } from '../services/geminiService';

interface ScanHistoryItem {
  id: string;
  domain: string;
  result: string;
  timestamp: number;
}

const DomainScanner: React.FC = React.memo(() => {
  const [domain, setDomain] = useState('');
  const [scannedDomain, setScannedDomain] = useState(''); // Store the actual domain being displayed
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // Initialize history from localStorage
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('domainScanHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse history", e);
      return [];
    }
  });

  const handleAnalyze = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setResult(null);
    const normalizedDomain = domain.trim();
    
    const analysis = await analyzeDomain(normalizedDomain);
    
    setResult(analysis);
    setScannedDomain(normalizedDomain); // Update the scanned domain ref
    setLoading(false);

    // Save to history with deduplication (move to top if exists)
    const existingHistory = history.filter(item => item.domain.toLowerCase() !== normalizedDomain.toLowerCase());

    const newItem: ScanHistoryItem = {
      id: Date.now().toString(),
      domain: normalizedDomain,
      result: analysis,
      timestamp: Date.now()
    };

    const updatedHistory = [newItem, ...existingHistory].slice(0, 20); // Keep last 20 items
    setHistory(updatedHistory);
    localStorage.setItem('domainScanHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('domainScanHistory');
  };

  const loadFromHistory = (item: ScanHistoryItem) => {
    setDomain(item.domain);
    setScannedDomain(item.domain); // Sync scanned domain
    setResult(item.result);
    // Scroll to top to see result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDomainUrl = () => {
    // Use scannedDomain if available, otherwise fallback to input
    const targetDomain = scannedDomain || domain;
    if (!targetDomain) return;
    
    let url = targetDomain.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyResultToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper to determine status color based on result text
  const getStatusColor = (text: string) => {
    if (text.includes('拦截') || text.includes('风险') || text.includes('恶意')) return 'bg-red-500';
    if (text.includes('放行') || text.includes('安全')) return 'bg-emerald-500';
    return 'bg-slate-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="text-purple-400" size={24} />
          <h2 className="text-xl font-bold text-white">AI 智能检测</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          不确定某个域名是否安全？输入域名，让 Gemini AI 帮你深度分析其潜在风险。
        </p>
        
        <div className="relative">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="例如: doubleclick.net"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
          <button 
            onClick={handleAnalyze}
            disabled={loading || !domain}
            className="absolute right-2 top-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white p-1.5 rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-slate-800/30 p-8 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center animate-pulse">
           <Loader2 className="animate-spin text-purple-500 mb-3" size={32} />
           <p className="text-slate-400 text-sm font-medium">正在进行 AI 安全分析...</p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4 relative group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">分析报告</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={copyResultToClipboard}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                title="复制分析结果"
              >
                {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{isCopied ? '已复制' : '复制结果'}</span>
              </button>
              <button 
                onClick={openDomainUrl}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-purple-500/30"
                title={`访问 ${scannedDomain}`}
              >
                <ExternalLink size={14} />
                <span>访问网站</span>
              </button>
            </div>
          </div>
          
          <div className="prose prose-invert prose-sm">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
          
          <div className="mt-4 flex items-center space-x-2 text-xs text-slate-500">
             <span>由 Gemini 2.5 Flash 提供技术支持</span>
          </div>
        </div>
      )}

      {/* Static Info Cards */}
      {!result && !loading && history.length === 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center">
              <CheckCircle className="text-emerald-500 mb-2" size={24} />
              <h4 className="text-slate-200 font-medium text-sm">白名单检查</h4>
              <p className="text-slate-500 text-xs mt-1">验证域名是否在安全列表中</p>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center">
              <AlertTriangle className="text-amber-500 mb-2" size={24} />
              <h4 className="text-slate-200 font-medium text-sm">恶意库匹配</h4>
              <p className="text-slate-500 text-xs mt-1">与 Blokada 数据库交叉比对</p>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-2 text-slate-300">
              <History size={16} />
              <h3 className="font-semibold text-sm">扫描历史</h3>
          </div>
          {history.length > 0 && (
              <button 
                onClick={clearHistory} 
                className="text-xs text-slate-500 hover:text-red-400 flex items-center transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                  <Trash2 size={12} className="mr-1" /> 清空记录
              </button>
          )}
        </div>
        
        <div className="space-y-3">
          {history.length === 0 ? (
              <div className="text-center text-slate-600 text-xs py-8 border border-dashed border-slate-800 rounded-xl">
                暂无历史记录，开始第一次扫描吧
              </div>
          ) : (
              history.map(item => (
                  <div 
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="bg-slate-800/30 hover:bg-slate-700/50 border border-slate-800/50 rounded-xl p-3 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]"
                  >
                      <div className="flex items-center overflow-hidden mr-3">
                          <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${getStatusColor(item.result)}`} />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm text-slate-200 font-medium truncate">{item.domain}</span>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {new Date(item.timestamp).toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                  </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
});

export default DomainScanner;