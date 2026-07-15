import React, { useState } from 'react';
import { Settings, ShieldCheck, Download, Trash2, Save, Moon, Sun, Sparkles } from 'lucide-react';
import { UserProfile, JournalLog } from '../types';
import { VeyaStore } from '../lib/store';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

export default function SettingsView({ profile, onUpdateProfile }: SettingsViewProps) {
  const [name, setName] = useState(profile.name);
  const [cycleLength, setCycleLength] = useState(profile.cycleLength);
  const [periodLength, setPeriodLength] = useState(profile.periodLength);
  const [lastPeriodDate, setLastPeriodDate] = useState(profile.lastPeriodDate);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name,
      cycleLength: Number(cycleLength),
      periodLength: Number(periodLength),
      lastPeriodDate,
    };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = () => {
    const logs = VeyaStore.getLogs();
    const exportObject = {
      app: "VEYA",
      exportedAt: new Date().toISOString(),
      profile,
      logs
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VEYA_Database_Export_${name}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm("Are you absolutely sure you want to delete your entire VEYA logging history? This is irreversible.")) {
      localStorage.removeItem('veya_logs');
      localStorage.removeItem('veya_profile');
      localStorage.removeItem('veya_insights');
      window.location.reload();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Profile Parameters (left card) */}
      <div className="lg:col-span-7 bg-white dark:bg-veya-card-dark rounded-3xl p-6 sm:p-8 border border-veya-border-light shadow-veya-sm space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-veya-gradient flex items-center justify-center text-white">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif font-medium text-2xl text-veya-text-primary dark:text-white">Profile Parameters</h3>
            <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark">Customize your hormonal baseline cycle mathematical metrics</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-veya-text-muted">Your First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-veya-bg-light/60 dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl px-4 py-3 text-xs sm:text-sm text-veya-text-primary dark:text-white focus:outline-none focus:border-veya-highlight"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-veya-text-muted">Avg Cycle Length (days)</label>
              <input
                type="number"
                min="20"
                max="45"
                value={cycleLength}
                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                className="w-full bg-veya-bg-light/60 dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl px-4 py-3 text-xs sm:text-sm text-veya-text-primary dark:text-white focus:outline-none focus:border-veya-highlight"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-veya-text-muted">Avg Period Length (days)</label>
              <input
                type="number"
                min="3"
                max="10"
                value={periodLength}
                onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                className="w-full bg-veya-bg-light/60 dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl px-4 py-3 text-xs sm:text-sm text-veya-text-primary dark:text-white focus:outline-none focus:border-veya-highlight"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-veya-text-muted">Start Date of Last Period</label>
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="w-full bg-veya-bg-light/60 dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl px-4 py-3 text-xs sm:text-sm text-veya-text-primary dark:text-white focus:outline-none focus:border-veya-highlight"
            />
          </div>

          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-600 dark:text-veya-sage font-medium">
              Profile metrics successfully updated and saved locally!
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-veya-gradient hover:bg-veya-gradient-hover text-white font-heading font-semibold text-xs sm:text-sm py-3.5 rounded-2xl shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile Baseline</span>
          </button>
        </form>
      </div>

      {/* Global Theme & Security Data Controls (right cards) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Visual Settings Panel */}
        <div className="bg-white rounded-3xl p-6 border border-veya-border-light space-y-4">
          <span className="block text-[10px] uppercase tracking-widest text-veya-text-muted font-bold">Aesthetic Identity</span>
          <h4 className="font-heading font-bold text-base text-veya-text-primary">Aesthetic Atmosphere</h4>
          <p className="text-xs text-veya-text-secondary leading-relaxed">
            VEYA runs exclusively in our signature <span className="font-semibold text-veya-highlight">Morning Lavender & Blush</span> light mode. This high-contrast, soft-colored palette is mindfully curated to be gentle on your eyes and evoke a sense of peaceful serenity.
          </p>

          <div className="w-full border border-veya-border-light bg-veya-bg-light rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-veya-text-primary">Selected Vibe</span>
            <div className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-veya-border-light text-xs font-semibold text-veya-highlight">
              <Sparkles className="h-3.5 w-3.5 text-veya-highlight" />
              <span>Lavender & Blush</span>
            </div>
          </div>
        </div>

        {/* Local Data Privacy & Sandbox Controls */}
        <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm space-y-4">
          <span className="block text-[10px] uppercase tracking-widest text-veya-text-muted font-bold">Privacy Controls</span>
          <h4 className="font-heading font-bold text-base text-veya-text-primary dark:text-white">Personal Health Sovereignty</h4>
          <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed">
            We adhere to absolute personal sovereignty. Your physical metrics are stored exclusively on-device in your localized sandbox. They are parsed server-side anonymously strictly when generating AI insights, and are never logged on persistent databases.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportData}
              className="bg-[#F2ECFF] dark:bg-purple-950/20 hover:bg-[#EBE1FF]/60 border border-veya-border-light dark:border-purple-900/40 text-veya-highlight dark:text-purple-400 font-sans font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export DB</span>
            </button>
            <button
              onClick={handleResetData}
              className="bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100/60 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-sans font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
