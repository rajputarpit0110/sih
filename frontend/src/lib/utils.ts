import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals: number = 1): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatTonnes(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0 t';
  return `${Math.round(num).toLocaleString('en-IN')} t`;
}

export function formatCoord(deg: number, isLat: boolean): string {
  if (deg === undefined || deg === null || isNaN(deg)) return '0.0000°';
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
  return `${Math.abs(deg).toFixed(4)}° ${dir}`;
}

export function getRiskBadgeClass(risk: string) {
  switch (risk?.toUpperCase()) {
    case 'LOW':
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
    case 'MEDIUM':
      return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
    case 'HIGH':
      return 'bg-orange-950/80 text-orange-300 border-orange-700/60';
    case 'CRITICAL':
      return 'bg-rose-950/80 text-rose-300 border-rose-700/60';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

export function getProspectivityColor(level: string) {
  switch (level?.toUpperCase()) {
    case 'VERY HIGH':
      return 'text-amber-400 bg-amber-950/80 border-amber-600/70';
    case 'HIGH':
      return 'text-emerald-400 bg-emerald-950/80 border-emerald-700/70';
    case 'MEDIUM':
      return 'text-blue-400 bg-blue-950/80 border-blue-700/70';
    case 'LOW':
    default:
      return 'text-slate-400 bg-slate-900 border-slate-700/70';
  }
}
