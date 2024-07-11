"use client"

import { Interview } from '@/app/types/database';
import { useRouter } from 'next/navigation';
import { supabaseBrowserClient as supabase } from '@/utils/supabase/client';
import IconTrash from '@/icons/trash';
import { useEffect } from "react";

export default function Interviews({ interviews, sessionID, refresh }: { interviews: Interview[] , sessionID: string | undefined, refresh: any}) {

    const router = useRouter() 

    useEffect(() => {

        if (sessionID) {

            console.log("Start listening for DB changes of process status");

            const channel = supabase
                .channel('schema-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'interviews',
                        filter: `session_id=eq.${sessionID}`
                    },
                    (payload) => {refresh();}
                )
                .subscribe();

            return () => {
                console.log("Unsubscribe from DB changes");
                supabase.removeChannel(channel);
            };
        } else {
            console.log("Process is terminated, don't listen for DB changes");
        }
    }, [sessionID, interviews]);


    const deleteInterview = async (sessionID: string | undefined, interviewID: string | undefined) => {
        if (interviewID) {
            const { error } = await supabase
                .from('interviews')
                .delete()
                .eq('id', interviewID);

            if (error) {
                console.error('Error deleting interview:', error);
                return;
            }
            router.refresh();
        }
    };

    return (
        <div className='h-full w-full bg-slate-700 rounded shadow-lg px-3 my-1'>
            <ul>
                {interviews.map((interview) => (
                    <div key={interview.id} className='w-full my-2 p-1 grid grid-cols-3 bg-slate-300 rounded-md hover:bg-slate-200 items-center shadow-md '>
                        <h3
                            className="text-start align-middle text-lg font-semibold ml-1 select-none"
                            onClick={() => router.push(`/application/sessions/${interview.session_id}/${interview.id}`)}
                        >
                            {interview.last_name} {interview.first_name}
                        </h3>

                        <div
                            className='select-none'
                            onClick={() => router.push(`/application/sessions/${interview.session_id}/${interview.id}`)}
                        >
                            {interview.agreement_ok ? (
                                !interview.raw_file_ok ? (
                                    <h5 className="text-yellow-600 font-semibold text-end select-none">Waiting for a video ...</h5>
                                ) : (
                                    interview.diarization_ok ? (
                                        !interview.speaker_validation_ok ? (
                                            <h5 className="text-yellow-600 font-semibold text-end select-none">Waiting for speaker validation ...</h5>
                                        ) : !interview.inference_ok ? (
                                            <h5 className="text-blue-600 font-semibold text-end select-none">Processing ...</h5>
                                        ): null
                                    ): <h5 className="text-blue-600 font-semibold text-end select-none">Processing ...</h5>
                                )
                            ) : (
                                <h5 className="text-yellow-600 font-semibold text-end select-none">Waiting for candidate agreement ...</h5>
                            )}
                        </div>
                        <div className='flex justify-end mr-2'>
                            <button className='hover:hover:bg-slate-300 hover:shadow-md rounded-md' onClick={() => deleteInterview(interview.session_id, interview.id)}>
                                <IconTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}
