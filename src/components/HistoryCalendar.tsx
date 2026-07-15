import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Edit2, ShieldAlert, Heart, Smile, Moon, Sparkles, Filter } from 'lucide-react';
import { UserProfile, JournalLog } from '../types';
import { VeyaStore } from '../lib/store';
import { phaseDisplay, phaseColors } from '../lib/phaseLabels';

interface HistoryCalendarProps {
  profile: UserProfile;
  logs: JournalLog[];
  onOpenJournalForDate: (date: string) => void;
}

export default function HistoryCalendar({ profile, logs, onOpenJournalForDate }: HistoryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [filterSymptom, setFilterSymptom] = useState<string>('all');

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of week (0-6)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create array representing days
  const calendarDays: (number | null)[] = [];
  
  // Padding for starting days of week
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Find a specific log by date string
  const getLogForDateStr = (dateStr: string): JournalLog | undefined => {
    return logs.find((l) => l.date === dateStr);
  };

  // Get list of unique symptoms logged for filter list
  const allUniqueLoggedSymptoms = Array.from(
    new Set(logs.flatMap((l) => l.symptoms || []))
  );

  // Map day status
  const getDayStatus = (dayNum: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const log = getLogForDateStr(dStr);
    const state = VeyaStore.calculateCycleState(profile, logs, new Date(dStr));
    
    return {
      dateStr: dStr,
      log,
      phase: state.phase,
      isPeriod: log?.flow !== null && log?.flow !== undefined,
      isToday: dStr === new Date().toISOString().split('T')[0]
    };
  };

  const activeLog = getLogForDateStr(selectedDateStr);
  const activeCycleState = VeyaStore.calculateCycleState(profile, logs, new Date(selectedDateStr));

  return (
    <div className="space-y-6">
      
      {/* Search Filter Strip */}
      <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-4 border border-veya-border-light shadow-veya-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-veya-highlight" />
          <span className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">
            Filter Log History
          </span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterSymptom}
            onChange={(e) => setFilterSymptom(e.target.value)}
            className="bg-veya-bg-light/60 dark:bg-veya-bg-dark/40 text-xs text-veya-text-primary dark:text-white border border-veya-border-light dark:border-veya-card-dark rounded-xl px-4 py-2 w-full sm:w-56 focus:outline-none"
          >
            <option value="all">Show all entries</option>
            {allUniqueLoggedSymptoms.map((sym) => (
              <option key={sym} value={sym}>
                Logged: {sym.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Core Section */}
        <div className="lg:col-span-7 bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm">
          
          {/* Month Navigator Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-medium text-2xl text-veya-text-primary dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            
            <div className="flex space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2.5 rounded-xl border border-veya-border-light dark:border-veya-card-dark text-veya-text-muted hover:text-veya-text-secondary dark:hover:text-slate-200 hover:bg-veya-bg-secondary dark:hover:bg-veya-bg-dark/80 transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2.5 rounded-xl border border-veya-border-light dark:border-veya-card-dark text-veya-text-muted hover:text-veya-text-secondary dark:hover:text-slate-200 hover:bg-veya-bg-secondary dark:hover:bg-veya-bg-dark/80 transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday titles */}
          <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-heading font-bold uppercase tracking-wider text-veya-text-muted dark:text-veya-text-muted mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayNum, index) => {
              if (dayNum === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const info = getDayStatus(dayNum);
              const isSelected = info.dateStr === selectedDateStr;
  
              // Filter check
              let matchesFilter = true;
              if (filterSymptom !== 'all') {
                matchesFilter = info.log?.symptoms.includes(filterSymptom) || false;
              }

              // Color classes based on cycle phase
              let styleClasses = `
                border
                text-veya-text-primary
                dark:text-white
                transition-all
                duration-200
                ${phaseColors[info.phase].background}
                ${phaseColors[info.phase].border}
              `;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDateStr(info.dateStr)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 p-1.5 transition relative cursor-pointer group select-none ${styleClasses} ${
                    isSelected ? `ring-[2.5px] ring-offset-2 dark:ring-offset-veya-bg-dark ${phaseColors[info.phase].ring}` : ''
                  } ${!matchesFilter ? 'opacity-30' : ''}`}
                >
                  {/* Small dots indicators */}
                  <div className="flex gap-1">
                    {info.log && !info.isPeriod && (
                      <span className="h-1.5 w-1.5 rounded-full bg-veya-highlight" />
                    )}
                    {info.isToday && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    )}
                  </div>

                  <span
                    className={`text-xs sm:text-sm font-sans font-bold ${
                      info.phase !== "menstruation" ? phaseColors[info.phase].text : ""
                    }`}
                  >
                    {dayNum}
                  </span>

                  <span
                    className={`text-[7px] tracking-wider uppercase opacity-70 block sm:hidden ${
                      info.phase !== "menstruation" ? phaseColors[info.phase].text : ""
                    }`}
                  >
                    {phaseDisplay[info.phase]}
                  </span>

                  <span
                    className={`text-[8px] font-sans font-semibold uppercase tracking-[0.18em] hidden sm:block opacity-80 ${
                      info.phase !== "menstruation" ? phaseColors[info.phase].text : ""
                    }`}
                  >
                    {phaseDisplay[info.phase]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-veya-border-light/60 dark:border-veya-bg-dark/60 flex flex-wrap gap-x-5 gap-y-3 items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-veya-text-muted dark:text-veya-text-muted">

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-pink-400 shadow-sm" />
              <span>Menstruation</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-violet-100 border border-violet-300" />
              <span>Follicular</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-amber-100 border border-amber-300" />
              <span>Ovulatory (Est.)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-indigo-100 border border-indigo-300" />
              <span>Luteal</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-veya-highlight" />
              <span>Journal Entry</span>
            </div>

          </div>

        </div>

        {/* Selected Day Log Details Pane (right card) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-veya-text-secondary dark:text-veya-text-secondary-dark font-bold">
                Detail Inspect
              </span>
              <button
                id="edit-selected-day-log"
                onClick={() => onOpenJournalForDate(selectedDateStr)}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl border border-veya-border-light dark:border-veya-card-dark text-xs font-semibold text-veya-highlight hover:bg-veya-bg-light/60 dark:hover:bg-veya-bg-dark/40 transition cursor-pointer"
              >
                <Edit2 className="h-3 w-3" />
                <span>Log Entry</span>
              </button>
            </div>

            <h4 className="font-serif font-medium text-xl text-veya-text-primary dark:text-white mb-1.5">
              {new Date(selectedDateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h4>
            <span className="inline-block text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-veya-bg-light dark:bg-veya-bg-dark/80 text-veya-highlight uppercase tracking-wider mb-5">
              {activeCycleState.phase} phase • Day {activeCycleState.currentDayOfCycle}
            </span>

            {activeLog ? (
              <div className="space-y-5">
                {/* Flow and Pain stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 p-3 rounded-2xl border border-veya-border-light/40 dark:border-veya-card-dark/40">
                    <span className="block text-[10px] uppercase tracking-widest text-veya-text-muted mb-1">Period Flow</span>
                    <span className="font-heading font-bold text-sm text-veya-text-primary dark:text-white flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-veya-rose" />
                      {activeLog.flow === null ? 'None' : (activeLog.flow === 1 ? 'Light' : (activeLog.flow === 2 ? 'Medium' : 'Heavy'))}
                    </span>
                  </div>
                  <div className="bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 p-3 rounded-2xl border border-veya-border-light/40 dark:border-veya-card-dark/40">
                    <span className="block text-[10px] uppercase tracking-widest text-veya-text-muted mb-1">Cramp Pain</span>
                    <span className="font-heading font-bold text-sm text-veya-text-primary dark:text-white flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-violet-400" />
                      {activeLog.pain} / 10
                    </span>
                  </div>
                </div>

                {/* Mood, Sleep, Energy */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 p-2 text-center rounded-xl border border-veya-border-light/20">
                    <span className="block text-[9px] text-veya-text-muted">Mood</span>
                    <span className="text-xs font-semibold text-veya-text-primary dark:text-white capitalize block mt-1">
                      {activeLog.mood}
                    </span>
                  </div>
                  <div className="bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 p-2 text-center rounded-xl border border-veya-border-light/20">
                    <span className="block text-[9px] text-veya-text-muted">Sleep</span>
                    <span className="text-xs font-semibold text-veya-text-primary dark:text-white block mt-1">
                      {activeLog.sleep} hrs
                    </span>
                  </div>
                  <div className="bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 p-2 text-center rounded-xl border border-veya-border-light/20">
                    <span className="block text-[9px] text-veya-text-muted">Vitality</span>
                    <span className="text-xs font-semibold text-[#D9A05B] block mt-1">
                      {activeLog.energy} ★
                    </span>
                  </div>
                </div>

                {/* Symptoms chips */}
                {activeLog.symptoms && activeLog.symptoms.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="block text-[10px] uppercase tracking-widest text-veya-text-muted">Logged Symptoms</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeLog.symptoms.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full bg-[#F2ECFF] dark:bg-purple-950/20 text-[11px] font-sans font-semibold text-veya-highlight dark:text-purple-400 border border-veya-border-light dark:border-purple-900/40">
                          {s.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Movement / Medication */}
                <div className="space-y-2 text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark">
                  {activeLog.exercise && activeLog.exercise !== 'none' && (
                    <p>• <strong>Movement</strong>: {activeLog.exercise} intensity log</p>
                  )}
                  {activeLog.medication && (
                    <p>• <strong>Supplements</strong>: {activeLog.medication}</p>
                  )}
                </div>

                {/* Daily Notes */}
                {activeLog.notes && (
                  <div className="bg-[#F2ECFF]/30 dark:bg-veya-bg-dark/40 p-4 rounded-2xl border border-veya-border-light/40 dark:border-veya-card-dark/40 text-xs italic text-veya-text-secondary dark:text-[#D5C9EE] leading-relaxed">
                    "{activeLog.notes}"
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <ShieldAlert className="h-10 w-10 text-[#D5C9EE] dark:text-veya-text-secondary mx-auto" />
                <p className="text-xs text-veya-text-muted max-w-xs mx-auto">
                  No detailed physiological or mood logs exist for this date. Click 'Log Entry' to log flow, symptoms, and sleep parameters!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
