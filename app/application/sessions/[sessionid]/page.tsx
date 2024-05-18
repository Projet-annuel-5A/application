"use client"

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import Interviews from './interviews';
import { usePathname ,useRouter } from 'next/navigation'
import { Session, Interview } from '@/app/types/database';


interface ParamsInterface {
    sessionid: Session["id"]
}

export default function Page({ params }: { params: ParamsInterface }){

    const supabase = createClient();
    const path = usePathname();
    const router = useRouter();
    const [interviews, setInterviews] = useState<Interview[] | null>([]);
    const [loading, setLoading] = useState(true);

    const fetchInterviews = async () => {
        setLoading(true);
        const { data , error } = await supabase
            .from('interviews')
            .select('*')
            .filter('session_id','eq',params.sessionid) as { data: Interview[] | null, error: any };
            
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


    return(
        <div className='flex flex-col justify-center w-4/5'>
            <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => router.push(`${path}/new`)}>Add Interview</button>
            </div>
            {interviews && interviews.length > 0 ? (
                <Interviews interviews={interviews}/>
            ) : (
                <div>No interviews found.</div>
            )}
        </div>
    );
}