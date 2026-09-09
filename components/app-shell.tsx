import { createClient } from "@/lib/supabase/server";
import { ShellNavigation } from "@/components/shell-navigation";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  await supabase.auth.getUser();
  return <ShellNavigation>{children}</ShellNavigation>;
}