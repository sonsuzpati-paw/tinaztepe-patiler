/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured =
  supabaseUrl &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your-anon-public-key');

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase API anahtarları henüz tanımlanmadı! Lütfen .env dosyasını kendi Supabase URL ve Anon Key bilgilerinizle güncelleyin. Uygulama şimdilik çevrimdışı (local) modda çalışmaya devam edecektir.'
  );
}

// Fallback to placeholder URL if not configured, to prevent createClient from throwing an error during startup
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project-id.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);
