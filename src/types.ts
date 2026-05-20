/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AnimalType = 'kedi' | 'köpek';
export type AnimalStatus = 'sağlıklı' | 'hasta' | 'tedavide' | 'kayıp' | 'acil';
export type LogCategory = 'hastalık' | 'ilaç' | 'beslenme' | 'davranış' | 'diğer';
export type AlertUrgency = 'duyuru' | 'uyarı' | 'acil';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  isAdmin: boolean;
  password?: string;
  workedPlace?: string;
  hasVehicle?: boolean;
  personalNotes?: string;
}

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  gender: 'erkek' | 'dişi' | 'bilinmiyor';
  isNeutered: boolean;
  age?: string; // yavru, genç, yetişkin, yaşlı
  location: string; // Tınaztepe kampüs bölgesi (örn: Mühendislik Fakültesi)
  locationDetails?: string; // Yakın bina, kapı girişi vb. (örn: A Blok kantin arkası)
  lat?: number;
  lng?: number;
  region?: string;
  photos: string[];
  status: AnimalStatus;
  createdAt: string;
  responsibleUserIds: string[]; // Bu hayvanla ilgilenen kullanıcıların listesi
}

export interface LogEntry {
  id: string;
  animalId: string;
  animalName: string; // Kolay arama/listeleme için
  category: LogCategory;
  title: string;
  description: string;
  date: string;
  isScheduled?: boolean;
  scheduledDate?: string;
  userId: string;
  userName: string;
}

export interface ImportantMessage {
  id: string;
  title: string;
  content: string;
  date: string;
  userId: string;
  userName: string;
  urgency: AlertUrgency;
}
