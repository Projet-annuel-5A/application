"use client"

import { useState, useEffect } from 'react';
import { supabaseBrowserClient as supabase } from "@/utils/supabase/client";
import Sessions from "@/app/application/sessions/sessions";
import { usePathname, useRouter } from 'next/navigation'
import { Session } from '@/app/types/database';
import { getUserClient } from '@/utils/supabase/client';

export default function Page() {
    const [sessions, setSessions] = useState<Session[] | null>([]);

    const path = usePathname();
    const router = useRouter();    


    const fetchSessions = async () => {

        const response = await getUserClient();
        const user = response.data.user;

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
        <div className="flex justify-center w-4/5 h-full">
            <div className="flex flex-col overflow-y-auto w-full h-full">
                <div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-slate-900 py-2 px-4 rounded select-none" onClick={() => router.push(`${path}/new`)}>Add Session</button>
                </div>
                {sessions ? <Sessions sessions={sessions} /> : <div>No sessions found</div>}
            </div>
        </div>
    );
}