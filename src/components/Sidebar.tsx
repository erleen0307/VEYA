import { 
  Calendar, 
  BookOpen, 
  Activity, 
  Brain, 
  FileText, 
  Settings as SettingsIcon, 
  Sparkles,
  ChevronRight,
  MessageSquareHeart
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenJournal: () => void;
}

export default function Sidebar({ activeTab, onChangeTab, onOpenJournal }: SidebarProps) {
  const menuItems = [
    { id: 'today', name: "Today's Journal", icon: Calendar, color: 'text-violet-400' },
    { id: 'rhythm', name: "Cycle Rhythm", icon: Activity, color: 'text-pink-400' },
    { id: 'insights', name: "AI Insights", icon: Brain, color: 'text-indigo-400' },
    { id: 'history', name: "History Logs", icon: Calendar, color: 'text-purple-400' },
    { id: 'chat', name: "VEYA Companion", icon: MessageSquareHeart, color: 'text-rose-400' },
    { id: 'reports', name: "Health Reports", icon: FileText, color: 'text-veya-sage' },
    { id: 'learn', name: "Learn Library", icon: BookOpen, color: 'text-amber-400' },
    { id: 'settings', name: "Settings", icon: SettingsIcon, color: 'text-veya-text-muted' },
  ];

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border md:border-veya-border-light bg-white/80 md:bg-white md:rounded-3xl md:shadow-veya-sm md:self-start md:sticky md:top-24 flex flex-col transition-colors z-20">
      {/* Quick Log Action Banner */}
      <div className="p-4 hidden md:block">
        <button
          id="sidebar-log-button"
          onClick={onOpenJournal}
          className="w-full bg-veya-gradient hover:bg-veya-gradient-hover text-white font-heading font-semibold text-sm py-3 px-4 rounded-2xl shadow-lg shadow-lavender-mist/20 dark:shadow-none flex items-center justify-center space-x-2 transition transform active:scale-95 cursor-pointer group"
        >
          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          <span>Log Today's Vibe</span>
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible px-2 py-3 md:py-2 space-x-2 md:space-x-0 md:space-y-1.5 scrollbar-none justify-start md:justify-start flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-sans font-medium transition-all duration-300 whitespace-nowrap md:w-full select-none cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#F2ECFF] to-[#FFF3F9] text-veya-text-primary shadow-veya-sm font-semibold'
                  : 'text-veya-text-secondary dark:text-veya-text-secondary-dark hover:bg-veya-bg-light/70 dark:hover:bg-veya-card-dark/30 hover:text-veya-text-primary dark:hover:text-veya-text-primary-dark'
              }`}
            >
              <Icon className={`h-4 w-4 md:h-5 md:w-5 ${isActive ? 'text-veya-highlight' : 'text-veya-text-secondary/80 dark:text-veya-text-secondary-dark/60'}`} />
              <span className="flex-1 text-left">{item.name}</span>
              <ChevronRight className={`hidden md:block h-3 w-3 opacity-0 group-hover:opacity-100 transition ${isActive ? 'opacity-40 text-veya-highlight' : 'text-veya-text-muted'}`} />
            </button>
          );
        })}
      </nav>

      {/* Bottom info card */}
      <div className="hidden md:block p-5 m-4 rounded-3xl bg-veya-wash-cream border border-veya-border-light/60 text-center">
        <span className="block text-[10px] uppercase tracking-widest text-veya-text-secondary dark:text-veya-text-secondary-dark font-semibold">
          Disclaimer
        </span>
        <p className="text-[10px] text-veya-text-muted dark:text-veya-text-muted mt-1.5 leading-relaxed">
          VEYA provides support & body awareness insights. It is not a diagnostic tool or medical device.
        </p>
      </div>
    </aside>
  );
}
