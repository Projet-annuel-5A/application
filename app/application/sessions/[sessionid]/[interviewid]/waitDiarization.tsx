"use client"
import { supabaseBrowserClient as supabase } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function WaitDiarization({ interview, interviewid }: { interview: any, interviewid: string | undefined }) {

    const router = useRouter();

    useEffect(() => {

        if (!interview.diarization_ok) {

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
                        if (updatedInterview.diarization_ok) {
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
    }, [interviewid, interview, router]);


    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-800">
            <div className="text-white text-lg font-semibold bg-blue-600 px-6 py-3 rounded-lg shadow-md animate-pulse">
                Splitting speakers...
            </div>
        </div>
    );
    
}