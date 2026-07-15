import { useState } from 'react';
import { FileText, Sparkles, Printer, Download, HelpCircle, ShieldCheck, Heart, Moon, Zap, RefreshCw } from 'lucide-react';
import { UserProfile, JournalLog } from '../types';
import { VeyaStore } from '../lib/store';

interface ReportsViewProps {
  profile: UserProfile;
  logs: JournalLog[];
}

export default function ReportsView({ profile, logs }: ReportsViewProps) {
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState<string>('');

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const summary = await VeyaStore.generateReportSummary(profile, logs);
      setReportText(summary);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([reportText || 'VEYA Health Dossier'], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VEYA_Report_${profile.name}_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate high-level stats
  const totalEntries = logs.length;
  const loggedPeriodDays = logs.filter(l => l.flow !== null).length;
  
  const averagePain = totalEntries > 0 
    ? (logs.reduce((acc, l) => acc + l.pain, 0) / totalEntries).toFixed(1) 
    : '0';

  const averageSleep = totalEntries > 0 
    ? (logs.reduce((acc, l) => acc + l.sleep, 0) / totalEntries).toFixed(1) 
    : '8.0';

  const averageVitality = totalEntries > 0 
    ? (logs.reduce((acc, l) => acc + l.energy, 0) / totalEntries).toFixed(1) 
    : '3.5';

  return (
    <div className="space-y-6">
      
      {/* High-level metrics blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-veya-card-dark p-5 rounded-3xl border border-veya-border-light shadow-veya-sm">
          <span className="block text-[10px] uppercase tracking-wider text-veya-text-muted font-bold mb-1">Tracking Span</span>
          <span className="font-serif font-medium text-3xl text-veya-text-primary dark:text-white">{totalEntries} Days</span>
          <p className="text-[10px] text-veya-text-muted mt-1">Total chronological logs</p>
        </div>
        <div className="bg-white dark:bg-veya-card-dark p-5 rounded-3xl border border-veya-border-light shadow-veya-sm">
          <span className="block text-[10px] uppercase tracking-wider text-veya-text-muted font-bold mb-1">Average Pain</span>
          <span className="font-serif font-medium text-3xl text-violet-400 flex items-center gap-1.5">
            <Heart className="h-5 w-5 text-violet-400" />
            {averagePain} <span className="text-xs font-normal text-veya-text-muted">/10</span>
          </span>
          <p className="text-[10px] text-veya-text-muted mt-1">Symptomatic discomfort score</p>
        </div>
        <div className="bg-white dark:bg-veya-card-dark p-5 rounded-3xl border border-veya-border-light shadow-veya-sm">
          <span className="block text-[10px] uppercase tracking-wider text-veya-text-muted font-bold mb-1">Avg Sleep Rest</span>
          <span className="font-serif font-medium text-3xl text-indigo-400 flex items-center gap-1.5">
            <Moon className="h-5 w-5 text-indigo-400" />
            {averageSleep} <span className="text-xs font-normal text-veya-text-muted">hrs</span>
          </span>
          <p className="text-[10px] text-veya-text-muted mt-1">Daily average restorative rest</p>
        </div>
        <div className="bg-white dark:bg-veya-card-dark p-5 rounded-3xl border border-veya-border-light shadow-veya-sm">
          <span className="block text-[10px] uppercase tracking-wider text-veya-text-muted font-bold mb-1">Avg Vitality</span>
          <span className="font-serif font-medium text-3xl text-[#D9A05B] flex items-center gap-1.5">
            <Zap className="h-5 w-5 text-[#D9A05B]" />
            {averageVitality} <span className="text-xs font-normal text-veya-text-muted">★</span>
          </span>
          <p className="text-[10px] text-veya-text-muted mt-1">Body energy rating baseline</p>
        </div>
      </div>

      {/* Main Report Panel */}
      <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 sm:p-8 border border-veya-border-light shadow-veya-sm space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-veya-border-light/60 dark:border-veya-bg-dark/60">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-veya-highlight">
              <FileText className="h-5 w-5" />
              <span className="text-xs font-heading font-bold uppercase tracking-widest">Clinician Sharing</span>
            </div>
            <h3 className="font-serif font-medium text-2xl sm:text-3xl text-veya-text-primary dark:text-white">
              Printable Medical Summary Report
            </h3>
            <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed max-w-lg">
              Generate a structured, clinical summary of your tracking data and symptom clusters. Fully prepared for review with your general practitioner or gynecologist.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {reportText && (
              <>
                <button
                  onClick={handlePrint}
                  className="bg-white dark:bg-veya-bg-dark/40 hover:bg-veya-bg-secondary border border-veya-border-light dark:border-veya-card-dark text-veya-text-secondary dark:text-[#D5C9EE] font-sans font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-white dark:bg-veya-bg-dark/40 hover:bg-veya-bg-secondary border border-veya-border-light dark:border-veya-card-dark text-veya-text-secondary dark:text-[#D5C9EE] font-sans font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition"
                >
                  <Download className="h-4 w-4" />
                  <span>Download .md</span>
                </button>
              </>
            )}
            <button
              id="compile-report-button"
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-veya-gradient hover:bg-veya-gradient-hover text-white font-heading font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>{loading ? 'Compiling Dossier...' : (reportText ? 'Re-compile with AI' : 'Compile AI Doctor Report')}</span>
            </button>
          </div>
        </div>

        {/* Report Output Content Area */}
        <div id="printable-report-area">
          {reportText ? (
            <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-[#3D3655] dark:text-[#D5C9EE] p-6 rounded-3xl bg-veya-bg-secondary/40 dark:bg-veya-bg-dark/30 border border-veya-border-light/60 dark:border-veya-bg-dark/80 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-dashed border-veya-border-light dark:border-slate-800 text-[10px] text-veya-text-muted uppercase tracking-widest font-mono">
                <span>VEYA CLINICAL PORTAL SUMMARY</span>
                <span>GENERATED: {new Date().toLocaleDateString('en-US')}</span>
              </div>
              
              {/* Custom renderer for nice markdown styling */}
              <div className="space-y-6 leading-relaxed">
                {reportText.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('###') || paragraph.startsWith('####')) {
                    return (
                      <h4 key={pIdx} className="font-heading font-bold text-base text-veya-text-primary dark:text-white mt-4 border-l-4 border-veya-highlight pl-3">
                        {paragraph.replace(/###|####/g, '').trim()}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('##') || paragraph.startsWith('#')) {
                    return (
                      <h3 key={pIdx} className="font-heading font-bold text-lg text-veya-gradient mt-6">
                        {paragraph.replace(/##|#/g, '').trim()}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('-')) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1.5">
                        {paragraph.split('\n').map((line, lIdx) => (
                          <li key={lIdx} className="font-sans text-xs text-veya-text-secondary dark:text-[#D5C9EE]">
                            {line.substring(1).trim()}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={pIdx} className="font-sans text-xs text-veya-text-secondary dark:text-[#D5C9EE] leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Hand-write Physician Section */}
              <div className="mt-8 pt-8 border-t border-dashed border-veya-border-light dark:border-slate-800">
                <span className="block text-[11px] font-heading font-bold uppercase tracking-wider text-veya-text-muted mb-3">
                  Physician / Practitioner Notes & Action Plan
                </span>
                <div className="h-28 w-full border border-veya-border-light dark:border-slate-800 rounded-2xl bg-white dark:bg-veya-card-dark/40 p-4 relative">
                  <span className="absolute bottom-3 right-4 text-[9px] text-veya-text-muted font-sans italic">
                    Doctor's Signature: _______________________
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="h-14 w-14 rounded-3xl bg-veya-bg-secondary dark:bg-veya-bg-dark/40 flex items-center justify-center text-veya-text-muted dark:text-veya-text-secondary mx-auto">
                <FileText className="h-7 w-7" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="font-serif font-medium text-xl text-veya-text-primary dark:text-white">
                  No Summary Compiled Yet
                </h4>
                <p className="text-xs text-veya-text-muted">
                  Click the 'Compile AI Doctor Report' button above to have our secure AI system synthesize your logged symptoms, pain levels, sleep duration, and cycle variations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Safety and privacy clause */}
        <div className="bg-veya-bg-light/60 dark:bg-veya-bg-dark/20 border border-veya-border-light dark:border-veya-card-dark p-4 rounded-3xl flex items-center gap-3.5">
          <ShieldCheck className="h-5 w-5 text-veya-sage flex-shrink-0" />
          <p className="text-[10px] text-veya-text-muted leading-relaxed">
            <strong>Clinical Safety Alignment</strong>: VEYA is built for body awareness. This document compiles your logging parameters accurately, but does not provide diagnosis or clinical analysis. It is meant solely as a support instrument to streamline conversations with qualified healthcare teams.
          </p>
        </div>

      </div>
    </div>
  );
}
