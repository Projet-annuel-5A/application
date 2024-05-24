"use client"
import ScreenRecorder from '@/components/record/ScreenRecorder';
import { supabaseBrowserClient as supabase, getUserClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { Session, Interview } from '@/app/types/database';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ParamsInterface {
    sessionid: Session["id"]
}

export default function Page({ params }: { params: ParamsInterface }) {
    const router = useRouter();
    const [interviewData, setInterviewData] = useState<Interview>({
        first_name: '',
        last_name: '',
        duration: 0,
        session_id: params.sessionid,
        user_id: '',
        raw_file_ok: false,
        diarization_ok: false,
        audio_ok: false,
        video_ok: false,
        text_ok: false
    });

    const isFormValid = () => {
        return interviewData.first_name.length > 2 && interviewData.last_name.length > 2;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInterviewData({ ...interviewData, [name]: value });
    };

    const addInterview = async (interview: Interview) => {
        const { data, error } = await supabase.from('interviews').insert([interview]);
        if (error) {
            console.error('Error adding session:', error.message);
        } else {
            router.push(`/application/sessions/${params.sessionid}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user_id = (await getUserClient()).data.user?.id;
        const updatedInterviewData = { ...interviewData, user_id: user_id || '' };

        await addInterview(updatedInterviewData);
    };

    return (
        <div className='flex justify-center'>
            <div className='flex flex-col justify-center'>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            First Name:
                            <input type="text" name="first_name" value={interviewData.first_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name:
                            <input type="text" name="last_name" value={interviewData.last_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </label>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button 
                            type="submit" 
                            className={`font-bold py-2 px-4 rounded ${isFormValid() ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            disabled={!isFormValid()}
                        >
                            Create Interview
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}