"use client"

import Link from 'next/link';
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

            if (error) {
                console.error('Error deleting interview:', error);
                return;
            }

            router.refresh();
        }
    };

    return (
        <div className='h-full w-full'>
            {sessions.length > 0 ? (
                <ul>
                    {sessions.map((session) => (
                        <div className='flex w-full items-center justify-center space-x-2 '>
                            <Link key={session.id} href={`/application/sessions/${session.id}`} className='w-full' passHref>
                                <div className="w-full bg-white rounded-lg shadow-md my-5 p-4 cursor-pointer hover:bg-gray-100">
                                    <h3 className="text-lg font-semibold">{session.name}</h3>
                                    <p>Start : {session.startDate}</p>
                                    <p>End : {session.endDate}</p>
                                </div>
                            </Link>
                            <button
                                onClick={() => deleteSession(session.id)}
                                className='flex items-center bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100'
                                style={{ height: '100%' }}
                            >
                                <IconTrash />
                            </button>
                        </div>

                    ))}
                </ul>
            ) : (
                <div>No sessions found.</div>
            )}
        </div>
    );
}
