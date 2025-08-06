import { Link, useLocation } from 'wouter';
import { Home, Dumbbell, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/workouts', icon: Dumbbell, label: 'Schede' },
  { path: '/clients', icon: Users, label: 'Clienti' },
  { path: '/settings', icon: Settings, label: 'Impostazioni' },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 dark:border-gray-700/50 md:hidden z-30">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button
                className={cn(
                  "flex flex-col items-center py-2 px-4 transition-colors",
                  isActive 
                    ? "text-indigo-500" 
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
