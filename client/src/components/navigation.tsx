import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Moon, Sun, CloudUpload, Dumbbell } from 'lucide-react';
import { BackupManager } from '@/lib/backup';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleBackup = async () => {
    try {
      await BackupManager.exportToJSON();
      BackupManager.setLastBackupDate();
      toast({
        title: "Backup completato",
        description: "I dati sono stati esportati con successo"
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile completare il backup",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Dumbbell className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  FitTracker Pro
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Schede di Allenamento
                </p>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="glass-effect hover:bg-white/20 dark:hover:bg-black/20"
            >
              {theme === 'light' ? (
                <Sun className="text-yellow-500" size={18} />
              ) : (
                <Moon className="text-indigo-400" size={18} />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackup}
              className="glass-effect hover:bg-white/20 dark:hover:bg-black/20"
            >
              <CloudUpload className="text-indigo-500" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
