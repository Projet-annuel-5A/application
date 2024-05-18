"use client"

import Link from 'next/link';

export default function Sessions({ sessions }) {
    return (
        <div className='h-full w-full'>
            {sessions.length > 0 ? (
                <ul>
                    {sessions.map((session) => (
                        <Link key={session.id} href={`/application/sessions/${session.id}`} passHref>
                            <div className="w-4/5 bg-white rounded-lg shadow-md my-5 p-4 cursor-pointer hover:bg-gray-100">
                                <h3 className="text-lg font-semibold">{session.name}</h3>
                                <p>Start : {session.startDate}</p>
                                <p>End : {session.endDate}</p>
                            </div>
                        </Link>
                    ))}
                </ul>
            ) : (
                <div>No sessions found.</div>
            )}
        </div>
    );
}
