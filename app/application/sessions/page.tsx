"use client"

import { useState, useEffect } from 'react';
import { supabaseClientClient as supabase } from "@/utils/supabase/client";
import Sessions from "@/app/application/sessions/sessions";
import { usePathname, useRouter } from 'next/navigation'
import { Session } from '@/app/types/database';

export default function Page() {
    const [sessions, setSessions] = useState<Session[] | null>([]);

    const path = usePathname();
    const router = useRouter();

    const fetchSessions = async () => {
        const { data, error } = await supabase.from('sessions').select('*') as { data: Session[] | null, error: any };
        if (error) {
            console.error('Error fetching sessions:', error.message);
        } else {
            setSessions(data);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    return (
        <div className="flex justify-center w-4/5">
            <div className="flex flex-col overflow-y-auto w-full">
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => router.push(`${path}/new`)}>Add Session</button>
                </div>
                {sessions ? <Sessions sessions={sessions} /> : <div>No sessions found</div>}
            </div>
        </div>
    );
}