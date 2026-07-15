import { JournalLog, UserProfile, InsightCard, ChatMessage } from '../types';

// Let's generate a rich baseline mock history so the app starts beautifully pre-populated.
const generateMockHistory = (profile: UserProfile): JournalLog[] => {
  const logs: JournalLog[] = [];
  const today = new Date();
  
  // Create 3 cycles worth of historical daily logs (approx 84 days)
  const daysToMock = 85;
  const cycleLength = profile.cycleLength;
  const periodLength = profile.periodLength;
  
  // Let's assume the user's last period started 12 days ago
  const baseDate = new Date();
  baseDate.setDate(today.getDate() - 12); // Start date of current cycle

  for (let i = daysToMock; i >= 0; i--) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() - i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Calculate how many days relative to the cycles
    // We can count back from baseDate
    const diffTime = currentDate.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Find where the day lies in the cycle (mod cycleLength)
    let cycleDay = diffDays % cycleLength;
    if (cycleDay < 0) {
      cycleDay = cycleLength + cycleDay;
    }
    
    let log: JournalLog;

    if (cycleDay < periodLength) {
      // Menstruation Phase
      log = {
        date: dateStr,
        flow: cycleDay === 0 ? 3 : (cycleDay === 1 || cycleDay === 2 ? 2 : 1),
        pain: cycleDay < 2 ? 6 : 2,
        mood: cycleDay < 2 ? 'sensitive' : 'calm',
        energy: 2,
        sleep: 7.5,
        symptoms: cycleDay < 2 ? ['cramps', 'bloating', 'backache'] : ['cramps'],
        medication: cycleDay < 2 ? 'Ibuprofen 200mg' : '',
        exercise: cycleDay < 2 ? 'none' : 'yoga',
        notes: cycleDay === 0 ? 'Period started today. Felt slow and introspective.' : 'Cramps easing off. Light yoga felt comforting.'
      };
    } else if (cycleDay < cycleLength - 14) {
      // Follicular Phase
      log = {
        date: dateStr,
        flow: null,
        pain: 0,
        mood: 'motivated',
        energy: 4,
        sleep: 8.0,
        symptoms: [],
        medication: '',
        exercise: 'moderate',
        notes: 'Felt very clear-headed and energetic today.'
      };
    } else if (cycleDay >= cycleLength - 14 && cycleDay <= cycleLength - 12) {
      // Ovulatory Phase
      log = {
        date: dateStr,
        flow: null,
        pain: 1,
        mood: 'radiant',
        energy: 5,
        sleep: 7.0,
        symptoms: ['tender_breasts'],
        medication: '',
        exercise: 'intense',
        notes: 'Woke up with vibrant energy! Did high intensity cardio and felt excellent.'
      };
    } else {
      // Luteal Phase
      const daysIntoLuteal = cycleDay - (cycleLength - 11);
      const isLateLuteal = daysIntoLuteal > 6;
      log = {
        date: dateStr,
        flow: null,
        pain: isLateLuteal ? 3 : 0,
        mood: isLateLuteal ? 'anxious' : 'calm',
        energy: isLateLuteal ? 2 : 3,
        sleep: isLateLuteal ? 6.5 : 8.0,
        symptoms: isLateLuteal ? ['bloating', 'cravings', 'insomnia'] : [],
        medication: '',
        exercise: isLateLuteal ? 'light' : 'moderate',
        notes: isLateLuteal 
          ? 'Slight bloating and craving dark chocolate. Sleep was a bit restless.' 
          : 'Felt calm and balanced. Did a strength training session.'
      };
    }
    
    logs.push(log);
  }
  
  return logs;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Sophia",
  cycleLength: 28,
  periodLength: 5,
  lastPeriodDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() - 12); // Last period started 12 days ago
    return d.toISOString().split('T')[0];
  })()
};

