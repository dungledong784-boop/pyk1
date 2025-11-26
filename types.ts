export enum Tab {
  HOME = 'HOME',
  LOGS = 'LOGS',
  SCANNER = 'SCANNER',
  SETTINGS = 'SETTINGS'
}

export interface LogEntry {
  id: string;
  timestamp: number;
  domain: string;
  status: 'BLOCKED' | 'ALLOWED';
  source: string;
}

export interface DnsProvider {
  id: string;
  name: string;
  description: string;
  primary: string;
}

export interface AppStats {
  adsBlocked: number;
  trackersStopped: number;
  dataSavedMb: number;
}
