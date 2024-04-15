"use client"

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import AddInterview from "./addInterview";
import Interviews from './interviews';

export default function InterviewsPage({ params }){

    const supabase = createClient();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInterviews = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('interviews').select('*').filter('sessionId','eq',params.sessionid);
        if (error) {
            console.error('Error fetching sessions:', error.message);
        } else {
            setInterviews(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const addInterview = async (interview) => {
        const { data, error } = await supabase.from('interviews').insert([interview]);
        if (error) {
            console.error('Error adding session:', error.message);
        } else {
            fetchInterviews();
        }
    };

    return(
        <div>
            <AddInterview addInterview={addInterview} sessionid={params.sessionid}/>
            <Interviews interviews={interviews} loading={loading} sessionid={params.sessionid}/>
        </div>
    );
}