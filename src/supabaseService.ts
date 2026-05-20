/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Animal, LogEntry, ImportantMessage, User } from './types';
import {
  INITIAL_ANIMALS,
  INITIAL_LOGS,
  INITIAL_ALERTS,
  INITIAL_USERS
} from './mockData';

// --- Mappers to bridge PostgreSQL snake_case with TypeScript camelCase ---

const mapUserFromDB = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  phoneNumber: data.phone_number || undefined,
  avatar: data.avatar || '',
  isAdmin: data.is_admin,
  password: data.password || '123456',
  workedPlace: data.worked_place || undefined,
  hasVehicle: data.has_vehicle ?? false,
  personalNotes: data.personal_notes || undefined
});

const mapUserToDB = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone_number: user.phoneNumber || null,
  avatar: user.avatar,
  is_admin: user.isAdmin,
  password: user.password || '123456',
  worked_place: user.workedPlace || null,
  has_vehicle: user.hasVehicle ?? false,
  personal_notes: user.personalNotes || null
});

const mapAnimalFromDB = (data: any): Animal => ({
  id: data.id,
  name: data.name,
  type: data.type,
  gender: data.gender,
  isNeutered: data.is_neutered,
  age: data.age || undefined,
  location: data.location,
  locationDetails: data.location_details || undefined,
  photos: data.photos || [],
  status: data.status,
  createdAt: data.created_at,
  responsibleUserIds: data.responsible_user_ids || []
});

const mapAnimalToDB = (animal: Animal) => ({
  id: animal.id,
  name: animal.name,
  type: animal.type,
  gender: animal.gender,
  is_neutered: animal.isNeutered,
  age: animal.age || null,
  location: animal.location,
  location_details: animal.locationDetails || null,
  photos: animal.photos,
  status: animal.status,
  created_at: animal.createdAt,
  responsible_user_ids: animal.responsibleUserIds
});

const mapLogFromDB = (data: any): LogEntry => ({
  id: data.id,
  animalId: data.animal_id,
  animalName: data.animal_name,
  category: data.category,
  title: data.title,
  description: data.description,
  date: data.date,
  userId: data.user_id,
  userName: data.user_name
});

const mapLogToDB = (log: LogEntry) => ({
  id: log.id,
  animal_id: log.animalId,
  animal_name: log.animalName,
  category: log.category,
  title: log.title,
  description: log.description,
  date: log.date,
  user_id: log.userId,
  user_name: log.userName
});

const mapAlertFromDB = (data: any): ImportantMessage => ({
  id: data.id,
  title: data.title,
  content: data.content,
  date: data.date,
  userId: data.user_id,
  userName: data.user_name,
  urgency: data.urgency
});

const mapAlertToDB = (alert: ImportantMessage) => ({
  id: alert.id,
  title: alert.title,
  content: alert.content,
  date: alert.date,
  user_id: alert.userId,
  user_name: alert.userName,
  urgency: alert.urgency
});

// --- LocalStorage Fallback Helper Methods ---

const getLocal = <T>(key: string, initial: T): T => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : initial;
};

const saveLocal = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Exported Unified Database Service ---

