/**
 * Compatibility wrapper.
 * Re-exports all data service methods from Supabase backend services.
 * Existing code importing from '@/services/strapiServices' will seamlessly
 * connect to Supabase without requiring changes.
 */

export * from "./supabaseServices";
