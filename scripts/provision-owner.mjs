import { createClient } from "@supabase/supabase-js";

const username = process.env.MERIDIAN_OWNER_USERNAME?.trim().toLowerCase();
const displayName = process.env.MERIDIAN_OWNER_DISPLAY_NAME?.trim();
const password = process.env.MERIDIAN_OWNER_TEMP_PASSWORD;
if (!username || !displayName || !password) throw new Error("Set MERIDIAN_OWNER_USERNAME, MERIDIAN_OWNER_DISPLAY_NAME, and MERIDIAN_OWNER_TEMP_PASSWORD locally before provisioning.");
if (!/^[a-z0-9._-]{3,40}$/.test(username)) throw new Error("Owner username must be 3–40 lowercase characters: letters, numbers, dots, underscores, or hyphens.");
if (password.length < 10 || !/\d/.test(password)) throw new Error("Temporary password must be at least 10 characters and include a number.");

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const email = `${username}@internal.meridian.local`;
const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { username, display_name: displayName } });
if (error || !data.user) throw error ?? new Error("Owner creation failed.");
const { error: profileError } = await supabase.from("users_profile").insert({ id: data.user.id, username, display_name: displayName, role: "owner", must_change_pw: true });
if (profileError) throw profileError;
console.log(`Owner account provisioned for ${username}.`);
