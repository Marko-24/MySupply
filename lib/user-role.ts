import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AppRole = "user" | "vendor" | "admin";

function normalizeRole(value: unknown): AppRole {
  const role = String(value ?? "user").trim().toLowerCase();
  if (["vendor", "seller", "merchant", "business", "producer"].includes(role)) return "vendor";
  if (role === "admin" || role === "administrator") return "admin";
  return "user";
}

function metadataRole(user: User | null | undefined): AppRole {
  if (!user) return "user";
  const role = user.app_metadata?.role ?? user.user_metadata?.role;
  return normalizeRole(role);
}

/**
 * Zema role direktno preku Supabase RPC функцијата get_my_role().
 */
export async function resolveAppRole(user: User | null | undefined): Promise<AppRole> {
  if (!user) return "user";

  // 1. Проверка во metadata
  const metaRole = metadataRole(user);
  if (metaRole !== "user") return metaRole;

  // 2. Повик до RPC функцијата get_my_role()
  try {
    const { data, error } = await supabase.rpc("get_my_role");
    if (!error && data) {
      const role = normalizeRole(data);
      console.log(`[Role] get_my_role returned ${role}`);
      return role;
    }
  } catch (err) {
    console.error("[Role] RPC error:", err);
  }

  // 3. Директен fallback до 'profiles' табелата за тековниот user ID
  try {
    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (!error && data?.role) {
      return normalizeRole(data.role);
    }
  } catch (err) {
    console.error("[Role] Profile lookup error:", err);
  }

  return "user";
}

export function isVendor(user: User | null | undefined) {
  return metadataRole(user) === "vendor";
}