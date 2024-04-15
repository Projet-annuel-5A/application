"use client"

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import AddSession from "@/app/application/sessions/addSession";
import Sessions from "@/app/application/sessions/sessions";

export default function SessionsPage() {
    const supabase = createClient();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('sessions').select('*');
        if (error) {
            console.error('Error fetching sessions:', error.message);
        } else {
            setSessions(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const addSession = async (session) => {
        const { data, error } = await supabase.from('sessions').insert([session]);
        if (error) {
            console.error('Error adding session:', error.message);
        } else {
            fetchSessions();
        }
    };

    return (
        <div className="flex justify-center w-4/5">
            <div className="flex flex-col overflow-y-auto w-full">
                <AddSession addSession={addSession} />
                <Sessions sessions={sessions} loading={loading} />
            </div>
        </div>
    );
}