import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

interface LiveLogsProps {
  logs: LogEntry[];
  active: boolean;
}

// Extract LogItem to prevent re-rendering of existing items
const LogItem = React.memo(({ log }: { log: LogEntry }) => (
  <div 
    className={`flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-800/50 backdrop-blur-sm transition-all animate-in fade-in slide-in-from-bottom-2`}
  >
    <div className="flex items-center space-x-3 overflow-hidden">
      <div className={`p-2 rounded-full ${log.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
        {log.status === 'BLOCKED' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
      </div>
      <div className="flex flex-col truncate">
        <span className="text-sm font-medium text-slate-200 truncate">{log.domain}</span>
        <span className="text-xs text-slate-500">
          {new Date(log.timestamp).toLocaleTimeString()} • {log.status === 'BLOCKED' ? '已拦截' : '允许'}
        </span>
      </div>
    </div>
    <div className="text-xs font-medium text-slate-600">
       {log.status === 'BLOCKED' ? '广告' : '正常'}
    </div>
  </div>
));

const LiveLogs: React.FC<LiveLogsProps> = React.memo(({ logs, active }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!active && logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Activity size={48} className="mb-4 opacity-50" />
        <p>保护未开启，无实时日志</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 pb-20">
      {logs.length === 0 ? (
        <div className="text-center text-slate-500 mt-10">等待网络活动...</div>
      ) : (
        logs.map((log) => (
          <LogItem key={log.id} log={log} />
        ))
      )}
      <div ref={endRef} />
    </div>
  );
});

export default LiveLogs;