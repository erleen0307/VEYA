import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Moon, 
  Sun, 
  Activity, 
  Brain, 
  FileText, 
  BookOpen, 
  Settings as SettingsIcon,
  MessageSquareHeart,
  Plus,
  ShieldCheck,
  Heart,
  Zap,
  Smile
} from 'lucide-react';

import { UserProfile, JournalLog, InsightCard } from './types';
import { VeyaStore } from './lib/store';

// Subcomponents
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CycleJournalModal from './components/CycleJournalModal';
import RhythmTracker from './components/RhythmTracker';
import InsightsView from './components/InsightsView';
import HistoryCalendar from './components/HistoryCalendar';
import ReportsView from './components/ReportsView';
import LearnView from './components/LearnView';
import SettingsView from './components/SettingsView';
import ChatCompanion from './components/ChatCompanion';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [profile, setProfile] = useState<UserProfile>(VeyaStore.getProfile());
  const [logs, setLogs] = useState<JournalLog[]>(VeyaStore.getLogs());
  const [insights, setInsights] = useState<InsightCard[]>(VeyaStore.getInsights());
  // Lock theme permanently to light for unified premium experience
  const theme = 'light';
  
  // Journal Modal state
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [journalTargetDate, setJournalTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Sync theme class on mount
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    VeyaStore.saveTheme('light');
  }, []);

  const handleUpdateProfile = (newProfile: UserProfile) => {
    VeyaStore.saveProfile(newProfile);
    setProfile(newProfile);
    // Recalculate logs / history based on new profile start period
    const updatedLogs = VeyaStore.getLogs();
    setLogs(updatedLogs);
  };

  const handleSaveLog = (newLog: JournalLog) => {
    const updated = VeyaStore.addOrUpdateLog(newLog);
    setLogs(updated);
  };

  // Quick helper to fetch today's log if it exists
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === todayDateStr);
  const todayCycleState = VeyaStore.calculateCycleState(profile, logs);

  const getActivePageTitle = () => {
    switch (activeTab) {
      case 'today': return "Daily Sanctuary";
      case 'rhythm': return "Endocrine Rhythm";
      case 'insights': return "AI Insights Panel";
      case 'history': return "Historical Logbook";
      case 'chat': return "VEYA AI Companion";
      case 'reports': return "Clinical Dossier";
      case 'learn': return "Learn Academy";
      case 'settings': return "Settings Parameters";
      default: return "Sanctuary";
    }
  };

  return (
    <div className="min-h-screen bg-veya-bg-light flex flex-col transition-colors duration-300">
      
      {/* Upper header navigation */}
      <Header 
        profile={profile} 
        activePage={getActivePageTitle()} 
      />

      {/* Main split dashboard frame */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-0 md:p-8 gap-0 md:gap-8">
        
        {/* Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onChangeTab={setActiveTab} 
          onOpenJournal={() => {
            setJournalTargetDate(todayDateStr);
            setIsJournalOpen(true);
          }} 
        />

        {/* Core Workspace content router */}
        <main className="flex-1 p-6 md:p-0 overflow-y-auto">
          <div key={activeTab} className="animate-fade-up">
          {activeTab === 'today' && (
            <div className="space-y-6">
              
              {/* Personalized Greetings Banner */}
              <div className="bg-veya-wash-lavender dark:bg-veya-card-dark rounded-3xl p-8 sm:p-10 border border-veya-border-light shadow-veya-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Sparkles className="h-48 w-48 text-veya-highlight" />
                </div>

                <div className="space-y-3 relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-veya-text-muted font-semibold block">
                    Welcome Back, {profile.name}
                  </span>
                  <h2 className="font-serif font-medium text-3xl sm:text-4xl text-veya-text-primary dark:text-white leading-snug">
                    How does your body feel today?
                  </h2>
                  <p className="text-xs sm:text-sm text-veya-text-secondary dark:text-veya-text-secondary-dark font-medium">
                    Today is Day {todayCycleState.currentDayOfCycle} of your cycle, entering the <span className="text-veya-highlight font-semibold">{todayCycleState.phase} phase</span>.
                  </p>
                </div>

                <button
                  id="log-vibe-today"
                  onClick={() => {
                    setJournalTargetDate(todayDateStr);
                    setIsJournalOpen(true);
                  }}
                  className="bg-veya-gradient hover:bg-veya-gradient-hover text-white font-heading font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-2xl shadow-lg transition transform active:scale-95 flex items-center justify-center space-x-2 relative z-10 cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>{todayLog ? 'Edit Daily Logs' : 'Log Today\'s Vibe'}</span>
                </button>
              </div>

              {/* Today's Logged State Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Status Card */}
                <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-widest text-veya-text-muted font-bold">Daily Mirror</span>
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-veya-bg-light dark:bg-veya-bg-dark/80 text-veya-highlight uppercase">
                        Today's Parameters
                      </span>
                    </div>

                    {todayLog ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 p-3.5 rounded-2xl border border-veya-border-light/40 text-center">
                            <span className="block text-[9px] uppercase text-veya-text-muted font-bold mb-1">Period Flow</span>
                            <span className="font-heading font-bold text-sm text-veya-text-primary dark:text-white flex items-center justify-center gap-1.5">
                              <Heart className="h-4 w-4 text-veya-rose" />
                              {todayLog.flow === null ? 'No period' : (todayLog.flow === 1 ? 'Light' : (todayLog.flow === 2 ? 'Medium' : 'Heavy'))}
                            </span>
                          </div>
                          <div className="bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 p-3.5 rounded-2xl border border-veya-border-light/40 text-center">
                            <span className="block text-[9px] uppercase text-veya-text-muted font-bold mb-1">Pelvic Cramps</span>
                            <span className="font-heading font-bold text-sm text-veya-text-primary dark:text-white flex items-center justify-center gap-1.5">
                              <Zap className="h-4 w-4 text-violet-400" />
                              {todayLog.pain} / 10
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="px-3 py-1 bg-teal-50 dark:bg-teal-950/20 text-teal-600 border border-teal-200/50 rounded-full text-xs font-semibold capitalize flex items-center gap-1">
                            <Smile className="h-3.5 w-3.5 text-teal-500" />
                            {todayLog.mood}
                          </span>
                          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-200/50 rounded-full text-xs font-semibold flex items-center gap-1">
                            Vitality: {todayLog.energy} ★
                          </span>
                          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border border-indigo-200/50 rounded-full text-xs font-semibold flex items-center gap-1">
                            Rest: {todayLog.sleep} hrs
                          </span>
                        </div>

                        {todayLog.symptoms && todayLog.symptoms.length > 0 && (
                          <div className="pt-2">
                            <span className="block text-[10px] text-veya-text-muted mb-1.5 font-bold uppercase tracking-wider">Physiological Symptoms</span>
                            <div className="flex flex-wrap gap-1">
                              {todayLog.symptoms.map(s => (
                                <span key={s} className="px-2.5 py-1 rounded-full bg-[#F2ECFF] dark:bg-purple-950/20 text-[10px] font-sans font-semibold text-veya-highlight dark:text-purple-400 border border-veya-border-light dark:border-purple-900/40">
                                  {s.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {todayLog.notes && (
                          <div className="bg-[#F2ECFF]/20 dark:bg-veya-bg-dark/40 p-3.5 rounded-2xl border border-veya-border-light/40 text-xs italic text-veya-text-secondary dark:text-[#D5C9EE] leading-relaxed">
                            "{todayLog.notes}"
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-veya-text-muted text-xs flex flex-col items-center justify-center space-y-3">
                        <Calendar className="h-8 w-8 text-[#D5C9EE] dark:text-veya-text-secondary" />
                        <p className="max-w-xs leading-relaxed">
                          You haven't logged today's parameters yet. Recording flow, cramps, sleep, and emotional moods unlocks personalized hormonal AI insights!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-veya-border-light/60 dark:border-veya-bg-dark/60 flex items-center justify-between text-[11px] text-veya-text-muted">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-veya-sage" />
                      Encrypted Sandbox Storage
                    </span>
                    <button
                      onClick={() => {
                        setJournalTargetDate(todayDateStr);
                        setIsJournalOpen(true);
                      }}
                      className="font-semibold text-veya-highlight hover:text-soft-violet flex items-center gap-1"
                    >
                      {todayLog ? 'Refine logs' : 'Log parameters'}
                    </button>
                  </div>
                </div>

                {/* Companion Prompting card */}
                <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="block text-[10px] uppercase tracking-widest text-veya-text-muted font-bold">Veya Companion</span>
                    <h3 className="font-heading font-bold text-base text-veya-text-primary dark:text-white">
                      Ask your wellness companion
                    </h3>
                    <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed">
                      Instead of researching generic guidelines online, converse directly with VEYA. VEYA cross-references your physical parameters, moods, and sleep duration history to explain daily fluctuations.
                    </p>

                    <div className="bg-veya-bg-light/60 dark:bg-veya-bg-dark/20 p-3.5 rounded-2xl border border-veya-border-light/40">
                      <span className="block text-[9px] uppercase tracking-wider text-veya-text-muted font-bold mb-1.5">Try asking:</span>
                      <p className="text-xs text-veya-text-secondary dark:text-[#D5C9EE] font-medium italic">
                        "Why am I tired today?" or "Give me a daily ritual for late luteal cramps."
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className="w-full mt-6 bg-veya-bg-light dark:bg-veya-bg-dark hover:bg-veya-bg-light/80 text-veya-highlight font-heading font-semibold text-xs py-3 rounded-2xl border border-veya-border-light dark:border-veya-card-dark flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <MessageSquareHeart className="h-4 w-4" />
                    <span>Converse with VEYA AI</span>
                  </button>
                </div>

              </div>

              {/* Dynamic Phase details quick link card */}
              <div 
                onClick={() => setActiveTab('rhythm')}
                className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm hover:border-veya-highlight/30 hover:shadow-veya transition duration-300 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-2xl bg-veya-bg-light dark:bg-veya-bg-dark/80 flex items-center justify-center text-veya-highlight flex-shrink-0">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-veya-text-primary dark:text-white group-hover:text-veya-highlight transition">
                      View Cycle Rhythm Timeline
                    </h4>
                    <p className="text-xs text-veya-text-muted">
                      Map out fertile windows, luteal audit windows, and upcoming cycle dates.
                    </p>
                  </div>
                </div>
                <Plus className="h-5 w-5 text-veya-text-muted group-hover:translate-x-1 group-hover:text-veya-highlight transition-all" />
              </div>

            </div>
          )}

          {activeTab === 'rhythm' && (
            <RhythmTracker 
              profile={profile} 
              logs={logs} 
              onOpenJournal={() => {
                setJournalTargetDate(todayDateStr);
                setIsJournalOpen(true);
              }} 
            />
          )}

          {activeTab === 'insights' && (
            <InsightsView 
              profile={profile} 
              logs={logs} 
              insights={insights} 
              onUpdateInsights={(newInsights) => setInsights(newInsights)} 
            />
          )}

          {activeTab === 'history' && (
            <HistoryCalendar 
              profile={profile} 
              logs={logs} 
              onOpenJournalForDate={(targetDate) => {
                setJournalTargetDate(targetDate);
                setIsJournalOpen(true);
              }} 
            />
          )}

          {activeTab === 'chat' && (
            <ChatCompanion 
              profile={profile} 
              logs={logs} 
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView 
              profile={profile} 
              logs={logs} 
            />
          )}

          {activeTab === 'learn' && (
            <LearnView />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              profile={profile} 
              onUpdateProfile={handleUpdateProfile}
            />
          )}
          </div>
        </main>

      </div>

      {/* Persistent global journal modal dialog */}
      <CycleJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        selectedDate={journalTargetDate}
        initialLog={logs.find(l => l.date === journalTargetDate)}
        onSave={handleSaveLog}
      />

    </div>
  );
}
