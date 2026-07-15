import { useState } from 'react';
import { Brain, Sparkles, RefreshCw, Moon, Zap, Smile, HelpCircle, Activity } from 'lucide-react';
import { UserProfile, JournalLog, InsightCard } from '../types';
import { VeyaStore } from '../lib/store';

interface InsightsViewProps {
  profile: UserProfile;
  logs: JournalLog[];
  insights: InsightCard[];
  onUpdateInsights: (newInsights: InsightCard[]) => void;
}

export default function InsightsView({ profile, logs, insights, onUpdateInsights }: InsightsViewProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRefresh = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const refreshed = await VeyaStore.generateAIInsights(profile, logs);
      onUpdateInsights(refreshed);
    } catch (e) {
      setErrorMessage("Could not connect to the VEYA analysis engine. Fallback logs loaded safely.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rhythm': return <Activity className="h-5 w-5 text-indigo-400" />;
      case 'sleep': return <Moon className="h-5 w-5 text-indigo-400" />;
      case 'symptoms': return <Smile className="h-5 w-5 text-pink-400" />;
      case 'energy': return <Zap className="h-5 w-5 text-amber-400" />;
      default: return <Brain className="h-5 w-5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 sm:p-8 border border-veya-border-light shadow-veya-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="h-44 w-44 text-veya-highlight" />
        </div>
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-veya-bg-light dark:bg-veya-bg-dark/60 border border-veya-border-light shadow-veya-sm px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-veya-highlight" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-veya-highlight">
              AI Pattern Core
            </span>
          </div>
          <h3 className="font-serif font-medium text-3xl text-veya-text-primary dark:text-white">
            Personalized Hormonal Observations
          </h3>
          <p className="text-xs sm:text-sm text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed">
            Our secure AI engine cross-references your sleep logs, symptoms, cycle days, and energy shifts to find gentle, non-clinical trends unique to your baseline.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="relative z-10 bg-veya-gradient hover:bg-veya-gradient-hover disabled:opacity-70 text-white font-heading font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition transform active:scale-95 flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing Trends...' : 'Refresh AI Analysis'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl text-xs text-amber-600 dark:text-amber-400 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // Beautiful pulse loading skeletons
          [1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light dark:border-veya-card-dark/60 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 rounded-xl bg-veya-bg-secondary dark:bg-veya-bg-dark/80" />
                <div className="h-4 w-16 rounded-full bg-veya-bg-secondary dark:bg-veya-bg-dark/80" />
              </div>
              <div className="h-5 w-3/4 rounded bg-veya-bg-secondary dark:bg-veya-bg-dark/80" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-veya-bg-secondary dark:bg-veya-bg-dark/80" />
                <div className="h-3 w-5/6 rounded bg-veya-bg-secondary dark:bg-veya-bg-dark/80" />
                <div className="h-3 w-4/5 rounded bg-veya-bg-secondary dark:bg-veya-bg-dark/80" />
              </div>
              <div className="h-12 w-full rounded-2xl bg-veya-bg-secondary dark:bg-veya-bg-dark/80" />
            </div>
          ))
        ) : (
          insights.map((card, cardIdx) => (
            <div
              key={card.id}
              className={`${['bg-veya-wash-lavender', 'bg-veya-wash-blush', 'bg-veya-wash-cream'][cardIdx % 3]} dark:bg-veya-card-dark rounded-3xl p-7 border border-veya-border-light shadow-veya-sm hover:border-veya-highlight/30 hover:shadow-veya hover:-translate-y-1 transition duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-2xl bg-white shadow-veya-sm border border-veya-border-light/60 flex items-center justify-center">
                    {getCategoryIcon(card.category)}
                  </div>
                  <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-veya-text-muted dark:text-veya-text-muted">
                    {card.category}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-serif font-medium text-xl leading-snug text-veya-text-primary dark:text-white">
                  {card.title}
                </h4>

                {/* Observation block */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-heading font-semibold uppercase tracking-wider text-veya-highlight">
                    Observation
                  </span>
                  <p className="text-xs text-veya-text-primary dark:text-veya-text-primary-dark font-medium leading-relaxed">
                    "{card.observation}"
                  </p>
                </div>

                {/* Context block */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-heading font-semibold uppercase tracking-wider text-veya-text-secondary dark:text-veya-text-secondary-dark">
                    Biological Context
                  </span>
                  <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed">
                    {card.context}
                  </p>
                </div>
              </div>

              {/* Suggestion action bar */}
              <div className="mt-6 bg-veya-sage-light/80 dark:bg-veya-bg-dark/20 border border-veya-sage/20 p-4 rounded-2xl">
                <span className="block text-[9px] font-heading font-bold uppercase tracking-wider text-[#5E9678] mb-1.5">
                  Gentle Suggestion
                </span>
                <p className="text-xs text-veya-text-secondary dark:text-[#D5C9EE] font-medium leading-relaxed">
                  {card.suggestion}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Safety Notice */}
      <div className="bg-veya-bg-light dark:bg-veya-bg-dark/20 border border-veya-border-light dark:border-veya-card-dark p-5 rounded-3xl text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-left">
        <HelpCircle className="h-6 w-6 text-veya-text-muted flex-shrink-0" />
        <p className="text-[11px] text-veya-text-muted leading-relaxed">
          <strong>Emotional Alignment</strong>: These observations are powered by AI analyzing your local records for physical patterns. They do not represent diagnostics, laboratory results, or therapeutic assessments. Talk with a gynecologist or practitioner to build custom wellness itineraries.
        </p>
      </div>
    </div>
  );
}
