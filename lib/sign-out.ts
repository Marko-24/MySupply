import { supabase } from "@/lib/supabase";

/**
 * Sign out locally first so a device can immediately switch between test
 * accounts, then let the root auth gate settle the correct route.
 */
export async function signOutFromDevice() {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  return error;
}
