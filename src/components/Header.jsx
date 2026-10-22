import React from 'react';
import { KeyRound, Settings } from 'lucide-react';
import ProtonIcon from './ProtonIcon';
import { storageService } from '../services/storageService';

export default function Header({ onOpenSettings }) {
  const hasApiKey = Boolean(storageService.getApiKey());

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-rose-100/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Title & Proton Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-rose-400 flex items-center justify-center p-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-transform">
            <ProtonIcon className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-purple-700 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
              Learning English
            </span>
            <span className="text-[11px] font-extrabold bg-gradient-to-r from-purple-100 to-rose-100 text-purple-800 px-2 py-0.5 rounded-full border border-rose-200/60 font-numeric">
              A1-A2
            </span>
          </div>
        </div>

        {/* Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            hasApiKey
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 active:bg-emerald-100'
              : 'border-rose-200 bg-gradient-to-r from-purple-50 to-rose-50 text-rose-700 active:from-purple-100 active:to-rose-100 animate-pulse'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-purple-600" />
          <span>{hasApiKey ? 'Đã có Key' : 'Cài Key'}</span>
          <Settings className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
