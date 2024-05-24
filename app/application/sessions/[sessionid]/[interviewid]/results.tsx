"use client"
import { Interview } from "@/app/types/database";
import { supabaseBrowserClient as supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { countTrueValues } from '@/functions/compute';
import { fetchInterviewResult } from "@/utils/supabase/browserQueries";
import VideoDisplay from "./videoDisplay";
import Dashboard from "./dashboard";

export default function Results({ sessionid, interviewid, interview }: { sessionid: string | undefined, interviewid: string | undefined, interview: Interview }) {
    
    const router = useRouter();
    const [results, setResults] = useState<any>([]);

    useEffect(() => {
        
        if (!interview.video_ok || !interview.text_ok || !interview.audio_ok || !interview.diarization_ok) {

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
                        if (updatedInterview.video_ok && updatedInterview.text_ok && updatedInterview.audio_ok && updatedInterview.diarization_ok) {
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

    // Generate URL for the raw video file
    const { data: fileData } = supabase
        .storage
        .from('interviews')
        .getPublicUrl(`${sessionid}/${interviewid}/raw/raw.mp4`);

    const videoUrl = fileData.publicUrl;


    const processOkNum = countTrueValues(interview);

    return (
        <div className="flex justify-center items-start h-screen w-full">
            <div className="flex flex-col items-center mt-4 w-full h-screen overflow-auto">
                {processOkNum === 4 ? 
                    <div className="flex flex-col">
                        <VideoDisplay videoUrl={videoUrl} results={results}/>
                        <Dashboard results={results}/>
                    </div> :
                    <div>
                        Processing: {processOkNum}/4
                    </div>
                }

            </div>
        </div>
    );
}

