import { createBrowserClient } from "@supabase/ssr";
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export const supabaseClientClient = createClient();

export async function getUserClient(){
  return await supabaseClientClient.auth.getUser();
}