export const dbService = {
  // --- PHOTO UPLOAD ---
  async uploadPhoto(file: File): Promise<string> {
    if (!isSupabaseConfigured) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('animal-photos')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading photo to Supabase:', error);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file);
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from('animal-photos')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (e) {
      console.error('Unexpected error in photo upload, using base64 fallback:', e);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }
  },

  // --- USERS ---
  async getUsers(): Promise<User[]> {
    if (!isSupabaseConfigured) {
      return getLocal('tinaztepe_users', INITIAL_USERS);
    }
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error fetching users from Supabase:', error);
      return getLocal('tinaztepe_users', INITIAL_USERS);
    }
    return data.map(mapUserFromDB);
  },

  async saveUser(user: User): Promise<User> {
    if (!isSupabaseConfigured) {
      const users = getLocal<User[]>('tinaztepe_users', INITIAL_USERS);
      const existsIdx = users.findIndex(u => u.id === user.id);
      if (existsIdx !== -1) {
        users[existsIdx] = user;
      } else {
        users.push(user);
      }
      saveLocal('tinaztepe_users', users);
      return user;
    }
    const { error } = await supabase.from('users').upsert(mapUserToDB(user));
    if (error) {
      console.error('Error saving user to Supabase:', error);
      throw error;
    }
    return user;
  },

  // --- ANIMALS ---
  async getAnimals(): Promise<Animal[]> {
    if (!isSupabaseConfigured) {
      return getLocal('tinaztepe_animals', INITIAL_ANIMALS);
    }
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching animals from Supabase:', error);
      return getLocal('tinaztepe_animals', INITIAL_ANIMALS);
    }
    return data.map(mapAnimalFromDB);
  },

  async saveAnimal(animal: Animal): Promise<Animal> {
    if (!isSupabaseConfigured) {
      const animals = getLocal<Animal[]>('tinaztepe_animals', INITIAL_ANIMALS);
      const existsIdx = animals.findIndex(a => a.id === animal.id);
      if (existsIdx !== -1) {
        animals[existsIdx] = animal;
      } else {
        animals.unshift(animal); // new ones first
      }
      saveLocal('tinaztepe_animals', animals);
      return animal;
    }
    const { error } = await supabase.from('animals').upsert(mapAnimalToDB(animal));
    if (error) {
      console.error('Error saving animal to Supabase:', error);
      throw error;
    }
    return animal;
  },

  async deleteAnimal(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const animals = getLocal<Animal[]>('tinaztepe_animals', INITIAL_ANIMALS);
      const logs = getLocal<LogEntry[]>('tinaztepe_logs', INITIAL_LOGS);
      
      saveLocal('tinaztepe_animals', animals.filter(a => a.id !== id));
      saveLocal('tinaztepe_logs', logs.filter(l => l.animalId !== id));
      return;
    }
    const { error } = await supabase.from('animals').delete().eq('id', id);
    if (error) {
      console.error('Error deleting animal from Supabase:', error);
      throw error;
    }
  },

  // --- LOGS ---
  async getLogs(): Promise<LogEntry[]> {
    if (!isSupabaseConfigured) {
      return getLocal('tinaztepe_logs', INITIAL_LOGS);
    }
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      console.error('Error fetching logs from Supabase:', error);
      return getLocal('tinaztepe_logs', INITIAL_LOGS);
    }
    return data.map(mapLogFromDB);
  },

  async saveLog(log: LogEntry): Promise<LogEntry> {
    if (!isSupabaseConfigured) {
      const logs = getLocal<LogEntry[]>('tinaztepe_logs', INITIAL_LOGS);
      logs.unshift(log);
      saveLocal('tinaztepe_logs', logs);
      return log;
    }
    const { error } = await supabase.from('logs').insert(mapLogToDB(log));
    if (error) {
      console.error('Error saving log to Supabase:', error);
      throw error;
    }
    return log;
  },

  async deleteLog(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const logs = getLocal<LogEntry[]>('tinaztepe_logs', INITIAL_LOGS);
      saveLocal('tinaztepe_logs', logs.filter(l => l.id !== id));
      return;
    }
    const { error } = await supabase.from('logs').delete().eq('id', id);
    if (error) {
      console.error('Error deleting log from Supabase:', error);
      throw error;
    }
  },

  // --- ALERTS ---
  async getAlerts(): Promise<ImportantMessage[]> {
    if (!isSupabaseConfigured) {
      return getLocal('tinaztepe_alerts', INITIAL_ALERTS);
    }
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      console.error('Error fetching alerts from Supabase:', error);
      return getLocal('tinaztepe_alerts', INITIAL_ALERTS);
    }
    return data.map(mapAlertFromDB);
  },

  async saveAlert(alert: ImportantMessage): Promise<ImportantMessage> {
    if (!isSupabaseConfigured) {
      const alerts = getLocal<ImportantMessage[]>('tinaztepe_alerts', INITIAL_ALERTS);
      alerts.unshift(alert);
      saveLocal('tinaztepe_alerts', alerts);
      return alert;
    }
    const { error } = await supabase.from('alerts').insert(mapAlertToDB(alert));
    if (error) {
      console.error('Error saving alert to Supabase:', error);
      throw error;
    }
    return alert;
  },

  async deleteAlert(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const alerts = getLocal<ImportantMessage[]>('tinaztepe_alerts', INITIAL_ALERTS);
      saveLocal('tinaztepe_alerts', alerts.filter(a => a.id !== id));
      return;
    }
    const { error } = await supabase.from('alerts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting alert from Supabase:', error);
      throw error;
    }
  }
};
