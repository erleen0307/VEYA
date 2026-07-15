import { Sparkles, Calendar } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  activePage: string;
}

export default function Header({ profile, activePage }: HeaderProps) {
  return (
    <header className="h-16 border-b border-veya-border-light/70 bg-white/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="bg-veya-gradient p-1.5 rounded-xl shadow-veya-sm flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex items-baseline">
          <span className="font-serif text-2xl tracking-wide text-veya-gradient">VEYA</span>
          <span className="hidden sm:inline-block mx-3 text-veya-border-light">|</span>
          <span className="hidden sm:inline-block font-sans font-medium text-[11px] text-veya-text-muted uppercase tracking-[0.18em]">
            {activePage}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Real-time date display */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-veya-border-light bg-veya-bg-light text-veya-text-secondary text-xs font-semibold">
          <Calendar className="h-3.5 w-3.5 text-veya-highlight" />
          <span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Profile pill */}
        <div className="flex items-center space-x-2 bg-veya-bg-light border border-veya-border-light px-3 py-1.5 rounded-full">
          <div className="h-6 w-6 rounded-full bg-veya-gradient flex items-center justify-center font-heading text-xs font-bold text-white shadow-sm">
            {profile.name ? profile.name[0].toUpperCase() : 'S'}
          </div>
          <span className="font-sans font-medium text-xs text-veya-text-primary">
            {profile.name || 'Sophia'}
          </span>
        </div>
      </div>
    </header>
  );
}
