import { Sparkles, ArrowRight, ShieldCheck, Heart, Moon, Zap } from 'lucide-react';
import { UserProfile, JournalLog } from '../types';
import { VeyaStore } from '../lib/store';

interface RhythmTrackerProps {
  profile: UserProfile;
  logs: JournalLog[];
  onOpenJournal: () => void;
}

export default function RhythmTracker({ profile, logs, onOpenJournal }: RhythmTrackerProps) {
  const state = VeyaStore.calculateCycleState(profile, logs);
  const phaseDetails = VeyaStore.getPhaseDetails(state.phase);

  // Math for progress ring: 2 * PI * R
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (state.currentDayOfCycle / state.totalCycleLength) * circumference;

  // Render correct color theme for current phase
  const getPhaseTheme = (ph: string) => {
    switch (ph) {
      case 'menstruation': return { bg: 'bg-rose-100/60 text-rose-600 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-900', circle: 'stroke-rose-400' };
      case 'follicular': return { bg: 'bg-indigo-100/60 text-indigo-600 dark:bg-indigo-950/20', border: 'border-indigo-200 dark:border-indigo-900', circle: 'stroke-indigo-400' };
      case 'ovulatory': return { bg: 'bg-amber-100/60 text-amber-600 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-900', circle: 'stroke-amber-400' };
      case 'luteal': return { bg: 'bg-[#EBE1FF]/60 text-veya-highlight dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-900', circle: 'stroke-purple-400' };
      default: return { bg: 'bg-indigo-100/60 text-indigo-600 dark:bg-indigo-950/20', border: 'border-indigo-200 dark:border-indigo-900', circle: 'stroke-indigo-400' };
    }
  };

  const theme = getPhaseTheme(state.phase);

  return (
    <div className="space-y-6">
      {/* Visual Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ring Centerpiece (left card) */}
        <div className="lg:col-span-5 bg-white dark:bg-veya-card-dark rounded-3xl p-10 border border-veya-border-light shadow-veya-sm flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[390px]">
          <div className="absolute inset-0 bg-radial-gradient from-veya-highlight/5 to-transparent pointer-events-none" />
          
          <span className="text-[10px] uppercase tracking-[0.25em] text-veya-text-secondary dark:text-veya-text-secondary-dark font-bold mb-7.5">
            Rhythm Sphere
          </span>

          {/* Interactive Progress circle */}
          <div className="relative flex items-center justify-center h-44 w-44 mb-7">
            <svg className="absolute -rotate-90 w-40 h-40 overflow-visible">
              {/* Secondary background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#EFE9FB] dark:stroke-veya-bg-dark/80"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Dynamic filled circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`${theme.circle} transition-all duration-700 ease-out`}
                strokeWidth="6.5"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pb-1 z-10">
              <span className="font-serif font-medium text-[2.2rem] leading-none text-veya-text-primary dark:text-white mt-5">
                Day {state.currentDayOfCycle}
              </span>
              <span className="font-sans text-[11px] font-semibold tracking-widest text-veya-text-muted uppercase mt-2">
                of {state.totalCycleLength} days
              </span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-4 border ${theme.bg} ${theme.border}`}>
                {state.phase.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="text-sm text-veya-text-secondary dark:text-veya-text-secondary-dark font-medium leading-relaxed max-w-[270px]">
            {state.daysToNextPeriod === 1 
              ? 'Your upcoming cycle begins tomorrow' 
              : `Approx. ${state.daysToNextPeriod} days remaining until upcoming period`}
          </p>
        </div>

        {/* Phase Details Card (right card) */}
        <div className="lg:col-span-7 bg-white dark:bg-veya-card-dark rounded-3xl p-9 border border-veya-border-light shadow-veya-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="h-2.5 w-2.5 rounded-full bg-veya-gradient shadow-veya-sm" />
              <h3 className="font-serif font-medium text-3xl text-veya-text-primary dark:text-white">
                {phaseDetails.title}
              </h3>
            </div>
            
            <p className="text-sm text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed">
              {phaseDetails.description}
            </p>

            <div className="border-t border-veya-border-light/60 dark:border-veya-bg-dark/60 my-5" />

            <div className="space-y-2.5">
              <span className="block text-[11px] font-heading font-bold uppercase tracking-wider text-veya-highlight">
                Personalized Ritual Suggestions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {phaseDetails.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-2xl bg-veya-bg-light/60 dark:bg-veya-bg-dark/30 border border-veya-border-light/40 dark:border-veya-card-dark/40">
                    <div className="h-5 w-5 rounded-full bg-white dark:bg-veya-card-dark shadow-sm flex items-center justify-center text-[10px] font-semibold text-veya-highlight flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-xs text-veya-text-primary dark:text-veya-text-primary-dark font-medium leading-relaxed">
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-veya-border-light/60 dark:border-veya-bg-dark/60 flex items-center justify-between">
            <span className="text-xs text-veya-text-muted flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-veya-sage" />
              Empirical Cycle Estimates
            </span>
            <button
              onClick={onOpenJournal}
              className="text-xs font-semibold text-veya-highlight hover:text-soft-violet flex items-center gap-1 group transition cursor-pointer"
            >
              Update Symptoms Log
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Cycle Phases Grid Timeline */}
      <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm">
        <h4 className="font-serif font-medium text-xl text-veya-text-primary dark:text-white mb-6">
          Your Complete 4-Phase Hormonal Wave
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {[
            { id: 'menstruation', name: 'Menstruation', days: `Days 1–${profile.periodLength}`, icon: Heart, desc: 'Rest & Release', color: 'text-rose-400 bg-rose-50 dark:bg-rose-950/20' },
            { id: 'follicular', name: 'Follicular', days: `Days ${profile.periodLength + 1}–${profile.cycleLength - 14}`, icon: Zap, desc: 'Envision & Build', color: 'text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20' },
            { id: 'ovulatory', name: 'Ovulatory', days: 'Days 14–16 (Est.)', icon: Sparkles, desc: 'Radiate & Speak', color: 'text-amber-400 bg-amber-50 dark:bg-amber-950/20' },
            { id: 'luteal', name: 'Luteal', days: `Days ${profile.cycleLength - 11}–${profile.cycleLength}`, icon: Moon, desc: 'Audit & Ground', color: 'text-purple-400 bg-[#F2ECFF] dark:bg-purple-950/20' },
          ].map((ph) => {
            const isActive = state.phase === ph.id;
            const Icon = ph.icon;
            return (
              <div 
                key={ph.id} 
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'border-veya-highlight bg-veya-bg-light/40 dark:bg-veya-card-dark ring-1 ring-veya-highlight shadow-lg' 
                    : 'border-veya-border-light/60 dark:border-veya-card-dark/40 bg-white dark:bg-veya-bg-dark/20'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 bg-veya-gradient text-white text-[9px] font-bold px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider">
                    Active
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${ph.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-sans text-veya-text-muted dark:text-veya-text-muted font-medium">
                      {ph.days}
                    </span>
                    <span className="font-heading font-bold text-sm text-veya-text-primary dark:text-white">
                      {ph.name}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark">
                  {ph.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
