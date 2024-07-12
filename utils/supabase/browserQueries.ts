import { supabaseBrowserClient as supabase } from "./client";


export async function fetchInterviewResult(interviewID: string | undefined){
    return await supabase.from("results").select("*").filter('interview_id','eq',interviewID)
}

export async function updateSpeakerOk(interviewID: string | undefined) {
    if (!interviewID) {
        throw new Error("interviewID is undefined");
    }

    const { data, error } = await supabase
        .from("interviews")
        .update({ speaker_validation_ok: true })
        .eq('id', interviewID);

    if (error) {
        throw new Error(`Error updating speaker_validation_ok: ${error.message}`);
    }

    return data;
}

export async function updateSpeakerInDB(resultsToUpdate: any, interviewID: string | undefined) {
    if (!resultsToUpdate || resultsToUpdate.length === 0) {
        throw new Error("resultsToUpdate is undefined or empty");
    }

    const updates = resultsToUpdate.map((result: any) => ({
        id: result.id,
        speaker: result.speaker,
        interview_id: result.interview_id,
        start: result.start,
        end: result.end,
        user_id: result.user_id,
        text: result.text,
        text_emotions: result.text_emotions,
        audio_emotions: result.audio_emotions,
        video_emotions: result.video_emotions
    }));

    const { data, error } = await supabase
        .from("results")
        .upsert(updates, { onConflict: 'id' });

    if (error) {
        throw new Error(`Error updating speaker: ${error.message}`);
    }

    await updateSpeakerOk(interviewID);

    return data;
}