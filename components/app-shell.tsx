import { createClient } from "@/lib/supabase/server";
import { ShellNavigation } from "@/components/shell-navigation";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("users_profile").select("username, display_name, role").eq("id", user.id).maybeSingle()
    : { data: null };
  return <ShellNavigation profile={profile}>{children}</ShellNavigation>;
}