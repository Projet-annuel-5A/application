"use client"
import { Interview } from "@/app/types/database";
import { supabaseClientClient as supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Results({ sessionid, interviewid, interview }: { sessionid: string | undefined, interviewid: string | undefined, interview: Interview }) {
    
    const router = useRouter();

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


    const countTrueValues = (interview: Interview) => {
        let count = 0;
        if (interview.video_ok) count++;
        if (interview.text_ok) count++;
        if (interview.audio_ok) count++;
        if (interview.diarization_ok) count++;
        return count;
    };

    // Generate URL for the raw video file
    const { data: fileData } = supabase
        .storage
        .from('interviews')
        .getPublicUrl(`interviews/${sessionid}/${interviewid}/raw/raw.mp4`);

    const videoUrl = fileData.publicUrl;


    if (!interview.video_ok || !interview.text_ok || !interview.audio_ok || !interview.diarization_ok) {
        console.log("Start listing for db changes of process status")
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
                        channel.unsubscribe();
                        console.log("Process is terminated, unsubscribe to db changes");

                    } else {
                        router.refresh();
                    }
                }
            )
            .subscribe();
    } else {
        console.log("Process is terminated, don't listen for db changes");
    }

    const processOkNum = countTrueValues(interview);

    return (
        <div className="flex justify-center items-start h-screen">
            <div className="flex flex-col items-center mt-4">
                {processOkNum === 4 ?
                    <div className="w-80 h-80">
                        <video className="w-full h-full object-cover" controls>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div>
                            Results here
                        </div>
                    </div> :
                    <div>
                        Processing: {processOkNum}/4
                    </div>
                }

            </div>
        </div>
    );
}

