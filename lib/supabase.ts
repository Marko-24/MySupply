import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Адаптер кој ги дели големите податоци на парчиња помали од 2048 бајти
const LargeSecureStore = {
    async getItem(key: string) {
        if (Platform.OS === 'web') {
            return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
        }

        // Прво бараме дали е снимено во единечен key
        const json = await SecureStore.getItemAsync(key);
        if (json) return json;

        // Ако не, бараме дали е поделено на повеќе chunks (key_0, key_1...)
        let i = 0;
        let combined = '';
        while (true) {
            const chunk = await SecureStore.getItemAsync(`${key}_${i}`);
            if (!chunk) break;
            combined += chunk;
            i++;
        }
        return combined || null;
    },

    async setItem(key: string, value: string) {
        if (Platform.OS === 'web') {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, value);
            }
            return;
        }

        // Избриши ги старите податоци/chunks пред да снимиме нови
        await LargeSecureStore.removeItem(key);

        const CHUNK_SIZE = 1800; // Помалку од лимитот од 2048 бајти
        if (value.length <= CHUNK_SIZE) {
            await SecureStore.setItemAsync(key, value);
        } else {
            // Поддели го токенот на повеќе парчиња
            for (let i = 0; i < value.length; i += CHUNK_SIZE) {
                const chunk = value.slice(i, i + CHUNK_SIZE);
                const chunkKey = `${key}_${Math.floor(i / CHUNK_SIZE)}`;
                await SecureStore.setItemAsync(chunkKey, chunk);
            }
        }
    },

    async removeItem(key: string) {
        if (Platform.OS === 'web') {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(key);
            }
            return;
        }

        await SecureStore.deleteItemAsync(key);
        let i = 0;
        while (true) {
            const chunkKey = `${key}_${i}`;
            const exists = await SecureStore.getItemAsync(chunkKey);
            if (!exists) break;
            await SecureStore.deleteItemAsync(chunkKey);
            i++;
        }
    },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: LargeSecureStore,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});