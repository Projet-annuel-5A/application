"use client"

import { Interview } from '@/app/types/database';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowserClient as supabase } from '@/utils/supabase/client';
import IconTrash from '@/icons/trash';

export default function Interviews({ interviews }: { interviews: Interview[]; }) {
    const router = useRouter();

    const deleteInterview = async (id: string | undefined) => {
        if (id) {
            const { error } = await supabase
                .from('interviews')
                .delete()
                .eq('id', id);

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
                    <div className='w-full my-2 p-1 grid grid-cols-3 bg-slate-300 rounded-md hover:bg-slate-200 items-center shadow-md '>
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
                                    null
                                )
                            ) : (
                                <h5 className="text-yellow-600 font-semibold text-end select-none">Waiting for a candidate agreement ...</h5>
                            )}
                        </div>
                        <div className='flex justify-end mr-2'>
                            <button className='hover:hover:bg-slate-300 hover:shadow-md rounded-md' onClick={() => deleteInterview(interview.id)}>
                                <IconTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}
