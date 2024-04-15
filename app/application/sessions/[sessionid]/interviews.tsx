"use client"

import Link from 'next/link';

export default function Interviews({ interviews, loading , sessionid }) {
    return (
        <div className='h-full w-full'>
            {interviews.length > 0 ? (
                <ul>
                    {interviews.map((interview) => (
                        <Link key={interview.id} href={`/application/sessions/${sessionid}/${interview.id}`} passHref>
                            <div className="w-4/5 bg-white rounded-lg shadow-md my-5 p-4 cursor-pointer hover:bg-gray-100">
                                <h3 className="text-lg font-semibold">{interview.firstName}</h3>
                            </div>
                        </Link>
                    ))}
                </ul>
            ) : (
                <div>No interviews found.</div>
            )}
        </div>
    );
}
