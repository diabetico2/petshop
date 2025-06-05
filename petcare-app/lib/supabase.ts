import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvrheemfgobtmbbnjhbi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cmhlZW1mZ29idG1iYm5qaGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTY1NDIsImV4cCI6MjA2NDU3MjU0Mn0.BI9rJHLULT1j3MLEGztS9ilRXsfJuPH3li_ZnYunQY0';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
});

export { supabase }; 