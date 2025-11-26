import { DnsProvider } from './types';

export const MOCK_DOMAINS_ALLOWED = [
  'google.com', 'github.com', 'stackoverflow.com', 'reactjs.org', 
  'tailwindcss.com', 'api.twitter.com', 'fonts.googleapis.com',
  'netflix.com', 'spotify.com', 'apple.com', 'microsoft.com'
];

export const MOCK_DOMAINS_BLOCKED = [
  'ads.google.com', 'analytics.facebook.com', 'tracker.adnetwork.net',
  'doubleclick.net', 'adservice.site', 'pixel.tracking.co', 
  'banners.marketing.io', 'popups.annoying.com'
];

export const DNS_PROVIDERS: DnsProvider[] = [
  {
    id: 'adguard',
    name: 'AdGuard DNS',
    description: '拦截广告与追踪器 (推荐)',
    primary: '94.140.14.14'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    description: '速度最快，无拦截',
    primary: '1.1.1.1'
  },
  {
    id: 'google',
    name: 'Google Public DNS',
    description: '可靠稳定',
    primary: '8.8.8.8'
  },
  {
    id: 'pureguard_pro',
    name: 'PureGuard AI (Pro)',
    description: '智能AI过滤 (Blokada修改版)',
    primary: '10.0.0.1'
  }
];