const FALLBACK_INSIGHTS: InsightCard[] = [
  {
    id: "rhythm-1",
    title: "Embracing Inner Solitude",
    category: "rhythm",
    observation: "We noticed you are entering your luteal phase, when estrogen begins to decline.",
    context: "During this time, the body transitions from action-oriented energy to inward-focused intuition, which can naturally accompany a desire for quiet space.",
    suggestion: "Consider blocking off 15 minutes of evening stillness or indulging in soft journaling without any self-expectation.",
    timestamp: "Today"
  },
  {
    id: "sleep-1",
    title: "Optimal Rest Windows",
    category: "sleep",
    observation: "Your logs suggest sleep quality increases when moderate exercise is completed before 4:00 PM.",
    context: "Elevating heart rate early in the day optimizes melatonin synthesis, while late-night intensive exercise can elevate core body temperature.",
    suggestion: "You may wish to schedule your next strength or aerobic workout during lunch hours to promote natural circadian rhythm.",
    timestamp: "Today"
  },
  {
    id: "symptoms-1",
    title: "Gentle Anti-Cramp Synergy",
    category: "symptoms",
    observation: "Cramping symptoms correlate with lower hydration entries in your historical logs.",
    context: "Adequate cellular hydration reduces uterine muscle spasms and alleviates core water retention that causes bloating.",
    suggestion: "Drinking warm infusions such as raspberry leaf or peppermint can soothe smooth muscle tissues in the lower pelvis.",
    timestamp: "Today"
  }
];

