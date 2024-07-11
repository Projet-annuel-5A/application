"use client"
import { Interview } from "@/app/types/database";
import { supabaseBrowserClient as supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchInterviewResult } from "@/utils/supabase/browserQueries";
import Dashboard from "./dashboard";

export default function Results({ sessionid, interviewid, interview, user }: { sessionid: string | undefined, interviewid: string | undefined, interview: Interview, user: any }) {

    const router = useRouter();
    const [results, setResults] = useState<any>([]);

    useEffect(() => {

        if (interview.speaker_validation_ok && !interview.inference_ok) {

            console.log("Start listening for DB changes of process status");

            const channel = supabase
                .channel('schema-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'interviews',
                        filter: `id=eq.${interviewid}`
                    },
                    (payload) => {
                        const updatedInterview = payload.new;
                        if (updatedInterview.inference_ok) {
                            console.log("Process is terminated, unsubscribe from DB changes");
                            channel.unsubscribe();
                            router.refresh();
                        } else {
                            router.refresh();
                        }
                    }
                )
                .subscribe();

            return () => {
                console.log("Unsubscribe from DB changes");
                supabase.removeChannel(channel);
            };
        } else {
            console.log("Process is terminated, don't listen for DB changes");
        }
    }, [sessionid, interviewid, interview, router]);

    useEffect(() => {
        const getResults = async () => {
            try {
                const response = await fetchInterviewResult(interviewid);
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        if (interviewid) {
            getResults();
        }
    }, [interviewid]);


    const { data: fileData } = supabase
        .storage
        .from('interviews')
        .getPublicUrl(`${sessionid}/${interviewid}/raw/raw.mp4`);

    const videoUrl = fileData.publicUrl;


    const countOk = (okElems: boolean[]) => {
        let nb = 0;
        okElems.forEach((elem) => {
            if (elem) nb++
        })
        return { "nbOk": nb, "lenOk": okElems.length }
    }

    const { nbOk, lenOk } = countOk([
        interview.text_ok,
        interview.video_ok,
        interview.audio_ok
    ])

    return (
        <div className="flex justify-center items-start h-full w-full">
            <div className="flex flex-col items-center mt-4 w-full h-full overflow-auto">
                <>
                    {!interview.speaker_validation_ok ? (
                        <div className="flex flex-col">
                            <Dashboard videoUrl={videoUrl} results={results} complet={false} sessionID={sessionid} interviewID={interviewid} />
                        </div>
                    ) : interview.inference_ok ? (
                        <div className="flex flex-col">
                            <Dashboard videoUrl={videoUrl} results={results} complet={true} sessionID={sessionid} interviewID={interviewid} />
                        </div>
                    ) : (
                        <div className="w-2/4 h-full flex flex-col items-center justify-center bg-gray-50 p-6 rounded-xl shadow-lg">
                            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Processing...</h2>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div className="bg-blue-600 h-4 rounded-full transition-all duration-300" style={{ width: `${(nbOk / lenOk) * 100}%` }}></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">{`${Math.round((nbOk / lenOk) * 100)}% Complete`}</p>
                            </div>
                        </div>

                    )}
                </>
            </div>
        </div>
    );
}

