import { dbOps } from './database';
import type { Workout, Client, CoachProfile } from '@shared/schema';

export class BackupManager {
  static async exportToJSON(): Promise<void> {
    try {
      const data = await dbOps.exportData();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fittracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Errore durante l\'esportazione dei dati');
    }
  }

  static async importFromJSON(file: File): Promise<void> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate the structure
      if (!this.isValidBackupData(data)) {
        throw new Error('Formato del file di backup non valido');
      }

      // Convert date strings back to Date objects
      const processedData = this.processImportData(data);
      
      await dbOps.importData(processedData);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Errore durante l\'importazione dei dati');
    }
  }

  private static isValidBackupData(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      (Array.isArray(data.workouts) || data.workouts === undefined) &&
      (Array.isArray(data.clients) || data.clients === undefined) &&
      (Array.isArray(data.coachProfile) || data.coachProfile === undefined)
    );
  }

  private static processImportData(data: any): {
    workouts?: Workout[];
    clients?: Client[];
    coachProfile?: CoachProfile[];
  } {
    const processedData: any = {};

    if (data.workouts) {
      processedData.workouts = data.workouts.map((workout: any) => ({
        ...workout,
        createdAt: new Date(workout.createdAt),
        updatedAt: new Date(workout.updatedAt)
      }));
    }

    if (data.clients) {
      processedData.clients = data.clients.map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt)
      }));
    }

    if (data.coachProfile) {
      processedData.coachProfile = data.coachProfile;
    }

    return processedData;
  }

  static async getBackupStats(): Promise<{
    workoutsCount: number;
    clientsCount: number;
    lastBackup?: Date;
  }> {
    const data = await dbOps.exportData();
    
    // Get last backup date from localStorage
    const lastBackupStr = localStorage.getItem('lastBackupDate');
    const lastBackup = lastBackupStr ? new Date(lastBackupStr) : undefined;

    return {
      workoutsCount: data.workouts.length,
      clientsCount: data.clients.length,
      lastBackup
    };
  }

  static setLastBackupDate(): void {
    localStorage.setItem('lastBackupDate', new Date().toISOString());
  }
}
