import Dexie, { Table } from 'dexie';
import type { Workout, Client, CoachProfile, Exercise, Week, Day } from '@shared/schema';

export class FitTrackerDatabase extends Dexie {
  workouts!: Table<Workout>;
  clients!: Table<Client>;
  coachProfile!: Table<CoachProfile>;

  constructor() {
    super('FitTrackerDatabase');
    this.version(1).stores({
      workouts: 'id, clientName, coachName, workoutType, createdAt, updatedAt',
      clients: 'id, name, createdAt',
      coachProfile: 'id, name'
    });
    
    // Upgrade hook to migrate existing data
    this.version(1).upgrade(async (tx) => {
      await this.migrateWorkouts(tx);
    });
  }

  private async migrateWorkouts(tx: any) {
    const workouts = await tx.table('workouts').toArray();
    
    for (const workout of workouts) {
      let needsUpdate = false;
      
      if (workout.weeks) {
        for (const week of workout.weeks) {
          // Check if week has old structure (exercises directly)
          if (week.exercises && !week.days) {
            // Migrate to new structure
            week.days = [
              {
                id: crypto.randomUUID(),
                name: "Giorno 1",
                exercises: week.exercises || [],
                notes: ''
              }
            ];
            delete week.exercises;
            week.notes = week.notes || '';
            needsUpdate = true;
          }
          
          // Ensure all exercises have rest field
          if (week.days) {
            for (const day of week.days) {
              if (day.exercises) {
                for (const exercise of day.exercises) {
                  if (!exercise.rest) {
                    exercise.rest = '';
                    needsUpdate = true;
                  }
                }
              }
              if (!day.notes) {
                day.notes = '';
                needsUpdate = true;
              }
            }
          }
        }
      }
      
      if (needsUpdate) {
        await tx.table('workouts').put(workout);
      }
    }
  }
}

export const db = new FitTrackerDatabase();

// Database operations
export const dbOps = {
  // Workout operations
  async getAllWorkouts(): Promise<Workout[]> {
    return await db.workouts.orderBy('updatedAt').reverse().toArray();
  },

  async getWorkout(id: string): Promise<Workout | undefined> {
    return await db.workouts.get(id);
  },

  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    const now = new Date();
    const newWorkout: Workout = {
      ...workout,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    await db.workouts.add(newWorkout);
    return newWorkout;
  },

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout | undefined> {
    const existing = await db.workouts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    await db.workouts.put(updated);
    return updated;
  },

  async deleteWorkout(id: string): Promise<boolean> {
    const deleted = await db.workouts.delete(id);
    return deleted === 1;
  },

  async getWorkoutsByClient(clientName: string): Promise<Workout[]> {
    return await db.workouts.where('clientName').equals(clientName).toArray();
  },

  // Client operations
  async getAllClients(): Promise<Client[]> {
    return await db.clients.orderBy('createdAt').reverse().toArray();
  },

  async getClient(id: string): Promise<Client | undefined> {
    return await db.clients.get(id);
  },

  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    await db.clients.add(newClient);
    return newClient;
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | undefined> {
    const existing = await db.clients.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    await db.clients.put(updated);
    return updated;
  },

  async deleteClient(id: string): Promise<boolean> {
    const deleted = await db.clients.delete(id);
    return deleted === 1;
  },

  async getClientByName(name: string): Promise<Client | undefined> {
    return await db.clients.where('name').equals(name).first();
  },

  // Coach profile operations
  async getCoachProfile(): Promise<CoachProfile | undefined> {
    const profiles = await db.coachProfile.toArray();
    return profiles[0]; // There should only be one coach profile
  },

  async createCoachProfile(profile: Omit<CoachProfile, 'id'>): Promise<CoachProfile> {
    // Clear any existing profiles first
    await db.coachProfile.clear();
    
    const newProfile: CoachProfile = {
      ...profile,
      id: crypto.randomUUID()
    };
    await db.coachProfile.add(newProfile);
    return newProfile;
  },

  async updateCoachProfile(id: string, updates: Partial<CoachProfile>): Promise<CoachProfile | undefined> {
    const existing = await db.coachProfile.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    await db.coachProfile.put(updated);
    return updated;
  },

  // Data management
  async clearAllData(): Promise<void> {
    await Promise.all([
      db.workouts.clear(),
      db.clients.clear(),
      db.coachProfile.clear()
    ]);
  },

  async exportData(): Promise<{ workouts: Workout[], clients: Client[], coachProfile: CoachProfile | null }> {
    const [workouts, clients, coachProfile] = await Promise.all([
      db.workouts.toArray(),
      db.clients.toArray(),
      this.getCoachProfile()
    ]);
    
    return {
      workouts,
      clients, 
      coachProfile: coachProfile || null
    };
  },

  async importData(data: { workouts?: Workout[], clients?: Client[], coachProfile?: CoachProfile }): Promise<void> {
    console.log('💾 Importazione dati nel database:', data);
    
    try {
      await this.clearAllData();
      console.log('🗑️ Database pulito');
      
      if (data.workouts && data.workouts.length > 0) {
        console.log('📝 Importo', data.workouts.length, 'workouts');
        await db.workouts.bulkAdd(data.workouts);
        console.log('✅ Workouts importati');
      }
      
      if (data.clients && data.clients.length > 0) {
        console.log('👥 Importo', data.clients.length, 'clienti');
        await db.clients.bulkAdd(data.clients);
        console.log('✅ Clienti importati');
      }
      
      if (data.coachProfile) {
        console.log('👨‍💼 Importo profilo coach:', data.coachProfile);
        await db.coachProfile.add(data.coachProfile);
        console.log('✅ Profilo coach importato');
      }
      
      console.log('🎉 Importazione completata con successo!');
    } catch (error) {
      console.error('❌ Errore durante importazione database:', error);
      throw error;
    }
  }
};