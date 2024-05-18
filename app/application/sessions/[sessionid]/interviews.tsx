"use client"

import { Interview } from '@/app/types/database';
import Link from 'next/link';


export default function Interviews({ interviews }: { interviews: Interview[]; }) {
    return (
        <div className='h-full w-full'>
            <ul>
                {interviews.map((interview) => (
                    <Link key={interview.id} href={`/application/sessions/${interview.session_id}/${interview.id}`} passHref>
                        <div className="flex justify-between space-x-3 w-full bg-white rounded-lg shadow-md my-5 p-4 cursor-pointer hover:bg-gray-100">
                            <div className='flex space-x-3'>
                                <h3 className="text-lg font-semibold">{interview.last_name}</h3>
                                <h3 className="text-lg font-semibold">{interview.first_name}</h3>
                            </div>
                            <div className='flex space-x-3 ml-auto'>
                                {!interview.raw_file_ok ? (
                                    <h5>Add a video</h5>
                                ) : (
                                    (!interview.video_ok || !interview.text_ok || !interview.diarization_ok) ? (
                                        <h5>In processing...</h5>
                                    ) : null
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
}
