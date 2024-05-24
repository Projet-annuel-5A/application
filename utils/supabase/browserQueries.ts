import { supabaseBrowserClient as supabase } from "./client";


export async function fetchInterviewResult(interviewID: string | undefined){
    return await supabase.from("results").select("*").filter('interview_id','eq',interviewID)
}