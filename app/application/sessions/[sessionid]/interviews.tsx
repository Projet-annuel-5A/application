"use client"

import { Interview } from '@/app/types/database';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseClientClient as supabase } from '@/utils/supabase/client';
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
        <div className='h-full w-full'>
            <ul>
                {interviews.map((interview) => (
                    <div key={interview.id} className='flex justify-between items-center w-full space-x-2 my-5'>
                        <Link className='flex-grow' href={`/application/sessions/${interview.session_id}/${interview.id}`} passHref>
                            <div className="flex justify-between space-x-3 w-full bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100">
                                <div className='flex space-x-3'>
                                    <h3 className="text-lg font-semibold">{interview.last_name}</h3>
                                    <h3 className="text-lg font-semibold">{interview.first_name}</h3>
                                </div>
                                <div className='flex space-x-3 ml-auto'>
                                    {!interview.raw_file_ok ? (
                                        <h5 className="text-yellow-600 font-semibold">Waiting for a video</h5>
                                    ) : (
                                        null
                                    )}
                                </div>
                            </div>
                        </Link>
                        <button
                            onClick={() => deleteInterview(interview.id)}
                            className='flex items-center bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100'
                            style={{ height: '100%' }}
                        >
                            <IconTrash/>
                        </button>
                    </div>
                ))}
            </ul>
        </div>
    );
}
