"use client"

import { useRouter } from 'next/navigation';
import { Session } from '@/app/types/database';
import { supabaseBrowserClient as supabase } from '@/utils/supabase/client';
import IconTrash from '@/icons/trash';

export default function Sessions({ sessions }: { sessions: Session[] }) {

    const router = useRouter();

    const deleteSession = async (id: string | undefined) => {
        if (id) {
            const { error } = await supabase
                .from('sessions')
                .delete()
                .eq('id', id);

                router.refresh();
            if (error) {
                console.error('Error deleting interview:', error);
                return;
            }
        }
    };


    return (
        <div className='h-full w-full bg-slate-700 rounded-lg shadow-xl px-3 my-1'>
            {sessions.length > 0 ? (
                <ul>
                    {sessions.map((session) => (
                        <div className='w-full my-5 p-1 py-4 grid grid-cols-4 bg-slate-300 rounded-md hover:bg-slate-200 items-center shadow-md '>
                            <h3 
                                className="text-start align-middle text-lg font-semibold ml-1 select-none"
                                onClick={() => router.push(`/application/sessions/${session.id}`)}
                            >
                                {session.name}
                            </h3>
                            <p 
                                className='text-start align-middle select-none text-lg'
                                onClick={() => router.push(`/application/sessions/${session.id}`)}
                            >
                                Start : {session.startDate}
                            </p>
                            <p
                                className='text-start align-middle select-none text-lg'
                                onClick={() => router.push(`/application/sessions/${session.id}`)}
                            >
                                End : {session.endDate}
                            </p>
                            <div className='flex justify-end mr-2'>
                                <button className='hover:hover:bg-slate-300 hover:shadow-md rounded-md' onClick={() => deleteSession(session.id)}>
                                    <IconTrash />
                                </button>
                            </div>
                        </div>

                    ))}
                </ul>
            ) : (
                <div className='grid grid-cols-1 place-content-center w-full h-full'>
                    <h2 className='text-white text-center select-none'>Please add a new session.</h2>
                </div>
            )}
        </div>
    );
}
