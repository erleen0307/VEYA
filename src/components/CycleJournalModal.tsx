import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, Zap, Moon, Smile, Dumbbell, Pill, Calendar } from 'lucide-react';
import { JournalLog } from '../types';

interface CycleJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  initialLog?: JournalLog;
  onSave: (log: JournalLog) => void;
}

const ALL_SYMPTOMS = [
  { id: 'cramps', label: 'Cramps', emoji: '⚡' },
  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'backache', label: 'Backache', emoji: '🪵' },
  { id: 'tender_breasts', label: 'Tender Breasts', emoji: '🌸' },
  { id: 'insomnia', label: 'Restless Sleep', emoji: '👁️' },
  { id: 'cravings', label: 'Cravings', emoji: '🍫' },
];

const MOODS = [
  { id: 'radiant', label: 'Radiant', emoji: '✨', bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200' },
  { id: 'calm', label: 'Calm', emoji: '🍃', bg: 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 border-teal-200' },
  { id: 'sensitive', label: 'Sensitive', emoji: '💧', bg: 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 border-sky-200' },
  { id: 'low', label: 'Low Energy', emoji: '🌧️', bg: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border-indigo-200' },
  { id: 'anxious', label: 'Anxious', emoji: '🌪️', bg: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-200' },
  { id: 'motivated', label: 'Motivated', emoji: '🚀', bg: 'bg-[#F2ECFF] dark:bg-purple-950/20 text-veya-highlight border-purple-200' },
];

export default function CycleJournalModal({ isOpen, onClose, selectedDate, initialLog, onSave }: CycleJournalModalProps) {
  const [flow, setFlow] = useState<number | null>(null);
  const [pain, setPain] = useState<number>(0);
  const [mood, setMood] = useState<string>('calm');
  const [energy, setEnergy] = useState<number>(3);
  const [sleep, setSleep] = useState<number>(8);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [medication, setMedication] = useState<string>('');
  const [exercise, setExercise] = useState<string>('light');
  const [notes, setNotes] = useState<string>('');

  // Load initial logs if editing
  useEffect(() => {
    if (initialLog) {
      setFlow(initialLog.flow);
      setPain(initialLog.pain);
      setMood(initialLog.mood || 'calm');
      setEnergy(initialLog.energy || 3);
      setSleep(initialLog.sleep || 8);
      setSelectedSymptoms(initialLog.symptoms || []);
      setMedication(initialLog.medication || '');
      setExercise(initialLog.exercise || 'light');
      setNotes(initialLog.notes || '');
    } else {
      // Default state for a fresh journal
      setFlow(null);
      setPain(0);
      setMood('calm');
      setEnergy(3);
      setSleep(8);
      setSelectedSymptoms([]);
      setMedication('');
      setExercise('none');
      setNotes('');
    }
  }, [initialLog, selectedDate, isOpen]);

  if (!isOpen) return null;

  const handleToggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: JournalLog = {
      date: selectedDate,
      flow,
      pain,
      mood,
      energy,
      sleep,
      symptoms: selectedSymptoms,
      medication,
      exercise,
      notes
    };
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#221C34]/40 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        id="journal-modal"
        className="bg-white dark:bg-veya-card-dark rounded-3xl w-full max-w-2xl shadow-veya-lg overflow-hidden max-h-[90vh] flex flex-col border border-veya-border-light dark:border-veya-card-dark animate-in"
      >
        {/* Header */}
        <div className="p-6 border-b border-veya-border-light dark:border-veya-card-dark/60 flex items-center justify-between bg-veya-bg-light/60 dark:bg-veya-bg-dark/40">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-veya-gradient flex items-center justify-center text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-2xl text-veya-text-primary dark:text-white">Cycle Journal</h3>
              <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-veya-highlight" />
                <span>Logging for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-veya-text-muted hover:text-veya-text-secondary dark:hover:text-slate-200 hover:bg-veya-bg-secondary dark:hover:bg-veya-bg-dark/80 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section 1: Period Flow */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-pink-400" />
              <label className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Is your period today?</label>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { value: null, label: 'No' },
                { value: 1, label: 'Light' },
                { value: 2, label: 'Medium' },
                { value: 3, label: 'Heavy' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setFlow(opt.value)}
                  className={`py-3 rounded-2xl border text-xs sm:text-sm font-sans font-medium transition cursor-pointer select-none text-center ${
                    flow === opt.value
                      ? 'bg-veya-gradient text-white border-transparent shadow-md'
                      : 'bg-white dark:bg-veya-bg-dark/40 text-veya-text-secondary dark:text-veya-text-secondary-dark border-veya-border-light dark:border-veya-card-dark hover:bg-veya-bg-light/40 dark:hover:bg-veya-card-dark/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: Pain & Discomfort */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-violet-400" />
                <label className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Pain & Cramps Level</label>
              </div>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-veya-bg-light dark:bg-veya-bg-dark/80 text-veya-highlight">
                {pain === 0 ? 'None' : `${pain} / 10`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={pain}
              onChange={(e) => setPain(parseInt(e.target.value))}
              className="w-full accent-veya-highlight cursor-pointer h-2 bg-veya-bg-secondary dark:bg-veya-bg-dark/80 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-sans font-medium text-veya-text-muted">
              <span>Peaceful (0)</span>
              <span>Mild</span>
              <span>Distracting</span>
              <span>Severe (10)</span>
            </div>
          </section>

          {/* Section 3: Mood & Emotional Vibe */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2">
              <Smile className="h-4 w-4 text-veya-sage" />
              <label className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Dominant Emotional Vibe</label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOODS.map((m) => {
                const isSelected = mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`flex items-center justify-center space-x-2.5 p-3 rounded-2xl border text-xs sm:text-sm font-sans font-medium transition cursor-pointer select-none ${
                      isSelected
                        ? 'bg-veya-gradient text-white border-transparent shadow-md'
                        : `${m.bg} border-opacity-40`
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 4: Physical Energy & Sleep */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <label className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Physical Vitality</label>
                </div>
                <span className="font-sans text-xs font-semibold text-amber-500">
                  {['Low', 'Soft', 'Moderate', 'Active', 'Radiant'][energy - 1]}
                </span>
              </div>
              <div className="flex items-center justify-between bg-veya-bg-light/60 dark:bg-veya-bg-dark/40 p-2 rounded-2xl border border-veya-border-light dark:border-veya-card-dark">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEnergy(star)}
                    className={`flex-1 py-1.5 text-center font-heading font-bold text-sm rounded-xl transition ${
                      energy === star
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'
                        : 'text-veya-text-muted hover:text-veya-text-secondary dark:hover:text-slate-200'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <label className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Rest Duration</label>
                </div>
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-veya-bg-light dark:bg-veya-bg-dark/80 text-veya-highlight">
                  {sleep} hours
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-veya-highlight cursor-pointer h-2 bg-veya-bg-secondary dark:bg-veya-bg-dark/80 rounded-lg mt-3"
              />
            </div>
          </section>

          {/* Section 5: Symptoms Checklist */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-rose-400" />
              <label className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Physiological Symptoms</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => handleToggleSymptom(sym.id)}
                    className={`px-4 py-2.5 rounded-full border text-xs sm:text-sm font-sans font-medium transition flex items-center space-x-2 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#EBE1FF] dark:bg-purple-950/40 text-veya-highlight border-veya-highlight/40 dark:border-purple-800'
                        : 'bg-white dark:bg-veya-bg-dark/40 text-veya-text-secondary dark:text-veya-text-secondary-dark border-veya-border-light dark:border-veya-card-dark hover:bg-veya-bg-light/40 dark:hover:bg-veya-card-dark/40'
                    }`}
                  >
                    <span>{sym.emoji}</span>
                    <span>{sym.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 6: Exercise & Medications */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-4 w-4 text-teal-400" />
                <label className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Movement & Exercise</label>
              </div>
              <select
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="w-full bg-white dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl px-4 py-3 text-xs sm:text-sm text-veya-text-primary dark:text-white focus:outline-none focus:border-veya-highlight focus:ring-1 focus:ring-veya-highlight"
              >
                <option value="none">No intensive exercise</option>
                <option value="light">Light (Yoga, Walk, stretching)</option>
                <option value="moderate">Moderate (Pilates, jog, strength)</option>
                <option value="intense">Intense (HIIT, long run, powerlift)</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Pill className="h-4 w-4 text-veya-sage" />
                <label className="font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Supplement or Medication</label>
              </div>
              <input
                type="text"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="e.g. Magnesium, Ibuprofen, Prenatals"
                className="w-full bg-white dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl px-4 py-3 text-xs sm:text-sm text-veya-text-primary dark:text-white placeholder-veya-text-muted focus:outline-none focus:border-veya-highlight focus:ring-1 focus:ring-veya-highlight"
              />
            </div>
          </section>

          {/* Section 7: Journal Notes */}
          <section className="space-y-3">
            <label className="block font-heading font-semibold text-sm text-veya-text-primary dark:text-white">Vibe Notes & Reflections</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How does your body feel today? What thoughts or insights came up? Reflect gently here..."
              rows={3}
              className="w-full bg-white dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl p-4 text-xs sm:text-sm text-veya-text-primary dark:text-white placeholder-veya-text-muted focus:outline-none focus:border-veya-highlight focus:ring-1 focus:ring-veya-highlight resize-none"
            />
          </section>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-veya-border-light dark:border-veya-card-dark/60 flex items-center justify-end bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl border border-veya-border-light dark:border-veya-card-dark text-xs sm:text-sm text-veya-text-secondary dark:text-veya-text-secondary-dark hover:bg-white dark:hover:bg-veya-card-dark font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-2xl bg-veya-gradient hover:bg-veya-gradient-hover text-white font-heading font-semibold text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer"
          >
            Save Journal Entry
          </button>
        </div>
      </div>
    </div>
  );
}
