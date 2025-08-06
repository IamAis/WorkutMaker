import { Link } from 'wouter';
import { Plus, Upload, Download, Users, Smartphone, Settings, Dumbbell, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCards } from '@/components/stats-cards';
import { WorkoutCardHome } from '@/components/workout-card-home';
import { useWorkouts } from '@/hooks/use-workouts';
import { BackupManager } from '@/lib/backup';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';

export default function Home() {
  const { data: workouts = [], isLoading } = useWorkouts();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recentWorkouts = workouts.slice(0, 3);

  const handleImport = async (file: File) => {
    try {
      await BackupManager.importFromJSON(file);
      toast({
        title: "Importazione completata",
        description: "I dati sono stati importati con successo"
      });
      window.location.reload(); // Refresh to show imported data
    } catch (error) {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore durante l'importazione",
        variant: "destructive"
      });
    }
  };

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

  const handleInstallApp = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      toast({
        title: "App installabile",
        description: "Usa il menu del browser per installare l'app"
      });
    } else {
      toast({
        title: "Non supportato",
        description: "Il browser non supporta l'installazione PWA"
      });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          FitTracker Pro
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Gestisci le tue schede di allenamento in modo professionale
        </p>
      </div>

      <StatsCards />

      {/* Menu Principale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/clients">
          <Card className="glass-effect rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Gestione Clienti
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Aggiungi e gestisci i tuoi clienti
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/workouts">
          <Card className="glass-effect rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Schede Workout
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Crea e modifica le schede di allenamento
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings">
          <Card className="glass-effect rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Settings className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Impostazioni
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Configura profilo coach e export
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Create Workout */}
        <div className="lg:col-span-2">
          <Card className="glass-effect rounded-2xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Plus className="mr-2" size={20} />
                Crea Nuova Scheda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/workouts">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                  <Plus className="mr-2" size={16} />
                  Inizia a Creare
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Recent Workouts */}
          <Card className="glass-effect rounded-2xl mb-6 animate-fade-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Schede Recenti
              </h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : recentWorkouts.length > 0 ? (
                <div className="space-y-3">
                  {recentWorkouts.map((workout) => (
                    <WorkoutCardHome key={workout.id} workout={workout} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                  Nessuna scheda creata ancora
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-effect rounded-2xl mb-6 animate-fade-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Azioni Rapide
              </h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-700 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/40 dark:hover:to-purple-800/40 text-left justify-start h-auto"
                  variant="ghost"
                >
                  <Upload className="text-indigo-500 mr-3" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      Importa Dati
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Da file JSON
                    </p>
                  </div>
                </Button>

                <Button
                  onClick={handleBackup}
                  className="w-full p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/40 dark:hover:to-teal-800/40 text-left justify-start h-auto"
                  variant="ghost"
                >
                  <Download className="text-emerald-500 mr-3" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      Backup Dati
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Esporta tutto
                    </p>
                  </div>
                </Button>

                <Link href="/clients">
                  <Button
                    className="w-full p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-700 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-800/40 dark:hover:to-red-800/40 text-left justify-start h-auto"
                    variant="ghost"
                  >
                    <Users className="text-orange-500 mr-3" size={20} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        Gestisci Clienti
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aggiungi/Modifica
                      </p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* PWA Install */}
          <Card className="glass-effect rounded-2xl animate-fade-in">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Installa l'App
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Accedi offline e da qualsiasi dispositivo
                </p>
                <Button 
                  onClick={handleInstallApp}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-sm"
                >
                  Installa Ora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-40 md:bottom-6 md:right-6">
        <Link href="/workouts">
          <Button 
            size="lg"
            className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 p-0"
          >
            <Plus size={24} />
          </Button>
        </Link>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImport(file);
          }
        }}
        className="hidden"
      />
    </main>
  );
}