export class VeyaStore {
  static getProfile(): UserProfile {
    const saved = localStorage.getItem('veya_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Set default and save
    localStorage.setItem('veya_profile', JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem('veya_profile', JSON.stringify(profile));
  }

  static getLogs(): JournalLog[] {
    const saved = localStorage.getItem('veya_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Generate mock history as baseline
    const profile = this.getProfile();
    const mockLogs = generateMockHistory(profile);
    localStorage.setItem('veya_logs', JSON.stringify(mockLogs));
    return mockLogs;
  }

  static saveLogs(logs: JournalLog[]): void {
    localStorage.setItem('veya_logs', JSON.stringify(logs));
  }

  static addOrUpdateLog(log: JournalLog): JournalLog[] {
    const currentLogs = this.getLogs();
    const index = currentLogs.findIndex(l => l.date === log.date);
    if (index >= 0) {
      currentLogs[index] = log;
    } else {
      currentLogs.push(log);
    }
    // Sort chronologically
    currentLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.saveLogs(currentLogs);
    return currentLogs;
  }

  static getInsights(): InsightCard[] {
    const saved = localStorage.getItem('veya_insights');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Set fallback
    localStorage.setItem('veya_insights', JSON.stringify(FALLBACK_INSIGHTS));
    return FALLBACK_INSIGHTS;
  }

  static saveInsights(insights: InsightCard[]): void {
    localStorage.setItem('veya_insights', JSON.stringify(insights));
  }

  static getTheme(): 'light' | 'dark' {
    return (localStorage.getItem('veya_theme') as 'light' | 'dark') || 'light';
  }

  static saveTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem('veya_theme', theme);
  }

  // Calculate current cycle details
  static calculateCycleState(profile: UserProfile, logs: JournalLog[], targetDate: Date = new Date()) {
    const lastPeriod = new Date(profile.lastPeriodDate);
    const today = new Date(targetDate.toISOString().split('T')[0]);
    
    // Days since last period started
    const diffTime = today.getTime() - lastPeriod.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Standard mod cycle math
    let currentDayOfCycle = (diffDays % profile.cycleLength) + 1;
    if (currentDayOfCycle <= 0) {
      currentDayOfCycle = profile.cycleLength + currentDayOfCycle;
    }

    // Determine current phase
    let phase: 'menstruation' | 'follicular' | 'ovulatory' | 'luteal' = 'follicular';
    let phaseProgress = 0;
    let phaseLength = 0;

    const pLength = profile.periodLength;
    const cLength = profile.cycleLength;

    const ovulationStart = cLength - 14;
    const ovulationLength = 3;
    const ovulationEnd = ovulationStart + ovulationLength - 1;

    if (currentDayOfCycle <= pLength) {
        phase = "menstruation";
        phaseLength = pLength;
        phaseProgress = currentDayOfCycle;

    } else if (currentDayOfCycle < ovulationStart) {
        phase = "follicular";
        phaseLength = ovulationStart - pLength;
        phaseProgress = currentDayOfCycle - pLength;

    } else if (currentDayOfCycle <= ovulationEnd) {
        phase = "ovulatory";
        phaseLength = ovulationLength;
        phaseProgress = currentDayOfCycle - ovulationStart + 1;

    } else {
        phase = "luteal";
        phaseLength = cLength - ovulationEnd;
        phaseProgress = currentDayOfCycle - ovulationEnd;

    }

    // Calculate days until next period
    let daysToNextPeriod = pLength - currentDayOfCycle + 1;
    if (currentDayOfCycle > pLength) {
      daysToNextPeriod = cLength - currentDayOfCycle + 1;
    }

    return {
      currentDayOfCycle,
      phase,
      daysToNextPeriod,
      phaseProgress: Math.min(100, Math.max(0, (phaseProgress / (phaseLength || 1)) * 100)),
      totalCycleLength: cLength
    };
  }

  // Get Phase Details
  static getPhaseDetails(phase: 'menstruation' | 'follicular' | 'ovulatory' | 'luteal') {
    switch (phase) {
      case 'menstruation':
        return {
          title: "Menstrual Phase",
          description: "Estrogen and progesterone are at their lowest. Your body is shedding the uterine lining. Perfect time for rest, warm nourishment, and gentle reflection.",
          tips: ["Prioritize sleep", "Nourish with warm soups & herbal teas", "Somatic stretching or yin yoga"]
        };
      case 'follicular':
        return {
          title: "Follicular Phase",
          description: "Estrogen starts rising, sparking creativity, cognitive clarity, and physical endurance. Your body is building up energy and stamina.",
          tips: ["Begin new projects", "Engage in creative strategy", "Try strength or aerobic exercise"]
        };
      case 'ovulatory':
        return {
          title: "Ovulatory Phase",
          description: "Estrogen and LH peak. This is your high-vitality window. Social confidence, communication skills, and libido are natural strengths.",
          tips: ["Host meetings or presentations", "High intensity workouts", "Connect deeply with loved ones"]
        };
      case 'luteal':
        return {
          title: "Luteal Phase",
          description: "Progesterone rises to hold space. Focus shifts from external expression to internal audit. Energy levels might wind down.",
          tips: ["Organize and complete open tasks", "Wind down workouts to slow pacing", "Practice mindful grounding and boundaries"]
        };
    }
  }

  // API Call: Fetch insights from server
  static async generateAIInsights(profile: UserProfile, logs: JournalLog[]): Promise<InsightCard[]> {
    try {
      const recentLogs = logs.slice(-30); // Keep only last 30 logs for context speed
      const response = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs: recentLogs, profile }),
      });
      if (!response.ok) throw new Error("Insights API failed");
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        this.saveInsights(data);
        return data;
      }
    } catch (e) {
      console.warn("Using local fallback insights due to offline/missing key:", e);
    }
    return this.getInsights();
  }

  // API Call: Send chat message to server
  static async sendChatMessage(
    messages: ChatMessage[],
    profile: UserProfile,
    logs: JournalLog[],
    currentPhase: string
  ): Promise<string> {
    try {
      const recentLogs = logs.slice(-20); // Keep only recent 20 logs
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, logs: recentLogs, profile, currentPhase }),
      });
      if (!response.ok) throw new Error("Chat API failed");
      const data = await response.json();
      return data.text || "I'm having trouble reflecting right now. Please check if your key is configured in Secrets.";
    } catch (e) {
      return "I noticed that I couldn't reach VEYA's server. To unlock my personalized, history-grounded reflections, make sure to add your GEMINI_API_KEY in the Secrets panel!";
    }
  }

  // API Call: Compile clinician ready summary
  static async generateReportSummary(profile: UserProfile, logs: JournalLog[]): Promise<string> {
    try {
      const response = await fetch("/api/reports/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs, profile }),
      });
      if (!response.ok) throw new Error("Reports API failed");
      const data = await response.json();
      return data.reportMarkdown;
    } catch (e) {
      return `### VEYA Clinician Sharing Outline
      
*We were unable to reach our AI analysis server. Below is a structured summary of your logged data for you to share:*

#### Cycle Tracking Metrics
- **Assigned Name**: ${profile.name}
- **Average Cycle Length**: ${profile.cycleLength} Days
- **Average Period Duration**: ${profile.periodLength} Days
- **Last Menstrual Date**: ${profile.lastPeriodDate}

#### Logged Symptoms (Past 30 Entries)
- **Total Logs Recorded**: ${logs.length} entries
- **Logged Symptoms**: ${Array.from(new Set(logs.flatMap(l => l.symptoms))).join(', ') || 'None logged'}
- **Pain Level (Average)**: ${(logs.reduce((acc, l) => acc + l.pain, 0) / (logs.length || 1)).toFixed(1)} / 10
- **Daily Average Rest**: ${(logs.reduce((acc, l) => acc + l.sleep, 0) / (logs.length || 1)).toFixed(1)} Hours
      `;
    }
  }
}
